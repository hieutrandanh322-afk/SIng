import React, { useState } from 'react';
import { AvatarState, CulturalCheckResult, Language } from '../types';
import { CULTURAL_SAFEGUARD_RULES, evaluateLocalSafeguard } from '../data/culturalRules';
import { 
  DongSonDrum, 
  LacBird, 
  DongSonBorderStrip 
} from './HeritageMotifs';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  RotateCcw,
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';

interface CulturalSafeguardPanelProps {
  language: Language;
  avatarState: AvatarState;
  setAvatarState: React.Dispatch<React.SetStateAction<AvatarState>>;
  onGoToWardrobe: () => void;
  onGoToLookbook: () => void;
}

export const CulturalSafeguardPanel: React.FC<CulturalSafeguardPanelProps> = ({
  language,
  avatarState,
  setAvatarState,
  onGoToWardrobe,
  onGoToLookbook,
}) => {
  const localResult = evaluateLocalSafeguard(avatarState);
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiCheckResult, setAiCheckResult] = useState<CulturalCheckResult | null>(null);

  const activeResult = aiCheckResult || localResult;

  // Run deep Gemini AI Safeguard analysis (Prompt 2)
  const handleRunAiSafeguard = async () => {
    setIsAiChecking(true);
    try {
      const response = await fetch('/api/gemini/cultural-safeguard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedItems: {
            garment: avatarState.selectedGarmentId,
            garmentColor: avatarState.selectedGarmentColor,
            lowerGarment: avatarState.lowerGarment,
            headwear: avatarState.headwear,
            jewelry: avatarState.jewelry,
            motif: avatarState.dragonPattern,
            fabric: avatarState.fabricType,
          },
          occasion: avatarState.occasionContext,
        }),
      });
      const data = await response.json();
      setAiCheckResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiChecking(false);
    }
  };

  // Preset quick test scenarios to demonstrate safeguards
  const applyPreset = (type: 'perfect' | 'short_error' | 'dragon_error' | 'era_error' | 'sheer_error') => {
    setAiCheckResult(null);
    if (type === 'perfect') {
      setAvatarState((prev) => ({
        ...prev,
        selectedGarmentId: 'ao-nhat-binh',
        selectedGarmentColor: '#881818',
        lowerGarment: 'quan_bach_lap',
        headwear: 'van_tran',
        jewelry: 'kieng_bac',
        dragonPattern: 'hoa_sen',
        fabricType: 'gam_bao_loc',
        occasionContext: 'da_tiec',
      }));
    } else if (type === 'short_error') {
      setAvatarState((prev) => ({
        ...prev,
        selectedGarmentId: 'ao-tac-nguyen',
        selectedGarmentColor: '#881818',
        lowerGarment: 'quan_short_loi', // Violation!
        headwear: 'khan_dong',
        dragonPattern: 'none',
        fabricType: 'lua_van_phuc',
      }));
    } else if (type === 'dragon_error') {
      setAvatarState((prev) => ({
        ...prev,
        selectedGarmentId: 'ao-tu-than-yem-dao',
        selectedGarmentColor: '#FFD700',
        dragonPattern: 'ngu_trao_long', // Violation!
        lowerGarment: 'vay_quan_den',
      }));
    } else if (type === 'era_error') {
      setAvatarState((prev) => ({
        ...prev,
        selectedGarmentId: 'ao-nhat-binh', // Nguyen dynasty
        headwear: 'mao_le_mismatch', // Le dynasty!
        lowerGarment: 'quan_bach_lap',
      }));
    } else if (type === 'sheer_error') {
      setAvatarState((prev) => ({
        ...prev,
        selectedGarmentId: 'ao-doi-kham',
        fabricType: 'voan_xuyen_thau', // Sheer!
        occasionContext: 'le_chua_tam_linh', // Sacred temple!
        lowerGarment: 'quan_bach_lap',
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Dong Son Motifs */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#430C0C] via-[#651212] to-[#881818] text-white p-8 rounded-2xl shadow-lg border border-[#A82020]/30">
        {/* Họa tiết Trống Đồng & Chim Hạc bảo vệ di sản */}
        <div className="absolute -right-12 -top-12 text-[#FAF7F2] opacity-15 pointer-events-none">
          <DongSonDrum size={320} color="currentColor" />
        </div>
        <div className="absolute bottom-4 right-24 text-[#DFCEB0] opacity-25 pointer-events-none hidden sm:block">
          <LacBird size={90} direction="left" color="currentColor" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs tracking-widest text-[#DFCEB0] uppercase font-semibold">
            <LacBird size={16} color="#DFCEB0" />
            <span>Màng Lọc Di Sản · Cultural Safeguard · Prompt 2</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-vintage tracking-tight text-[#FAF7F2]">
            Người Gác Đền Di Sản (Cultural Safeguard)
          </h2>
          <p className="text-xs sm:text-sm text-[#EDE3CF] leading-relaxed font-light">
            Hệ thống bảo vệ văn hóa thông minh ứng dụng AI để phân tích sự phối hợp phục sức của người dùng, phát hiện và chấn chỉnh kịp thời các sai lệch lịch sử về hạ bộ, phẩm trật hoàng gia, niên đại và thuần phong mỹ tục.
          </p>
        </div>

        {/* Diềm hoa văn Đông Sơn ở mép dưới */}
        <div className="absolute bottom-0 left-0 right-0">
          <DongSonBorderStrip height={6} color="#DFCEB0" className="opacity-40" />
        </div>
      </div>

      {/* Test Scenarios Quick Simulator Bar (Khối nổi màu đỏ) */}
      <div className="bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-5 rounded-2xl border border-[#E6C673]/60 shadow-lg text-[#FFF8ED] space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#FFDF88]">
          <span>Thử nghiệm nhanh các tình huống kiểm duyệt (Test Bench Simulator):</span>
          <span className="text-[11px] text-[#F3E2C8]">Bấm vào để nạp phối đồ mẫu</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => applyPreset('perfect')}
            className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-400/50 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
          >
            ✓ Thử Bộ Chuẩn Mực 100%
          </button>
          <button
            onClick={() => applyPreset('short_error')}
            className="px-3 py-1.5 bg-[#420707] hover:bg-[#5a0c0c] text-rose-200 border border-rose-400/50 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
          >
            ✕ Test Lỗi 1: Quần Short Cộc
          </button>
          <button
            onClick={() => applyPreset('dragon_error')}
            className="px-3 py-1.5 bg-[#420707] hover:bg-[#5a0c0c] text-rose-200 border border-rose-400/50 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
          >
            ✕ Test Lỗi 2: Rồng 5 Móng Hoàng Quyền
          </button>
          <button
            onClick={() => applyPreset('era_error')}
            className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-400/50 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
          >
            ⚠ Test Lỗi 3: Mão Lê x Áo Nguyễn
          </button>
          <button
            onClick={() => applyPreset('sheer_error')}
            className="px-3 py-1.5 bg-[#420707] hover:bg-[#5a0c0c] text-rose-200 border border-rose-400/50 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
          >
            ✕ Test Lỗi 4: Vải Xuyên Thấu Nơi Đền Chùa
          </button>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          activeResult.status === 'Pass'
            ? 'bg-emerald-50/90 border-emerald-300'
            : 'bg-rose-50/90 border-rose-300'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                activeResult.status === 'Pass'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white animate-pulse'
              }`}
            >
              {activeResult.status === 'Pass' ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    activeResult.status === 'Pass'
                      ? 'bg-emerald-200 text-emerald-950'
                      : 'bg-rose-200 text-rose-950'
                  }`}
                >
                  Kết quả: {activeResult.status === 'Pass' ? 'ĐẠT (PASS) — ĐÈN XANH' : 'LỆCH CHUẨN (FAIL) — ĐÈN ĐỎ'}
                </span>
                <span className="text-xs font-mono font-semibold text-[#6B5A47]">
                  [{activeResult.error_code}]
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif-vintage text-[#430C0C]">
                {activeResult.status === 'Pass' ? 'Phục Sức Tôn Nghiêm Chuẩn Sử' : 'Phát Hiện Sai Lệch Văn Hóa Cần Điều Chỉnh'}
              </h3>
              <p className="text-xs text-[#2C241E] leading-relaxed max-w-2xl font-medium">
                {activeResult.user_message}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={handleRunAiSafeguard}
              disabled={isAiChecking}
              className="px-4 py-2.5 bg-[#430C0C] hover:bg-[#651212] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              {isAiChecking ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang thẩm định AI...</span>
                </>
              ) : (
                <>
                  <Bot size={15} />
                  <span>Giám Định Chuyên Sâu (Prompt 2 AI)</span>
                </>
              )}
            </button>

            {activeResult.status === 'Pass' && (
              <button
                onClick={onGoToLookbook}
                className="px-4 py-2 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles size={14} />
                <span>Sinh Thẻ Lookbook Đẹp</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The 4 Core Rules Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif-vintage font-bold text-[#430C0C] flex items-center gap-2">
          <BookOpen size={18} className="text-[#881818]" />
          <span>Chi Tiết Bảng Quy Tắc Di Sản (Knowledge Base 4 Rules)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CULTURAL_SAFEGUARD_RULES.map((rule) => {
            const check = activeResult.detailedRules?.find((r) => r.ruleId === rule.id);
            const passed = check ? check.passed : true;

            return (
              <div
                key={rule.id}
                className={`p-5 rounded-2xl border transition-all ${
                  passed
                    ? 'bg-linear-to-b from-[#801414] via-[#6B1010] to-[#480808] border-[#E6C673]/60 text-[#FFF8ED] shadow-lg'
                    : 'bg-linear-to-b from-[#881818] via-[#751212] to-[#550808] border-rose-400 text-[#FFF8ED] ring-2 ring-rose-500/50 shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-[#FFDF88]">{rule.title[language]}</h4>
                  {passed ? (
                    <CheckCircle2 size={18} className="text-[#FFDF88] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                  )}
                </div>

                <p className="text-xs text-[#F5ECD8] font-medium leading-relaxed mb-3">
                  {rule.summary[language]}
                </p>

                {/* Specific feedback if checked */}
                {check && (
                  <div
                    className={`p-2.5 rounded-lg text-xs mb-3 ${
                      check.passed
                        ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                        : 'bg-rose-950/90 text-rose-200 border border-rose-400 font-semibold'
                    }`}
                  >
                    {check.feedback}
                  </div>
                )}

                {/* Historical context quote */}
                <div className="text-[11px] text-[#FAF0DE] bg-[#3B0606] p-2.5 rounded-lg border border-[#E6C673]/30 italic">
                  <strong className="text-[#FFDF88]">Sử liệu ghi chép:</strong> {rule.historicalContext[language]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Micro-learning footnote */}
      <div className="p-4 bg-[#F6F1E7] rounded-xl border border-[#E6D8C3] flex items-center justify-between text-xs text-[#430C0C]">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-[#881818]" />
          <span>
            <strong>Micro-learning Di Sản:</strong> Tôn trọng phom dáng cổ truyền là cách giữ gìn bản sắc Đại Việt trong dòng chảy thời trang đương đại.
          </span>
        </div>
        <button
          onClick={onGoToWardrobe}
          className="inline-flex items-center gap-1 font-semibold text-[#881818] hover:text-[#430C0C]"
        >
          <span>Quay lại phòng thử đồ</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
