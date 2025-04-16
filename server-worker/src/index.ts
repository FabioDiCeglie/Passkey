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
let rpID, expectedOrigin;
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

app.get('/', (c) => c.text('Hello World!'));

export default app;