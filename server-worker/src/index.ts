import { Hono } from 'hono';
import { CookieStore, Session, sessionMiddleware } from 'hono-sessions';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth';

export type HonoEnv = {
	Variables: {
		session: Session;
	};
	Bindings: Env;
};

const app = new Hono<HonoEnv>();
const store = new CookieStore();

app.use(cors({
	origin: ['http://localhost:5173'],
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use(
	'*',
	sessionMiddleware({
		store,
		encryptionKey: 'encryption_key_at_least_32_characters_long',
		expireAfterSeconds: 86400,
		cookieOptions: {
			sameSite: 'Lax',
			path: '/',
			httpOnly: true,
		},
	})
);

app.get('/healthcheck', (c) => c.json(204));

app.route('/api', authRoutes);

export default app;	