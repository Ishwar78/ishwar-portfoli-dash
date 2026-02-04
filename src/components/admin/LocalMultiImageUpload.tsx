import { useState, useRef } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LocalMultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const compressImage = (base64: string, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export function LocalMultiImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  className,
}: LocalMultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, GIF, or WebP)',
        variant: 'destructive',
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const base64 = await convertToBase64(file);
      const compressed = await compressImage(base64);
      return compressed;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  };

  const handleFilesUpload = async (files: FileList) => {
    if (value.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const url = await processFile(file);
        if (url) newUrls.push(url);
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
        toast({ title: `${newUrls.length} image(s) uploaded successfully` });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      if (value.length >= maxImages) {
        toast({
          title: 'Too many images',
          description: `Maximum ${maxImages} images allowed`,
          variant: 'destructive',
        });
        return;
      }
      onChange([...value, urlInput.trim()]);
      setUrlInput('');
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted group"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors cursor-pointer h-24',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/50 hover:border-primary/50 hover:bg-muted'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-xs">Drag & drop or click to upload images</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL Input */}
      <div className="flex items-center gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL..."
          className="text-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
