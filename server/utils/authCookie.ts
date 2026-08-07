import { Response } from 'express';
import jwt from 'jsonwebtoken';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// The browser always reaches this API on the same origin as the client: in
// production through the Vercel rewrite in client/vercel.json, locally through
// the Vite dev proxy. So the cookie is first-party and SameSite=Lax works -
// which matters because SameSite=None cookies are third-party cookies, and
// mobile browsers (iOS Safari/WebKit, Firefox, any private window) drop those.
// Secure only in production: over plain http://localhost the browser would
// silently discard a Secure cookie.
// NODE_ENV is guaranteed 'development' locally (set by the `dev` script) -
// make sure it's set to 'production' in your host's environment variables too.
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
};

export function setAuthCookie(res: Response, userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.cookie('token', token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE });
}

export function clearAuthCookie(res: Response) {
    res.clearCookie('token', cookieOptions);
}
