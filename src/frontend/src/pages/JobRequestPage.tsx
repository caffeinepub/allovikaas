import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActor } from '@/hooks/useActor';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import { useCreateJobPost } from '@/hooks/useQueries';
import { toast } from 'sonner';
import JobBoard from '@/components/jobs/JobBoard';
import PageShell from '@/components/layout/PageShell';
import { getBilingualFieldLabel } from '@/utils/bilingualFields';

export default function JobRequestPage() {
  const { actor } = useActor();
  const { t } = useI18n();
  const createJobMutation = useCreateJobPost();

  const [workType, setWorkType] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workType || !area || !date || !time || !salary || !description || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const dateTimeStr = `${date}T${time}`;
    const dateTime = BigInt(new Date(dateTimeStr).getTime() * 1000000);

    createJobMutation.mutate(
      {
        workType: workType.trim(),
        area: area.trim(),
        dateTime,
        salary: salary.trim(),
        description: description.trim(),
        phone: phone.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Job post submitted for approval!');
          setWorkType('');
          setArea('');
          setDate('');
          setTime('');
          setSalary('');
          setDescription('');
          setPhone('');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to submit job post');
        },
      }
    );
  };

  // Get bilingual labels for form fields
  const workTypeLabel = getBilingualFieldLabel('workType');
  const areaLabel = getBilingualFieldLabel('area');
  const dateTimeLabel = getBilingualFieldLabel('dateTime');
  const salaryLabel = getBilingualFieldLabel('salary');
  const descriptionLabel = getBilingualFieldLabel('description');
  const phoneLabel = getBilingualFieldLabel('phone');

  return (
    <PageShell variant="compact">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">Post a Job</h1>}
            regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">வேலை இடுகை</p>}
            regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
          />
          <BilingualText
            english={<p className="text-base md:text-lg text-muted-foreground">Find workers for your needs</p>}
            regional={<p className="text-sm md:text-base text-muted-foreground">உங்கள் தேவைகளுக்கு தொழிலாளர்களை கண்டுபிடிக்கவும்</p>}
            regionalClassName="text-sm md:text-base text-muted-foreground mt-1"
          />
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-5 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workType" className="text-base font-semibold">
                <BilingualText
                  english={<span>{workTypeLabel.en}</span>}
                  regional={<span className="text-sm">{workTypeLabel.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Input
                id="workType"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                placeholder="e.g., Mason, Carpenter"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-base font-semibold">
                <BilingualText
                  english={<span>{areaLabel.en}</span>}
                  regional={<span className="text-sm">{areaLabel.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter area or locality"
                className="h-11"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{dateTimeLabel.en}</span>}
                    regional={<span className="text-sm">{dateTimeLabel.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11"
                    required
                  />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-base font-semibold">
                  <BilingualText
                    english={<span>{salaryLabel.en}</span>}
                    regional={<span className="text-sm">{salaryLabel.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-sm mt-0.5"
                  />
                </Label>
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g., ₹500/day"
                  className="h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                <BilingualText
                  english={<span>{descriptionLabel.en}</span>}
                  regional={<span className="text-sm">{descriptionLabel.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work requirements"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                <BilingualText
                  english={<span>{phoneLabel.en}</span>}
                  regional={<span className="text-sm">{phoneLabel.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit phone number"
                className="h-11"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {createJobMutation.isPending ? 'Submitting...' : 'Submit Job Post'}
            </Button>
          </form>
        </div>

        <JobBoard />
      </div>
    </PageShell>
  );
}
