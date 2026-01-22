import React from 'react';
import { Project } from '../types';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`} className="block h-full">
      <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-accent/30 transition-all duration-500 flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-2 flex-wrap">
              {project.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-accent bg-accent/5 px-2 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            {project.date && (
              <div className="flex items-center text-gray-400 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(project.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>

          <h3 className="font-serif text-xl font-bold text-ink mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          
          <p className="text-ink-light text-sm leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-ink group-hover:text-accent transition-colors flex items-center gap-1">
              Read Case Study
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};