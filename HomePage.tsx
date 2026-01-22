import React from 'react';
import { ArrowRight, Layers, Zap, Globe, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, SiteContent, OwnerProfile } from '../types';
import { ProjectCard } from '../components/ProjectCard';

interface HomePageProps {
  projects: Project[];
  content: SiteContent['home'];
  owner?: OwnerProfile;
}

export const HomePage: React.FC<HomePageProps> = ({ projects, content, owner }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-slide-up">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-xs font-medium text-ink-light tracking-wide uppercase">Open for new collaborations</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink mb-6 tracking-tight leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {content.heroTitle}
        </h1>

        <p className="text-lg md:text-xl text-ink-light max-w-2xl mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {content.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link 
            to="/contact" 
            className="px-8 py-4 bg-ink text-white rounded-full font-medium hover:bg-accent transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group"
          >
            {content.heroButtonText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/projects" 
            className="px-8 py-4 bg-white text-ink border border-gray-200 rounded-full font-medium hover:border-accent hover:text-accent transition-all duration-300 flex items-center justify-center"
          >
            View Portfolio
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-paper hover:bg-[#f3f0e8] transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-accent">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-3">{content.feature1Title}</h3>
              <p className="text-ink-light leading-relaxed">
                {content.feature1Desc}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-paper hover:bg-[#f3f0e8] transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-accent">
                <Zap className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-3">{content.feature2Title}</h3>
              <p className="text-ink-light leading-relaxed">
                {content.feature2Desc}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-paper hover:bg-[#f3f0e8] transition-colors duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-accent">
                <Globe className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-3">{content.feature3Title}</h3>
              <p className="text-ink-light leading-relaxed">
                {content.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">Selected Work</h2>
            <p className="text-ink-light max-w-md">A glimpse into our recent endeavors in digital craftsmanship.</p>
          </div>
          <Link to="/projects" className="hidden md:flex items-center gap-2 text-sm font-medium text-ink hover:text-accent transition-colors pb-1 border-b border-transparent hover:border-accent">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
           <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent transition-colors">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Owner Profile Section */}
      {owner && (
        <section className="bg-white border-t border-gray-100 py-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
                        <img 
                            src={owner.avatarUrl} 
                            alt={owner.name} 
                            className="w-full h-full object-cover rounded-full border-4 border-paper shadow-xl"
                        />
                        <div className="absolute inset-0 rounded-full border border-gray-100 pointer-events-none"></div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
                            The Creator
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-2">
                            {owner.name}
                        </h2>
                        <h3 className="text-accent font-medium text-lg mb-6">{owner.role}</h3>
                        <p className="text-ink-light text-lg leading-relaxed mb-8">
                            {owner.bio}
                        </p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            {owner.github && (
                                <a href={owner.github} className="p-2 text-ink hover:text-accent transition-colors bg-gray-50 rounded-full">
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {owner.linkedin && (
                                <a href={owner.linkedin} className="p-2 text-ink hover:text-accent transition-colors bg-gray-50 rounded-full">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {owner.twitter && (
                                <a href={owner.twitter} className="p-2 text-ink hover:text-accent transition-colors bg-gray-50 rounded-full">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                             <Link to="/contact" className="ml-4 text-sm font-bold text-ink hover:text-accent underline decoration-2 underline-offset-4">
                                Get in touch
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}
    </div>
  );
};