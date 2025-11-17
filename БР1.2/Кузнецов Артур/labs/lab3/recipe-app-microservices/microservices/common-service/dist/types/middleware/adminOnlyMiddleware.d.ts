import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';
export declare const adminOnlyMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
