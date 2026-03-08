/** @format */
import type { Request, Response } from "express";
interface CreateAdminRequest {
    email: string;
    password?: string;
    role: "admin" | "super_admin";
}
export declare const createAdmin: (req: Request<{}, {}, CreateAdminRequest>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=adminController.d.ts.map