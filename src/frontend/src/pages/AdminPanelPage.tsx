import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminWorkerReviewList from '@/components/admin/AdminWorkerReviewList';
import AdminJobPostReviewList from '@/components/admin/AdminJobPostReviewList';
import BilingualText from '@/components/i18n/BilingualText';
import { useI18n } from '@/components/i18n/I18nProvider';
import PageShell from '@/components/layout/PageShell';

export default function AdminPanelPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('workers');

  const adminTitle = t('admin.title');
  const adminSubtitle = t('admin.subtitle');
  const tabWorkers = t('admin.tabs.workers');
  const tabJobs = t('admin.tabs.jobs');

  return (
    <AdminGuard>
      <PageShell variant="compact">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <BilingualText
              english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{adminTitle.en}</h1>}
              regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{adminTitle.regional}</p>}
              regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
            />
            <BilingualText
              english={<p className="text-base md:text-lg text-muted-foreground">{adminSubtitle.en}</p>}
              regional={<p className="text-sm md:text-base text-muted-foreground">{adminSubtitle.regional}</p>}
              regionalClassName="text-sm md:text-base text-muted-foreground mt-1"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="workers" className="text-base">
                <BilingualText
                  english={<span>{tabWorkers.en}</span>}
                  regional={<span className="text-sm">{tabWorkers.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </TabsTrigger>
              <TabsTrigger value="jobs" className="text-base">
                <BilingualText
                  english={<span>{tabJobs.en}</span>}
                  regional={<span className="text-sm">{tabJobs.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-sm mt-0.5"
                />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workers" className="mt-0">
              <AdminWorkerReviewList />
            </TabsContent>

            <TabsContent value="jobs" className="mt-0">
              <AdminJobPostReviewList />
            </TabsContent>
          </Tabs>
        </div>
      </PageShell>
    </AdminGuard>
  );
}
