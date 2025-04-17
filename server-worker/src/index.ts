import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { Hono } from 'hono';
import { sessionMiddleware, CookieStore } from 'hono-sessions';
import { cors } from 'hono/cors';

const app = new Hono();
const store = new CookieStore();

app.use(cors({
	origin: ['http://localhost:5173'],
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use(
	sessionMiddleware({
		store,
		encryptionKey: 'encryption_key_at_least_32_characters_long',
		expireAfterSeconds: 900,
		cookieOptions: {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
		},
	})
);

let isConfigured = false;
let rpID: string;
let expectedOrigin: string;
let rpName = 'WebAuthn';

app.use(async (c, next) => {
	if (isConfigured) {
		return await next();
	}
	const url = c.req.header('Origin');
	if (!url) {
		return c.json({ error: 'Origin header is required' }, 400);
	}
	const { origin, hostname } = new URL(url);
	expectedOrigin = origin;
	rpID = hostname;
	isConfigured = true;
	return await next();
});

app.get('/healthcheck', (c) => c.json(204));

/**
 * WebAuthn registration endpoint
 * Generates registration options for a new passkey and stores the challenge
 * in the user's session for later verification
 */
app.post('/register', async (c) => {
	const username = (await c.req.json()).username;
	try {
		const env = c.env as Env;
		// Retrieve existing user or create a new one if not found
		const user = JSON.parse(await env.users.get(username) || JSON.stringify({ username, passKeys: [] }));

		// Configure WebAuthn registration options
		const opts = {
			rpID,
			rpName,
			userName: username,
			attestation: 'none',
			supportedAlgorithmIDs: [-7, -257],
			authenticatorSelection: {
				residentKey: 'discouraged' as "discouraged",
			},
			// Exclude existing credentials to prevent duplicates
			excludeCredentials: user.passKeys.map((key: { credentialID: string, transports: string[] }) => ({
				id: key.credentialID,
				transports: key.transports,
			})),
		}
		const options = await generateRegistrationOptions(opts);

		// Store challenge and user data in session for verification
		// @ts-ignore
		(c.get('session') as Record<string, any>).set('challenge', JSON.stringify({ user, options }));
		return c.json(options);
	} catch (err) {
		console.error(err);
		return c.json({ error: `Error registering user ${username}: ${err}` }, 500);
	}
});

/**
 * WebAuthn registration completion endpoint
 * Verifies the registration response from the client and saves the new passkey
 * to the user's account if verification is successful
 */
app.post('/register/complete', async (c) => {
	const response = await c.req.json();
	// Retrieve the challenge and user data from the session
	// @ts-ignore
	const { options, user } = JSON.parse((c.get('session') as Record<string, any>).get('challenge'));
	let verification;
	try {
		// Configure verification options
		const opts = {
			response,
			expectedOrigin,
			expectedRPID: rpID,
			requireUserVerification: true,
			expectedChallenge: options.challenge,
		}
		// Verify the authenticator's response against our challenge
		verification = await verifyRegistrationResponse(opts);
		const { verified, registrationInfo } = verification;
		
		if (verified && registrationInfo) {
			// Extract credential details from the verification result
			const { credentialBackedUp, credentialDeviceType, credential } = registrationInfo;
	
			// Check if this credential already exists for the user
			const passKey = user.passKeys.find((key: { id: string }) => key.id === credential.id);
			if(!passKey) {
				// Store the new passkey in the user's account
				user.passKeys.push({
					counter: credential.counter,
					id: credential.id,
					backedUp: credentialBackedUp,
					webAuthnUserID: options.user.id,
					deviceType: credentialDeviceType,
					transports: response.response.transports,
					// Convert Uint8Array to regular array for storage
					credentialPublicKey: Array.from(credential.publicKey),
				});
			}
	
			// Save the updated user data
			const env = c.env as Env;
			await env.users.put(user.username, JSON.stringify(user));
	
			// Clear the challenge from the session
			// @ts-ignore
			(c.get('session') as Record<string, any>).set('challenge', null);
			return c.json({ verified });
		}
	} catch (err) {
		console.error(err);
		return c.json({ error: `Error verifying registration response: ${err}` }, 500);
	}
});

export default app;