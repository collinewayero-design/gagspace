import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, MapPin, Mail, Phone } from 'lucide-react';
import { ContactFormInputs, LoadingState, SiteContent } from '../types';

interface ContactPageProps {
  onSendMessage: (data: ContactFormInputs) => void;
  content: SiteContent['contact'];
}

export const ContactPage: React.FC<ContactPageProps> = ({ onSendMessage, content }) => {
  const [formState, setFormState] = useState<ContactFormInputs>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(LoadingState.LOADING);
    
    // Simulate API delay
    setTimeout(() => {
      onSendMessage(formState);
      setStatus(LoadingState.SUCCESS);
      setFormState({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5s
      setTimeout(() => setStatus(LoadingState.IDLE), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div className="animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink mb-6">{content.title}</h1>
            <p className="text-lg text-ink-light mb-10 leading-relaxed">
              {content.subtitle}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-accent border border-gray-100">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink mb-1">Email</h3>
                  <p className="text-ink-light text-sm mb-1">Our friendly team is here to help.</p>
                  <a href={`mailto:${content.email}`} className="text-accent font-medium hover:underline">{content.email}</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-accent border border-gray-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink mb-1">Studio</h3>
                  <p className="text-ink-light text-sm mb-1">Come say hello at our office HQ.</p>
                  <p className="text-ink text-sm">{content.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-accent border border-gray-100">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink mb-1">Phone</h3>
                  <p className="text-ink-light text-sm mb-1">Mon-Fri from 8am to 5pm.</p>
                  <p className="text-ink text-sm">{content.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper placeholder:text-gray-400"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper placeholder:text-gray-400"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formState.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper placeholder:text-gray-400"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-paper placeholder:text-gray-400 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === LoadingState.LOADING || status === LoadingState.SUCCESS}
                className={`w-full py-4 rounded-xl font-medium text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  status === LoadingState.SUCCESS 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-ink hover:bg-accent'
                }`}
              >
                {status === LoadingState.LOADING && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === LoadingState.SUCCESS && <CheckCircle2 className="w-5 h-5" />}
                {status === LoadingState.IDLE && <Send className="w-4 h-4" />}
                
                {status === LoadingState.LOADING && 'Sending...'}
                {status === LoadingState.SUCCESS && 'Message Sent!'}
                {status === LoadingState.IDLE && 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};