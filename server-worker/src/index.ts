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

app.get('/', (c) => c.text('Hello World!'));

export default app;
