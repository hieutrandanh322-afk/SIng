import React from 'react';
import { Language } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { DongSonDrum, LacBird, DongSonBorderStrip } from './HeritageMotifs';
import { 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Bot, 
  Languages, 
  Menu, 
  X, 
  Mic,
  Share2,
  Check
} from 'lucide-react';

export type ActiveSection = 'museum' | 'wardrobe' | 'safeguard' | 'lookbook' | 'map' | 'consultant';

interface NavbarProps {
  activeSection: ActiveSection;
  setActiveSection: (sec: ActiveSection) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  language,
  setLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [copiedShareLink, setCopiedShareLink] = React.useState(false);

  const SHARED_APP_URL = 'https://ais-pre-xowwhn3tmb6szcbctox6uz-964121286274.asia-southeast1.run.app';

  const handleShareApp = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(SHARED_APP_URL);
      } else {
        const input = document.createElement('input');
        input.value = SHARED_APP_URL;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    } catch {
      // Fallback
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  const navItems: { id: ActiveSection; labelVi: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'museum', labelVi: 'Bảo Tàng Số', labelEn: 'Museum', icon: <BookOpen size={15} /> },
    { id: 'wardrobe', labelVi: 'Phòng Thử Đồ', labelEn: '3D Wardrobe', icon: <Layers size={15} /> },
    { id: 'safeguard', labelVi: 'Màng Lọc Di Sản', labelEn: 'Safeguard', icon: <ShieldCheck size={15} /> },
    { id: 'lookbook', labelVi: 'Thẻ Lookbook', labelEn: 'Lookbook', icon: <Sparkles size={15} /> },
    { id: 'map', labelVi: 'Bản Đồ O2O', labelEn: 'O2O Map', icon: <Compass size={15} /> },
    { id: 'consultant', labelVi: 'Trợ Lý Giọng Nói Tú', labelEn: 'Voice Stylist', icon: <Mic size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF2DF]/95 backdrop-blur-md border-b border-[#E6C673]/50 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Name with Dong Son & Lac Bird Crest */}
          <div
            onClick={() => setActiveSection('museum')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-[#881818] via-[#651212] to-[#430C0C] flex items-center justify-center text-white shadow-md border-2 border-[#E6C673] overflow-hidden">
              {/* Rotating subtle Dong Son drum inside logo */}
              <DongSonDrum 
                size={48} 
                color="#E6C673" 
                className="absolute inset-0 m-auto opacity-35 group-hover:rotate-45 transition-transform duration-700" 
              />
              {/* Flying Lac bird foreground */}
              <LacBird size={24} color="#FFF8EE" className="relative z-10 drop-shadow-xs" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display-royal font-bold text-base sm:text-lg tracking-wider text-[#430C0C]">
                  VIỆT PHỤC REMIX
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] font-bold bg-[#881818]/15 text-[#881818] rounded-xs border border-[#881818]/30">
                  ĐÔNG SƠN · ĐẠI VIỆT
                </span>
              </div>
              <span className="text-[9px] tracking-widest text-[#881818] uppercase font-semibold flex items-center gap-1">
                Heritage Couture · AI Safeguard
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F3E7CD] p-1 rounded-xl border border-[#E6C673]/50 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#881818] text-[#FFFDF8] shadow-sm border border-[#E6C673]/60'
                      : 'text-[#5C4530] hover:text-[#430C0C] hover:bg-white/40'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'vi' ? item.labelVi : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Audio Player, Share Button & Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Share app button */}
            <button
              onClick={handleShareApp}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs border ${
                copiedShareLink
                  ? 'bg-emerald-700 text-white border-emerald-500 scale-105'
                  : 'bg-[#881818] hover:bg-[#6e1313] text-[#FFFDF8] border-[#E6C673]/70 hover:scale-102'
              }`}
              title="Sao chép link chia sẻ app cho mọi người"
            >
              {copiedShareLink ? (
                <>
                  <Check size={14} className="text-emerald-200" />
                  <span>{language === 'vi' ? 'Đã chép link!' : 'Copied Link!'}</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-[#FFDF88]" />
                  <span className="hidden sm:inline">{language === 'vi' ? 'Chia Sẻ' : 'Share'}</span>
                </>
              )}
            </button>

            {/* Audio player */}
            <div className="hidden sm:block">
              <AudioPlayer />
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F3E7CD] hover:bg-[#EBDDC1] text-[#430C0C] border border-[#E6C673]/60 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
              title="Chuyển đổi ngôn ngữ / Switch language"
            >
              <Languages size={14} className="text-[#881818]" />
              <span>{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#430C0C] hover:bg-[#F3E7CD] rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#E6C673]/40 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${
                    activeSection === item.id
                      ? 'bg-[#881818] text-[#FFFDF8] border border-[#E6C673]/60'
                      : 'bg-[#F3E7CD] text-[#430C0C] border border-[#E6C673]/40'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'vi' ? item.labelVi : item.labelEn}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2 sm:hidden">
              <button
                onClick={handleShareApp}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold shadow-xs border transition-all ${
                  copiedShareLink
                    ? 'bg-emerald-700 text-white border-emerald-500'
                    : 'bg-[#881818] text-[#FFFDF8] border-[#E6C673]/60'
                }`}
              >
                {copiedShareLink ? (
                  <>
                    <Check size={15} className="text-emerald-200" />
                    <span>{language === 'vi' ? 'Đã sao chép link chia sẻ!' : 'Copied Share Link!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} className="text-[#FFDF88]" />
                    <span>{language === 'vi' ? 'Chia Sẻ App Cho Mọi Người' : 'Share App Link'}</span>
                  </>
                )}
              </button>
              <div className="flex justify-center">
                <AudioPlayer />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dải diềm hoa văn Trống Đồng Đông Sơn viền chân Navbar */}
      <DongSonBorderStrip height={12} color="#881818" className="opacity-50" />
    </header>
  );
};
