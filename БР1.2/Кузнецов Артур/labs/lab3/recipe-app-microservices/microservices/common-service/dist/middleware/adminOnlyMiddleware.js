"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnlyMiddleware = void 0;
const adminOnlyMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied: Admins only' });
        return;
    }
    next();
};
exports.adminOnlyMiddleware = adminOnlyMiddleware;
