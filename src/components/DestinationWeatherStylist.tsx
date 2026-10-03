import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Compass, 
  CloudSun, 
  MapPin, 
  Sparkles, 
  Layers, 
  Bot, 
  ExternalLink, 
  Scissors, 
  Smile, 
  Gem,
  CheckCircle2
} from 'lucide-react';

interface DestinationWeatherStylistProps {
  language: Language;
  onApplyOutfitSuggestion: (costumeId: string, destination: string) => void;
}

export const DestinationWeatherStylist: React.FC<DestinationWeatherStylistProps> = ({
  language,
  onApplyOutfitSuggestion,
}) => {
  const destinations = [
    {
      id: 'van-mieu',
      name: 'Văn Miếu - Quốc Tử Giám (Hà Nội)',
      category: 'Không gian học thuật & tôn nghiêm',
      suggestedCostumeId: 'ao-tac-nguyen',
      costumeName: 'Áo Tấc Ngũ Thân hoặc Áo Dài Ngũ Thân Tay Chẽn',
      idealWeather: 'Mát mẻ, nắng nhẹ mùa thu hoặc se lạnh mùa xuân',
      hairStyle: 'Nam đội khăn đóng chữ Nhân; Nữ vấn khăn trần hoặc tóc dài suôn mượt.',
      makeup: 'Trang điểm trong suốt tự nhiên, chân mày lá liễu mềm mại, môi son cánh sen phớt.',
      jewelry: 'Vòng kiềng bạc trơn hoặc quạt xếp nan tre, giày da hoặc hài cườm đen.',
      why: 'Văn Miếu là cái nôi khoa cử nho nhã, đòi hỏi trang phục ngũ thân nghiêm cẩn, kín cổng cao tường, biểu trưng cho ngũ thường.',
    },
    {
      id: 'hoang-thanh',
      name: 'Hoàng Thành Thăng Long (Hà Nội)',
      category: 'Di tích hoàng thành ngàn năm',
      suggestedCostumeId: 'ao-giao-linh',
      costumeName: 'Áo Giao Lĩnh hoặc Áo Viên Lĩnh (Thời Lý - Trần - Lê)',
      idealWeather: 'Trời quang mây tạnh, gió thu kinh thành',
      hairStyle: 'Xõa tóc cài trâm bạc hoặc búi tóc cao đính hoa đào.',
      makeup: 'Điểm xuyết chấm son son nụ đào giữa trán (phong cách mỹ nhân thời Trần), viền mắt đen tự nhiên.',
      jewelry: 'Đai thắt lưng lụa thả dài, ngọc bội hòa điền, hài cong nhọn đầu.',
      why: 'Tôn vinh cội nguồn văn minh Đại Việt thời Lý-Trần, phù hợp chụp ảnh tại bậc đá rồng Đoan Môn.',
    },
    {
      id: 'dai-noi-hue',
      name: 'Đại Nội Huế & Lăng Tẩm Triều Nguyễn (Huế)',
      category: 'Quần thể cung đình cố đô',
      suggestedCostumeId: 'ao-nhat-binh',
      costumeName: 'Áo Nhật Bình hoặc Áo Tấc thêu hoa văn cung đình',
      idealWeather: 'Nắng ấm hoặc mưa phùn lãng đãng xứ Huế',
      hairStyle: 'Khăn vành dây xanh lam hoặc lục viền kim tuyến, búi tóc cài trâm phượng.',
      makeup: 'Môi đỏ son chu sa tươi tắn, chân mày thanh tú, gò má phớt hồng đoan trang.',
      jewelry: 'Vòng kiềng chạm mây lành, trâm cài ngũ lạt, quạt lụa thêu chim trĩ hoàng cung.',
      why: 'Đại Nội là không gian chuẩn mực nhất để khoác lên bộ Nhật Bình quý phái, hòa mình vào không gian rêu phong cổ kính.',
    },
    {
      id: 'hoi-an',
      name: 'Phố Cổ Hội An (Quảng Nam)',
      category: 'Thương cảng di sản & đèn lồng',
      suggestedCostumeId: 'ao-doi-kham',
      costumeName: 'Áo Đối Khâm hoặc Áo Dài Ngũ Thân lụa mềm',
      idealWeather: 'Hoàng hôn rực rỡ, gió sông Hoài mát lành',
      hairStyle: 'Tóc búi lơi cài hoa lài tươi, vài lọn tóc buông rủ bay trong gió.',
      makeup: 'Tông màu quả mơ hoặc cam đất nhẹ nhàng, son bóng tự nhiên.',
      jewelry: 'Quạt tròn lụa tiêu tương, hoa tai ngọc bích, guốc mộc mộc mạc.',
      why: 'Đường phố Hội An nhiều màu vàng nghệ và hoa giấy, tà áo Đối Khâm bay bổng nhiều lớp layer cực kỳ ăn ảnh khi phố lên đèn.',
    },
    {
      id: 'chua-tran-quoc',
      name: 'Chùa Trấn Quốc & Hồ Tây (Hà Nội)',
      category: 'Chốn thiền môn thanh tịnh',
      suggestedCostumeId: 'ao-tac-nguyen',
      costumeName: 'Áo Tấc lụa trơn hoặc Áo Dài Lam kín đáo',
      idealWeather: 'Sáng sớm sương mai hoặc chiều tà',
      hairStyle: 'Búi tóc gọn gàng sau gáy, không xõa buông xõa rườm rà.',
      makeup: 'Mộc mạc, gần như không trang điểm đậm, thể hiện tâm thế thanh tịnh.',
      jewelry: 'Vòng chuỗi hạt bồ đề hoặc trầm hương thanh nhã.',
      why: 'Nơi tôn nghiêm ngàn năm bên sóng nước Tây Hồ, ưu tiên màu sắc trầm ấm, vải dày dặn lịch thiệp.',
    },
  ];

  const [selectedDestId, setSelectedDestId] = useState(destinations[0].id);
  const [currentWeather, setCurrentWeather] = useState('Hà Nội 18°C, se lạnh đầu xuân, có gió nhẹ');
  const [customDestination, setCustomDestination] = useState('');
  const [aiStylistResponse, setAiStylistResponse] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const activeDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];

  const handleAskAiStylist = async () => {
    setIsConsulting(true);
    try {
      const response = await fetch('/api/gemini/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Tôi dự định đi ${customDestination || activeDest.name}. Thời tiết hiện tại: ${currentWeather}. Hãy tư vấn cách phối đồ Việt phục, cách layering áo lót/áo khoác, kiểu tóc và makeup phù hợp nhất.`,
          destination: customDestination || activeDest.name,
          weather: currentWeather,
          chosenCostume: activeDest.costumeName,
        }),
      });
      const data = await response.json();
      setAiStylistResponse(data.reply);
    } catch (err) {
      console.error(err);
      setAiStylistResponse('Hôm nay thời tiết se lạnh, bạn nên chọn mặc áo Tấc bằng gấm Bảo Lộc và khoác thêm áo Đối Khâm mỏng bên ngoài để vừa ấm áp vừa bay bổng khi dạo bước nhé!');
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E6D8C3] space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#881818] uppercase tracking-wider">
          <Compass size={16} />
          <span>Giai đoạn 4 · Cố Vấn Điểm Đến & Thời Tiết Thực Tế</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-vintage font-bold text-[#430C0C]">
          Gợi Ý Phục Sức Theo Điểm Đến & Thời Tiết
        </h2>
        <p className="text-xs text-[#6B5A47]">
          Chọn di tích hoặc nhập địa điểm thực tế cùng điều kiện thời tiết để được định hướng trang phục, kiểu tóc, phong cách trang điểm và phụ kiện chuẩn cảnh quan di sản.
        </p>
      </div>

      {/* Main Grid: Selection Left, Advice Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Destinations & Weather Input */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E6D8C3] space-y-5">
          <h3 className="text-sm font-bold text-[#430C0C] uppercase tracking-wider">
            1. Chọn Hoặc Nhập Điểm Đến:
          </h3>

          <div className="space-y-2">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestId(dest.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedDestId === dest.id
                    ? 'bg-[#FAF7F2] border-[#881818] ring-1 ring-[#881818]'
                    : 'border-[#E6D8C3] hover:border-[#881818]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#430C0C]">{dest.name}</span>
                  {selectedDestId === dest.id && <CheckCircle2 size={15} className="text-[#881818]" />}
                </div>
                <span className="text-[11px] text-[#8C7A65] block mt-0.5">{dest.category}</span>
              </button>
            ))}
          </div>

          {/* Weather input */}
          <div className="space-y-2 pt-3 border-t border-[#F3ECE0]">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#430C0C]">
              <CloudSun size={15} className="text-[#881818]" />
              <span>Thời Tiết Hiện Tại / Dự Báo:</span>
            </label>
            <input
              type="text"
              value={currentWeather}
              onChange={(e) => setCurrentWeather(e.target.value)}
              placeholder="Ví dụ: Nắng ráo 26 độ C, gió thu nhẹ..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] text-[#430C0C] rounded-lg border border-[#E6D8C3] outline-none"
            />
          </div>

          <button
            onClick={handleAskAiStylist}
            disabled={isConsulting}
            className="w-full py-2.5 bg-[#430C0C] hover:bg-[#651212] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isConsulting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Tú Gia Cổ Phong đang luận giải thời tiết...</span>
              </>
            ) : (
              <>
                <Bot size={15} />
                <span>Hỏi Cố Vấn Thời Tiết & Điểm Đến (Gemini)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Detailed Curation Guide */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Destination Curation Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6D8C3] space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F3ECE0] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#881818] tracking-widest block">
                  Phục Sức Phù Hợp Nhất
                </span>
                <h3 className="text-xl font-serif-vintage font-bold text-[#430C0C]">
                  {activeDest.costumeName}
                </h3>
              </div>

              <button
                onClick={() => onApplyOutfitSuggestion(activeDest.suggestedCostumeId, activeDest.name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <Layers size={13} />
                <span>Mặc lên Avatar</span>
              </button>
            </div>

            <p className="text-xs text-[#2C241E] leading-relaxed bg-[#FAF7F2] p-3 rounded-lg border border-[#E6D8C3]">
              <strong>Lý do lựa chọn:</strong> {activeDest.why}
            </p>

            {/* Hair, Makeup, Jewelry Triad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#881818]">
                  <Scissors size={14} />
                  <span>Kiểu Tóc Gợi Ý</span>
                </div>
                <p className="text-[11px] text-[#430C0C] leading-relaxed">
                  {activeDest.hairStyle}
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#881818]">
                  <Smile size={14} />
                  <span>Phong Cách Makeup</span>
                </div>
                <p className="text-[11px] text-[#430C0C] leading-relaxed">
                  {activeDest.makeup}
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6D8C3] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#881818]">
                  <Gem size={14} />
                  <span>Trang Sức Kèm Theo</span>
                </div>
                <p className="text-[11px] text-[#430C0C] leading-relaxed">
                  {activeDest.jewelry}
                </p>
              </div>
            </div>
          </div>

          {/* AI Consultant Live Output */}
          {aiStylistResponse && (
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DFCEB0] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#430C0C]">
                <Bot size={16} className="text-[#881818]" />
                <span>Lời Dặn Của Tú Gia Cổ Phong (Cố Vấn AI):</span>
              </div>
              <p className="text-xs text-[#2C241E] leading-relaxed italic bg-white p-3.5 rounded-xl border border-[#E6D8C3]">
                {aiStylistResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
