import { GitPullRequest, Star, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';

async function getGitHubStats() {
  try {
    const res = await fetch('https://api.github.com/repos/openindoormaps/openindoormaps', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      stars: data.stargazers_count as number,
      forks: data.forks_count as number,
    };
  } catch {
    return null;
  }
}

async function Community() {
  const gh = await getGitHubStats();

  const stats = [
    {
      icon: Star,
      label: 'GitHub Stars',
      value: gh ? gh.stars.toLocaleString() : '100+',
      color: 'text-primary',
    },
    {
      icon: GitPullRequest,
      label: 'Forks',
      value: gh ? gh.forks.toLocaleString() : '27+',
      color: 'text-accent',
    },
    {
      icon: Users,
      label: 'Discord Community',
      value: '100+',
      color: 'text-primary',
    },
  ];

  return (
    <section id="community" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 animate-fade-in text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Join the <span className="text-accent">Project</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            OpenIndoorMaps is developed transparently on GitHub. Follow the progress, open issues,
            or contribute.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="animate-slide-up border-border bg-card p-8 text-center transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className={`mx-auto mb-4 h-10 w-10 ${stat.color}`} />
              <div className="mb-2 text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-border bg-card/50 p-8 backdrop-blur md:p-12">
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold md:text-3xl">Get involved</h3>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Star the repo, open an issue, or share feedback — every bit of engagement helps
                shape the direction of the project.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Fully Open Source',
              description: 'Every line of code is public. Fork it, extend it, use it.',
            },
            {
              title: 'Issues Welcome',
              description: 'Bug reports, feature ideas, and feedback — all appreciated.',
            },
            {
              title: 'Built in Public',
              description: 'Development happens openly on GitHub, commit by commit.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="animate-fade-in text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h4 className="mb-3 text-xl font-bold">{item.title}</h4>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Community;
