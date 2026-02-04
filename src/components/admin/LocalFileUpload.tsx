import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LocalFileUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export function LocalFileUpload({
  value,
  onChange,
  placeholder = 'Upload a file',
  className,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 10,
}: LocalFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAcceptString = () => {
    return acceptedTypes.map(type => {
      if (type === 'application/pdf') return '.pdf';
      if (type === 'image/jpeg') return '.jpg,.jpeg';
      if (type === 'image/png') return '.png';
      if (type === 'image/webp') return '.webp';
      return type;
    }).join(',');
  };

  const isValidType = (file: File) => {
    return acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type;
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadFile = async (file: File) => {
    if (!isValidType(file)) {
      toast({
        title: 'Invalid file type',
        description: `Please upload a valid file (PDF, JPEG, PNG, or WebP)`,
        variant: 'destructive',
      });
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Please upload a file smaller than ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await convertToBase64(file);
      setFileName(file.name);
      onChange(base64);
      toast({ title: 'File uploaded successfully' });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file',
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
  };

  const getDisplayFileName = () => {
    if (fileName) return fileName;
    if (value && !value.startsWith('data:')) {
      const parts = value.split('/');
      return parts[parts.length - 1] || 'Resume';
    }
    return 'Uploaded File';
  };

  const isPdf = value?.includes('application/pdf') || value?.toLowerCase().endsWith('.pdf');
  const isImage = value?.startsWith('data:image/') || 
                  (value && (value.toLowerCase().endsWith('.jpg') || 
                   value.toLowerCase().endsWith('.jpeg') || 
                   value.toLowerCase().endsWith('.png') || 
                   value.toLowerCase().endsWith('.webp')));

  const handleOpen = () => {
    if (value.startsWith('data:')) {
      // For base64, create a blob and open it
      const byteString = atob(value.split(',')[1]);
      const mimeString = value.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      window.open(value, '_blank');
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="rounded-lg border border-border bg-muted p-4">
          <div className="flex items-center gap-3">
            {isImage && value.startsWith('data:image/') ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{getDisplayFileName()}</p>
              <p className="text-xs text-muted-foreground">
                {isPdf ? 'PDF Document' : isImage ? 'Image File' : 'Document'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleOpen}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors cursor-pointer p-8',
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
            accept={getAcceptString()}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">{placeholder}</span>
                <span className="text-xs">Drag & drop or click to upload</span>
                <span className="text-xs text-muted-foreground/70">PDF, JPEG, PNG, WebP (Max {maxSizeMB}MB)</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste file URL..."
          className="text-xs"
        />
      </div>
    </div>
  );
}
