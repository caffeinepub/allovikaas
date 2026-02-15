import PageShell from '@/components/layout/PageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Finding Reliable Local Workers Made Easy',
      excerpt: 'Discover how AREA WORKARS connects you with skilled professionals in your neighborhood.',
      date: 'February 10, 2026',
      author: 'AREA WORKARS Team',
    },
    {
      id: 2,
      title: 'Tips for Hiring Construction Workers',
      excerpt: 'Essential guidelines for finding and working with construction professionals.',
      date: 'February 5, 2026',
      author: 'AREA WORKARS Team',
    },
    {
      id: 3,
      title: 'Supporting Local Skilled Workers',
      excerpt: 'How our platform empowers local workers and strengthens communities.',
      date: 'January 28, 2026',
      author: 'AREA WORKARS Team',
    },
  ];

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-primary">Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            News, tips, and insights from AREA WORKARS
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-foreground hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-8">
          <p className="text-muted-foreground">More articles coming soon!</p>
        </div>
      </div>
    </PageShell>
  );
}
