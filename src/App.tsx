import React, { useState } from 'react';
import { AvatarState, Language } from './types';
import { Navbar, ActiveSection } from './components/Navbar';
import { DigitalMuseum } from './components/DigitalMuseum';
import { VirtualDressingRoom } from './components/VirtualDressingRoom';
import { CulturalSafeguardPanel } from './components/CulturalSafeguardPanel';
import { DigitalLookbookCard } from './components/DigitalLookbookCard';
import { O2OMapDirectory } from './components/O2OMapDirectory';
import { PersonalColorScanner } from './components/PersonalColorScanner';
import { DestinationWeatherStylist } from './components/DestinationWeatherStylist';
import { AIConsultantChat } from './components/AIConsultantChat';
import { 
  DongSonBackgroundWatermark, 
  DongSonBorderStrip, 
  DongSonDrum, 
  LacBird 
} from './components/HeritageMotifs';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Bot, 
  Palette,
  X
} from 'lucide-react';
import { AudioProvider } from './context/AudioContext';
import { AudioAutoplayPrompt } from './components/AudioAutoplayPrompt';

function AppContent() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('museum');
  const [language, setLanguage] = useState<Language>('vi');

  // Sub-modal overlays
  const [isPersonalColorModalOpen, setIsPersonalColorModalOpen] = useState(false);
  const [isStylistModalOpen, setIsStylistModalOpen] = useState(false);

  // Default Avatar State (Historical Court Nhat Binh preset)
  const [avatarState, setAvatarState] = useState<AvatarState>({
    gender: 'female',
    heightCm: 162,
    weightKg: 49,
    skinTone: 'natural',
    bodyType: 'balanced',
    selectedGarmentId: 'ao-nhat-binh',
    selectedGarmentColor: '#881818',
    lowerGarment: 'quan_bach_lap',
    headwear: 'van_tran',
    jewelry: 'kieng_bac',
    dragonPattern: 'hoa_sen',
    fabricType: 'gam_bao_loc',
    destination: 'Văn Miếu - Quốc Tử Giám',
    occasionContext: 'da_tiec',
  });

  const handleSelectForFitting = (costumeId: string) => {
    setAvatarState((prev) => ({
      ...prev,
      selectedGarmentId: costumeId,
    }));
    setActiveSection('wardrobe');
  };

  const handleApplyColorFromPersonalColor = (hex: string) => {
    setAvatarState((prev) => ({
      ...prev,
      selectedGarmentColor: hex,
    }));
    setIsPersonalColorModalOpen(false);
    setActiveSection('wardrobe');
  };

  const handleApplyOutfitSuggestion = (costumeId: string, destination: string) => {
    setAvatarState((prev) => ({
      ...prev,
      selectedGarmentId: costumeId,
      destination,
    }));
    setIsStylistModalOpen(false);
    setActiveSection('wardrobe');
  };

  return (
    <div className="relative min-h-screen bg-[#FAF2DF] bg-silk-paper text-[#261E14] flex flex-col font-sans selection:bg-[#881818] selection:text-[#FAF2DF] overflow-x-hidden">
      {/* Nền vàng be nhạt nghệ thuật Trống Đồng Đông Sơn & Đàn Chim Hạc Lạc Việt */}
      <DongSonBackgroundWatermark opacity={0.09} />

      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'museum' && (
          <DigitalMuseum
            language={language}
            onSelectForFitting={handleSelectForFitting}
            onOpenMap={() => setActiveSection('map')}
          />
        )}

        {activeSection === 'wardrobe' && (
          <VirtualDressingRoom
            language={language}
            avatarState={avatarState}
            setAvatarState={setAvatarState}
            onOpenLookbook={() => setActiveSection('lookbook')}
            onOpenSafeguard={() => setActiveSection('safeguard')}
            onOpenPersonalColor={() => setIsPersonalColorModalOpen(true)}
            onOpenStylist={() => setIsStylistModalOpen(true)}
          />
        )}

        {activeSection === 'safeguard' && (
          <CulturalSafeguardPanel
            language={language}
            avatarState={avatarState}
            setAvatarState={setAvatarState}
            onGoToWardrobe={() => setActiveSection('wardrobe')}
            onGoToLookbook={() => setActiveSection('lookbook')}
          />
        )}

        {activeSection === 'lookbook' && (
          <DigitalLookbookCard
            language={language}
            avatarState={avatarState}
            onGoToWardrobe={() => setActiveSection('wardrobe')}
          />
        )}

        {activeSection === 'map' && (
          <O2OMapDirectory language={language} />
        )}

        {activeSection === 'consultant' && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-6 rounded-2xl border border-[#E6C673]/60 shadow-xl space-y-1 text-[#FFF8ED]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDF88] uppercase tracking-wider">
                <Bot size={16} />
                <span>Trợ Lý Giọng Nói Thời Gian Thực & Thời Tiết (Prompt 8 & 9) · Gemini 3.8 Flash</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-vintage font-bold text-[#FFFDF8]">
                Trợ Lý Stylist "Tú" & Cố Vấn Thời Tiết O2O
              </h2>
              <p className="text-xs text-[#F5ECD8]">
                Giao tiếp giọng nói tự nhiên bằng micro, tự động lấy dữ liệu thời tiết thực tế để gợi ý layering và phối đồ Gen Z theo chuẩn văn hóa Việt.
              </p>
            </div>
            <AIConsultantChat 
              language={language} 
              onSelectForFitting={handleSelectForFitting}
            />
          </div>
        )}
      </main>

      {/* MODAL: PERSONAL COLOR SCANNER (Khối nổi màu đỏ) */}
      {isPersonalColorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-linear-to-b from-[#821515] via-[#6D0F0F] to-[#480808] text-[#FFFDF8] w-full max-w-4xl rounded-3xl border-2 border-[#E6C673]/70 shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E6C673]/40 pb-3">
              <div className="flex items-center gap-2">
                <Palette size={20} className="text-[#FFDF88]" />
                <h3 className="text-xl font-serif-vintage font-bold text-[#FFDF88]">
                  Khảo Sát Personal Color (Sắc Tố Da & Bảng Màu Việt)
                </h3>
              </div>
              <button
                onClick={() => setIsPersonalColorModalOpen(false)}
                className="text-[#E6C673] hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <PersonalColorScanner
              language={language}
              onApplyColorToAvatar={handleApplyColorFromPersonalColor}
            />
          </div>
        </div>
      )}

      {/* MODAL: DESTINATION & WEATHER STYLIST (Khối nổi màu đỏ) */}
      {isStylistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-linear-to-b from-[#821515] via-[#6D0F0F] to-[#480808] text-[#FFFDF8] w-full max-w-4xl rounded-3xl border-2 border-[#E6C673]/70 shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E6C673]/40 pb-3">
              <div className="flex items-center gap-2">
                <Compass size={20} className="text-[#FFDF88]" />
                <h3 className="text-xl font-serif-vintage font-bold text-[#FFDF88]">
                  Cố Vấn Điểm Đến, Thời Tiết & Gợi Ý Phục Sức
                </h3>
              </div>
              <button
                onClick={() => setIsStylistModalOpen(false)}
                className="text-[#E6C673] hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <DestinationWeatherStylist
              language={language}
              onApplyOutfitSuggestion={handleApplyOutfitSuggestion}
            />
          </div>
        </div>
      )}

      {/* Footer Decorated with Dong Son Motifs & Imperial Red Lacquer */}
      <footer className="relative z-10 bg-linear-to-b from-[#5C0C0C] via-[#480808] to-[#300505] text-[#F3E7CD] border-t-2 border-[#E6C673]/50 mt-16 text-xs shadow-2xl">
        {/* Dải hoa văn diềm Trống Đồng Đông Sơn */}
        <DongSonBorderStrip height={16} color="#E6C673" className="opacity-40 border-b border-[#E6C673]/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-[#A82020] via-[#881818] to-[#430C0C] flex items-center justify-center text-white border-2 border-[#E6C673] shadow-md overflow-hidden">
                <DongSonDrum size={48} color="#E6C673" className="absolute inset-0 m-auto opacity-35" />
                <LacBird size={26} color="#FFFDF8" className="relative z-10" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display-royal font-bold text-[#FFDF88] text-base block tracking-wider">
                    VIỆT PHỤC REMIX
                  </span>
                  <span className="text-[10px] bg-[#E6C673]/20 text-[#FFDF88] font-bold px-2 py-0.5 rounded-sm border border-[#E6C673]/40">
                    DI SẢN ĐÔNG SƠN & ĐẠI VIỆT
                  </span>
                </div>
                <span className="text-[11px] text-[#E6D2B5]">
                  Dự án Số Hóa Di Sản & Thời Trang Cổ Phong Đương Đại · Biểu Tượng Trống Đồng & Chim Lạc · Nhạc Nền: Hello Vietnam
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-[#FAF0DE]">
              <button onClick={() => setActiveSection('museum')} className="hover:text-[#FFDF88] transition-colors">
                Bảo Tàng Số
              </button>
              <button onClick={() => setActiveSection('wardrobe')} className="hover:text-[#FFDF88] transition-colors">
                Phòng Thử Đồ
              </button>
              <button onClick={() => setActiveSection('safeguard')} className="hover:text-[#FFDF88] transition-colors">
                Màng Lọc Di Sản
              </button>
              <button onClick={() => setActiveSection('lookbook')} className="hover:text-[#FFDF88] transition-colors">
                Lookbook Số
              </button>
              <button onClick={() => setActiveSection('map')} className="hover:text-[#FFDF88] transition-colors">
                Bản Đồ O2O
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E6C673]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#DFCEB0]">
            <p>
              "Y phục xứng kỳ đức — Nâng niu bản sắc văn hóa ngàn năm của dân tộc Việt Nam."
            </p>
            <p>
              Xây dựng với Google AI Studio · Gemini 3.8 Flash & Multimodal API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
      <AudioAutoplayPrompt />
    </AudioProvider>
  );
}

