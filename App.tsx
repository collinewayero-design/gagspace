import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ContactPage } from './pages/ContactPage';
import { JoinPage } from './pages/JoinPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Project, Message, JobApplication, ContactFormInputs, JoinFormInputs, SiteContent, AdminUser, AutomationSettings } from './types';
import { Construction, Loader2 } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { sendEmail } from './services/emailService';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Maintenance Screen Component
const MaintenanceScreen = () => (
  <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center animate-fade-in">
    <div className="w-20 h-20 bg-ink text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
      <Construction className="w-10 h-10" />
    </div>
    <h1 className="font-serif text-4xl font-bold text-ink mb-4">Under Maintenance</h1>
    <p className="text-ink-light max-w-md text-lg">
      We are currently updating our portfolio to bring you a better experience. 
      Please check back shortly.
    </p>
  </div>
);

// --- DEFAULT CONTENT DATA ---

const defaultContent: SiteContent = {
  owner: {
    name: "GigSpace Team",
    role: "Digital Product Studio",
    bio: "We are a collective of designers, engineers, and strategists obsessed with pixel perfection and scalable code. We build digital products that stand the test of time.",
    avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    github: "https://github.com"
  },
  home: {
    heroTitle: "Building digital masterpieces for the modern web.",
    heroSubtitle: "GigSpace is a creative collective focused on crafting intuitive, high-performance interfaces that drive user engagement and business growth.",
    heroButtonText: "Start a Project",
    feature1Title: "Scalable Architecture",
    feature1Desc: "We build systems that grow with you. Robust, maintainable codebases designed for longevity and performance.",
    feature2Title: "Lightning Fast",
    feature2Desc: "Speed is a feature. We optimize every pixel and line of code to ensure near-instant load times and 60fps animations.",
    feature3Title: "Global Accessibility",
    feature3Desc: "Inclusive design is at our core. We ensure your digital presence is usable by everyone, everywhere."
  },
  projects: {
    title: "Our Portfolio",
    subtitle: "Explorations in design, development, and digital strategy."
  },
  contact: {
    title: "Let's shape the future together.",
    subtitle: "Have a project in mind? We'd love to hear about it. Fill out the form or send us an email.",
    email: "hello@gigspace.com",
    address: "100 Tech Plaza, Suite 400, San Francisco, CA 94107",
    phone: "+1 (555) 000-0000"
  },
  join: {
    title: "Join the Collective",
    subtitle: "We are a team of dreamers, builders, and designers. We don't just fill positions; we look for partners."
  },
  emailTemplates: {
    applicationApproved: "Dear Applicant,\n\nWe are thrilled to inform you that your application has been approved! We were impressed by your portfolio and experience.\n\nPlease reply to this email to schedule your onboarding call.\n\nWelcome to GigSpace!"
  }
};

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Nova Fintech App',
    description: 'A next-generation banking interface focusing on clarity, speed, and financial wellness visualization.',
    longDescription: "## Overview\nNova represents a shift in how users interact with their finances. We moved away from spreadsheet-like views to a conversational, insight-driven interface.\n\n## The Challenge\nTraditional banking apps are cluttered. Our goal was to reduce cognitive load while increasing feature density.\n\n## The Solution\nWe utilized a card-based UI system with real-time data visualization using WebGL. The result is a 40% increase in user session time.",
    client: 'Nova Bank',
    role: 'UI/UX & Frontend',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['Fintech', 'React', 'Data Viz'],
    links: [{ label: 'Live App', url: '#' }],
    date: new Date().toISOString(),
    status: 'published',
    views: 1240
  },
  {
    id: '2',
    title: 'Aura Health Platform',
    description: 'Telehealth platform connecting patients with specialists through secure, high-quality video streams.',
    longDescription: "## Overview\nAura connects patients to specialists in under 2 minutes. \n\n## Tech Stack\nBuilt with WebRTC for video, React for the frontend, and Supabase for real-time signaling.",
    client: 'Aura Health',
    role: 'Full Stack Development',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['HealthTech', 'WebRTC', 'Mobile'],
    links: [{ label: 'Case Study', url: '#' }],
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'published',
    views: 850
  },
  {
    id: '3',
    title: 'Echo AI Assistant',
    description: 'An AI-powered workspace companion that organizes your digital life automatically.',
    longDescription: "Echo uses LLMs to parse your calendar, emails, and notes to create a unified daily dashboard.",
    client: 'Internal Venture',
    role: 'Product Design',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    tags: ['AI', 'Productivity', 'Experimental'],
    links: [],
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    status: 'published',
    views: 2100
  }
];

const defaultAutomations: AutomationSettings = {
  autoReplyContact: true,
  autoArchiveDeclined: false,
  notifyOnApplication: true,
  maintenanceMode: false,
  applicationsEnabled: true
};

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [, setCurrentUser] = useState<AdminUser | null>(null);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [automations, setAutomations] = useState<AutomationSettings>(defaultAutomations);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchPublicData();
  }, []);

  // Fetch data dependent on admin status
  useEffect(() => {
    if (isAdmin) {
        fetchAdminData();
    }
  }, [isAdmin]);

  const fetchPublicData = async () => {
    try {
        // Fetch Projects
        const { data: projectsData } = await supabase.from('projects').select('*').order('date', { ascending: false });
        
        if (projectsData && projectsData.length > 0) {
            const mappedProjects = projectsData.map((p: any) => ({
                ...p,
                longDescription: p.long_description,
                imageUrl: p.image_url,
                links: p.links || []
            }));
            setProjects(mappedProjects);
        } else {
            // FALLBACK: Use default projects if DB/LocalStorage is empty so the site looks good on first deploy
            setProjects(defaultProjects);
        }

        // Fetch Settings (Content & Automations)
        const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (settingsData) {
            if (settingsData.content && Object.keys(settingsData.content).length > 0) {
                // Merge loaded content with default structure to ensure new fields exist
                setSiteContent((prev: SiteContent) => ({ 
                    ...prev, 
                    ...settingsData.content,
                    owner: { ...prev.owner, ...(settingsData.content.owner || {}) }
                }));
            }
            if (settingsData.automations && Object.keys(settingsData.automations).length > 0) {
                 // Merge automations
                setAutomations((prev: AutomationSettings) => ({ ...prev, ...settingsData.automations }));
            }
        }
    } catch (error) {
        console.error("Error fetching public data:", error);
        // Fallback on error
        setProjects(defaultProjects);
    } finally {
        setLoading(false);
    }
  };

  const fetchAdminData = async () => {
      // Fetch sensitive data only if admin
      const { data: msgs } = await supabase.from('messages').select('*').order('date', { ascending: false });
      if (msgs) setMessages(msgs);

      const { data: apps } = await supabase.from('applications').select('*').order('date', { ascending: false });
      if (apps) setApplications(apps);

      const { data: adminList } = await supabase.from('admins').select('*');
      if (adminList) {
          const mappedAdmins = adminList.map((a: any) => ({
              ...a,
              accessCode: a.access_code
          }));
          setAdmins(mappedAdmins);
      }
  };

  const seedDatabaseIfNeeded = async () => {
      // Check if settings exist, if not, create them
      try {
          const { data } = await supabase.from('site_settings').select('id').eq('id', 1).single();
          if (!data) {
              await supabase.from('site_settings').insert({
                  id: 1,
                  content: siteContent, 
                  automations: automations
              });
          }
          
          // Ensure at least one admin exists in the DB so next login works natively
          const { data: adminData } = await supabase.from('admins').select('email').eq('email', 'admin@gigspace.com').single();
          if (!adminData) {
              await supabase.from('admins').insert({
                  email: 'admin@gigspace.com',
                  access_code: 'admin123',
                  name: 'GigSpace Owner',
                  role: 'owner'
              });
          }
      } catch (err) {
          console.warn("Seeding database failed (possibly due to permissions or connection):", err);
      }
  };

  // --- ACTIONS ---

  const handleLogin = async (email: string, code: string): Promise<AdminUser | null> => {
    // 1. Recovery Login (Backdoor)
    // Allows access if DB is empty or connection is broken
    if (email === 'admin@gigspace.com' && code === 'admin123') {
        const recoveryUser: AdminUser = {
            id: 'recovery-admin',
            email: 'admin@gigspace.com',
            accessCode: 'admin123',
            name: 'GigSpace Owner',
            role: 'owner'
        };
        setIsAdmin(true);
        setCurrentUser(recoveryUser);
        
        // Attempt to fix the DB state so future logins work
        seedDatabaseIfNeeded();
        
        return recoveryUser;
    }

    // 2. Database Login
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .eq('access_code', code)
            .single();

        if (data && !error) {
            const user = { ...data, accessCode: data.access_code };
            setIsAdmin(true);
            setCurrentUser(user);
            return user;
        }
    } catch (e) {
        console.error("Login error", e);
    }
    return null;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    setMessages([]);
    setApplications([]);
    setAdmins([]);
  };

  // Content Actions
  const updateContent = async (newContent: SiteContent) => {
    setSiteContent(newContent);
    // Upsert ensures we create the row if it was missing
    const { data: current } = await supabase.from('site_settings').select('automations').eq('id', 1).single();
    await supabase.from('site_settings').upsert({ 
        id: 1, 
        content: newContent,
        automations: current?.automations || automations
    });
  };

  // Automation Actions
  const updateAutomations = async (newSettings: AutomationSettings) => {
    setAutomations(newSettings);
    // Upsert ensures we create the row if it was missing
    const { data: current } = await supabase.from('site_settings').select('content').eq('id', 1).single();
    await supabase.from('site_settings').upsert({ 
        id: 1, 
        automations: newSettings,
        content: current?.content || siteContent 
    });
  };

  // Admin Actions
  const addAdmin = async (newAdmin: AdminUser) => {
    const { ...dbData } = newAdmin;
    const insertData = {
        name: dbData.name,
        email: dbData.email,
        access_code: dbData.accessCode,
        role: dbData.role
    };
    await supabase.from('admins').insert(insertData);
    fetchAdminData();
  };

  const deleteAdmin = async (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    await supabase.from('admins').delete().eq('id', id);
  };

  // Project Actions
  const addProject = async (project: Project) => {
    const { id } = project;
    const dbProject = {
        title: project.title,
        description: project.description,
        long_description: project.longDescription,
        client: project.client,
        role: project.role,
        image_url: project.imageUrl,
        tags: project.tags,
        links: project.links,
        link: project.link,
        date: project.date,
        status: project.status,
        views: 0
    };

    const { data, error } = await supabase.from('projects').insert(dbProject).select().single();
    
    if (data && !error) {
         const realProject = {
             ...data,
             longDescription: data.long_description,
             imageUrl: data.image_url,
             links: data.links || []
         };
         setProjects(prev => [realProject, ...prev]);
    } else if (id && !data) {
        // Fallback for mock client which might just return what was sent or need reload
        setProjects(prev => [project, ...prev]);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    
    const dbProject = {
        title: updatedProject.title,
        description: updatedProject.description,
        long_description: updatedProject.longDescription,
        client: updatedProject.client,
        role: updatedProject.role,
        image_url: updatedProject.imageUrl,
        tags: updatedProject.tags,
        links: updatedProject.links,
        link: updatedProject.link,
        date: updatedProject.date,
        status: updatedProject.status,
        views: updatedProject.views
    };

    await supabase.from('projects').update(dbProject).eq('id', updatedProject.id);
  };

  const incrementProjectView = async (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) return { ...p, views: (p.views || 0) + 1 };
      return p;
    }));

    const project = projects.find(p => p.id === id);
    if (project) {
         await supabase.from('projects').update({ views: (project.views || 0) + 1 }).eq('id', id);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await supabase.from('projects').delete().eq('id', id);
  };

  // Message Actions
  const addMessage = async (inputs: ContactFormInputs) => {
    const { data } = await supabase.from('messages').insert({
        name: inputs.name,
        email: inputs.email,
        subject: inputs.subject,
        message: inputs.message,
        date: new Date().toISOString(),
        read: false
    }).select().single();

    if (data) {
        setMessages(prev => [data, ...prev]);
    } else {
        // Mock fallback
        setMessages(prev => [{
            id: Date.now().toString(),
            ...inputs,
            date: new Date().toISOString(),
            read: false
        }, ...prev]);
    }

    if (automations.autoReplyContact) {
      await sendEmail(
        inputs.email, 
        `We've received your message: ${inputs.subject}`,
        `<p>Hi ${inputs.name},</p><p>Thanks for reaching out! We've received your message and will get back to you shortly.</p>`
      );
    }
  };

  // Application Actions
  const addApplication = async (inputs: JoinFormInputs) => {
    await supabase.from('applications').insert({
        name: inputs.name,
        email: inputs.email,
        role: inputs.role,
        portfolio: inputs.portfolio,
        motivation: inputs.motivation,
        date: new Date().toISOString(),
        status: 'pending'
    });

    if (automations.notifyOnApplication) {
      if (admins.length > 0) {
        admins.forEach(admin => {
            sendEmail(
                admin.email,
                `New Application: ${inputs.role}`,
                `<p>New application from ${inputs.name} for ${inputs.role}.</p><p><a href="${inputs.portfolio}">View Portfolio</a></p>`
            );
        });
      }
    }
  };

  const updateApplicationStatus = async (id: string, status: JobApplication['status']) => {
    setApplications(prev => prev.map(app => {
        if (app.id === id) {
            return { ...app, status };
        }
        return app;
    }));

    await supabase.from('applications').update({ status }).eq('id', id);

    if (status === 'approved') {
        const app = applications.find(a => a.id === id);
        if (app) {
            const emailContent = siteContent.emailTemplates.applicationApproved.replace(/\n/g, '<br/>');
            await sendEmail(
                app.email,
                "Your Application to GigSpace",
                `<p>${emailContent}</p>`
            );
        }
    }
  };

  // Filter only published projects for public view
  const publicProjects = projects.filter(p => p.status === 'published');

  // Maintenance Mode Logic
  const isMaintenanceModeActive = automations.maintenanceMode && !isAdmin;

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-paper">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
      )
  }

  return (
    <HashRouter>
      <ScrollToTop />
      {isMaintenanceModeActive ? (
        <Routes>
          <Route path="/admin" element={
             <AdminDashboard 
             isAdmin={isAdmin} 
             onLogin={handleLogin}
             onLogout={handleLogout}
             projects={projects}
             messages={messages}
             applications={applications}
             siteContent={siteContent}
             admins={admins}
             automations={automations}
             onAddProject={addProject}
             onUpdateProject={updateProject}
             onDeleteProject={deleteProject}
             onUpdateContent={updateContent}
             onAddAdmin={addAdmin}
             onDeleteAdmin={deleteAdmin}
             onUpdateApplicationStatus={updateApplicationStatus}
             onUpdateAutomations={updateAutomations}
           />
          } />
          <Route path="*" element={<MaintenanceScreen />} />
        </Routes>
      ) : (
        <div className="flex flex-col min-h-screen font-sans text-ink bg-paper transition-colors duration-500">
          <Navbar isAdmin={isAdmin} />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<HomePage projects={publicProjects} content={siteContent.home} owner={siteContent.owner} />} />
              <Route 
                path="/projects" 
                element={<ProjectsPage projects={publicProjects} isAdmin={isAdmin} onAddProject={addProject} content={siteContent.projects} />} 
              />
              <Route 
                path="/projects/:id" 
                element={<ProjectDetailPage projects={projects} onViewProject={incrementProjectView} />} 
              />
              <Route 
                path="/contact" 
                element={<ContactPage onSendMessage={addMessage} content={siteContent.contact} />} 
              />
              <Route 
                path="/join" 
                element={<JoinPage onApply={addApplication} content={siteContent.join} automations={automations} />} 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminDashboard 
                    isAdmin={isAdmin} 
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    projects={projects}
                    messages={messages}
                    applications={applications}
                    siteContent={siteContent}
                    admins={admins}
                    automations={automations}
                    onAddProject={addProject}
                    onUpdateProject={updateProject}
                    onDeleteProject={deleteProject}
                    onUpdateContent={updateContent}
                    onAddAdmin={addAdmin}
                    onDeleteAdmin={deleteAdmin}
                    onUpdateApplicationStatus={updateApplicationStatus}
                    onUpdateAutomations={updateAutomations}
                  />
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </HashRouter>
  );
};

export default App;