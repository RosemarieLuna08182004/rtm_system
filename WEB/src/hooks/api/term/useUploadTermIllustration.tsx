import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ToastType } from "../../../types";
import { displayToast } from "../../../utils";

interface UploadResponse {
    data: {
        url: string;
    };
}

export const useUploadTermIllustration = () => {
    const axios = useAxiosPrivate();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const upload = useCallback(async (termId: string, file: File): Promise<string | null> => {
        if (!file || !termId) return null;
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('Illustration', file);

        try {
            const response = await axios.post<UploadResponse>(
                `/api/v1/storage/term/${termId}/illustration`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            displayToast('Image uploaded successfully', ToastType.success);
            return response.data?.data?.url || null;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to upload image';
            displayToast(errorMessage, ToastType.error);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [axios]);

    return {
        isUploading,
        upload,
    };
};
