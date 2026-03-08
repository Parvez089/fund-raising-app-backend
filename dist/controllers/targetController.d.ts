/** @format */
import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/protect.js";
export declare const getTarget: (_req: Request, res: Response) => Promise<void>;
export declare const updateTarget: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTargetHistory: (req: Request, res: Response) => Promise<void>;
export declare const downloadHistoryCSV: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=targetController.d.ts.map