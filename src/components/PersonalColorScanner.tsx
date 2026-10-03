import React, { useState } from 'react';
import { Language, PersonalColorAnalysis, Prompt7ArtDirectorResult } from '../types';
import { VIET_COSTUMES } from '../data/vietCostumes';
import { 
  Palette, 
  Upload, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Camera, 
  ArrowRight, 
  Flame, 
  Compass, 
  Smile,
  Scissors,
  Wand2,
  Image as ImageIcon,
  Copy,
  ExternalLink,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

interface PersonalColorScannerProps {
  language: Language;
  onApplyColorToAvatar: (hex: string) => void;
}

export const PersonalColorScanner: React.FC<PersonalColorScannerProps> = ({
  language,
  onApplyColorToAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt6-color' | 'prompt7-makeup'>('prompt6-color');

  // Image Upload state
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selfDesc, setSelfDesc] = useState<string>('');

  // Prompt 6: Personal Color & Five Elements state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PersonalColorAnalysis | null>(null);
  const [appliedColorHex, setAppliedColorHex] = useState<string | null>(null);

  // Prompt 7: Art Director Makeup & Hair state
  const [selectedCostumeName, setSelectedCostumeName] = useState<string>('Áo Tấc Cổ Phục (Triều Nguyễn)');
  const [selectedCostumeColor, setSelectedCostumeColor] = useState<string>('#881818');
  const [userMakeupPref, setUserMakeupPref] = useState<string>('Phong cách thanh lịch hoàng cung, tôn vinh nét Á Đông');
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artDirectorResult, setArtDirectorResult] = useState<Prompt7ArtDirectorResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Sample portrait presets for quick test
  const sampleProfiles = [
    {
      label: 'Da Trắng Sáng Sắc Lạnh (Cool Winter)',
      desc: 'Làn da trắng sáng, mắt đen láy, tĩnh mạch cổ tay xanh dương/tím, môi phớt hồng lạnh.',
      mockImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Da Vàng Ấm Á Đông (Warm Autumn)',
      desc: 'Làn da vàng mật ong ấm áp, mắt nâu hạt dẻ, tĩnh mạch xanh lá, sắc thái trầm ấm quý phái.',
      mockImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Da Tươi Sáng Trong Trẻo (Warm Spring)',
      desc: 'Làn da trắng ngà ửng hồng ấm, mắt sáng trong, nụ cười rạng rỡ như nắng mai xuân thì.',
      mockImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      const base64Clean = result.split(',')[1];
      setImageBase64(base64Clean);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof sampleProfiles[0]) => {
    setImagePreview(sample.mockImg);
    setSelfDesc(sample.desc);
    setImageBase64(null);
  };

  // Run Prompt 6: Personal Color & Five Elements Analysis
  const handleAnalyzePersonalColor = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/personal-color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64 || undefined,
          mimeType: 'image/jpeg',
          selfCharacteristics: selfDesc || 'Người Việt Nam có sắc tố da Á Đông tự nhiên, tóc đen, mắt nâu.',
        }),
      });
      const data = await response.json();
      setAnalysis(data);

      if (data.recommended_colors?.[0]?.hex_code) {
        setSelectedCostumeColor(data.recommended_colors[0].hex_code);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Prompt 7: Art Director Makeup, Hair & Image Generation
  const handleGenerateArtDirector = async () => {
    setIsGeneratingArt(true);
    setCopiedPrompt(false);
    try {
      const response = await fetch('/api/gemini/art-director-makeup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeName: selectedCostumeName,
          costumeColor: selectedCostumeColor,
          imageBase64: imageBase64 || undefined,
          mimeType: 'image/jpeg',
          userPreference: userMakeupPref,
        }),
      });
      const data = await response.json();
      setArtDirectorResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const copyPromptToClipboard = () => {
    if (!artDirectorResult?.image_generation_prompt) return;
    navigator.clipboard.writeText(artDirectorResult.image_generation_prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6D8C3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#881818] uppercase tracking-wider">
            <Palette size={16} />
            <span>Giai Đoạn 3 · Cá Nhân Hóa Đa Phương Thức (Multimodal Gemini 3.1 Pro & 3.8 Flash)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-vintage font-bold text-[#430C0C]">
            Khảo Sát Personal Color & Tạo Hình Nghệ Thuật (Prompt 6 & 7)
          </h2>
          <p className="text-xs text-[#6B5A47]">
            Phân tích Undertone, đối chiếu Ngũ Hành Chính sắc - Tạp sắc, tạo layout makeup, kiểu tóc và tự động sinh ảnh concept.
          </p>
        </div>

        {/* Tab switch between Prompt 6 and Prompt 7 */}
        <div className="flex items-center bg-[#F3ECE0] p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('prompt6-color')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompt6-color'
                ? 'bg-[#881818] text-white shadow-2xs'
                : 'text-[#6B5A47] hover:text-[#430C0C]'
            }`}
          >
            <Palette size={14} />
            <span>Personal Color & Ngũ Hành (Prompt 6)</span>
          </button>
          <button
            onClick={() => setActiveTab('prompt7-makeup')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompt7-makeup'
                ? 'bg-[#881818] text-white shadow-2xs'
                : 'text-[#6B5A47] hover:text-[#430C0C]'
            }`}
          >
            <Wand2 size={14} />
            <span>Makeup & Sinh Ảnh Concept (Prompt 7)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Upload on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Shared Photo Uploader */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E6D8C3] space-y-5">
          <div className="flex items-center justify-between border-b border-[#F3ECE0] pb-2">
            <h3 className="text-xs font-bold text-[#430C0C] uppercase tracking-wider">
              1. Tải Ảnh Chân Dung / Khuôn Mặt:
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Multimodal Vision Input
            </span>
          </div>

          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-[#E6D8C3] hover:border-[#881818] rounded-xl p-4 text-center transition-colors bg-[#FAF7F2]">
            {imagePreview ? (
              <div className="relative h-52 rounded-lg overflow-hidden mx-auto max-w-xs shadow-xs">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] px-2 py-1 rounded backdrop-blur-xs transition-colors"
                >
                  Đổi ảnh
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-8">
                <div className="w-12 h-12 rounded-full bg-[#F3ECE0] text-[#881818] flex items-center justify-center shadow-2xs">
                  <Camera size={22} />
                </div>
                <span className="text-xs font-semibold text-[#430C0C]">
                  Tải lên ảnh khuôn mặt hoặc toàn thân rõ nét
                </span>
                <span className="text-[11px] text-[#8C7A65]">
                  AI sẽ đọc tĩnh mạch, sắc thái da và góc mặt
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#6B5A47] block">
              Hoặc chọn nhanh hồ sơ chân dung mẫu:
            </span>
            <div className="space-y-1.5">
              {sampleProfiles.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="w-full text-left p-2.5 rounded-lg border border-[#E6D8C3] hover:border-[#881818] bg-[#FAF7F2] hover:bg-white text-xs transition-all"
                >
                  <span className="font-semibold text-[#430C0C] block">{sample.label}</span>
                  <span className="text-[11px] text-[#8C7A65] block line-clamp-1">{sample.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-semibold text-[#430C0C] mb-1">
              Mô tả thêm đặc điểm da / sở thích phục sức:
            </label>
            <textarea
              rows={2}
              value={selfDesc}
              onChange={(e) => setSelfDesc(e.target.value)}
              placeholder="Ví dụ: Da ấm dễ rám nắng, hợp với các tông màu đỏ gạch, thích phong cách hoàng gia..."
              className="w-full p-2.5 text-xs bg-[#FAF7F2] text-[#430C0C] rounded-lg border border-[#E6D8C3] outline-none"
            />
          </div>

          {/* Primary trigger depending on active tab */}
          {activeTab === 'prompt6-color' ? (
            <button
              onClick={handleAnalyzePersonalColor}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-[#881818] hover:bg-[#A82020] disabled:bg-[#881818]/50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Gemini đang đọc sắc tố da và đối chiếu ngũ hành...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Phân Tích Personal Color & Ngũ Hành (Prompt 6)</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleGenerateArtDirector}
              disabled={isGeneratingArt}
              className="w-full py-2.5 bg-[#881818] hover:bg-[#A82020] disabled:bg-[#881818]/50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingArt ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang tạo hình Makeup, Hair & Gọi Nano Banana Pro vẽ ảnh...</span>
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  <span>Tạo Hình & Sinh Ảnh Concept (Prompt 7)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E6D8C3] space-y-6">
          {/* TAB 1: PROMPT 6 PERSONAL COLOR & FIVE ELEMENTS */}
          {activeTab === 'prompt6-color' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#F3ECE0] pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-serif-vintage font-bold text-[#430C0C]">
                    2. Bảng Phân Tích Màu Sắc Cá Nhân & Đối Chiếu Ngũ Hành
                  </h3>
                  <span className="text-[11px] text-[#8C7A65]">
                    Định dạng Structured JSON Outputs · Mã màu HEX đưa thẳng vào Engine 3D
                  </span>
                </div>
                {analysis && (
                  <span className="text-xs font-semibold text-[#881818] bg-[#FAF7F2] px-3 py-1 rounded-md border border-[#E6D8C3]">
                    {analysis.season}
                  </span>
                )}
              </div>

              {analysis ? (
                <div className="space-y-5">
                  {/* Undertone and Season Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3]">
                      <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Sắc Tố Da (Undertone)</span>
                      <span className="text-base font-bold text-[#430C0C]">
                        {analysis.undertone === 'Warm' ? 'Warm (Ấm)' : analysis.undertone === 'Cool' ? 'Cool (Lạnh)' : 'Neutral (Trung tính)'}
                      </span>
                      <span className="text-[11px] text-[#6B5A47] block mt-0.5">Dựa trên sắc thái da & tĩnh mạch</span>
                    </div>

                    <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3]">
                      <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Nhóm Mùa (Season)</span>
                      <span className="text-base font-bold text-[#881818]">{analysis.season}</span>
                      <span className="text-[11px] text-[#6B5A47] block mt-0.5">Phong cách phương Tây</span>
                    </div>

                    <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3]">
                      <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Tương Ứng Ngũ Hành</span>
                      <span className="text-base font-bold text-amber-900">
                        {analysis.fiveElementsConnection || 'Hài hòa ngũ hành'}
                      </span>
                      <span className="text-[11px] text-[#6B5A47] block mt-0.5">Khí sắc tương sinh</span>
                    </div>
                  </div>

                  {/* Lời khuyên phối đồ (Advice) */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#881818]">
                      <Smile size={14} />
                      <span>Lời Khuyên Phối Đồ & Tôn Khí Sắc:</span>
                    </div>
                    <p className="text-xs text-[#430C0C] leading-relaxed">
                      {analysis.paletteSummary || analysis.prompt6Data?.advice}
                    </p>
                  </div>

                  {/* Recommended Colors: Phân định Chính sắc & Tạp sắc */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#430C0C] uppercase tracking-wider flex items-center gap-1.5">
                        <Palette size={14} className="text-[#881818]" />
                        <span>Màu Sắc Truyền Thống Phù Hợp (Chính Sắc & Tạp Sắc):</span>
                      </h4>
                      <span className="text-[11px] text-[#881818] font-mono">Bấm để nhuộm màu áo 3D</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(analysis.prompt6Data?.recommended_colors || analysis.recommendedVietColors || []).map((col: any, idx: number) => {
                        const hex = col.hex_code || col.hex;
                        const name = col.color_name || col.nameVi;
                        const element = col.nguhanh_element || 'Ngũ Hành';
                        const type = col.type || (idx === 0 ? 'Chính sắc' : 'Tạp sắc');
                        const isApplied = appliedColorHex === hex;

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-[#E6D8C3] hover:border-[#881818] bg-[#FAF7F2] flex items-center justify-between gap-3 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-9 h-9 rounded-full border border-black/10 shrink-0 shadow-sm"
                                style={{ backgroundColor: hex }}
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#430C0C]">{name}</span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                      type === 'Chính sắc'
                                        ? 'bg-[#881818] text-white'
                                        : 'bg-[#430C0C]/10 text-[#430C0C] border border-[#430C0C]/20'
                                    }`}
                                  >
                                    {type}
                                  </span>
                                </div>
                                <span className="text-[11px] text-[#8C7A65] block font-mono">
                                  {hex} · Hành {element}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                onApplyColorToAvatar(hex);
                                setAppliedColorHex(hex);
                                setSelectedCostumeColor(hex);
                              }}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-2xs ${
                                isApplied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white hover:bg-[#881818] text-[#881818] hover:text-white border border-[#E6D8C3]'
                              }`}
                            >
                              {isApplied ? 'Đã Nhuộm 3D' : 'Nhuộm Áo'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Step CTA */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#F3ECE0]">
                    <span className="text-xs text-[#6B5A47]">
                      Đã có bảng màu? Chuyển sang bước tiếp theo:
                    </span>
                    <button
                      onClick={() => setActiveTab('prompt7-makeup')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      <span>Tạo Hình Makeup & Hair (Prompt 7)</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E6D8C3] text-[#8C7A65] flex items-center justify-center mx-auto shadow-2xs">
                    <Palette size={24} className="text-[#881818]" />
                  </div>
                  <h4 className="text-base font-serif-vintage font-bold text-[#430C0C]">
                    Chưa Có Kết Quả Phân Tích
                  </h4>
                  <p className="text-xs text-[#6B5A47] max-w-sm mx-auto">
                    Tải ảnh chân dung hoặc chọn hồ sơ mẫu ở cột bên trái rồi bấm <strong>"Phân Tích Personal Color & Ngũ Hành"</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROMPT 7 ART DIRECTOR MAKEUP, HAIR & IMAGE GENERATION */}
          {activeTab === 'prompt7-makeup' && (
            <div className="space-y-6">
              <div className="border-b border-[#F3ECE0] pb-3 space-y-1">
                <h3 className="text-lg font-serif-vintage font-bold text-[#430C0C] flex items-center gap-2">
                  <Wand2 size={18} className="text-[#881818]" />
                  <span>Giám Đốc Nghệ Thuật & Tạo Hình (Prompt 7: Makeup, Hair & Sinh Ảnh Concept)</span>
                </h3>
                <p className="text-xs text-[#6B5A47]">
                  Tự động gợi ý kiểu tóc truyền thống remix, layout trang điểm và gọi mô hình Nano Banana Pro vẽ ảnh mẫu 2D.
                </p>
              </div>

              {/* Costume Context Setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#E6D8C3]">
                <div>
                  <label className="block text-xs font-semibold text-[#430C0C] mb-1">
                    Trang phục kết hợp:
                  </label>
                  <select
                    value={selectedCostumeName}
                    onChange={(e) => setSelectedCostumeName(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-xs text-[#430C0C] rounded-lg border border-[#E6D8C3] outline-none"
                  >
                    {VIET_COSTUMES.map((c) => (
                      <option key={c.id} value={`${c.name.vi} (${c.era.vi})`}>
                        {c.name.vi} — {c.era.vi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#430C0C] mb-1">
                    Tông màu vải chủ đạo:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedCostumeColor}
                      onChange={(e) => setSelectedCostumeColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E6D8C3] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedCostumeColor}
                      onChange={(e) => setSelectedCostumeColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white text-xs text-[#430C0C] font-mono rounded-lg border border-[#E6D8C3] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Art Director Results Display */}
              {artDirectorResult ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hair Style Card */}
                    <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#881818] uppercase tracking-wider">
                        <Scissors size={15} />
                        <span>Kiểu Tóc (Hair Style)</span>
                      </div>
                      <p className="text-xs text-[#430C0C] leading-relaxed">
                        {artDirectorResult.hair_style}
                      </p>
                    </div>

                    {/* Makeup Style Card */}
                    <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#881818] uppercase tracking-wider">
                        <Smile size={15} />
                        <span>Layout Trang Điểm (Makeup Style)</span>
                      </div>
                      <p className="text-xs text-[#430C0C] leading-relaxed">
                        {artDirectorResult.makeup_style}
                      </p>
                    </div>
                  </div>

                  {/* Generated Concept Image (from Nano Banana Pro) */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#430C0C] uppercase tracking-wider">
                        <ImageIcon size={15} className="text-[#881818]" />
                        <span>Ảnh Concept Nghệ Thuật (Nano Banana Pro / Imagen Output)</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                        Prompt 7 Live
                      </span>
                    </div>

                    {artDirectorResult.generated_image_url ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#E6D8C3] max-w-md mx-auto shadow-md">
                        <img
                          src={artDirectorResult.generated_image_url}
                          alt="AI Concept Art"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-6 text-center space-y-2 bg-white rounded-lg border border-[#E6D8C3]">
                        <p className="text-xs text-[#430C0C] font-semibold">
                          Câu lệnh Image Generation Prompt đã được kỹ sư AI biên soạn chuẩn xác.
                        </p>
                        <p className="text-[11px] text-[#6B5A47]">
                          (Khi có API key hình ảnh trả phí, mô hình Nano Banana Pro sẽ render trực tiếp ảnh 2D độ phân giải cao).
                        </p>
                      </div>
                    )}

                    {/* English Image Generation Prompt */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#8C7A65]">
                          Prompt Tiếng Anh Chi Tiết (Cho Nano Banana Pro / Midjourney):
                        </span>
                        <button
                          onClick={copyPromptToClipboard}
                          className="inline-flex items-center gap-1 text-[11px] text-[#881818] hover:text-[#430C0C] font-medium"
                        >
                          {copiedPrompt ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          <span>{copiedPrompt ? 'Đã chép prompt!' : 'Sao chép Prompt'}</span>
                        </button>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-[#E6D8C3] text-[11px] font-mono text-[#430C0C] leading-relaxed">
                        {artDirectorResult.image_generation_prompt}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E6D8C3] text-[#8C7A65] flex items-center justify-center mx-auto shadow-2xs">
                    <Wand2 size={24} className="text-[#881818]" />
                  </div>
                  <h4 className="text-base font-serif-vintage font-bold text-[#430C0C]">
                    Sẵn Sàng Tạo Hình Nghệ Thuật
                  </h4>
                  <p className="text-xs text-[#6B5A47] max-w-sm mx-auto">
                    Chọn trang phục và màu sắc ở trên, sau đó bấm <strong>"Tạo Hình & Sinh Ảnh Concept (Prompt 7)"</strong> để Art Director thiết kế kiểu tóc, layout makeup và tạo ảnh tham khảo.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
