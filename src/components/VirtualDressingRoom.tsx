import React, { useState } from 'react';
import { AvatarState, Language, CulturalCheckResult } from '../types';
import { VIET_COSTUMES } from '../data/vietCostumes';
import { evaluateLocalSafeguard } from '../data/culturalRules';
import { 
  DongSonDrum, 
  LacBird, 
  HeritageCorner, 
  DongSonBorderStrip 
} from './HeritageMotifs';
import { 
  User, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Palette, 
  Sliders, 
  Share2, 
  Check, 
  RotateCcw,
  Sparkle,
  Compass,
  Tag,
  AlertCircle,
  Rotate3d
} from 'lucide-react';
import { VirtualFitting3DViewer } from './VirtualFitting3DViewer';

interface VirtualDressingRoomProps {
  language: Language;
  avatarState: AvatarState;
  setAvatarState: React.Dispatch<React.SetStateAction<AvatarState>>;
  onOpenLookbook: () => void;
  onOpenSafeguard: () => void;
  onOpenPersonalColor: () => void;
  onOpenStylist: () => void;
}

export const VirtualDressingRoom: React.FC<VirtualDressingRoomProps> = ({
  language,
  avatarState,
  setAvatarState,
  onOpenLookbook,
  onOpenSafeguard,
  onOpenPersonalColor,
  onOpenStylist,
}) => {
  const [activeTab, setActiveTab] = useState<'garment' | 'lower' | 'headwear' | 'jewelry' | 'fabric_motif' | 'measurements'>('garment');
  const [displayMode, setDisplayMode] = useState<'3d' | '2d'>('3d');

  // Real-time local evaluation
  const safeguardResult: CulturalCheckResult = evaluateLocalSafeguard(avatarState);

  const selectedCostumeObj = VIET_COSTUMES.find((c) => c.id === avatarState.selectedGarmentId) || VIET_COSTUMES[0];

  // Palette presets
  const colorOptions = [
    { label: 'Đỏ Chu Sa Cung Đình', hex: '#C81E1E', meaning: 'Hoàng phái Triều Nguyễn & Chuẩn tư liệu 4 góc chụp' },
    { label: 'Đỏ Chu Sa Cổ Điển', hex: '#881818', meaning: 'Phẩm giá hoàng gia & Hỏa khí' },
    { label: 'Xanh Cổ Vịt', hex: '#065F46', meaning: 'Trầm mặc tao nhã & Mộc khí' },
    { label: 'Xanh Lam Phỉ Thúy', hex: '#1E3A8A', meaning: 'Khoan thai cao quý & Thủy khí' },
    { label: 'Vàng Hoàng Kim (Đặc quyền)', hex: '#FFD700', meaning: 'Cẩn trọng: Hoàng quyền' },
    { label: 'Tím Cố Đô', hex: '#6B2D5C', meaning: 'Kinh kỳ mộng mơ' },
    { label: 'Trắng Bạch Lạp', hex: '#FAF7F2', meaning: 'Thanh bạch & Kim khí' },
    { label: 'Đen Mực Nho', hex: '#1C1917', meaning: 'Nho nhã trang nghiêm' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Navigation (Khối nổi màu đỏ) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-6 rounded-2xl border border-[#E6C673]/60 shadow-xl text-[#FFF8ED]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDF88] uppercase tracking-wider">
            <Layers size={16} />
            <span>Kho 2 · Phòng Thử Đồ Cá Nhân Hóa & Mô Hình Avatar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-vintage font-bold text-[#FFFDF8]">
            Phòng Thử Đồ Ảo & Phối Lớp Việt Phục (Layering)
          </h2>
          <p className="text-xs text-[#F5ECD8]">
            Tự do thử các dạng thức áo cổ phong, kiểm soát tỉ lệ số đo, phối hạ bộ, nón mão và nhận diện cảnh báo Màng Lọc Di Sản thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              setAvatarState((prev) => ({
                ...prev,
                selectedGarmentId: 'ao-nhat-binh',
                selectedGarmentColor: '#C81E1E',
                headwear: 'khan_vanh_xanh_lam',
                lowerGarment: 'quan_bach_lap',
                fabricType: 'gam_bao_loc',
                dragonPattern: 'hoa_sen',
                gender: 'female',
              }))
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#B91C1C] to-[#881818] hover:from-[#DC2626] hover:to-[#A82020] border-2 border-[#FFDF88] text-xs font-bold text-[#FFF8ED] rounded-lg transition-all shadow-md cursor-pointer"
            title="Nạp ngay bộ phối mẫu Áo Nhật Bình Đỏ Chu Sa chuẩn 4 ảnh tư liệu"
          >
            <Sparkles size={14} className="text-[#FFDF88]" />
            <span>Mẫu 3D: Áo Nhật Bình Đỏ Chu Sa (4 Góc Chụp)</span>
          </button>
          <button
            onClick={onOpenPersonalColor}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#520A0A] hover:bg-[#680E0E] border border-[#E6C673]/50 text-xs font-semibold text-[#FFDF88] rounded-lg transition-colors"
          >
            <Palette size={14} className="text-[#FFDF88]" />
            <span>Personal Color & Makeup AI (Prompt 6 & 7)</span>
          </button>
          <button
            onClick={onOpenStylist}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#520A0A] hover:bg-[#680E0E] border border-[#E6C673]/50 text-xs font-semibold text-[#FFFDF8] rounded-lg transition-colors"
          >
            <Compass size={14} className="text-[#E6C673]" />
            <span>Gợi Ý Điểm Đến & Thời Tiết</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Mannequin Canvas, Right Wardrobe Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Avatar Canvas & Real-time Safeguard Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative bg-linear-to-b from-[#881818] via-[#721111] to-[#500808] text-[#FFF8ED] rounded-2xl border-2 border-[#E6C673]/60 p-4 sm:p-5 shadow-2xl overflow-hidden flex flex-col items-center justify-between min-h-[580px]">
            {/* Background texture & imperial arch */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E6C673_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {/* Display Mode Switcher (3D 360° vs 2D Silhouette) */}
            <div className="w-full flex items-center justify-between mb-2 z-20">
              <div className="flex items-center gap-1 bg-[#430808] p-1 rounded-lg border border-[#E6C673]/40">
                <button
                  onClick={() => setDisplayMode('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    displayMode === '3d'
                      ? 'bg-[#E6C673] text-[#5C0C0C] shadow-sm'
                      : 'text-[#FFF8ED]/80 hover:text-white'
                  }`}
                >
                  <Rotate3d size={13} />
                  <span>Mô hình 3D (360°)</span>
                </button>

                <button
                  onClick={() => setDisplayMode('2d')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    displayMode === '2d'
                      ? 'bg-[#E6C673] text-[#5C0C0C] shadow-sm'
                      : 'text-[#FFF8ED]/80 hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>Bản vẽ 2D</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#FFDF88]">
                {avatarState.heightCm}cm · {avatarState.weightKg}kg
              </span>
            </div>

            {/* 3D 360-Degree Interactive Model Display */}
            {displayMode === '3d' ? (
              <div className="w-full flex-1 flex flex-col z-10">
                <VirtualFitting3DViewer
                  avatarState={avatarState}
                  setAvatarState={setAvatarState}
                  language={language}
                />
              </div>
            ) : (
              /* Stylized 2D Interactive Fashion Avatar Canvas */
              <div className="w-full flex flex-col items-center z-10">
                <div className="relative w-64 h-[370px] flex items-center justify-center my-2">
                  {/* SVG Mannequin Silhouette with dynamic Layering */}
                  <svg viewBox="0 0 240 400" className="w-full h-full drop-shadow-md">
                    <defs>
                      {/* Subtle silk gradient */}
                      <linearGradient id="garmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={avatarState.selectedGarmentColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={avatarState.selectedGarmentColor} stopOpacity="0.85" />
                      </linearGradient>
                      {/* Gold border */}
                      <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#DFCEB0" />
                        <stop offset="50%" stopColor="#FAF7F2" />
                        <stop offset="100%" stopColor="#DFCEB0" />
                      </linearGradient>
                    </defs>

                    {/* Pedestal / Ground shadow */}
                    <ellipse cx="120" cy="385" rx="75" ry="12" fill="rgba(67, 12, 12, 0.15)" />

                    {/* Skin tone color mapping */}
                    {(() => {
                      const skinColor =
                        avatarState.skinTone === 'fair'
                          ? '#FBEAE3'
                          : avatarState.skinTone === 'natural'
                          ? '#F2D3BE'
                          : avatarState.skinTone === 'honey'
                          ? '#D8A581'
                          : '#C8936C';

                      return (
                        <g id="avatarModel">
                          {/* Legs / Lower Layer Preview */}
                          {avatarState.lowerGarment === 'quan_short_loi' ? (
                            /* Shorts violation: bare legs exposed! */
                            <g id="lowerViolation">
                              {/* Short hem */}
                              <path d="M95 240 L145 240 L150 270 L125 270 L120 255 L115 270 L90 270 Z" fill="#2563EB" />
                              {/* Exposed bare legs */}
                              <rect x="96" y="270" width="18" height="90" rx="6" fill={skinColor} />
                              <rect x="126" y="270" width="18" height="90" rx="6" fill={skinColor} />
                              {/* Shoes */}
                              <ellipse cx="105" cy="365" rx="12" ry="5" fill="#4B5563" />
                              <ellipse cx="135" cy="365" rx="12" ry="5" fill="#4B5563" />
                            </g>
                          ) : avatarState.lowerGarment === 'vay_quan_den' ? (
                            /* Traditional Black wrap skirt */
                            <path
                              d="M85 220 Q120 230 155 220 L165 375 Q120 382 75 375 Z"
                              fill="#18181B"
                              stroke="#27272A"
                              strokeWidth="1.5"
                            />
                          ) : (
                            /* Traditional White silk trousers (Quần bạch lạp) */
                            <g id="whiteTrousers">
                              <path
                                d="M85 220 Q105 230 120 230 L115 375 L85 372 Z"
                                fill="#FAF7F2"
                                stroke="#E6D8C3"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M155 220 Q135 230 120 230 L125 375 L155 372 Z"
                                fill="#FAF7F2"
                                stroke="#E6D8C3"
                                strokeWidth="1.5"
                              />
                            </g>
                          )}

                          {/* Head and Neck */}
                          <circle cx="120" cy="55" r="22" fill={skinColor} />
                          <rect x="114" y="74" width="12" height="18" fill={skinColor} />

                          {/* Headwear Layer */}
                          {avatarState.headwear === 'khan_dong' && (
                            <g>
                              <ellipse cx="120" cy="42" rx="25" ry="12" fill="#1C1917" stroke="#430C0C" strokeWidth="1" />
                              <path d="M96 42 Q120 32 144 42 L140 48 Q120 38 100 48 Z" fill="#2C241E" />
                            </g>
                          )}
                          {avatarState.headwear === 'van_tran' && (
                            <g>
                              <ellipse cx="120" cy="38" rx="22" ry="8" fill="#18181B" />
                              <circle cx="120" cy="34" r="7" fill="#881818" />
                            </g>
                          )}
                          {avatarState.headwear === 'non_quai_thao' && (
                            <g>
                              <ellipse cx="120" cy="32" rx="48" ry="10" fill="#DFCEB0" stroke="#B79E78" strokeWidth="1.5" />
                              <path d="M80 32 Q90 100 115 140" stroke="#881818" strokeWidth="2" fill="none" />
                              <path d="M160 32 Q150 100 125 140" stroke="#881818" strokeWidth="2" fill="none" />
                            </g>
                          )}
                          {avatarState.headwear === 'mao_le_mismatch' && (
                            <g>
                              <ellipse cx="120" cy="40" rx="24" ry="14" fill="#0F172A" />
                              <path d="M96 40 Q65 30 50 35 Q65 48 96 44 Z" fill="#0F172A" stroke="#334155" />
                              <path d="M144 40 Q175 30 190 35 Q175 48 144 44 Z" fill="#0F172A" stroke="#334155" />
                            </g>
                          )}

                          {/* Main Garment Body */}
                          <path
                            d={`M105 88 L60 135 L75 160 L95 140 L80 310 Q120 320 160 310 L145 140 L165 160 L180 135 L135 88 Z`}
                            fill="url(#garmentGrad)"
                            stroke="#651212"
                            strokeWidth="1.5"
                          />

                          {/* Collar Cut styling */}
                          {avatarState.selectedGarmentId === 'ao-nhat-binh' ? (
                            <g>
                              <rect x="110" y="88" width="20" height="150" fill="url(#goldTrim)" stroke="#881818" strokeWidth="1" />
                              <g>
                                <rect x="62" y="142" width="14" height="4" fill="#2563EB" />
                                <rect x="62" y="146" width="14" height="4" fill="#EAB308" />
                                <rect x="62" y="150" width="14" height="4" fill="#FAF7F2" />
                                <rect x="62" y="154" width="14" height="4" fill="#DC2626" />
                                <rect x="62" y="158" width="14" height="4" fill="#18181B" />

                                <rect x="164" y="142" width="14" height="4" fill="#2563EB" />
                                <rect x="164" y="146" width="14" height="4" fill="#EAB308" />
                                <rect x="164" y="150" width="14" height="4" fill="#FAF7F2" />
                                <rect x="164" y="154" width="14" height="4" fill="#DC2626" />
                                <rect x="164" y="158" width="14" height="4" fill="#18181B" />
                              </g>
                            </g>
                          ) : avatarState.selectedGarmentId === 'ao-giao-linh' ? (
                            <g>
                              <path d="M108 88 L136 140" stroke="#DFCEB0" strokeWidth="6" />
                              <path d="M132 88 L104 140" stroke="#FAF7F2" strokeWidth="6" />
                              <rect x="90" y="170" width="60" height="12" fill="#881818" rx="2" />
                              <path d="M125 182 L132 250" stroke="#881818" strokeWidth="4" />
                            </g>
                          ) : avatarState.selectedGarmentId === 'ao-doi-kham' ? (
                            <g>
                              <rect x="112" y="90" width="16" height="110" fill="#FAF7F2" stroke="#E6D8C3" />
                              <line x1="110" y1="90" x2="110" y2="310" stroke="#DFCEB0" strokeWidth="3" />
                              <line x1="130" y1="90" x2="130" y2="310" stroke="#DFCEB0" strokeWidth="3" />
                            </g>
                          ) : (
                            <g>
                              <rect x="112" y="84" width="16" height="12" rx="4" fill="url(#garmentGrad)" stroke="#DFCEB0" strokeWidth="1.5" />
                              <circle cx="120" cy="90" r="2" fill="#EAB308" />
                              <circle cx="127" cy="102" r="2" fill="#EAB308" />
                              <circle cx="132" cy="116" r="2" fill="#EAB308" />
                              <circle cx="134" cy="130" r="2" fill="#EAB308" />
                              <circle cx="133" cy="144" r="2" fill="#EAB308" />
                            </g>
                          )}

                          {/* Motifs / Patterns on Chest */}
                          {avatarState.dragonPattern === 'trong_dong_chim_lac' ? (
                            <g transform="translate(106, 120) scale(0.7)">
                              <circle cx="20" cy="20" r="19" fill="none" stroke="#FDE047" strokeWidth="1.2" strokeDasharray="2 1.5" />
                              <circle cx="20" cy="20" r="15" fill="none" stroke="#EAB308" strokeWidth="1" />
                              <polygon points="20,8 22,17 31,15 24,20 31,25 22,23 20,32 18,23 9,25 16,20 9,15 18,17" fill="#FACC15" />
                              <circle cx="20" cy="20" r="2.5" fill="#881818" />
                              <path d="M12 11 Q16 8 20 10 Q16 13 12 11 Z" fill="#FDE047" />
                              <path d="M28 29 Q24 32 20 30 Q24 27 28 29 Z" fill="#FDE047" />
                            </g>
                          ) : avatarState.dragonPattern === 'ngu_trao_long' ? (
                            <g transform="translate(108, 120) scale(0.6)">
                              <circle cx="20" cy="20" r="18" fill="none" stroke="#EAB308" strokeWidth="2.5" strokeDasharray="3 2" />
                              <path d="M10 20 Q20 5 30 20 Q20 35 10 20" fill="none" stroke="#EAB308" strokeWidth="3" />
                              <circle cx="20" cy="20" r="4" fill="#EAB308" />
                              <path d="M6 14 L2 10 M8 10 L6 5 M14 8 L15 3 M20 8 L24 4 M26 12 L31 9" stroke="#EAB308" strokeWidth="1.5" />
                            </g>
                          ) : avatarState.dragonPattern === 'hoa_sen' ? (
                            <g transform="translate(110, 122) scale(0.5)">
                              <path d="M20 5 Q10 20 20 35 Q30 20 20 5" fill="#F472B6" />
                              <path d="M20 12 Q5 22 12 32 Q20 30 20 12" fill="#FB7185" opacity="0.8" />
                              <path d="M20 12 Q35 22 28 32 Q20 30 20 12" fill="#FB7185" opacity="0.8" />
                            </g>
                          ) : null}

                          {/* Jewelry Layer */}
                          {avatarState.jewelry === 'kieng_bac' && (
                            <path d="M108 96 Q120 114 132 96" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
                          )}
                          {avatarState.jewelry === 'tram_phuong' && (
                            <path d="M136 42 L150 30 M150 30 Q160 25 155 35" stroke="#EAB308" strokeWidth="2.5" fill="none" />
                          )}
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Direct Height & Weight Adjustment in 2D View */}
                <div className="w-full bg-[#520A0A]/90 border border-[#E6C673]/50 rounded-xl p-3 space-y-2 z-20 mb-1">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-[#FFFDF8] mb-0.5">
                        <span>Chiều cao:</span>
                        <span className="text-[#FFDF88] font-mono">{avatarState.heightCm} cm</span>
                      </div>
                      <input
                        type="range"
                        min="140"
                        max="205"
                        value={avatarState.heightCm}
                        onChange={(e) => setAvatarState((prev) => ({ ...prev, heightCm: parseInt(e.target.value, 10) }))}
                        className="w-full h-1.5 bg-[#2B0505] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-[#FFFDF8] mb-0.5">
                        <span>Cân nặng:</span>
                        <span className="text-[#FFDF88] font-mono">{avatarState.weightKg} kg</span>
                      </div>
                      <input
                        type="range"
                        min="38"
                        max="115"
                        value={avatarState.weightKg}
                        onChange={(e) => setAvatarState((prev) => ({ ...prev, weightKg: parseInt(e.target.value, 10) }))}
                        className="w-full h-1.5 bg-[#2B0505] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-Time Safeguard Indicator Pill on Avatar Canvas */}
            <div className="w-full mt-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  safeguardResult.status === 'Pass'
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50/90 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {safeguardResult.status === 'Pass' ? (
                    <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                  ) : (
                    <ShieldAlert size={18} className="text-rose-700 shrink-0 animate-pulse" />
                  )}
                  <div>
                    <span className="font-bold">
                      {safeguardResult.status === 'Pass' ? 'Đạt Chuẩn Di Sản' : 'Cảnh Báo Lệch Chuẩn'}
                    </span>
                    <p className="text-[11px] opacity-90 truncate max-w-[200px] sm:max-w-xs">
                      {safeguardResult.user_message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenSafeguard}
                  className="px-2.5 py-1 bg-white rounded-md text-[11px] font-semibold border border-current hover:opacity-80 transition-opacity shrink-0 ml-2"
                >
                  Chi tiết màng lọc
                </button>
              </div>
            </div>

            {/* Fast Action Buttons under Avatar */}
            <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E6D8C3]">
              <button
                onClick={onOpenSafeguard}
                className="py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#430C0C] border border-[#E6D8C3] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck size={14} className="text-[#881818]" />
                <span>Kiểm định AI (Prompt 2)</span>
              </button>

              <button
                onClick={onOpenLookbook}
                className="py-2 px-3 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles size={14} />
                <span>Sinh Lookbook (Prompt 3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Wardrobe Controls & Customization Tabs (Khối nổi màu đỏ) */}
        <div className="lg:col-span-7 bg-linear-to-b from-[#881818] via-[#701010] to-[#500808] text-[#FFF8ED] rounded-2xl border-2 border-[#E6C673]/60 p-6 shadow-2xl space-y-6">
          {/* Segmented Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#4A0909] rounded-xl border border-[#E6C673]/40">
            <button
              onClick={() => setActiveTab('garment')}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'garment' ? 'bg-[#E6C673] text-[#4A0909] font-bold shadow-xs' : 'text-[#F3E7CD] hover:text-white'
              }`}
            >
              1. Thân Áo (Chính)
            </button>
            <button
              onClick={() => setActiveTab('lower')}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'lower' ? 'bg-[#E6C673] text-[#4A0909] font-bold shadow-xs' : 'text-[#F3E7CD] hover:text-white'
              }`}
            >
              2. Hạ Bộ (Quần/Váy)
            </button>
            <button
              onClick={() => setActiveTab('headwear')}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'headwear' ? 'bg-[#E6C673] text-[#4A0909] font-bold shadow-xs' : 'text-[#F3E7CD] hover:text-white'
              }`}
            >
              3. Mũ Mão & Tóc
            </button>
            <button
              onClick={() => setActiveTab('jewelry')}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'jewelry' ? 'bg-[#E6C673] text-[#4A0909] font-bold shadow-xs' : 'text-[#F3E7CD] hover:text-white'
              }`}
            >
              4. Trang Sức & Đạo Cụ
            </button>
            <button
              onClick={() => setActiveTab('fabric_motif')}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'fabric_motif' ? 'bg-[#E6C673] text-[#4A0909] font-bold shadow-xs' : 'text-[#F3E7CD] hover:text-white'
              }`}
            >
              5. Họa Tiết & Bối Cảnh
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'measurements' ? 'bg-[#E6C673] text-[#4A0909] font-bold shadow-xs' : 'text-[#F3E7CD] hover:text-white'
              }`}
            >
              6. Số Đo 3D
            </button>
          </div>

          {/* TAB 1: GARMENT SELECTOR & COLOR */}
          {activeTab === 'garment' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#FFDF88] tracking-wider mb-2.5">
                  Chọn Phom Dáng Áo Truyền Thống:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VIET_COSTUMES.map((costume) => {
                    const isSelected = avatarState.selectedGarmentId === costume.id;
                    return (
                      <button
                        key={costume.id}
                        onClick={() =>
                          setAvatarState((prev) => ({
                            ...prev,
                            selectedGarmentId: costume.id,
                          }))
                        }
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]'
                            : 'bg-white border-[#E6D8C3] hover:border-[#881818]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#430C0C]">{costume.name[language]}</span>
                          {isSelected && <Check size={14} className="text-[#881818]" />}
                        </div>
                        <span className="text-[11px] text-[#8C7A65] block mt-0.5">{costume.era[language]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Garment Color Swatches */}
              <div className="pt-2 border-t border-[#F3ECE0]">
                <h4 className="text-xs uppercase font-semibold text-[#881818] tracking-wider mb-2.5">
                  Sắc Màu Vải (Theo Ngũ Hành):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {colorOptions.map((c) => {
                    const isSelected = avatarState.selectedGarmentColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        onClick={() =>
                          setAvatarState((prev) => ({
                            ...prev,
                            selectedGarmentColor: c.hex,
                          }))
                        }
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                          isSelected ? 'border-[#881818] bg-[#FAF7F2] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="overflow-hidden">
                          <span className="text-xs font-semibold text-[#430C0C] block truncate">{c.label}</span>
                          <span className="text-[10px] text-[#8C7A65] block truncate">{c.meaning}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOWER BODY (RULE 1 TEST) */}
          {activeTab === 'lower' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6D8C3] text-xs text-[#430C0C]">
                <span className="font-bold text-[#881818]">Lưu ý Quy tắc 1 (Hạ bộ):</span> Cổ phục bắt buộc phải có lớp quần hoặc váy dài che kín mắt cá chân. Thử chọn "Quần short ngắn" để xem màng lọc phản ứng!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, lowerGarment: 'quan_bach_lap' }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    avatarState.lowerGarment === 'quan_bach_lap'
                      ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]'
                      : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Quần Lụa Bạch Lạp (Trắng)</div>
                  <div className="text-[11px] text-[#8C7A65] mt-1">Chuẩn mực truyền thống Đại Việt & Triều Nguyễn. Kín đáo, thanh khiết.</div>
                  <span className="inline-block mt-2 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ Đạt chuẩn di sản
                  </span>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, lowerGarment: 'vay_quan_den' }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    avatarState.lowerGarment === 'vay_quan_den'
                      ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]'
                      : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Váy Quấn Lụa Đen (Váy đầm xưa)</div>
                  <div className="text-[11px] text-[#8C7A65] mt-1">Phổ biến thời Lý - Trần - Lê và phụ nữ đồng bằng Bắc Bộ.</div>
                  <span className="inline-block mt-2 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ Đạt chuẩn di sản
                  </span>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, lowerGarment: 'quan_au_dai' }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    avatarState.lowerGarment === 'quan_au_dai'
                      ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]'
                      : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Quần Tây Dài Cách Tân (Remix)</div>
                  <div className="text-[11px] text-[#8C7A65] mt-1">Phối đồ phong cách đương đại (Modern fusion), vẫn che kín hạ bộ.</div>
                  <span className="inline-block mt-2 text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                    ✓ Chấp nhận (Remix đương đại)
                  </span>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, lowerGarment: 'quan_short_loi' }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    avatarState.lowerGarment === 'quan_short_loi'
                      ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#E6D8C3] hover:border-rose-400'
                  }`}
                >
                  <div className="font-semibold text-xs text-rose-900">Quần Short Cộc Ngắn (Lỗi Thử Nghiệm)</div>
                  <div className="text-[11px] text-rose-700 mt-1">Hở chân cộc lốc làm phá vỡ cấu trúc và sự tôn nghiêm của cổ phục.</div>
                  <span className="inline-block mt-2 text-[10px] text-rose-800 bg-rose-100 px-2 py-0.5 rounded font-bold">
                    ✕ Lỗi Vi Phạm Quy Tắc 1
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: HEADWEAR & HAIR (RULE 3 TEST) */}
          {activeTab === 'headwear' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6D8C3] text-xs text-[#430C0C]">
                <span className="font-bold text-[#881818]">Lưu ý Quy tắc 3 (Niên đại):</span> Không nên phối phụ kiện khác triều đại. Thử chọn "Mũ quan triều Lê" khi đang mặc Áo Nhật Bình để xem màng lọc cảnh báo!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, headwear: 'khan_vanh_xanh_lam' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.headwear === 'khan_vanh_xanh_lam' ? 'bg-[#FAF7F2] border-[#1545b5] ring-2 ring-[#1545b5]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-[#1E3A8A]">Khăn Vành Xanh Lam Bảo Thạch</div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Chuẩn 4 Ảnh</span>
                  </div>
                  <div className="text-[11px] text-[#475569] mt-0.5">Khăn vành quấn nhiều lớp màu lam lộ búi tóc cung đình sang trọng ở đỉnh đầu.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, headwear: 'khan_dong' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.headwear === 'khan_dong' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Khăn Đóng / Khăn Xếp (Triều Nguyễn)</div>
                  <div className="text-[11px] text-[#8C7A65]">Chuẩn xác cho Áo Tấc, Áo Dài Ngũ Thân.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, headwear: 'van_tran' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.headwear === 'van_tran' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Tóc Vấn Trần / Búi Trâm</div>
                  <div className="text-[11px] text-[#8C7A65]">Tao nhã, hợp Giao Lĩnh, Đối Khâm, Nhật Bình.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, headwear: 'non_quai_thao' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.headwear === 'non_quai_thao' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Nón Quai Thao (Nón ba tầm)</div>
                  <div className="text-[11px] text-[#8C7A65]">Đặc trưng Kinh Bắc, hợp Áo Tứ Thân Yếm Đào.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, headwear: 'mao_le_mismatch' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.headwear === 'mao_le_mismatch'
                      ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                      : 'border-[#E6D8C3] hover:border-amber-400'
                  }`}
                >
                  <div className="font-semibold text-xs text-amber-900">Mũ Quan Cánh Chuồn Triều Lê (Lỗi Thử Nghiệm)</div>
                  <div className="text-[11px] text-amber-700">Mũ thời Lê sơ/Trung Hưng (sẽ lệch niên đại nếu mặc với đồ Nguyễn).</div>
                  <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    ⚠ Cảnh báo lệch niên đại (Rule 3)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: JEWELRY & PROPS */}
          {activeTab === 'jewelry' && (
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-semibold text-[#881818] tracking-wider">
                Trang Sức Cổ Phong & Đạo Cụ Đi Kèm:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, jewelry: 'kieng_bac' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.jewelry === 'kieng_bac' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Vòng Kiềng Bạc Chạm Mây</div>
                  <div className="text-[11px] text-[#8C7A65]">Biểu tượng quý phái của phụ nữ quý tộc Việt xưa.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, jewelry: 'tram_phuong' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.jewelry === 'tram_phuong' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Trâm Cài Phượng Hoàng Vàng</div>
                  <div className="text-[11px] text-[#8C7A65]">Cung đình quý phái, cài búi tóc hoặc khăn vành.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, jewelry: 'quat_lua' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.jewelry === 'quat_lua' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Quạt Lụa Thêu Hoa Sen Cầm Tay</div>
                  <div className="text-[11px] text-[#8C7A65]">Đạo cụ khoan thai, tôn nét duyên dáng kinh kỳ.</div>
                </button>

                <button
                  onClick={() => setAvatarState((prev) => ({ ...prev, jewelry: 'chuoi_ngoc' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    avatarState.jewelry === 'chuoi_ngoc' ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]' : 'border-[#E6D8C3]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#430C0C]">Chuỗi Ngọc Bội Đeo Hông</div>
                  <div className="text-[11px] text-[#8C7A65]">Đĩnh đạc, tiếng ngọc va leng keng theo từng bước đi.</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: MOTIF, FABRIC & OCCASION (RULES 2 & 4 TEST) */}
          {activeTab === 'fabric_motif' && (
            <div className="space-y-5">
              {/* Dragon Pattern (Rule 2) */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#881818] tracking-wider mb-2">
                  Họa Tiết Thêu Thêu (Kiểm định Quy tắc 2 - Hoàng gia):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, dragonPattern: 'trong_dong_chim_lac' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.dragonPattern === 'trong_dong_chim_lac' 
                        ? 'border-[#881818] bg-linear-to-br from-[#FAF7F2] to-[#F3ECE0] font-semibold ring-2 ring-[#881818]/20' 
                        : 'border-[#E6D8C3] hover:border-[#881818]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[#881818] font-bold">
                      <DongSonDrum size={16} color="#881818" />
                      <span>Trống Đồng & Chim Lạc</span>
                    </div>
                    <span className="block text-[10px] text-[#6B5A47] mt-0.5">Mặt trời 14 tia & Chim Hạc Lạc Việt</span>
                  </button>

                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, dragonPattern: 'hoa_sen' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.dragonPattern === 'hoa_sen' ? 'border-[#881818] bg-[#FAF7F2] font-semibold' : 'border-[#E6D8C3]'
                    }`}
                  >
                    <div className="font-semibold text-[#430C0C]">Hoa Sen & Hạc Trắng</div>
                    <span className="block text-[10px] text-[#6B5A47] mt-0.5">Thanh khiết, tự nhiên (Hợp lệ)</span>
                  </button>

                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, dragonPattern: 'none' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.dragonPattern === 'none' ? 'border-[#881818] bg-[#FAF7F2] font-semibold' : 'border-[#E6D8C3]'
                    }`}
                  >
                    <div className="font-semibold text-[#430C0C]">Gấm Trơn Không Thêu</div>
                    <span className="block text-[10px] text-[#6B5A47] mt-0.5">Mộc mạc, giản dị</span>
                  </button>

                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, dragonPattern: 'ngu_trao_long' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.dragonPattern === 'ngu_trao_long'
                        ? 'border-rose-500 bg-rose-50 font-semibold text-rose-900'
                        : 'border-[#E6D8C3] hover:border-rose-400'
                    }`}
                  >
                    <div className="font-semibold">Ngũ Trảo Long (Rồng 5 móng)</div>
                    <span className="block text-[10px] text-rose-700 mt-0.5">✕ Lỗi Rule 2 nếu đồ thường dân</span>
                  </button>
                </div>
              </div>

              {/* Fabric Type & Spiritual Context (Rule 4) */}
              <div className="pt-3 border-t border-[#F3ECE0]">
                <h4 className="text-xs uppercase font-semibold text-[#881818] tracking-wider mb-2">
                  Chất Liệu Vải:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, fabricType: 'lua_van_phuc' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.fabricType === 'lua_van_phuc' ? 'border-[#881818] bg-[#FAF7F2] font-semibold' : 'border-[#E6D8C3]'
                    }`}
                  >
                    Lụa Tơ Tằm Vạn Phúc (Kín đáo)
                  </button>

                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, fabricType: 'gam_bao_loc' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.fabricType === 'gam_bao_loc' ? 'border-[#881818] bg-[#FAF7F2] font-semibold' : 'border-[#E6D8C3]'
                    }`}
                  >
                    Gấm Dệt Bảo Lộc (Dày dặn, trang nhã)
                  </button>

                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, fabricType: 'voan_xuyen_thau' }))}
                    className={`p-3 rounded-lg border text-left text-xs ${
                      avatarState.fabricType === 'voan_xuyen_thau'
                        ? 'border-rose-500 bg-rose-50 font-semibold text-rose-900'
                        : 'border-[#E6D8C3] hover:border-rose-400'
                    }`}
                  >
                    Voan Mỏng Xuyên Thấu (Test Rule 4)
                  </button>
                </div>
              </div>

              {/* Occasion / Context */}
              <div className="pt-3 border-t border-[#F3ECE0]">
                <h4 className="text-xs uppercase font-semibold text-[#881818] tracking-wider mb-2">
                  Bối Cảnh Điểm Đến Dự Kiến:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'le_chua_tam_linh', label: 'Đền Chùa / Tâm Linh', warnIfSheer: true },
                    { id: 'chup_anh_pho', label: 'Chụp Ảnh Phố Cổ' },
                    { id: 'da_tiec', label: 'Dạ Tiệc Cổ Phong' },
                    { id: 'cuoi_hoi', label: 'Lễ Cưới Cổ Truyền' },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() =>
                        setAvatarState((prev) => ({
                          ...prev,
                          occasionContext: occ.id as any,
                        }))
                      }
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                        avatarState.occasionContext === occ.id
                          ? 'border-[#881818] bg-[#FAF7F2] font-semibold text-[#430C0C]'
                          : 'border-[#E6D8C3]'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: 3D MEASUREMENTS & PROFILE */}
          {activeTab === 'measurements' && (
            <div className="space-y-5">
              <h4 className="text-xs uppercase font-semibold text-[#881818] tracking-wider">
                Nhập Số Đo Cơ Thể Để Tinh Chỉnh Mô Hình Avatar:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-[#430C0C] mb-1.5">Giới Tính / Phom Dáng:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAvatarState((prev) => ({ ...prev, gender: 'female' }))}
                      className={`py-2 text-xs font-semibold rounded-lg border ${
                        avatarState.gender === 'female' ? 'bg-[#881818] text-white border-[#881818]' : 'border-[#E6D8C3]'
                      }`}
                    >
                      Nữ Giới (Nhu nhã)
                    </button>
                    <button
                      onClick={() => setAvatarState((prev) => ({ ...prev, gender: 'male' }))}
                      className={`py-2 text-xs font-semibold rounded-lg border ${
                        avatarState.gender === 'male' ? 'bg-[#881818] text-white border-[#881818]' : 'border-[#E6D8C3]'
                      }`}
                    >
                      Nam Giới (Tuấn nhã)
                    </button>
                  </div>
                </div>

                {/* Skin tone */}
                <div>
                  <label className="block text-xs font-semibold text-[#430C0C] mb-1.5">Sắc Tố Da (Skin Tone):</label>
                  <select
                    value={avatarState.skinTone}
                    onChange={(e) => setAvatarState((prev) => ({ ...prev, skinTone: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs bg-white text-[#430C0C] rounded-lg border border-[#E6D8C3] outline-none"
                  >
                    <option value="fair">Trắng Sáng (Fair Tone)</option>
                    <option value="natural">Tự Nhiên Châu Á (Natural Warm)</option>
                    <option value="honey">Bánh Mật Khỏe Khoắn (Honey Tan)</option>
                    <option value="warm_olive">Ô-Liu Ấm (Warm Olive)</option>
                  </select>
                </div>

                {/* Height Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#430C0C] mb-1">
                    <span>Chiều Cao:</span>
                    <span className="text-[#881818]">{avatarState.heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="145"
                    max="195"
                    value={avatarState.heightCm}
                    onChange={(e) => setAvatarState((prev) => ({ ...prev, heightCm: parseInt(e.target.value) }))}
                    className="w-full accent-[#881818] cursor-pointer"
                  />
                </div>

                {/* Weight Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#430C0C] mb-1">
                    <span>Cân Nặng:</span>
                    <span className="text-[#881818]">{avatarState.weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={avatarState.weightKg}
                    onChange={(e) => setAvatarState((prev) => ({ ...prev, weightKg: parseInt(e.target.value) }))}
                    className="w-full accent-[#881818] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
