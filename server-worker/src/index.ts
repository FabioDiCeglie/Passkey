import { generateRegistrationOptions } from '@simplewebauthn/server';
import { Hono } from 'hono';
import { sessionMiddleware, CookieStore } from 'hono-sessions';

const app = new Hono();
const store = new CookieStore();

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
	const { origin, hostname } = new URL(c.req.url);
	expectedOrigin = origin;
	rpID = hostname;
	isConfigured = true;
	return await next();
});

app.get('/healthcheck', (c) => new Response(null, { status: 204 }));

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
		const user = JSON.parse(await env.users.get(username) || 'null') || { username, passKeys: [] };
		
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

export default app;