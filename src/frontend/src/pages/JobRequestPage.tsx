import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import JobBoard from '@/components/jobs/JobBoard';
import PageShell from '@/components/layout/PageShell';
import { logError } from '@/utils/errors';

export default function JobRequestPage() {
  const { actor } = useActor();
  const { t } = useI18n();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [workType, setWorkType] = useState('');
  const [area, setArea] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  const jobTitle = t('job.title');
  const jobHelper = t('job.helper');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!actor) {
      setError('Backend connection not available. Please try again.');
      return;
    }

    if (!workType.trim() || !area.trim() || !salary.trim() || !description.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dateTimeValue: bigint = dateTime 
        ? BigInt(new Date(dateTime).getTime()) * BigInt(1000000)
        : BigInt(Date.now()) * BigInt(1000000);
      
      const result = await actor.createJobPost(
        workType.trim(),
        area.trim(),
        dateTimeValue,
        salary.trim(),
        description.trim(),
        phone.trim()
      );

      if (result) {
        setIsSuccess(true);
        setWorkType('');
        setArea('');
        setDateTime('');
        setSalary('');
        setDescription('');
        setPhone('');
        
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err: any) {
      logError('JobRequest.handleSubmit', err);
      setError(err.message || 'Failed to submit job post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldWorkType = t('job.field.workType');
  const fieldArea = t('job.field.area');
  const fieldDateTime = t('job.field.dateTime');
  const fieldSalary = t('job.field.salary');
  const fieldDescription = t('job.field.description');
  const fieldPhone = t('job.field.phone');

  const placeholderWorkType = t('job.placeholder.workType');
  const placeholderArea = t('job.placeholder.area');
  const placeholderSalary = t('job.placeholder.salary');
  const placeholderDescription = t('job.placeholder.description');
  const placeholderPhone = t('job.placeholder.phone');

  const buttonSubmit = t('job.button.submit');
  const buttonSubmitting = t('job.button.submitting');

  return (
    <PageShell variant="compact">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{jobTitle.en}</h1>}
            regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{jobTitle.regional}</p>}
            regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
          />
          <BilingualText
            english={<p className="text-base md:text-lg text-muted-foreground">{jobHelper.en}</p>}
            regional={<p className="text-sm md:text-base text-muted-foreground">{jobHelper.regional}</p>}
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

            {isSuccess && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Job post submitted successfully! It will be visible after admin approval.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="workType" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldWorkType.en}</span>}
                  regional={<span className="text-sm">{fieldWorkType.regional}</span>}
                  regionalClassName="text-sm mt-0.5 opacity-80"
                />
              </Label>
              <Input
                id="workType"
                type="text"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                placeholder={placeholderWorkType.en}
                className="h-11 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldArea.en}</span>}
                  regional={<span className="text-sm">{fieldArea.regional}</span>}
                  regionalClassName="text-sm mt-0.5 opacity-80"
                />
              </Label>
              <Input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={placeholderArea.en}
                className="h-11 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldDateTime.en}</span>}
                  regional={<span className="text-sm">{fieldDateTime.regional}</span>}
                  regionalClassName="text-sm mt-0.5 opacity-80"
                />
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldSalary.en}</span>}
                  regional={<span className="text-sm">{fieldSalary.regional}</span>}
                  regionalClassName="text-sm mt-0.5 opacity-80"
                />
              </Label>
              <Input
                id="salary"
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder={placeholderSalary.en}
                className="h-11 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldDescription.en}</span>}
                  regional={<span className="text-sm">{fieldDescription.regional}</span>}
                  regionalClassName="text-sm mt-0.5 opacity-80"
                />
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={placeholderDescription.en}
                className="min-h-[100px] text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                <BilingualText
                  english={<span>{fieldPhone.en}</span>}
                  regional={<span className="text-sm">{fieldPhone.regional}</span>}
                  regionalClassName="text-sm mt-0.5 opacity-80"
                />
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={placeholderPhone.en}
                className="h-11 text-base"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base bg-primary hover:bg-primary-dark text-primary-foreground"
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

        <JobBoard />
      </div>
    </PageShell>
  );
}
