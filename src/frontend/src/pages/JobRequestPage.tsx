import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateJobPost } from '@/hooks/useQueries';
import PageShell from '@/components/layout/PageShell';
import { useI18n } from '@/components/i18n/I18nProvider';
import { getBilingualFieldLabel } from '@/utils/bilingualFields';

export default function JobRequestPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const search = useSearch({ from: '/post-job' }) as any;
  
  const [workType, setWorkType] = useState('');
  const [area, setArea] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  const createJobMutation = useCreateJobPost();

  // Prefill form from search params
  useEffect(() => {
    if (search?.workType) {
      setWorkType(search.workType);
    }
    if (search?.area) {
      setArea(search.area);
    }
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workType.trim() || !area.trim() || !salary.trim() || !description.trim() || !phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Convert dateTime string to timestamp (nanoseconds)
      const timestamp = dateTime ? BigInt(new Date(dateTime).getTime() * 1_000_000) : BigInt(Date.now() * 1_000_000);

      await createJobMutation.mutateAsync({
        workType: workType.trim(),
        area: area.trim(),
        dateTime: timestamp,
        salary: salary.trim(),
        description: description.trim(),
        phone: phone.trim(),
      });

      alert(t('job.success').en);
      
      // Reset form
      setWorkType('');
      setArea('');
      setDateTime('');
      setSalary('');
      setDescription('');
      setPhone('');
      
      // Navigate to home
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to create job post:', error);
      alert(t('job.error').en);
    }
  };

  const workTypeLabel = getBilingualFieldLabel('workType');
  const areaLabel = getBilingualFieldLabel('area');
  const dateTimeLabel = getBilingualFieldLabel('dateTime');
  const salaryLabel = getBilingualFieldLabel('salary');
  const descriptionLabel = getBilingualFieldLabel('description');
  const phoneLabel = getBilingualFieldLabel('phone');

  return (
    <PageShell variant="compact">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('job.title').en}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('job.title').regional}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('job.helper').en}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="workType" className="text-base font-semibold">
              {workTypeLabel.en}
              <span className="block text-sm font-normal text-muted-foreground">
                {workTypeLabel.regional}
              </span>
            </Label>
            <Input
              id="workType"
              type="text"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              placeholder={t('job.placeholder.workType').en}
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area" className="text-base font-semibold">
              {areaLabel.en}
              <span className="block text-sm font-normal text-muted-foreground">
                {areaLabel.regional}
              </span>
            </Label>
            <Input
              id="area"
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={t('job.placeholder.area').en}
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime" className="text-base font-semibold">
              {dateTimeLabel.en}
              <span className="block text-sm font-normal text-muted-foreground">
                {dateTimeLabel.regional}
              </span>
            </Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-base font-semibold">
              {salaryLabel.en}
              <span className="block text-sm font-normal text-muted-foreground">
                {salaryLabel.regional}
              </span>
            </Label>
            <Input
              id="salary"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={t('job.placeholder.salary').en}
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              {descriptionLabel.en}
              <span className="block text-sm font-normal text-muted-foreground">
                {descriptionLabel.regional}
              </span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('job.placeholder.description').en}
              required
              rows={4}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-semibold">
              {phoneLabel.en}
              <span className="block text-sm font-normal text-muted-foreground">
                {phoneLabel.regional}
              </span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('job.placeholder.phone').en}
              required
              className="text-base"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-lg font-semibold rounded-full py-6"
            disabled={createJobMutation.isPending}
          >
            {createJobMutation.isPending ? t('job.button.submitting').en : t('job.button.submit').en}
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
