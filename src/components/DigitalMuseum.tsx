import React, { useState } from 'react';
import { VietnameseCostume, Language } from '../types';
import { VIET_COSTUMES } from '../data/vietCostumes';
import { Costume3DViewer } from './Costume3DViewer';
import { Video360Player } from './Video360Player';
import { MuseumGuideAssistant } from './MuseumGuideAssistant';
import { 
  DongSonDrum, 
  LacBird, 
  DongSonBorderStrip, 
  HeritageCorner 
} from './HeritageMotifs';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Compass, 
  Play, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Maximize2,
  X,
  Languages,
  Video,
  ChevronRight,
  Flame,
  CheckCircle2,
  Bot,
  Rotate3d,
  Eye
} from 'lucide-react';

interface DigitalMuseumProps {
  language: Language;
  onSelectForFitting: (costumeId: string) => void;
  onOpenMap: () => void;
}

export const DigitalMuseum: React.FC<DigitalMuseumProps> = ({
  language,
  onSelectForFitting,
  onOpenMap,
}) => {
  const [selectedCostume, setSelectedCostume] = useState<VietnameseCostume | null>(null);
  const [activeEraFilter, setActiveEraFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabLang, setActiveTabLang] = useState<Language>(language);

  // 3D & 360 Modals (Giai đoạn 2 - Bước 2.1)
  const [active3DCostume, setActive3DCostume] = useState<VietnameseCostume | null>(null);
  const [active360Costume, setActive360Costume] = useState<VietnameseCostume | null>(null);
  const [isGuideAssistantOpen, setIsGuideAssistantOpen] = useState(false);

  // AI Prompt 1: Digital Historian extraction modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiCostumeName, setAiCostumeName] = useState('');
  const [aiEraHint, setAiEraHint] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const eraFilters = [
    { id: 'all', labelVi: 'Tất cả Triều đại', labelEn: 'All Eras' },
    { id: 'ly-tran', labelVi: 'Thời Lý - Trần (XI - XIV)', labelEn: 'Ly - Tran' },
    { id: 'hau-le', labelVi: 'Thời Hậu Lê (XV - XVIII)', labelEn: 'Later Le' },
    { id: 'trieu-nguyen', labelVi: 'Triều Nguyễn (XIX - XX)', labelEn: 'Nguyen Dynasty' },
    { id: 'dan-gian', labelVi: 'Dân Gian Bắc Bộ', labelEn: 'Folk Heritage' },
    { id: 'can-dai', labelVi: 'Tân Thời 1930s', labelEn: 'Modern 1930s' },
  ];

  const filteredCostumes = VIET_COSTUMES.filter((c) => {
    const matchesEra = activeEraFilter === 'all' || c.dynastyKey === activeEraFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.vi.toLowerCase().includes(q) ||
      c.name.en.toLowerCase().includes(q) ||
      c.era.vi.toLowerCase().includes(q) ||
      c.era.en.toLowerCase().includes(q) ||
      c.structure.vi.toLowerCase().includes(q);
    return matchesEra && matchesSearch;
  });

  const handleAiExtract = async () => {
    if (!aiCostumeName.trim()) return;
    setIsExtracting(true);
    setExtractedData(null);
    try {
      const response = await fetch('/api/gemini/museum-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeName: aiCostumeName,
          eraHint: aiEraHint,
        }),
      });
      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner with Dong Son & Lac Bird Motifs */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#430C0C] via-[#651212] to-[#881818] text-white p-8 md:p-12 rounded-2xl shadow-lg border border-[#A82020]/30">
        {/* Họa tiết Trống Đồng Đông Sơn chìm lớn góc phải */}
        <div className="absolute -right-16 -top-16 text-[#FAF7F2] opacity-15 pointer-events-none">
          <DongSonDrum size={380} color="currentColor" />
        </div>

        {/* Chim Hạc bay góc trái trên và phải dưới */}
        <div className="absolute top-4 right-1/3 text-[#DFCEB0] opacity-30 pointer-events-none hidden md:block">
          <LacBird size={90} direction="right" color="currentColor" />
        </div>
        <div className="absolute bottom-6 right-8 text-[#DFCEB0] opacity-25 pointer-events-none hidden sm:block">
          <LacBird size={120} direction="left" color="currentColor" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs tracking-widest text-[#DFCEB0] uppercase font-semibold">
            <BookOpen size={16} />
            <span>Kho 1 · Digital Heritage Museum · Song ngữ Anh - Việt (Giai đoạn 2)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-vintage tracking-tight text-[#FAF7F2] flex items-center gap-3">
            <span>Bảo Tàng Số Trang Phục Cổ Phong Việt Nam</span>
          </h1>
          <p className="text-sm sm:text-base text-[#EDE3CF] font-light leading-relaxed">
            {language === 'vi'
              ? 'Không gian lưu trữ, giám tuyển và số hóa đa chiều các dạng thức y phục Đại Việt qua các triều đại. Tích hợp Mô hình 3D tương tác xoay 360°, Video tài liệu phục dựng sống động và Trợ lý Hướng dẫn viên ảo với Function Calling.'
              : 'A curated multidimensional digital sanctuary digitizing Dai Viet historical costumes across Ly, Tran, Le, and Nguyen dynasties. Integrated with interactive 3D mesh viewers, 360° documentary reels, and an AI Museum Guide with Function Calling.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Guide Assistant Button */}
            <button
              onClick={() => setIsGuideAssistantOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF7F2] text-[#430C0C] hover:bg-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Bot size={16} className="text-[#881818]" />
              <span>Hướng Dẫn Viên Bảo Tàng Số (Prompt 4)</span>
              <span className="text-[10px] bg-[#881818]/10 text-[#881818] px-1.5 py-0.5 rounded font-mono">
                Function Calling
              </span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#430C0C]/70 hover:bg-[#430C0C] border border-[#DFCEB0]/30 text-[#FAF7F2] text-xs font-semibold rounded-lg transition-colors"
            >
              <Sparkles size={14} className="text-[#DFCEB0]" />
              <span>Giám Định Sử Học (Prompt 1)</span>
            </button>

            <button
              onClick={onOpenMap}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#430C0C]/50 hover:bg-[#430C0C] border border-white/20 text-[#FAF7F2] text-xs font-medium rounded-lg transition-colors"
            >
              <Compass size={14} />
              <span>Tìm shop & bảo tàng lân cận (O2O)</span>
            </button>
          </div>
        </div>

        {/* Diềm viền hoa văn Đông Sơn ở mép dưới Banner */}
        <div className="absolute bottom-0 left-0 right-0">
          <DongSonBorderStrip height={8} color="#DFCEB0" className="opacity-40" />
        </div>
      </div>

      {/* Filter & Search Bar (Khối nổi màu đỏ) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-4 rounded-2xl border border-[#E6C673]/60 shadow-lg text-[#FFF8ED]">
        {/* Dynasty Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#4A0909] rounded-xl border border-[#E6C673]/40">
          {eraFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEraFilter(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeEraFilter === tab.id
                  ? 'bg-[#E6C673] text-[#4A0909] shadow-xs font-bold'
                  : 'text-[#F3E7CD] hover:text-white hover:bg-white/10'
              }`}
            >
              {language === 'vi' ? tab.labelVi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E6C673]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm Nhật Bình, Giao Lĩnh, Áo Tấc...' : 'Search robe, dynasty, era...'}
            className="w-full pl-9 pr-4 py-2 bg-[#420707] text-xs text-[#FFF8ED] placeholder-[#D8BFA4] rounded-lg border border-[#E6C673]/50 focus:outline-none focus:ring-2 focus:ring-[#E6C673]/40 focus:border-[#E6C673]"
          />
        </div>
      </div>

      {/* Costume Catalog Grid (Các khối nổi màu đỏ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCostumes.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col bg-linear-to-b from-[#881818] via-[#701010] to-[#500808] rounded-2xl border border-[#E6C673]/60 shadow-xl overflow-hidden hover:border-[#E6C673] hover:shadow-2xl transition-all duration-300 text-[#FFF8ED] relative"
          >
            {/* Image & Badges */}
            <div className="relative h-64 overflow-hidden bg-[#3D0606]">
              <img
                src={item.imagePlaceholderUrl}
                alt={item.name[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#500808] via-black/40 to-transparent" />

              {/* Họa tiết góc Cổ Phong & Trống Đồng Đông Sơn */}
              <div className="absolute top-1 left-1 opacity-90">
                <HeritageCorner position="top-left" size={24} color="#E6C673" />
              </div>
              <div className="absolute top-1 right-1 opacity-90">
                <HeritageCorner position="top-right" size={24} color="#E6C673" />
              </div>

              {/* Dynasty Badge */}
              <div className="absolute top-3 left-3 bg-[#430C0C]/90 backdrop-blur-xs text-[#FFDF88] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#E6C673]/50 flex items-center gap-1.5 shadow-xs">
                <DongSonDrum size={12} color="#E6C673" />
                <span>{item.era[language]}</span>
              </div>

              {/* Quick Action Badges: 3D & 360 Video */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => setActive3DCostume(item)}
                  className="flex items-center gap-1 bg-[#4A0909]/90 hover:bg-[#881818] backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded-md border border-[#E6C673]/50 transition-colors shadow-sm"
                  title="Mở mô hình 3D tương tác"
                >
                  <Rotate3d size={12} className="text-[#FFDF88]" />
                  <span>3D</span>
                </button>
                <button
                  onClick={() => setActive360Costume(item)}
                  className="flex items-center gap-1 bg-[#9B1B1B] hover:bg-[#B32020] backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded-md border border-[#E6C673]/50 transition-colors shadow-sm"
                  title="Xem video phục dựng 360°"
                >
                  <Play size={11} fill="white" />
                  <span>360°</span>
                </button>
              </div>

              {/* Color Swatches */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                {item.notableColors.slice(0, 4).map((col, idx) => (
                  <span
                    key={idx}
                    className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>

              <div className="absolute bottom-3 right-3 text-[11px] text-[#FFDF88] font-serif-vintage italic">
                {item.century}
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-serif-vintage font-bold text-[#FFDF88] group-hover:text-white transition-colors">
                  {item.name[language]}
                </h3>
                <p className="text-xs text-[#F5ECD8] line-clamp-2 mt-1.5 leading-relaxed">
                  {item.description[language]}
                </p>
              </div>

              {/* Key Features Bullet Points */}
              <div className="space-y-1.5 pt-2 border-t border-[#E6C673]/25">
                {item.keyFeatures.slice(0, 2).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#FAF0DE]">
                    <CheckCircle2 size={13} className="text-[#FFDF88] shrink-0" />
                    <span className="truncate">{feat[language]}</span>
                  </div>
                ))}
              </div>

              {/* Quick Actions Row */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActive3DCostume(item)}
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#520A0A] hover:bg-[#680E0E] text-[#FFF4DE] border border-[#E6C673]/40 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Rotate3d size={13} className="text-[#FFDF88]" />
                  <span>Mô hình 3D</span>
                </button>
                <button
                  onClick={() => setActive360Costume(item)}
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#520A0A] hover:bg-[#680E0E] text-[#FFF4DE] border border-[#E6C673]/40 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Video size={13} className="text-[#FFDF88]" />
                  <span>Video 360°</span>
                </button>
              </div>

              {/* Detail & Try on actions */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E6C673]/25 gap-2">
                <button
                  onClick={() => setSelectedCostume(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFDF88] hover:text-white transition-colors"
                >
                  <BookOpen size={14} />
                  <span>{language === 'vi' ? 'Hồ sơ bảo tàng' : 'View Exhibit'}</span>
                </button>

                <button
                  onClick={() => onSelectForFitting(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E6C673] hover:bg-[#F5D88A] text-[#500808] text-xs font-bold rounded-md transition-all shadow-xs"
                >
                  <Layers size={13} />
                  <span>{language === 'vi' ? 'Thử đồ 3D' : 'Try on'}</span>
                </button>
              </div>
            </div>

            {/* Diềm viền Trống Đồng Đông Sơn mảnh dưới đáy thẻ */}
            <DongSonBorderStrip height={6} color="#E6C673" className="opacity-30" />
          </div>
        ))}
      </div>

      {/* DETAIL MODAL (Exhibit Sheet) */}
      {selectedCostume && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-linear-to-b from-[#821515] via-[#6B1010] to-[#450707] text-[#FFFDF8] w-full max-w-4xl rounded-3xl border-2 border-[#E6C673]/70 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
              <img
                src={selectedCostume.imagePlaceholderUrl}
                alt={selectedCostume.name[activeTabLang]}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#450707] via-black/40 to-transparent" />

              <button
                onClick={() => setSelectedCostume(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-[#881818] text-[#E6C673] hover:text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-[#E6C673]/40"
              >
                <X size={18} />
              </button>

              {/* Floating Action in Header: 3D & 360 */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <button
                  onClick={() => {
                    const c = selectedCostume;
                    setActive3DCostume(c);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-[#881818] text-white text-xs font-semibold rounded-lg backdrop-blur-xs border border-white/20 transition-all shadow-md"
                >
                  <Rotate3d size={14} className="text-[#DFCEB0]" />
                  <span>Mô hình 3D tương tác</span>
                </button>

                <button
                  onClick={() => {
                    const c = selectedCostume;
                    setActive360Costume(c);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#881818]/90 hover:bg-[#881818] text-white text-xs font-semibold rounded-lg backdrop-blur-xs border border-white/20 transition-all shadow-md"
                >
                  <Play size={13} fill="white" />
                  <span>Video phục dựng 360°</span>
                </button>
              </div>

              {/* Title & Badge */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider bg-[#881818] px-2.5 py-0.5 rounded text-[#FAF7F2]">
                    {selectedCostume.era[activeTabLang]}
                  </span>
                  <span className="text-xs text-[#DFCEB0]">{selectedCostume.century}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif-vintage font-bold text-[#FAF7F2]">
                  {selectedCostume.name[activeTabLang]}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Language Switcher in modal */}
              <div className="flex items-center justify-between border-b border-[#E6D8C3] pb-3">
                <span className="text-xs text-[#8C7A65] font-semibold uppercase tracking-wider">
                  Hồ sơ bảo tàng số Đại Việt · Digital Archive
                </span>
                <div className="flex items-center gap-1 bg-[#F3ECE0] p-1 rounded-md text-xs">
                  <button
                    onClick={() => setActiveTabLang('vi')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTabLang === 'vi' ? 'bg-[#430C0C] text-white font-semibold' : 'text-[#6B5A47]'
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => setActiveTabLang('en')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTabLang === 'en' ? 'bg-[#430C0C] text-white font-semibold' : 'text-[#6B5A47]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* 3D & 360 Banner Launchers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setActive3DCostume(selectedCostume)}
                  className="p-3.5 bg-white hover:bg-[#F3ECE0] border border-[#E6D8C3] rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#430C0C] text-[#DFCEB0] flex items-center justify-center">
                      <Rotate3d size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#430C0C] group-hover:text-[#881818]">
                        Khởi động Mô hình 3D (Three.js)
                      </div>
                      <div className="text-[11px] text-[#6B5A47]">
                        Xoay 360°, bóc tách nếp vải, khung dây wireframe
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#881818] group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  onClick={() => setActive360Costume(selectedCostume)}
                  className="p-3.5 bg-white hover:bg-[#F3ECE0] border border-[#E6D8C3] rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#881818] text-white flex items-center justify-center">
                      <Video size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#430C0C] group-hover:text-[#881818]">
                        Xem Video Phục Dựng 360°
                      </div>
                      <div className="text-[11px] text-[#6B5A47]">
                        Thước phim tư liệu toàn cảnh & bảo tồn di sản
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#881818] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Two columns data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#2C241E]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif-vintage font-bold text-[#430C0C] text-sm uppercase tracking-wider mb-1">
                      {activeTabLang === 'vi' ? 'Mô tả & Ý nghĩa lịch sử' : 'Historical Significance'}
                    </h4>
                    <p className="text-[#430C0C] leading-relaxed">
                      {selectedCostume.description[activeTabLang]}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif-vintage font-bold text-[#430C0C] text-sm uppercase tracking-wider mb-1">
                      {activeTabLang === 'vi' ? 'Cấu trúc & Kỹ thuật may' : 'Tailoring & Geometry'}
                    </h4>
                    <p className="text-[#430C0C] leading-relaxed">
                      {selectedCostume.structure[activeTabLang]}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif-vintage font-bold text-[#430C0C] text-sm uppercase tracking-wider mb-1">
                      {activeTabLang === 'vi' ? 'Triết lý Ngũ Thường & Văn Hóa' : 'Philosophy & Five Virtues'}
                    </h4>
                    <p className="text-[#430C0C] leading-relaxed bg-[#F3ECE0] p-3 rounded-lg border border-[#E6D8C3]">
                      {selectedCostume.philosophy[activeTabLang]}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif-vintage font-bold text-[#430C0C] text-sm uppercase tracking-wider mb-1">
                      {activeTabLang === 'vi' ? 'Hoàn cảnh & Nghi thức sử dụng' : 'Protocol & Occasion'}
                    </h4>
                    <p className="text-[#430C0C] leading-relaxed">
                      {selectedCostume.occasion[activeTabLang]}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif-vintage font-bold text-[#430C0C] text-sm uppercase tracking-wider mb-1">
                      {activeTabLang === 'vi' ? 'Đặc trưng cấu tạo' : 'Salient Features'}
                    </h4>
                    <div className="space-y-1.5 mt-2">
                      {selectedCostume.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-[#881818] mt-0.5 shrink-0" />
                          <span>{feat[activeTabLang]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6D8C3] space-y-2">
                    <h4 className="font-serif-vintage font-bold text-[#430C0C] text-sm flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#881818]" />
                      <span>{activeTabLang === 'vi' ? 'Kiểu tóc, Makeup & Trang sức' : 'Hair, Makeup & Jewels'}</span>
                    </h4>
                    <p className="text-xs text-[#430C0C] leading-relaxed">
                      <strong className="text-[#881818]">{activeTabLang === 'vi' ? 'Tóc & Makeup:' : 'Hair & Face:'}</strong>{' '}
                      {selectedCostume.hairAndMakeup[activeTabLang]}
                    </p>
                    <p className="text-xs text-[#430C0C] leading-relaxed mt-2 pt-2 border-t border-[#F3ECE0]">
                      <strong className="text-[#881818]">{activeTabLang === 'vi' ? 'Trang sức:' : 'Adornments:'}</strong>{' '}
                      {selectedCostume.jewelry[activeTabLang]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Bottom CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E6D8C3]">
                <button
                  onClick={onOpenMap}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#F3ECE0] text-[#430C0C] border border-[#E6D8C3] text-xs font-medium rounded-lg transition-colors"
                >
                  <Compass size={14} />
                  <span>{activeTabLang === 'vi' ? 'Xem các bảo tàng & tiệm thuê áo này' : 'Find Museums & Rental Shops'}</span>
                </button>

                <button
                  onClick={() => {
                    const id = selectedCostume.id;
                    setSelectedCostume(null);
                    onSelectForFitting(id);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  <Layers size={14} />
                  <span>{activeTabLang === 'vi' ? 'Mang vào Thử đồ Cá nhân hóa' : 'Try on in 3D Fitting Room'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D VIEWER MODAL */}
      {active3DCostume && (
        <Costume3DViewer
          costume={active3DCostume}
          onClose={() => setActive3DCostume(null)}
          onSelectForFitting={(id: string) => {
            setActive3DCostume(null);
            onSelectForFitting(id);
          }}
        />
      )}

      {/* 360 VIDEO PLAYER MODAL */}
      {active360Costume && (
        <Video360Player
          costume={active360Costume}
          onClose={() => setActive360Costume(null)}
          onOpen3DViewer={() => {
            const c = active360Costume;
            setActive360Costume(null);
            setActive3DCostume(c);
          }}
        />
      )}

      {/* MUSEUM GUIDE ASSISTANT MODAL (Prompt 4) */}
      {isGuideAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-linear-to-b from-[#821515] via-[#6B1010] to-[#450707] text-[#FFFDF8] w-full max-w-3xl rounded-3xl border-2 border-[#E6C673]/70 shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E6C673]/40 pb-3">
              <div className="flex items-center gap-2">
                <Bot size={22} className="text-[#FFDF88]" />
                <div>
                  <h3 className="text-xl font-serif-vintage font-bold text-[#FFDF88]">
                    Hướng Dẫn Viên Bảo Tàng Số Việt Phục Remix (Prompt 4)
                  </h3>
                  <p className="text-[11px] text-[#F3E2C8]">
                    Kể chuyện di sản · Function Calling · Kéo Video 360° & Mô hình 3D tương tác
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideAssistantOpen(false)}
                className="text-[#E6C673] hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <MuseumGuideAssistant
              language={language}
              onOpen3DViewer={(c) => {
                setIsGuideAssistantOpen(false);
                setActive3DCostume(c);
              }}
              onOpen360Video={(c) => {
                setIsGuideAssistantOpen(false);
                setActive360Costume(c);
              }}
              onSelectForFitting={(id) => {
                setIsGuideAssistantOpen(false);
                onSelectForFitting(id);
              }}
            />
          </div>
        </div>
      )}

      {/* AI MUSEUM EXTRACTION TOOL MODAL (Prompt 1) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-linear-to-b from-[#821515] via-[#6B1010] to-[#450707] text-[#FFFDF8] w-full max-w-2xl rounded-3xl border-2 border-[#E6C673]/70 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#E6C673]/40 pb-4">
              <div className="flex items-center gap-2">
                <Bot size={22} className="text-[#FFDF88]" />
                <h3 className="text-xl font-serif-vintage font-bold text-[#FFDF88]">
                  Trợ Lý Sử Học AI (Prompt 1: Số Hóa Dữ Liệu Bảo Tàng)
                </h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-[#E6C673] hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#F5ECD8]">
              Nhập tên bất kỳ trang phục hoặc dạng thức y phục truyền thống Việt Nam để chuyên gia sử học AI trích xuất song ngữ JSON chuẩn học thuật bảo tàng.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#430C0C] mb-1">
                  Tên trang phục cần số hóa:
                </label>
                <input
                  type="text"
                  value={aiCostumeName}
                  onChange={(e) => setAiCostumeName(e.target.value)}
                  placeholder="Ví dụ: Áo Đối Khâm thời Trần, Áo Ngũ Thân hoa phượng, Áo thụ đán..."
                  className="w-full px-3.5 py-2 text-xs bg-white text-[#430C0C] rounded-lg border border-[#E6D8C3] focus:ring-2 focus:ring-[#881818]/20 focus:border-[#881818] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#430C0C] mb-1">
                  Gợi ý Niên đại / Triều đại (tùy chọn):
                </label>
                <input
                  type="text"
                  value={aiEraHint}
                  onChange={(e) => setAiEraHint(e.target.value)}
                  placeholder="Ví dụ: Triều Lý, Triều Lê Trung Hưng, Thế kỷ 17..."
                  className="w-full px-3.5 py-2 text-xs bg-white text-[#430C0C] rounded-lg border border-[#E6D8C3] focus:ring-2 focus:ring-[#881818]/20 focus:border-[#881818] outline-none"
                />
              </div>

              <button
                onClick={handleAiExtract}
                disabled={isExtracting || !aiCostumeName.trim()}
                className="w-full py-2.5 bg-[#881818] hover:bg-[#A82020] disabled:bg-[#881818]/50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isExtracting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang giám định sử liệu và trích xuất JSON...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Trích xuất Dữ Liệu Bảo Tàng (Prompt 1)</span>
                  </>
                )}
              </button>
            </div>

            {/* Extracted result display */}
            {extractedData && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-[#E6D8C3] space-y-3 max-h-80 overflow-y-auto text-xs">
                <div className="flex items-center justify-between border-b border-[#F3ECE0] pb-2">
                  <span className="font-bold text-[#881818] text-sm">{extractedData.nameVi}</span>
                  <span className="text-[#6B5A47] italic">{extractedData.nameEn}</span>
                </div>
                <div>
                  <strong className="text-[#430C0C]">Niên đại:</strong> {extractedData.eraVi} ({extractedData.eraEn})
                </div>
                <div>
                  <strong className="text-[#430C0C]">Cấu trúc:</strong> {extractedData.structureVi}
                </div>
                <div>
                  <strong className="text-[#430C0C]">Triết lý văn hóa:</strong> {extractedData.philosophyVi}
                </div>
                <div>
                  <strong className="text-[#430C0C]">Hoàn cảnh sử dụng:</strong> {extractedData.occasionVi}
                </div>
                {extractedData.hairAndJewelryVi && (
                  <div>
                    <strong className="text-[#430C0C]">Tóc & Trang sức:</strong> {extractedData.hairAndJewelryVi}
                  </div>
                )}
                <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                  ✓ Trích xuất định dạng chuẩn hóa thành công (JSON Schema Verified).
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
