import { Request, Response } from "express";
export declare const createMatch: (req: Request, res: Response) => Promise<void>;
export declare const viewMatch: (req: Request, res: Response) => Promise<void>;
export declare const updateMatch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
