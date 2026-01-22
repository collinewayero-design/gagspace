import React, { useState } from 'react';
import { Hexagon, Mail, Linkedin, Twitter, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [tapCount, setTapCount] = useState(0);
  const navigate = useNavigate();

  const handleSecretTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount >= 9) {
      setTapCount(0);
      navigate('/admin');
    }
  };

  return (
    <footer className="bg-paper-dark border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div 
              onClick={handleSecretTap} 
              className="flex items-center gap-2 mb-4 group cursor-pointer select-none"
            >
              <Hexagon className="w-6 h-6 text-ink group-hover:text-accent transition-colors stroke-[1.5]" />
              <span className="font-serif text-xl font-bold text-ink">GigSpace</span>
            </div>
            <p className="text-ink-light text-sm leading-relaxed">
              Crafting digital experiences that merge functionality with timeless aesthetics. 
              Upload, share, and connect.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-ink mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/projects" className="hover:text-accent transition-colors">Projects</Link></li>
              <li><Link to="/join" className="hover:text-accent transition-colors">Join the Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-ink mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@gigspace.com</span>
              </li>
              <li>
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-ink mb-4">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-full text-ink hover:text-accent hover:shadow-md transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full text-ink hover:text-accent hover:shadow-md transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full text-ink hover:text-accent hover:shadow-md transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-ink-light">
          <p>&copy; {new Date().getFullYear()} GigSpace. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <a href="#" className="hover:text-ink">Privacy Policy</a>
            <a href="#" className="hover:text-ink">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};