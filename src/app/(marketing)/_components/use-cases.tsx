import { Building2, Factory, Globe, GraduationCap, Hospital, Store } from 'lucide-react';

import { Card } from '@/components/ui/card';

const useCases = [
  {
    icon: Hospital,
    title: 'Hospitals',
    description: 'Help patients and visitors navigate complex medical facilities with ease.',
  },
  {
    icon: Building2,
    title: 'Museums',
    description: 'Enhance visitor experience with interactive indoor tours and exhibits.',
  },
  {
    icon: GraduationCap,
    title: 'Campuses',
    description: 'Guide students and faculty across university buildings and facilities.',
  },
  {
    icon: Store,
    title: 'Shopping Centers',
    description: 'Improve customer experience with store location and wayfinding.',
  },
  {
    icon: Factory,
    title: 'Industrial Complexes',
    description: 'Optimize worker navigation and logistics in large manufacturing facilities.',
  },
  {
    icon: Globe,
    title: 'Exhibitions',
    description: 'Create immersive navigation for conventions and trade shows.',
  },
];

function UseCases() {
  return (
    <section id="use-cases" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Real-World <span className="text-accent">Use Cases</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From healthcare to education, OpenIndoorMaps transforms how people navigate indoor
            spaces.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="group p-8 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border animate-slide-up overflow-hidden relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-300">
                    <useCase.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">Ready to map your venue?</p>
          <div className="inline-flex gap-3">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <div className="h-1 w-12 bg-accent rounded-full" />
            <div className="h-1 w-12 bg-secondary rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default UseCases;
