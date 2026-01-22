import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Loader2, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { Project, ProjectStatus, LinkItem } from '../types';
import { enhanceProjectDescription, generateProjectTags } from '../services/geminiService';

interface ProjectModalProps {
  onClose: () => void;
  onSave: (project: Project) => void;
  initialData?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('draft');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLongDescription(initialData.longDescription || '');
      setClient(initialData.client || '');
      setRole(initialData.role || '');
      setImageUrl(initialData.imageUrl);
      setTags(initialData.tags.join(', '));
      setStatus(initialData.status);
      setLinks(initialData.links || []);
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!description || description.length < 5) return;
    
    setIsEnhancing(true);
    try {
      const enhancedDesc = await enhanceProjectDescription(description);
      setDescription(enhancedDesc);
      
      if (!tags) {
        const generatedTags = await generateProjectTags(title, enhancedDesc);
        setTags(generatedTags.join(', '));
      }
    } catch (error) {
      console.error("Enhancement failed", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const addLink = () => {
      setLinks([...links, { label: '', url: '' }]);
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
      const newLinks = [...links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      setLinks(newLinks);
  };

  const removeLink = (index: number) => {
      setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: initialData ? initialData.id : Date.now().toString(),
      title,
      description,
      longDescription,
      client,
      role,
      imageUrl: imageUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      links: links.filter(l => l.label && l.url), // Filter empty links
      date: initialData ? initialData.date : new Date().toISOString(),
      status: status,
      views: initialData ? initialData.views : 0
    };
    onSave(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-paper">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">{initialData ? 'Edit Project' : 'Add Project'}</h2>
            <p className="text-sm text-ink-light">Curate your portfolio entry.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                imageUrl ? 'border-accent/50 bg-accent/5' : 'border-gray-200 hover:border-accent hover:bg-paper'
              }`}
            >
              {imageUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium">Click to change</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-accent">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-ink">Click to upload cover image</p>
                  <p className="text-xs text-ink-light mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper"
                  placeholder="e.g. Neo-Bank Interface"
                />
              </div>
              <div>
                 <label className="block text-sm font-semibold text-ink mb-2">Status</label>
                 <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper appearance-none"
                 >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Public)</option>
                    <option value="archived">Archived (Hidden)</option>
                 </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Client (Optional)</label>
                    <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper"
                    placeholder="e.g. FinCorp"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">My Role (Optional)</label>
                    <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper"
                    placeholder="e.g. Lead Designer & Frontend Dev"
                    />
                </div>
            </div>

            {/* Short Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-ink">Short Description (Card View)</label>
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || !description}
                  className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover disabled:opacity-50 transition-colors"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper placeholder:text-gray-400 resize-none"
                placeholder="Brief summary..."
              />
            </div>

             {/* Links Section */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-ink">Project Links</label>
                    <button type="button" onClick={addLink} className="text-xs text-accent hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Link
                    </button>
                </div>
                <div className="space-y-3">
                    {links.map((link, index) => (
                        <div key={index} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Label (e.g. Live Site)"
                                value={link.label}
                                onChange={(e) => updateLink(index, 'label', e.target.value)}
                                className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 focus:border-accent text-sm"
                            />
                            <input 
                                type="text" 
                                placeholder="URL (https://...)"
                                value={link.url}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                className="w-2/3 px-3 py-2 rounded-lg border border-gray-200 focus:border-accent text-sm"
                            />
                            <button type="button" onClick={() => removeLink(index)} className="p-2 text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {links.length === 0 && <p className="text-xs text-gray-400 italic">No links added yet.</p>}
                </div>
            </div>

            {/* Long Description (Article) */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Detailed Content (Article View)</label>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper placeholder:text-gray-400"
                placeholder="Full case study content. You can use simple text formatting here..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper"
                placeholder="React, Design System, UX Research"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-paper flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-ink hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="project-form"
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-ink text-white hover:bg-accent transition-colors shadow-lg shadow-gray-200"
          >
            {initialData ? 'Update Project' : 'Publish Project'}
          </button>
        </div>
      </div>
    </div>
  );
};