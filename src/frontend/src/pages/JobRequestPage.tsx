import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import JobBoard from '@/components/jobs/JobBoard';

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

  const validateForm = (): boolean => {
    if (!workType.trim()) {
      setError('Work type is required');
      return false;
    }
    if (!area.trim()) {
      setError('Area is required');
      return false;
    }
    if (!dateTime.trim()) {
      setError('Date/Time is required');
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
      const timestamp = BigInt(Date.now() * 1000000);
      
      const result = await actor.createJobPost(
        workType.trim(),
        area.trim(),
        timestamp,
        salary.trim() || 'Negotiable',
        description.trim() || '',
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
        
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } catch (err: any) {
      console.error('Job post error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Job Request Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <BilingualText
                english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{jobTitle.en}</h1>}
                regional={<p className="text-lg md:text-xl mt-2">{jobTitle.regional}</p>}
                regionalClassName="text-lg md:text-xl mt-2 opacity-80"
              />
            </div>

            {isSuccess && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-primary font-medium">
                  Job post submitted for approval. It will appear on the board once verified.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workType" className="text-base font-medium">
                  Work Type <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="workType"
                  type="text"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="e.g., Electrician, Plumber, Mason"
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="text-base font-medium">
                  Area <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area or pincode"
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTime" className="text-base font-medium">
                  Date/Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateTime"
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="e.g., Tomorrow 10 AM, 15th Jan 2026"
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-base font-medium">
                  Salary
                </Label>
                <Input
                  id="salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g., ₹500/day, Negotiable"
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the work requirements..."
                  className="min-h-[100px] text-base"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10 digit mobile number"
                  className="h-12 text-base"
                  maxLength={10}
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Post Job Requirement'
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                * Required fields
              </p>
            </form>
          </div>
        </div>

        {/* Job Board */}
        <JobBoard />
      </div>
    </div>
  );
}
