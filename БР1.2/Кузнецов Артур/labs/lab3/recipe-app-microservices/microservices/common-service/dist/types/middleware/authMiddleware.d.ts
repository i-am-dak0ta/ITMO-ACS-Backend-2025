import { NextFunction, Request, Response } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
