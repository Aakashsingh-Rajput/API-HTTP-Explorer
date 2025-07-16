import { Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 px-4 lg:px-6 py-6 mt-auto text-sm">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand Info */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold tracking-wide">API HTTP Explorer</span>
            </div>
            <p className="text-gray-400">
              Explore, test, and understand HTTP requests in a sleek developer-friendly way.
            </p>
          </div>

          {/* Socials and Credits */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Aakashsingh-Rajput"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/aakashsingh-rajput-5459bb25a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>

            {/* Personal Credit */}
            <div className="text-gray-400">
              <span>Crafted with curiosity by Aakashsingh Rajput</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2025 API HTTP Explorer. Powered by React, TypeScript & Tailwind CSS.
          </p>
                 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
