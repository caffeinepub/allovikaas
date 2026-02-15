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
import { logError } from '@/utils/errors';
import PageShell from '@/components/layout/PageShell';

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
      logError('WorkerRegistration.handleSubmit', err);
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
      <PageShell>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 text-center space-y-5">
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-5">
                <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-3">
              <BilingualText
                english={<h2 className="text-3xl md:text-4xl font-bold text-foreground">Registration Submitted!</h2>}
                regional={<p className="text-2xl md:text-3xl font-bold text-foreground">பதிவு சமர்ப்பிக்கப்பட்டது!</p>}
                regionalClassName="text-2xl md:text-3xl font-bold text-foreground mt-2"
              />
              <BilingualText
                english={<p className="text-lg text-muted-foreground">Your registration has been received successfully.</p>}
                regional={<p className="text-base text-muted-foreground">உங்கள் பதிவு வெற்றிகரமாக பெறப்பட்டது.</p>}
                regionalClassName="text-base text-muted-foreground mt-1"
              />
              <div className="bg-muted/50 rounded-xl p-4 mt-3">
                <BilingualText
                  english={<p className="text-sm text-muted-foreground">Your profile will be publicly visible after admin approval. We'll review your submission shortly.</p>}
                  regional={<p className="text-xs text-muted-foreground">நிர்வாக ஒப்புதலுக்குப் பிறகு உங்கள் சுயவிவரம் பொதுவில் காணப்படும். நாங்கள் விரைவில் உங்கள் சமர்ப்பிப்பை மதிப்பாய்வு செய்வோம்.</p>}
                  regionalClassName="text-xs text-muted-foreground mt-1"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <BilingualText
                  english={<span>Register Another Worker</span>}
                  regional={<span className="text-sm">மற்றொரு தொழிலாளியை பதிவு செய்யுங்கள்</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
                size="lg"
              >
                <BilingualText
                  english={<span>Go to Home</span>}
                  regional={<span className="text-sm">முகப்புக்கு செல்லவும்</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
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

  const subcategoryDisabled = !category || availableSubcategories.length === 0;
  const subcategoryPlaceholder = !category 
    ? selectCategoryFirst.en 
    : availableSubcategories.length === 0 
    ? 'No subcategories available' 
    : selectSubcategory.en;

  return (
    <PageShell variant="compact">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-6">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{registerTitle.en}</h1>}
            regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{registerTitle.regional}</p>}
            regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
          />
          <BilingualText
            english={<p className="text-base md:text-lg text-muted-foreground">{registerHelper.en}</p>}
            regional={<p className="text-sm md:text-base text-muted-foreground">{registerHelper.regional}</p>}
            regionalClassName="text-sm md:text-base text-muted-foreground mt-1"
          />
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-5 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldName.en}</span>}
                  regional={<span className="text-sm">{fieldName.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={placeholderName.en}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldPhone.en}</span>}
                  regional={<span className="text-sm">{fieldPhone.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={placeholderPhone.en}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{fieldCategory.en}</span>}
                    regional={<span className="text-sm">{fieldCategory.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <Select value={category} onValueChange={handleCategoryChange} disabled={taxonomy.isLoading}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={taxonomy.isLoading ? loadingCategories.en : selectCategory.en} />
                  </SelectTrigger>
                  <SelectContent>
                    {taxonomy.categories.map((cat) => {
                      const label = getBilingualCategoryLabel(cat, t);
                      return (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex flex-col">
                            <span>{label.en}</span>
                            <span className="text-xs text-muted-foreground">{label.regional}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{fieldSubcategory.en}</span>}
                    regional={<span className="text-sm">{fieldSubcategory.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <Select value={subcategory} onValueChange={setSubcategory} disabled={subcategoryDisabled}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={subcategoryPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((sub) => {
                      const label = getBilingualSubcategoryLabel(sub, t);
                      return (
                        <SelectItem key={sub} value={sub}>
                          <div className="flex flex-col">
                            <span>{label.en}</span>
                            <span className="text-xs text-muted-foreground">{label.regional}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldArea.en}</span>}
                  regional={<span className="text-sm">{fieldArea.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={placeholderArea.en}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{fieldExperience.en}</span>}
                    regional={<span className="text-sm">{fieldExperience.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <Input
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder={placeholderExperience.en}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{fieldWorkingHours.en}</span>}
                    regional={<span className="text-sm">{fieldWorkingHours.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <Input
                  id="workingHours"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder={placeholderWorkingHours.en}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldPhoto.en}</span>}
                  regional={<span className="text-sm">{fieldPhoto.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo')?.click()}
                  className="h-11"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {buttonChoosePhoto.en}
                </Button>
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-border" />
                )}
              </div>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldComments.en}</span>}
                  regional={<span className="text-sm">{fieldComments.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={placeholderComments.en}
                rows={3}
                className="resize-none"
              />
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-dark text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {buttonSubmitting.en}
                </>
              ) : (
                <BilingualText
                  english={<span>{buttonSubmit.en}</span>}
                  regional={<span className="text-sm">{buttonSubmit.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              )}
            </Button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
