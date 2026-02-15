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
import { useWorkerTaxonomy, getSubcategoriesForCategory } from '@/hooks/useWorkerTaxonomy';
import { getBilingualCategoryLabel, getBilingualSubcategoryLabel } from '@/utils/bilingualTaxonomy';

export default function WorkerRegistrationPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const { t } = useI18n();
  const taxonomy = useWorkerTaxonomy();
  
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
  const registerHelper = t('register.helper');
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
      const errorMsg = t('register.error.nameRequired');
      setError(errorMsg.en);
      return false;
    }
    if (!phone.trim()) {
      const errorMsg = t('register.error.phoneRequired');
      setError(errorMsg.en);
      return false;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      const errorMsg = t('register.error.phoneInvalid');
      setError(errorMsg.en);
      return false;
    }
    if (!category) {
      const errorMsg = t('register.error.categoryRequired');
      setError(errorMsg.en);
      return false;
    }
    if (!subcategory) {
      const errorMsg = t('register.error.subcategoryRequired');
      setError(errorMsg.en);
      return false;
    }
    if (!area.trim()) {
      const errorMsg = t('register.error.areaRequired');
      setError(errorMsg.en);
      return false;
    }
    if (!photoFile) {
      const errorMsg = t('register.error.photoRequired');
      setError(errorMsg.en);
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

  // Get available subcategories safely from taxonomy
  const availableSubcategories = category ? getSubcategoriesForCategory(category, taxonomy) : [];

  // Reset subcategory when category changes
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory('');
  };

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

  const fieldName = t('register.field.name');
  const fieldPhone = t('register.field.phone');
  const fieldCategory = t('register.field.category');
  const fieldSubcategory = t('register.field.subcategory');
  const fieldArea = t('register.field.area');
  const fieldExperience = t('register.field.experience');
  const fieldWorkingHours = t('register.field.workingHours');
  const fieldPhoto = t('register.field.photo');
  const fieldComments = t('register.field.comments');

  const placeholderName = t('register.placeholder.name');
  const placeholderPhone = t('register.placeholder.phone');
  const placeholderArea = t('register.placeholder.area');
  const placeholderExperience = t('register.placeholder.experience');
  const placeholderWorkingHours = t('register.placeholder.workingHours');
  const placeholderComments = t('register.placeholder.comments');

  const selectCategory = t('register.select.category');
  const selectSubcategory = t('register.select.subcategory');
  const selectCategoryFirst = t('register.select.categoryFirst');
  const loadingCategories = t('register.loading.categories');

  const buttonChoosePhoto = t('register.button.choosePhoto');
  const buttonSubmit = t('register.button.submit');
  const buttonSubmitting = t('register.button.submitting');

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{registerTitle.en}</h1>}
            regional={<p className="text-xl md:text-2xl font-semibold text-foreground/90">{registerTitle.regional}</p>}
            regionalClassName="text-xl md:text-2xl mt-2"
          />
          <BilingualText
            english={<p className="text-lg text-muted-foreground">{registerHelper.en}</p>}
            regional={<p className="text-base text-muted-foreground">{registerHelper.regional}</p>}
            regionalClassName="text-base mt-1 opacity-80"
          />
        </div>

        <div className="bg-card rounded-3xl shadow-xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="name" className="text-base font-medium">{fieldName.en} <span className="text-destructive">*</span></Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldName.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={placeholderName.en}
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="phone" className="text-base font-medium">{fieldPhone.en} <span className="text-destructive">*</span></Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldPhone.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={placeholderPhone.en}
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="category" className="text-base font-medium">{fieldCategory.en} <span className="text-destructive">*</span></Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldCategory.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Select
                value={category}
                onValueChange={handleCategoryChange}
                disabled={isSubmitting || taxonomy.isLoading}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={taxonomy.isLoading ? loadingCategories.en : selectCategory.en} />
                </SelectTrigger>
                <SelectContent>
                  {taxonomy.categories.map((cat) => {
                    const catLabel = getBilingualCategoryLabel(cat, t);
                    return (
                      <SelectItem key={cat} value={cat}>
                        <BilingualText
                          english={<span>{catLabel.en}</span>}
                          regional={<span className="text-xs">{catLabel.regional}</span>}
                          regionalClassName="text-xs mt-0.5 opacity-80"
                          containerClassName="flex flex-col items-start"
                        />
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="subcategory" className="text-base font-medium">{fieldSubcategory.en} <span className="text-destructive">*</span></Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldSubcategory.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={!category || availableSubcategories.length === 0 || isSubmitting || taxonomy.isLoading}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={category ? selectSubcategory.en : selectCategoryFirst.en} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((sub) => {
                    const subLabel = getBilingualSubcategoryLabel(sub, t);
                    return (
                      <SelectItem key={sub} value={sub}>
                        <BilingualText
                          english={<span>{subLabel.en}</span>}
                          regional={<span className="text-xs">{subLabel.regional}</span>}
                          regionalClassName="text-xs mt-0.5 opacity-80"
                          containerClassName="flex flex-col items-start"
                        />
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="area" className="text-base font-medium">{fieldArea.en} <span className="text-destructive">*</span></Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldArea.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={placeholderArea.en}
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="experience" className="text-base font-medium">{fieldExperience.en}</Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldExperience.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Input
                id="experience"
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder={placeholderExperience.en}
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            {/* Working Hours */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="workingHours" className="text-base font-medium">{fieldWorkingHours.en}</Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldWorkingHours.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Input
                id="workingHours"
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder={placeholderWorkingHours.en}
                className="h-12"
                disabled={isSubmitting}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="photo" className="text-base font-medium">{fieldPhoto.en} <span className="text-destructive">*</span></Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldPhoto.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12"
                    onClick={() => document.getElementById('photo')?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {buttonChoosePhoto.en}
                  </Button>
                  {photoFile && (
                    <span className="text-sm text-muted-foreground">{photoFile.name}</span>
                  )}
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                {photoPreview && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <BilingualText
                english={<Label htmlFor="comments" className="text-base font-medium">{fieldComments.en}</Label>}
                regional={<span className="text-sm text-muted-foreground">{fieldComments.regional}</span>}
                regionalClassName="text-sm mt-1 opacity-80"
              />
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={placeholderComments.en}
                className="min-h-24"
                disabled={isSubmitting}
              />
            </div>

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Uploading photo...</span>
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
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting || taxonomy.isLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {buttonSubmitting.en}
                </>
              ) : (
                buttonSubmit.en
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
