import React, { useState } from 'react';
import { ArrowRight, UserPlus, Star, Users, Heart, Clock } from 'lucide-react';
import { JoinFormInputs, LoadingState, SiteContent, AutomationSettings } from '../types';

interface JoinPageProps {
  onApply: (data: JoinFormInputs) => void;
  content: SiteContent['join'];
  automations?: AutomationSettings;
}

export const JoinPage: React.FC<JoinPageProps> = ({ onApply, content, automations }) => {
  const [formState, setFormState] = useState<JoinFormInputs>({
    name: '',
    email: '',
    role: 'Frontend Developer',
    portfolio: '',
    motivation: ''
  });
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  // Check if applications are enabled (default to true if undefined)
  const isApplicationsEnabled = automations?.applicationsEnabled ?? true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(LoadingState.LOADING);
    setTimeout(() => {
        onApply(formState);
        setStatus(LoadingState.SUCCESS);
        setFormState({ name: '', email: '', role: 'Frontend Developer', portfolio: '', motivation: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Render disabled state
  if (!isApplicationsEnabled) {
      return (
        <div className="min-h-screen py-16 animate-fade-in flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-500">
                <Clock className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">Applications Closed</h1>
            <p className="text-lg text-ink-light max-w-lg mb-8 leading-relaxed">
                Thank you for your interest in GigSpace. We are not currently accepting new applications. Please check back later or follow us on social media for updates.
            </p>
        </div>
      );
  }

  if (status === LoadingState.SUCCESS) {
      return (
          <div className="min-h-screen flex items-center justify-center px-6 animate-fade-in">
              <div className="text-center max-w-lg">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                      <Star className="w-10 h-10 fill-current" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-ink mb-4">Application Received!</h2>
                  <p className="text-ink-light mb-8">
                      Thank you for your interest in joining GigSpace. We have received your details and will review your portfolio shortly.
                  </p>
                  <button 
                    onClick={() => setStatus(LoadingState.IDLE)}
                    className="text-accent font-medium hover:underline"
                  >
                      Submit another application
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-ink mb-6">{content.title}</h1>
        <p className="text-lg md:text-xl text-ink-light leading-relaxed">
            {content.subtitle}
        </p>
      </section>

      {/* Culture Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <Users className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-serif text-lg font-bold mb-2">Community First</h3>
                  <p className="text-sm text-ink-light">We believe in radical collaboration. Your voice matters from day one.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <Heart className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-serif text-lg font-bold mb-2">Work-Life Harmony</h3>
                  <p className="text-sm text-ink-light">Burnout isn't a badge of honor here. We prioritize mental health and flexibility.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <Star className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-serif text-lg font-bold mb-2">Mastery</h3>
                  <p className="text-sm text-ink-light">We provide budgets for courses, conferences, and tools to help you grow.</p>
              </div>
          </div>
      </section>

      {/* Application Form */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-ink mb-8 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-accent" />
                Apply Now
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formState.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formState.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Role</label>
                        <select
                            name="role"
                            value={formState.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper appearance-none"
                        >
                            <option>Frontend Developer</option>
                            <option>Backend Developer</option>
                            <option>UI/UX Designer</option>
                            <option>Product Manager</option>
                            <option>Marketing Specialist</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Portfolio URL</label>
                        <input
                            type="url"
                            name="portfolio"
                            required
                            placeholder="https://..."
                            value={formState.portfolio}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Why GigSpace?</label>
                    <textarea
                        name="motivation"
                        required
                        rows={4}
                        value={formState.motivation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-paper resize-none"
                        placeholder="Tell us what drives you..."
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={status === LoadingState.LOADING}
                        className="w-full md:w-auto px-8 py-4 bg-ink text-white rounded-full font-medium hover:bg-accent transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {status === LoadingState.LOADING ? 'Submitting...' : 'Submit Application'}
                        {!status && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>
        </div>
      </section>
    </div>
  );
};