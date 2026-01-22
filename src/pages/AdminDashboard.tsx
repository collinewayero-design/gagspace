import React, { useState, useRef, useEffect } from 'react';
import { Lock, Briefcase, Mail, FileText, Trash2, Plus, LogOut, ChevronRight, Layout, Users, Save, Edit, Check, Eye, Archive, BarChart2, ToggleLeft, ToggleRight, Settings, Upload, Linkedin, Twitter, Github } from 'lucide-react';
import { Project, Message, JobApplication, SiteContent, AdminUser, AutomationSettings, ProjectStatus, AdminRole } from '../types';
import { ProjectModal } from '../components/ProjectModal';

interface AdminDashboardProps {
  isAdmin: boolean;
  onLogin: (email: string, code: string) => Promise<AdminUser | null>;
  onLogout: () => void;
  projects: Project[];
  messages: Message[];
  applications: JobApplication[];
  siteContent: SiteContent;
  admins: AdminUser[];
  automations: AutomationSettings;
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onUpdateContent: (content: SiteContent) => void;
  onAddAdmin: (admin: AdminUser) => void;
  onDeleteAdmin: (id: string) => void;
  onUpdateApplicationStatus: (id: string, status: JobApplication['status']) => void;
  onUpdateAutomations: (settings: AutomationSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAdmin,
  onLogin,
  onLogout,
  projects,
  messages,
  applications,
  siteContent,
  admins,
  automations,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateContent,
  onAddAdmin,
  onDeleteAdmin,
  onUpdateApplicationStatus,
  onUpdateAutomations
}) => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages' | 'applications' | 'content' | 'team' | 'automations'>('overview');
  
  // Project Filtering
  const [projectStatusFilter, setProjectStatusFilter] = useState<ProjectStatus | 'all'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  // Content Editing State
  const [editingContent, setEditingContent] = useState<SiteContent>(siteContent);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Sync editing state with prop siteContent when it updates (e.g. after fetch)
  useEffect(() => {
    setEditingContent(siteContent);
  }, [siteContent]);

  // New Admin State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminCode, setNewAdminCode] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('editor');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      const user = await onLogin(email, accessCode);
      if (user) {
        setCurrentUser(user);
        setEditingContent(siteContent);
      } else {
        setError('Invalid email or access code');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    setEmail('');
    setAccessCode('');
    setCurrentUser(null);
  };

  // --- HELPERS ---

  const canEdit = currentUser?.role === 'owner' || currentUser?.role === 'admin' || currentUser?.role === 'editor';
  const canManageTeam = currentUser?.role === 'owner';
  const canDelete = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  const handleContentChange = (section: keyof SiteContent, key: string, value: string) => {
    // @ts-ignore - dynamic key access
    setEditingContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleContentChange('owner', 'avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveContent = () => {
    if (!canEdit) return;
    setSaveStatus('saving');
    onUpdateContent(editingContent);
    setTimeout(() => setSaveStatus('saved'), 500);
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminEmail && newAdminCode && canManageTeam) {
      onAddAdmin({
        id: Date.now().toString(),
        name: newAdminName || 'Admin',
        email: newAdminEmail,
        accessCode: newAdminCode,
        role: newAdminRole
      });
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminCode('');
    }
  };

  // Toggle Automation
  const toggleAutomation = (key: keyof AutomationSettings) => {
      onUpdateAutomations({
          ...automations,
          [key]: !automations[key]
      });
  };

  // Project Filter Logic
  const filteredProjects = projectStatusFilter === 'all' 
    ? projects 
    : projects.filter(p => p.status === projectStatusFilter);

  // Statistics Calculation
  const totalViews = projects.reduce((acc, curr) => acc + curr.views, 0);
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const unreadMessages = messages.filter(m => !m.read).length; 

  if (!isAdmin || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-ink rounded-full text-white">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center text-ink mb-2">Admin Workspace</h2>
          <p className="text-center text-ink-light mb-8">Enter your team credentials to access.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper" />
            </div>
            <div>
              <input type="password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Access Code" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper" />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-3 bg-ink text-white rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-70"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Workspace'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Workspace Dashboard</h1>
          <p className="text-ink-light">Logged in as <span className="font-semibold text-accent">{currentUser.name}</span> ({currentUser.role})</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1 space-y-2">
           <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <BarChart2 className="w-5 h-5" /> Overview
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'projects' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <Briefcase className="w-5 h-5" /> Projects
          </button>
          <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'messages' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5" /> Messages</div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'messages' ? 'bg-white/20' : 'bg-gray-100'}`}>{unreadMessages}</span>
          </button>
          <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'applications' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3"><FileText className="w-5 h-5" /> Applications</div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'applications' ? 'bg-white/20' : 'bg-gray-100'}`}>{pendingApps}</span>
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'content' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <Layout className="w-5 h-5" /> Site Content
          </button>
          <button onClick={() => setActiveTab('automations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'automations' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <Settings className="w-5 h-5" /> Automations
          </button>
          <button onClick={() => setActiveTab('team')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'team' ? 'bg-ink text-white shadow-md' : 'bg-white text-ink hover:bg-gray-50'}`}>
            <Users className="w-5 h-5" /> Team Access
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] p-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
              <div className="space-y-8">
                  <h3 className="font-serif text-xl font-bold text-ink pb-6 border-b border-gray-100">Performance Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
                          <div className="text-blue-600 mb-2"><Eye className="w-6 h-6" /></div>
                          <div className="text-2xl font-bold text-ink">{totalViews}</div>
                          <div className="text-xs text-ink-light">Total Project Views</div>
                      </div>
                      <div className="p-6 rounded-xl bg-orange-50 border border-orange-100">
                          <div className="text-orange-600 mb-2"><Briefcase className="w-6 h-6" /></div>
                          <div className="text-2xl font-bold text-ink">{projects.length}</div>
                          <div className="text-xs text-ink-light">Total Projects</div>
                      </div>
                      <div className="p-6 rounded-xl bg-purple-50 border border-purple-100">
                          <div className="text-purple-600 mb-2"><FileText className="w-6 h-6" /></div>
                          <div className="text-2xl font-bold text-ink">{pendingApps}</div>
                          <div className="text-xs text-ink-light">Pending Applications</div>
                      </div>
                       <div className="p-6 rounded-xl bg-green-50 border border-green-100">
                          <div className="text-green-600 mb-2"><Mail className="w-6 h-6" /></div>
                          <div className="text-2xl font-bold text-ink">{unreadMessages}</div>
                          <div className="text-xs text-ink-light">Unread Messages</div>
                      </div>
                  </div>

                  <div className="bg-paper p-6 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-ink mb-4">Quick Actions</h4>
                      <div className="flex gap-4">
                          <button onClick={() => { setActiveTab('projects'); setIsModalOpen(true); setEditingProject(undefined); }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-colors">
                              <Plus className="w-4 h-4" /> New Project
                          </button>
                          <button onClick={() => setActiveTab('applications')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-colors">
                              <Check className="w-4 h-4" /> Review Apps
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 gap-4">
                <h3 className="font-serif text-xl font-bold text-ink">Manage Portfolio</h3>
                <div className="flex gap-3">
                    <select 
                        value={projectStatusFilter} 
                        onChange={(e) => setProjectStatusFilter(e.target.value as ProjectStatus | 'all')}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                        <option value="archived">Archived</option>
                    </select>
                    {canEdit && (
                        <button onClick={() => { setIsModalOpen(true); setEditingProject(undefined); }} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors">
                        <Plus className="w-4 h-4" /> Add Project
                        </button>
                    )}
                </div>
              </div>

              <div className="space-y-4">
                {filteredProjects.length === 0 ? <p className="text-ink-light text-center py-8">No projects found.</p> :
                 filteredProjects.map(project => (
                  <div key={project.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                    <img src={project.imageUrl} alt="" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-ink">{project.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                              project.status === 'published' ? 'bg-green-100 text-green-700' :
                              project.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                              {project.status}
                          </span>
                      </div>
                      <p className="text-sm text-ink-light line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {project.views} views</span>
                        <span>{project.tags.length} tags</span>
                        {project.links && project.links.length > 0 && <span className="text-accent">{project.links.length} links</span>}
                      </div>
                    </div>
                    {canEdit && (
                        <div className="flex gap-2">
                        <button 
                            onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                            className="p-2 text-gray-400 hover:text-ink transition-colors"
                            title="Edit Project"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                        {canDelete && (
                            <button 
                                onClick={() => onDeleteProject(project.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete Project"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
             <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-ink pb-6 border-b border-gray-100">Inbox</h3>
              {messages.length === 0 ? <div className="text-center py-12 text-ink-light">No messages yet.</div> : 
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`p-4 rounded-xl border transition-colors ${msg.read ? 'border-gray-100 opacity-70' : 'border-accent/20 bg-accent/5'}`}>
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-ink">{msg.name}</span>
                        <span className="text-xs text-ink-light">{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs font-semibold text-accent mb-2">{msg.email}</div>
                      <div className="font-medium text-sm text-ink mb-1">{msg.subject}</div>
                      <p className="text-sm text-ink-light leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
             <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-ink pb-6 border-b border-gray-100">Job Applications</h3>
              {applications.length === 0 ? <div className="text-center py-12 text-ink-light">No applications yet.</div> : 
                <div className="space-y-4">
                   {applications.map((app, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                       <div className="flex justify-between mb-2">
                        <span className="font-bold text-ink">{app.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            app.status === 'declined' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div><span className="text-gray-400">Role:</span> {app.role}</div>
                        <div><span className="text-gray-400">Email:</span> {app.email}</div>
                      </div>
                      <div className="mb-3">
                         <a href={app.portfolio} target="_blank" rel="noreferrer" className="text-accent text-sm hover:underline flex items-center gap-1">View Portfolio <ChevronRight className="w-3 h-3" /></a>
                      </div>
                      <div className="bg-paper p-3 rounded-lg text-sm text-ink-light mb-4">
                        <span className="block text-xs font-semibold text-ink mb-1">Motivation:</span>
                        {app.motivation}
                      </div>

                      {canEdit && (
                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                            {app.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => onUpdateApplicationStatus(app.id, 'declined')}
                                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Decline
                                    </button>
                                    <button 
                                        onClick={() => onUpdateApplicationStatus(app.id, 'approved')}
                                        className="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" /> Approve & Send Instructions
                                    </button>
                                </>
                            )}
                            {(app.status === 'approved' || app.status === 'declined') && (
                                <button 
                                    className="px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed"
                                    disabled
                                >
                                    Processed
                                </button>
                            )}
                        </div>
                      )}
                    </div>
                   ))}
                </div>
              }
            </div>
          )}

          {/* Automations Tab */}
          {activeTab === 'automations' && (
              <div className="space-y-8">
                  <h3 className="font-serif text-xl font-bold text-ink pb-6 border-b border-gray-100">Automation Settings</h3>
                  
                  {canEdit ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-ink">Accept Applications</h4>
                                <p className="text-sm text-ink-light">Enable or disable the public application form on the "Join" page.</p>
                            </div>
                            <button onClick={() => toggleAutomation('applicationsEnabled')} className={`text-2xl transition-colors ${automations.applicationsEnabled ? 'text-accent' : 'text-gray-300'}`}>
                                {automations.applicationsEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-ink">Auto-Reply to Contacts</h4>
                                <p className="text-sm text-ink-light">Automatically send a confirmation email when someone uses the contact form.</p>
                            </div>
                            <button onClick={() => toggleAutomation('autoReplyContact')} className={`text-2xl transition-colors ${automations.autoReplyContact ? 'text-accent' : 'text-gray-300'}`}>
                                {automations.autoReplyContact ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-ink">Notify Admins on Application</h4>
                                <p className="text-sm text-ink-light">Send an email to all admins when a new job application is received.</p>
                            </div>
                            <button onClick={() => toggleAutomation('notifyOnApplication')} className={`text-2xl transition-colors ${automations.notifyOnApplication ? 'text-accent' : 'text-gray-300'}`}>
                                {automations.notifyOnApplication ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                            </button>
                        </div>

                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-ink">Maintenance Mode</h4>
                                <p className="text-sm text-ink-light">Temporarily disable the public website (only admins can access).</p>
                            </div>
                            <button onClick={() => toggleAutomation('maintenanceMode')} className={`text-2xl transition-colors ${automations.maintenanceMode ? 'text-accent' : 'text-gray-300'}`}>
                                {automations.maintenanceMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                            </button>
                        </div>
                    </div>
                  ) : (
                      <p className="text-ink-light text-center py-8">You do not have permission to manage system automations.</p>
                  )}
              </div>
          )}

          {/* Site Content Tab */}
          {activeTab === 'content' && (
             <div className="space-y-8">
               <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                  <h3 className="font-serif text-xl font-bold text-ink">Edit Site Content</h3>
                  {canEdit && (
                    <button onClick={saveContent} className="flex items-center gap-2 px-6 py-2 bg-ink text-white rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-70" disabled={saveStatus === 'saving'}>
                        <Save className="w-4 h-4" />
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                    </button>
                  )}
               </div>
               
               <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                 
                 {/* Owner Profile Section */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-ink mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" /> Owner Profile
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                            <input type="text" value={editingContent.owner?.name || ''} onChange={(e) => handleContentChange('owner', 'name', e.target.value)} disabled={!canEdit} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent text-sm" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Role / Title</label>
                             <input type="text" value={editingContent.owner?.role || ''} onChange={(e) => handleContentChange('owner', 'role', e.target.value)} disabled={!canEdit} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent text-sm" />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Avatar Image</label>
                             <div 
                                onClick={() => canEdit && fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    editingContent.owner?.avatarUrl ? 'border-accent/50 bg-accent/5' : 'border-gray-200 hover:border-accent hover:bg-paper'
                                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                                {editingContent.owner?.avatarUrl ? (
                                    <div className="relative w-full h-full rounded-md overflow-hidden group">
                                    <img src={editingContent.owner.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    {canEdit && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-[10px] font-medium">Change</span>
                                        </div>
                                    )}
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 text-gray-400 mb-1" />
                                        <span className="text-[10px] text-gray-500">Upload</span>
                                    </>
                                )}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleAvatarUpload}
                                    disabled={!canEdit}
                                />
                             </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bio</label>
                             <textarea rows={3} value={editingContent.owner?.bio || ''} onChange={(e) => handleContentChange('owner', 'bio', e.target.value)} disabled={!canEdit} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent text-sm resize-none" />
                        </div>
                        
                        {/* Social Links */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div>
                                <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    <Linkedin className="w-3 h-3" /> LinkedIn URL
                                </label>
                                <input type="text" value={editingContent.owner?.linkedin || ''} onChange={(e) => handleContentChange('owner', 'linkedin', e.target.value)} disabled={!canEdit} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-accent text-sm" />
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    <Twitter className="w-3 h-3" /> Twitter URL
                                </label>
                                <input type="text" value={editingContent.owner?.twitter || ''} onChange={(e) => handleContentChange('owner', 'twitter', e.target.value)} disabled={!canEdit} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-accent text-sm" />
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    <Github className="w-3 h-3" /> GitHub URL
                                </label>
                                <input type="text" value={editingContent.owner?.github || ''} onChange={(e) => handleContentChange('owner', 'github', e.target.value)} disabled={!canEdit} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:border-accent text-sm" />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Home Section */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h4 className="font-bold text-ink mb-4 pb-2 border-b border-gray-100">Home Page Copy</h4>
                   <div className="grid grid-cols-1 gap-4">
                     {Object.entries(editingContent.home).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                          {key.includes('Desc') || key.includes('Subtitle') ? (
                            <textarea
                              value={value as string}
                              onChange={(e) => handleContentChange('home', key, e.target.value)}
                              disabled={!canEdit}
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm disabled:bg-gray-50 disabled:text-gray-400 resize-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => handleContentChange('home', key, e.target.value)}
                              disabled={!canEdit}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm disabled:bg-gray-50 disabled:text-gray-400"
                            />
                          )}
                        </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              <h3 className="font-serif text-xl font-bold text-ink pb-6 border-b border-gray-100">Team Management</h3>
              
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-ink">Active Admins</h4>
                {admins.map(admin => (
                  <div key={admin.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">{admin.name}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${
                            admin.role === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            admin.role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>{admin.role}</span>
                      </div>
                      <div className="text-xs text-gray-500">{admin.email}</div>
                    </div>
                    {canManageTeam && admins.length > 1 && admin.id !== currentUser.id && (
                      <button onClick={() => onDeleteAdmin(admin.id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {canManageTeam && (
                <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-ink mb-4">Recruit New Admin</h4>
                    <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        required
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Set Access Code"
                        value={newAdminCode}
                        onChange={(e) => setNewAdminCode(e.target.value)}
                        required
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm"
                    />
                    <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:border-accent outline-none text-sm"
                    >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                    </select>
                    <button type="submit" className="md:col-span-4 bg-ink text-white py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                        Add Team Member
                    </button>
                    </form>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {isModalOpen && (
        <ProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(project) => {
              if (editingProject) {
                  onUpdateProject(project);
              } else {
                  onAddProject(project);
              }
          }}
          initialData={editingProject}
        />
      )}
    </div>
  );
};