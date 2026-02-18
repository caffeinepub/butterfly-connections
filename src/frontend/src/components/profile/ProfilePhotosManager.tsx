import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

interface ProfilePhotosManagerProps {
  currentAvatar?: ExternalBlob;
  currentProfilePhoto?: ExternalBlob;
  displayName: string;
  onAvatarChange: (blob: ExternalBlob | undefined) => void;
  onProfilePhotoChange: (blob: ExternalBlob | undefined) => void;
}

export default function ProfilePhotosManager({
  currentAvatar,
  currentProfilePhoto,
  displayName,
  onAvatarChange,
  onProfilePhotoChange,
}: ProfilePhotosManagerProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState<number>(0);
  const [profilePhotoUploadProgress, setProfilePhotoUploadProgress] = useState<number>(0);
  const [showRemoveAvatarDialog, setShowRemoveAvatarDialog] = useState(false);
  const [showRemoveProfilePhotoDialog, setShowRemoveProfilePhotoDialog] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    file: File,
    type: 'avatar' | 'profilePhoto'
  ) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Create ExternalBlob with upload progress
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        if (type === 'avatar') {
          setAvatarUploadProgress(percentage);
        } else {
          setProfilePhotoUploadProgress(percentage);
        }
      });

      if (type === 'avatar') {
        setAvatarPreview(previewUrl);
        onAvatarChange(blob);
        toast.success('Avatar selected! Save your profile to upload.');
      } else {
        setProfilePhotoPreview(previewUrl);
        onProfilePhotoChange(blob);
        toast.success('Profile photo selected! Save your profile to upload.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleProfilePhotoClick = () => {
    profilePhotoInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarUploadProgress(0);
    onAvatarChange(undefined);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
    setShowRemoveAvatarDialog(false);
    toast.success('Avatar removed. Save your profile to confirm.');
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhotoPreview(null);
    setProfilePhotoUploadProgress(0);
    onProfilePhotoChange(undefined);
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = '';
    }
    setShowRemoveProfilePhotoDialog(false);
    toast.success('Profile photo removed. Save your profile to confirm.');
  };

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (currentAvatar) return currentAvatar.getDirectURL();
    return '/assets/generated/default-avatar-set.dim_1024x1024.png';
  };

  const getProfilePhotoUrl = () => {
    if (profilePhotoPreview) return profilePhotoPreview;
    if (currentProfilePhoto) return currentProfilePhoto.getDirectURL();
    return null;
  };

  const hasAvatar = avatarPreview || currentAvatar;
  const hasProfilePhoto = profilePhotoPreview || currentProfilePhoto;

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="space-y-3">
        <Label className="text-[oklch(0.35_0.08_320)]">Profile Avatar</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleAvatarClick}>
            <AvatarImage src={getAvatarUrl()} alt="Avatar" />
            <AvatarFallback className="bg-[oklch(0.65_0.15_320)] text-white text-2xl">
              {displayName.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                className="border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                {hasAvatar ? 'Change Avatar' : 'Upload Avatar'}
              </Button>
              
              {hasAvatar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRemoveAvatarDialog(true)}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            
            {avatarUploadProgress > 0 && avatarUploadProgress < 100 && (
              <div className="space-y-1">
                <Progress value={avatarUploadProgress} className="h-2" />
                <p className="text-xs text-[oklch(0.50_0.06_320)]">Uploading: {avatarUploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
        
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file, 'avatar');
          }}
        />
      </div>

      {/* Profile Photo Section */}
      <div className="space-y-3 pt-4 border-t border-[oklch(0.90_0.02_320)]">
        <Label className="text-[oklch(0.35_0.08_320)]">Additional Profile Photo</Label>
        <p className="text-sm text-[oklch(0.50_0.06_320)]">
          Add an additional photo to showcase on your profile
        </p>
        
        {hasProfilePhoto ? (
          <Card className="relative overflow-hidden border-[oklch(0.90_0.02_320)]">
            <img
              src={getProfilePhotoUrl()!}
              alt="Profile photo"
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleProfilePhotoClick}
                className="bg-white/90 hover:bg-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => setShowRemoveProfilePhotoDialog(true)}
                className="bg-red-500/90 hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {profilePhotoUploadProgress > 0 && profilePhotoUploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2">
                <Progress value={profilePhotoUploadProgress} className="h-2" />
                <p className="text-xs text-[oklch(0.50_0.06_320)] mt-1">Uploading: {profilePhotoUploadProgress}%</p>
              </div>
            )}
          </Card>
        ) : (
          <Card
            className="border-2 border-dashed border-[oklch(0.90_0.02_320)] hover:border-[oklch(0.65_0.15_320)] transition-colors cursor-pointer"
            onClick={handleProfilePhotoClick}
          >
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <ImageIcon className="w-12 h-12 text-[oklch(0.70_0.06_320)] mb-3" />
              <p className="text-[oklch(0.45_0.06_320)] text-sm mb-2">Click to upload a profile photo</p>
              <p className="text-[oklch(0.60_0.06_320)] text-xs">PNG, JPG up to 5MB</p>
            </div>
          </Card>
        )}
        
        <input
          ref={profilePhotoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file, 'profilePhoto');
          }}
        />
      </div>

      {/* Remove Avatar Dialog */}
      <AlertDialog open={showRemoveAvatarDialog} onOpenChange={setShowRemoveAvatarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Avatar?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your custom avatar and use the default avatar instead. You can always upload a new one later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAvatar} className="bg-red-500 hover:bg-red-600">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Profile Photo Dialog */}
      <AlertDialog open={showRemoveProfilePhotoDialog} onOpenChange={setShowRemoveProfilePhotoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Profile Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your additional profile photo. You can always upload a new one later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveProfilePhoto} className="bg-red-500 hover:bg-red-600">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
