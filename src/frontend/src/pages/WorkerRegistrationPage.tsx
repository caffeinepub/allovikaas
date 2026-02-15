import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import { ExternalBlob } from '@/backend';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import { useNavigate } from '@tanstack/react-router';
import {
  LOCAL_SKILLED_WORKERS_CATEGORY,
  getAllLocalSkilledWorkersSubcategories,
} from '@/config/localSkilledWorkers';

const categories = [
  'Construction',
  'Agriculture',
  'Home Services',
  'Transport',
  'Events & Cooking',
  'Daily Helpers',
  'Repairs',
  'Supplies',
  LOCAL_SKILLED_WORKERS_CATEGORY,
];

const subcategories: Record<string, string[]> = {
  'Construction': ['Mason', 'Carpenter', 'Painter', 'Welder', 'Tiles Worker'],
  'Agriculture': ['Farm Worker', 'Tractor Driver', 'Harvester', 'Irrigation Specialist'],
  'Home Services': ['Electrician', 'Plumber', 'AC Service', 'CCTV Installation', 'Cleaning'],
  'Transport': ['Mini Lorry', 'Load Auto', 'JCB Operator', 'Water Tanker'],
  'Events & Cooking': ['Catering', 'Cook', 'Makeup Artist', 'Mehendi Artist', 'Tent Setup'],
  'Daily Helpers': ['House Help', 'Babysitter', 'Elder Care', 'Driver'],
  'Repairs': ['Mobile Repair', 'Appliance Repair', 'Bike Mechanic', 'Car Mechanic'],
  'Supplies': ['Water Supply', 'Gas Supply', 'Material Supply', 'Equipment Rental'],
  [LOCAL_SKILLED_WORKERS_CATEGORY]: getAllLocalSkilledWorkersSubcategories(),
};

export default function WorkerRegistrationPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [area, setArea] = useState('');
  const [experience, setExperience] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  const registerTitle = t('register.title');
  const successMessage = t('register.success');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!category) {
      setError('Category is required');
      return false;
    }
    if (!subcategory) {
      setError('Sub category is required');
      return false;
    }
    if (!area.trim()) {
      setError('Area is required');
      return false;
    }
    if (!photoFile) {
      setError('Photo is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!actor) {
      setError('Backend connection not available. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await photoFile!.arrayBuffer();
      const photoBytes = new Uint8Array(arrayBuffer);
      
      const photoBlob = ExternalBlob.fromBytes(photoBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const result = await actor.submitWorkerRegistration(
        name.trim(),
        phone.trim(),
        category,
        subcategory,
        area.trim(),
        experience.trim() || 'Not specified',
        workingHours.trim() || 'Flexible',
        photoBlob,
        comments.trim() || null
      );

      if (result) {
        setIsSuccess(true);
        setName('');
        setPhone('');
        setCategory('');
        setSubcategory('');
        setArea('');
        setExperience('');
        setWorkingHours('');
        setPhotoFile(null);
        setPhotoPreview(null);
        setComments('');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Get available subcategories safely
  const availableSubcategories = category ? (subcategories[category] || []) : [];

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Registration Submitted!
              </h2>
              <BilingualText
                english={<p className="text-lg text-muted-foreground">{successMessage.en}</p>}
                regional={<p className="text-base text-muted-foreground">{successMessage.regional}</p>}
                regionalClassName="text-base mt-2 opacity-80"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Register Another Worker
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{registerTitle.en}</h1>}
            regional={<p className="text-xl md:text-2xl font-semibold text-foreground/90">{registerTitle.regional}</p>}
            regionalClassName="text-xl md:text-2xl mt-2"
          />
          <p className="text-lg text-muted-foreground">Fill in your details to register as a worker</p>
        </div>

        <div className="bg-card rounded-3xl shadow-xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10 digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Work Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setSubcategory('');
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select your work category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-base font-semibold">
                Sub Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={!category || availableSubcategories.length === 0 || isSubmitting}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={category ? "Select sub category" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area" className="text-base font-semibold">
                Area / Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="area"
                type="text"
                placeholder="Enter your area or pincode"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="h-12 text-base"
                disabled={isSubmitting}
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-base font-semibold">
                Experience
              </Label>
              <Input
                id="experience"
                type="text"
                placeholder="e.g., 5 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="h-12 text-base"
                disabled={isSubmitting}
              />
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <Label htmlFor="workingHours" className="text-base font-semibold">
                Working Hours
              </Label>
              <Input
                id="workingHours"
                type="text"
                placeholder="e.g., 9 AM - 6 PM"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="h-12 text-base"
                disabled={isSubmitting}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-base font-semibold">
                Your Photo <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-4">
                {photoPreview ? (
                  <div className="relative w-full max-w-xs mx-auto">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-2xl border-2 border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2"
                      disabled={isSubmitting}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="photo"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-base font-medium text-foreground">Click to upload photo</p>
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG (max 5MB)</p>
                  </label>
                )}
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-base font-semibold">
                Additional Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Any additional information..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-24 text-base"
                disabled={isSubmitting}
              />
            </div>

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Registration'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
