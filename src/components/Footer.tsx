
import { Github, Twitter, Heart, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 px-4 lg:px-6 py-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Brand info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Globe className="h-4 w-4" />
              </div>
              <span className="text-white font-semibold">API HTTP Explorer</span>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-left">
              Test, visualize, and learn HTTP APIs with ease
            </p>
          </div>

          {/* Right side - Links and credits */}
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>

            {/* Credits */}
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for developers</span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-400 text-xs">
            © 2024 API HTTP Explorer. Built with React, TypeScript & Tailwind CSS
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Docs</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
