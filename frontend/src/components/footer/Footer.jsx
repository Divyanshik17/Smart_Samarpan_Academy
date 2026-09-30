import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTelegramPlane,
  FaBookOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = {
    facebook: "https://www.facebook.com/share/1DwhFgiFtW",
    instagram: "https://instagram.com/m.k.yadav2000",
    telegram: "https://t.me/Samarpanacademy",
    whatsapp: "https://chat.whatsapp.com/Luru6pYkIqY0DU2Y2L3mode",
    phone: "+916201212522",
    email: "msamarpan44@gmail.com",
  };

  return (
    <footer className="relative z-10 bg-[#0f172a] text-gray-200 border-t border-[#1e293b] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand and About */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#0F766E]/20 flex items-center justify-center mr-3 border border-[#0F766E]/40">
                <FaBookOpen className="text-[#14B8A6]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Samarpan Math Academy</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students to master mathematics through deep conceptual clarity, structured curriculum, and modern AI learning tools.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 pb-1 border-b border-gray-800 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-[#14B8A6] transition-colors">Home</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-[#14B8A6] transition-colors">All Courses</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[#14B8A6] transition-colors">About Us</Link></li>
              <li><Link to="/ai-tools" className="text-gray-400 hover:text-[#14B8A6] transition-colors">AI Learning Tools</Link></li>
            </ul>
          </div>

          {/* Column 3: Student Resources */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 pb-1 border-b border-gray-800 inline-block">
              Student Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="https://questions.examside.com/past-years/jee/jee-main" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#14B8A6] transition-colors">JEE Previous Year Papers</a></li>
              <li><a href="https://www.amazon.in/s?k=jee+main+and+advanced+books" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#14B8A6] transition-colors">Recommended Math Books</a></li>
              <li><a href="https://olympiads.hbcse.tifr.res.in/how-to-prepare/past-papers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#14B8A6] transition-colors">Math Olympiad Papers</a></li>
              <li><a href="https://www.flipkart.com/search?q=math+olympiad+books" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#14B8A6] transition-colors">Olympiad Reference Guides</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 pb-1 border-b border-gray-800 inline-block">
              Contact & Connect
            </h3>
            <div className="space-y-2.5 text-sm text-gray-400 mb-5">
              <a href={`mailto:${socialLinks.email}`} className="flex items-center hover:text-white transition-colors">
                <FaEnvelope className="mr-2.5 text-[#14B8A6] flex-shrink-0" size={14} />
                <span>{socialLinks.email}</span>
              </a>
              <a href={`tel:${socialLinks.phone}`} className="flex items-center hover:text-white transition-colors">
                <FaPhone className="mr-2.5 text-[#14B8A6] flex-shrink-0" size={14} />
                <span>{socialLinks.phone}</span>
              </a>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2.5 text-[#14B8A6] flex-shrink-0" size={14} />
                <span>Saharsa, Bihar</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#1877F2] hover:text-white transition-all">
                <FaFacebookF size={15} />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#E1306C] hover:text-white transition-all">
                <FaInstagram size={15} />
              </a>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#229ED9] hover:text-white transition-all">
                <FaTelegramPlane size={15} />
              </a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-[#25D366] hover:text-white transition-all">
                <FaWhatsapp size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Samarpan Math Academy. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">Premium Mathematics Learning Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

