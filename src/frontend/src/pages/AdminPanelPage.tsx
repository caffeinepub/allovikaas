import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminWorkerReviewList from '@/components/admin/AdminWorkerReviewList';
import AdminJobPostReviewList from '@/components/admin/AdminJobPostReviewList';

export default function AdminPanelPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Review and manage worker registrations and job posts</p>
          </div>

          <Tabs defaultValue="workers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="workers">Workers</TabsTrigger>
              <TabsTrigger value="jobs">Job Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="workers" className="mt-8">
              <AdminWorkerReviewList />
            </TabsContent>

            <TabsContent value="jobs" className="mt-8">
              <AdminJobPostReviewList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}
