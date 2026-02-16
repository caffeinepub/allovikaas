import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import { useNavigate } from '@tanstack/react-router';
import { useWorkerTaxonomy } from '@/hooks/useWorkerTaxonomy';
import { getBilingualCategoryLabel } from '@/utils/bilingualTaxonomy';
import { getErrorMessage, logError } from '@/utils/errors';
import PageShell from '@/components/layout/PageShell';
import { useQueryClient } from '@tanstack/react-query';
import { PUBLIC_WORKERS_QUERY_KEY } from '@/hooks/useQueries';

export default function WorkerRegistrationPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const { t } = useI18n();
  const taxonomy = useWorkerTaxonomy();
  const queryClient = useQueryClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [experience, setExperience] = useState('');

  const registerTitle = t('register.title');
  const registerHelper = t('register.helper');

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
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!area.trim()) {
      setError('Area / Location is required');
      return false;
    }
    if (!category) {
      setError('Category is required');
      return false;
    }
    if (!availableTime.trim()) {
      setError('Available time is required');
      return false;
    }
    if (!experience.trim()) {
      setError('Experience is required');
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

    try {
      // Parse skills from comma-separated string
      const skillsArray = skillsStr
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const result = await actor.submitWorkerRegistration(
        name.trim(),
        phone.trim(),
        area.trim(),
        category,
        skillsArray,
        availableTime.trim(),
        experience.trim()
      );

      if (result) {
        // Invalidate public workers query to refresh the list
        await queryClient.invalidateQueries({ queryKey: PUBLIC_WORKERS_QUERY_KEY });
        
        setIsSuccess(true);
        // Reset form
        setName('');
        setPhone('');
        setArea('');
        setCategory('');
        setSkillsStr('');
        setAvailableTime('');
        setExperience('');
      }
    } catch (err: unknown) {
      logError('WorkerRegistration.handleSubmit', err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
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
                english={<h2 className="text-3xl md:text-4xl font-bold text-foreground">Registration Complete!</h2>}
                regional={<p className="text-2xl md:text-3xl font-bold text-foreground">பதிவு முடிந்தது!</p>}
                regionalClassName="text-2xl md:text-3xl font-bold text-foreground mt-2"
              />
              <BilingualText
                english={<p className="text-lg text-muted-foreground">Your profile is now live and visible to everyone.</p>}
                regional={<p className="text-base text-muted-foreground">உங்கள் சுயவிவரம் இப்போது நேரலையில் உள்ளது மற்றும் அனைவருக்கும் தெரியும்.</p>}
                regionalClassName="text-base text-muted-foreground mt-1"
              />
              <div className="bg-muted/50 rounded-xl p-4 mt-3">
                <BilingualText
                  english={<p className="text-sm text-muted-foreground">People can now find and contact you through the search page.</p>}
                  regional={<p className="text-xs text-muted-foreground">மக்கள் இப்போது தேடல் பக்கத்தின் மூலம் உங்களைக் கண்டுபிடித்து தொடர்பு கொள்ளலாம்.</p>}
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
                onClick={() => navigate({ to: '/search' })}
                className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground"
                size="lg"
              >
                <BilingualText
                  english={<span>View All Workers</span>}
                  regional={<span className="text-sm">அனைத்து தொழிலாளர்களையும் பார்க்கவும்</span>}
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
  const fieldArea = t('register.field.area');
  const fieldCategory = t('register.field.category');
  const fieldSkills = t('register.field.skills');
  const fieldAvailableTime = t('register.field.availableTime');
  const fieldExperience = t('register.field.experience');

  const placeholderName = t('register.placeholder.name');
  const placeholderPhone = t('register.placeholder.phone');
  const placeholderArea = t('register.placeholder.area');
  const placeholderSkills = t('register.placeholder.skills');
  const placeholderAvailableTime = t('register.placeholder.availableTime');
  const placeholderExperience = t('register.placeholder.experience');

  const selectCategory = t('register.select.category');
  const loadingCategories = t('register.loading.categories');

  const buttonSubmit = t('register.button.submit');
  const buttonSubmitting = t('register.button.submitting');

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
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
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldCategory.en}</span>}
                  regional={<span className="text-sm">{fieldCategory.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={taxonomy.isLoading || isSubmitting}>
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
              <Label htmlFor="skills" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldSkills.en}</span>}
                  regional={<span className="text-sm">{fieldSkills.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Textarea
                id="skills"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder={placeholderSkills.en}
                className="min-h-[80px] resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableTime" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{fieldAvailableTime.en}</span>}
                    regional={<span className="text-sm">{fieldAvailableTime.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <Input
                  id="availableTime"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  placeholder={placeholderAvailableTime.en}
                  className="h-11"
                  disabled={isSubmitting}
                />
              </div>

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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <BilingualText
                      english={<span>{buttonSubmitting.en}</span>}
                      regional={<span className="text-sm">{buttonSubmitting.regional}</span>}
                      containerClassName="flex flex-col"
                      regionalClassName="text-sm mt-0.5"
                    />
                  </span>
                ) : (
                  <BilingualText
                    english={<span>{buttonSubmit.en}</span>}
                    regional={<span className="text-sm">{buttonSubmit.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
