import { Hono } from 'hono';
import { CookieStore, Session, sessionMiddleware } from 'hono-sessions';
import { createMiddleware } from 'hono/factory'
import { cors } from 'hono/cors';
import authRoutes from './routes/auth';

export type HonoEnv = {
	Variables: {
		session: Session;
	};
	Bindings: Env;
};

const app = new Hono<HonoEnv>();

export const cookieSessionMiddleware = createMiddleware(async (c, next) => {
	const store = new CookieStore()

	const m = sessionMiddleware({
		store,
		encryptionKey: c.env.SESSION_ENCRYPTION_KEY || "8f2a1b9c7d3e5f4g6h8i0j2k4l6m8n0p2q",
		expireAfterSeconds: 604800,
		cookieOptions: {
			sameSite: 'Lax',
			path: '/',
			httpOnly: true,
			secure: true,
		},
	})

	return m(c, next)
})

app.use(cors({
	origin: ['http://localhost:5173', 'https://passkey-project.vercel.app'],
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app
	.use('*')
	.use(cookieSessionMiddleware)

app.get('/healthcheck', (c) => c.json(204));

app.route('/api', authRoutes);

export default app;	