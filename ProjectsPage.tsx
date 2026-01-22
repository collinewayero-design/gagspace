import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Project, SiteContent } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';

interface ProjectsPageProps {
  projects: Project[];
  isAdmin: boolean;
  onAddProject: (project: Project) => void;
  content: SiteContent['projects'];
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, isAdmin, onAddProject, content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))].slice(0, 6);
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.tags.includes(filter));

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-4">{content.title}</h1>
            <p className="text-ink-light max-w-xl">
              {content.subtitle}
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-3 bg-ink text-white rounded-lg text-sm font-medium hover:bg-accent transition-colors shadow-lg shadow-gray-200"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gray-200">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                filter === tag 
                  ? 'bg-ink text-white shadow-md' 
                  : 'bg-white text-ink-light hover:bg-gray-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-ink-light">No projects found for this category.</p>
            <button 
              onClick={() => setFilter('All')} 
              className="mt-2 text-accent text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={onAddProject} 
        />
      )}
    </div>
  );
};