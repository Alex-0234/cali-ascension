import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'Not authenticated' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        req.userId = payload.userId;
        next();
    } catch {
        res.status(401).send({ message: 'Invalid or expired session' });
    }
}
