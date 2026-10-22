import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

class StorageService {
    private storage: Storage;
    private bucketName: string;

    constructor() {
        this.storage = new Storage();
        this.bucketName = process.env.GCS_BUCKET_NAME || 'rtm-morphology-images';
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'illustrations'): Promise<string> {
        try {
            // Generate a unique filename with original extension
            const fileExt = path.extname(file.originalname).toLowerCase();
            const fileName = `${folder}/${uuidv4()}${fileExt}`;
            const bucket = this.storage.bucket(this.bucketName);
            const blob = bucket.file(fileName);
            
            // Set metadata including cache control
            const metadata = {
                contentType: file.mimetype,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            };

            // Create a write stream with public access
            const blobStream = blob.createWriteStream({
                metadata: metadata,
                resumable: false,
                validation: 'md5',
                public: true  // This will make the file publicly accessible
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', (error) => {
                    console.error('Error uploading file:', error);
                    reject(new Error(`Failed to upload file: ${error.message}`));
                });

                blobStream.on('finish', async () => {
                    try {
                        console.log(`File ${fileName} uploaded to ${this.bucketName}.`);
                        
                        // Get the public URL
                        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${encodeURIComponent(blob.name)}`;
                        console.log('Generated public URL:', publicUrl);
                        resolve(publicUrl);
                    } catch (e: unknown) {
                        console.error('Error finalizing upload:', e);
                        const errorMessage = e instanceof Error ? e.message : 'Unknown error during upload finalization';
                        reject(new Error(`Failed to finalize upload: ${errorMessage}`));
                    }
                });

                // Start the upload
                blobStream.end(file.buffer);
            });
        } catch (error: unknown) {
            console.error('Error in uploadFile:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
            throw new Error(`Upload failed: ${errorMessage}`);
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Derive the object path relative to the bucket, decoding any encoded slashes
            const bucketPrefix = `https://storage.googleapis.com/${this.bucketName}/`;
            let objectPath = fileUrl.startsWith(bucketPrefix)
                ? fileUrl.slice(bucketPrefix.length)
                : fileUrl.split('/').slice(3).join('/'); // fallback
            objectPath = decodeURIComponent(objectPath);

            const bucket = this.storage.bucket(this.bucketName);
            await bucket.file(objectPath).delete();
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}

export default new StorageService();
