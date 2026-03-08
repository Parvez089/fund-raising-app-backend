/** @format */
import type { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    admin?: {
        id: string;
        role: string;
    };
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireSuperAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=protect.d.ts.map