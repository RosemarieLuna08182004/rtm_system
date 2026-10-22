import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface TermIllustrationUploaderProps {
  termId: number;
  currentImageUrl?: string;
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: string) => void;
}

const TermIllustrationUploader: React.FC<TermIllustrationUploaderProps> = ({
  termId,
  currentImageUrl = '',
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError('');

    // Upload the file
    const formData = new FormData();
    formData.append('Illustration', file);

    try {
      setIsUploading(true);
      setProgress(0);

      const response = await axios.post(
        `/api/v1/storage/term/${termId}/illustration`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          },
        }
      );

      const imageUrl = response.data.data?.url;
      if (imageUrl) {
        setPreviewUrl(imageUrl);
        onUploadSuccess?.(imageUrl);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload image';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [termId, onUploadSuccess, onUploadError]);

  const handleDelete = useCallback(async () => {
    if (!previewUrl) return;

    try {
      setIsUploading(true);
      setError('');

      await axios.delete(`/api/v1/storage/term/${termId}/illustration`);
      
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onDeleteSuccess?.();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete image';
      setError(errorMessage);
      onDeleteError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [termId, previewUrl, onDeleteSuccess, onDeleteError]);

  const handleFileInputClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="term-illustration-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
      />
      
      <div className="preview-container">
        {previewUrl ? (
          <div className="image-preview">
            <img 
              src={previewUrl} 
              alt="Term illustration" 
              style={{ maxWidth: '100%', maxHeight: '300px' }} 
            />
            <div className="actions">
              <button 
                onClick={handleFileInputClick}
                disabled={isUploading}
                className="btn btn-secondary"
              >
                Change Image
              </button>
              <button 
                onClick={handleDelete}
                disabled={isUploading}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="upload-placeholder" 
            onClick={handleFileInputClick}
            style={{
              border: '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <div>Click to upload an illustration</div>
            <div className="text-muted">Max file size: 20MB</div>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="progress mt-2">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {progress}%
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default TermIllustrationUploader;
