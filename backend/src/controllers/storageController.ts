import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import storageService from '../services/storage/storageService';
import { FileRequest } from '../types/storage';
import { Error, Success } from '../shared';
import { UpdateService, GetService } from '../services';
import { DBTable } from '../shared/data/dbTables';
import { Controller, Route } from '../decorators';
import { API } from '../constants/api';
import { Authorize, TokenHandler } from '../middleware';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB limit
    },
});

@Controller(`${API}/storage`)
export class StorageController {
    constructor() {
        console.log('StorageController loaded');
    }
    // Single file upload middleware - matches the database column name 'Illustration'
    private uploadSingle = upload.single('Illustration');

    // Helper method to apply the upload middleware
    private applyUploadMiddleware = (req: FileRequest, res: Response, next: NextFunction) => {
        this.uploadSingle(req, res, (err) => {
            if (err) {
                return res.status(400).json({ data: null, message: err.message });
            }
            next();
        });
    };

    // Upload illustration for term
    @Route('post', '/term/:termId/illustration', TokenHandler.verifyToken, Authorize.requireRoles(...Authorize.STAFF_ROLES))
    public async uploadTermIllustration(req: FileRequest, res: Response, next: NextFunction) {
        // Apply upload middleware manually
        await new Promise<void>((resolve, reject) => {
            this.uploadSingle(req, res, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        try {
            if (!req.file) {
                return res.status(400).json({ data: null, message: 'No file uploaded. Please include a file with the field name \'Illustration\'' });
            }

            const { termId } = req.params;
            if (!termId) {
                return res.status(400).json({ data: null, message: 'Term ID is required' });
            }

            // Remember the current illustration so it can be removed once the new one is saved
            const terms = await GetService.byId(parseInt(termId, 10), DBTable.t005);
            const previous: string | null = terms[0]?.Illustration || null;

            // Upload first and save it on the term: if either step fails, the old picture is untouched
            const fileUrl = await storageService.uploadFile(req.file, 'terms');
            await UpdateService.record(
                parseInt(termId, 10),
                DBTable.t005, // term table
                ['Illustration'],
                [String],
                [fileUrl]
            );

            // Only now remove the old file; a failure here just leaves an unused file behind
            if (previous && previous !== fileUrl) {
                try {
                    await storageService.deleteFile(previous);
                } catch (error) {
                    console.warn('Failed to delete old illustration:', error);
                }
            }

            return res.status(200).json({
                data: { url: fileUrl },
                message: Success.m001,
            });
        } catch (error: any) {
            console.error('Error uploading term illustration:', error);
            return res.status(500).json({ data: null, message: Error.m001 });
        }
    }

    // Delete illustration for terms
    @Route('delete', '/term/:termId/illustration', TokenHandler.verifyToken, Authorize.requireRoles(...Authorize.STAFF_ROLES))
    public async deleteTermIllustration(req: Request, res: Response, next: NextFunction) {
        try {
            const { termId } = req.params;
            if (!termId) {
                return res.status(400).json({ data: null, message: 'Term ID is required' });
            }

            // Get the current illustration URL
            const terms = await GetService.byId(parseInt(termId, 10), DBTable.t005);
            const term = terms[0];
            
            if (!term?.Illustration) {
                return res.status(404).json({ data: null, message: 'Illustration not found' });
            }

            // Delete the file from Google Cloud Storage
            await storageService.deleteFile(term.Illustration);

            // Update the term to remove the illustration URL
            await UpdateService.record(
                parseInt(termId, 10),
                DBTable.t005, // term table
                ['Illustration'],
                [String],
                [null]
            );

            return res.status(200).json({
                data: null,
                message: Success.m002,
            });
        } catch (error) {
            console.error('Error deleting term illustration:', error);
            return res.status(500).json({ data: null, message: Error.m001 });
        }
    }
}

// Export the controller class as default
export default StorageController;
