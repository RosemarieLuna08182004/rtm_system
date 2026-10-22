import { Request } from 'express';

export interface FileRequest extends Request {
    file?: Express.Multer.File;
    files?: {
        [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
}

export interface UploadResponse {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
}
