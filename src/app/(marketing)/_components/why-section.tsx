import { MapPin, Shield, Users, Wrench } from 'lucide-react';

import { Card } from '@/components/ui/card';

const features = [
  {
    icon: MapPin,
    title: 'Collaborative Mapping',
    description:
      'Allow users to suggest edits, add POIs, or report map errors directly in the app.',
  },
  {
    icon: Users,
    title: 'Community-Powered',
    description: 'Join a global community contributing to open mapping standards and tools.',
  },
  {
    icon: Wrench,
    title: 'Customizable',
    description: 'Full control over your maps, navigation logic, and user experience.',
  },
  {
    icon: Shield,
    title: 'Privacy-First',
    description: 'Keep your data on your infrastructure. No tracking, no third-party dependencies.',
  },
];

function WhySection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why <span className="text-primary">OpenIndoorMaps</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Break free from proprietary indoor navigation systems. Build with transparency,
            flexibility, and community support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-border animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Comparison highlight */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-card border border-border rounded-2xl p-8 md:p-12 max-w-4xl shadow-md">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Proprietary vs. <span className="text-accent">Open Source</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-destructive mb-3">Closed Systems:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Vendor lock-in and expensive licensing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Limited customization options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span>Data stored on third-party servers</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-3">OpenIndoorMaps:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Free to use, modify, and distribute</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Complete control over features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Self-hosted with full privacy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default WhySection;
