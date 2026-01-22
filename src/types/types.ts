
export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface LinkItem {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  client?: string;
  role?: string;
  imageUrl: string;
  tags: string[];
  links: LinkItem[];
  link?: string; // keeping for backward compatibility, but 'links' array is preferred
  date: string;
  status: ProjectStatus;
  views: number;
}

export interface ContactFormInputs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Message extends ContactFormInputs {
  id: string;
  date: string;
  read: boolean;
}

export interface JoinFormInputs {
  name: string;
  email: string;
  role: string;
  portfolio: string;
  motivation: string;
}

export interface JobApplication extends JoinFormInputs {
  id: string;
  date: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'approved' | 'declined';
}

export type AdminRole = 'owner' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  accessCode: string;
  name: string;
  role: AdminRole;
}

export interface AutomationSettings {
  autoReplyContact: boolean;
  autoArchiveDeclined: boolean;
  notifyOnApplication: boolean;
  maintenanceMode: boolean;
  applicationsEnabled: boolean;
}

export interface OwnerProfile {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface SiteContent {
  owner: OwnerProfile;
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  projects: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    address: string;
    phone: string;
  };
  join: {
    title: string;
    subtitle: string;
  };
  emailTemplates: {
    applicationApproved: string;
  };
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
