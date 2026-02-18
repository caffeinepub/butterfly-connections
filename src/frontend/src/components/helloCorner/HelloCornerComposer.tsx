import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, Video as VideoIcon, X, Send } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

interface HelloCornerComposerProps {
  onSubmit: (text: string, photo: ExternalBlob | null, video: ExternalBlob | null) => Promise<void>;
  isSubmitting: boolean;
}

export default function HelloCornerComposer({ onSubmit, isSubmitting }: HelloCornerComposerProps) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<ExternalBlob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<ExternalBlob | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const previewUrl = URL.createObjectURL(file);

      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      setPhoto(blob);
      setPhotoPreview(previewUrl);
      toast.success('Photo attached!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  const handleVideoSelect = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video must be smaller than 50MB');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const previewUrl = URL.createObjectURL(file);

      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      setVideo(blob);
      setVideoPreview(previewUrl);
      toast.success('Video attached!');
    } catch (error) {
      console.error('Error processing video:', error);
      toast.error('Failed to process video');
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(null);
    setPhotoPreview(null);
    setUploadProgress(0);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideo(null);
    setVideoPreview(null);
    setUploadProgress(0);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await onSubmit(text.trim(), photo, video);
      setText('');
      setPhoto(null);
      setPhotoPreview(null);
      setVideo(null);
      setVideoPreview(null);
      setUploadProgress(0);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
      toast.success('Message posted!');
    } catch (error) {
      console.error('Error posting message:', error);
      toast.error('Failed to post message');
    }
  };

  const hasAttachment = !!photo || !!video;

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
      <CardContent className="pt-6 space-y-4">
        <Textarea
          placeholder="Share a hello, greeting, or thought with the community..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
          className="min-h-[100px] resize-none border-[oklch(0.90_0.02_320)] focus:border-[oklch(0.65_0.15_320)]"
        />

        {photoPreview && (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-lg border border-[oklch(0.90_0.02_320)]"
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemovePhoto}
              disabled={isSubmitting}
              className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 rounded-b-lg">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-[oklch(0.50_0.06_320)] mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
          </div>
        )}

        {videoPreview && (
          <div className="relative">
            <video
              src={videoPreview}
              controls
              className="w-full max-h-64 rounded-lg border border-[oklch(0.90_0.02_320)]"
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemoveVideo}
              disabled={isSubmitting}
              className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 rounded-b-lg">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-[oklch(0.50_0.06_320)] mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              disabled={isSubmitting || hasAttachment}
              className="border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {photo ? 'Photo Attached' : 'Add Photo'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => videoInputRef.current?.click()}
              disabled={isSubmitting || hasAttachment}
              className="border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              {video ? 'Video Attached' : 'Add Video'}
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
            className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white"
          >
            {isSubmitting ? (
              <>Posting...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoSelect(file);
          }}
        />

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleVideoSelect(file);
          }}
        />
      </CardContent>
    </Card>
  );
}
