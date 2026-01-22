import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, LinkItem } from '../types';
import { ArrowLeft, Calendar, Tag, User, Briefcase, ExternalLink } from 'lucide-react';

interface ProjectDetailPageProps {
  projects: Project[];
  onViewProject: (id: string) => void;
}

// Simple Markdown Parser (Headers, Lists, Bold)
const SimpleMarkdown = ({ text }: { text: string }) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        // Headers
        if (line.trim().startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold font-serif text-ink mt-8 mb-4">{line.replace('## ', '')}</h2>;
        }
        if (line.trim().startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold font-serif text-ink mt-8 mb-4">{line.replace('# ', '')}</h1>;
        }
        
        // Lists
        if (line.trim().startsWith('- ')) {
           return <li key={index} className="ml-4 list-disc text-ink-light">{line.replace('- ', '')}</li>;
        }

        // Empty lines
        if (!line.trim()) return <br key={index} />;

        // Paragraphs (with basic bold support)
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="leading-relaxed text-ink-light text-lg">
             {parts.map((part, i) => {
                 if (part.startsWith('**') && part.endsWith('**')) {
                     return <strong key={i} className="text-ink font-semibold">{part.slice(2, -2)}</strong>;
                 }
                 return part;
             })}
          </p>
        );
      })}
    </div>
  );
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projects, onViewProject }) => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  // Increment view count on mount
  useEffect(() => {
    if (id && project) {
      onViewProject(id);
    }
  }, [id, project, onViewProject]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-serif font-bold text-ink mb-4">Project Not Found</h2>
        <Link to="/projects" className="text-accent hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-20 animate-fade-in">
      {/* Header Image */}
      <div className="h-[40vh] md:h-[60vh] w-full relative overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Link to="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 shadow-sm">
                    {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                    {project.date && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(project.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </div>
                    )}
                    {project.client && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Client: {project.client}
                        </div>
                    )}
                     {project.role && (
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Role: {project.role}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Project Links (if any) */}
        {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-10">
                {project.links.map((link: LinkItem, idx: number) => (
                    <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-full font-medium hover:bg-accent transition-colors shadow-md"
                    >
                        {link.label} <ExternalLink className="w-4 h-4" />
                    </a>
                ))}
            </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
            {project.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper-dark text-ink text-xs font-medium">
                    <Tag className="w-3 h-3" /> {tag}
                </span>
            ))}
        </div>

        {/* Description Body */}
        <div className="prose prose-lg max-w-none">
            {project.longDescription ? (
                <SimpleMarkdown text={project.longDescription} />
            ) : (
                <p className="text-xl leading-relaxed text-ink-light font-serif italic border-l-4 border-accent pl-6 py-2">
                    {project.description}
                </p>
            )}
        </div>

      </div>
    </article>
  );
};