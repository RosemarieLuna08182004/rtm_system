import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ToastType } from "../../../types";
import { displayToast } from "../../../utils";

export const useUploadTermLineIllustration = () => {
    const axios = useAxiosPrivate();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const upload = useCallback(async (termLineId: string, file: File) => {
        if (!file || !termLineId) return null;
        
        setIsUploading(true);
        const formData = new FormData();
        formData.append('Illustration', file);

        try {
            const response = await axios.post(
                `/api/v1/storage/term-line/${termLineId}/illustration`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            displayToast('Image uploaded successfully', ToastType.success);
            return response.data.data?.url || null;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            displayToast(error?.response?.data?.message || 'Failed to upload image', ToastType.error);
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
