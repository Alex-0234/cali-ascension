import { Response } from 'express';
import jwt from 'jsonwebtoken';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Deployed: client and API are on different domains -> needs a cross-site
// cookie (SameSite=None), which browsers only allow over HTTPS (Secure).
// Local dev: client and API are both on plain http://localhost -> Secure
// cookies get silently dropped by the browser there, and SameSite=Lax is
// enough anyway since same-site (same "localhost", different port).
// NODE_ENV is guaranteed 'development' locally (set by the `dev` script) -
// make sure it's set to 'production' in your host's environment variables too.
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
};

export function setAuthCookie(res: Response, userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.cookie('token', token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE });
}

export function clearAuthCookie(res: Response) {
    res.clearCookie('token', cookieOptions);
}
