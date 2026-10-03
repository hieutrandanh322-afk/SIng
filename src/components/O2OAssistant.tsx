import React, { useState, useRef, useEffect } from 'react';
import { PlaceLocation, Language } from '../types';
import { 
  Compass, 
  Send, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Navigation, 
  Star, 
  Phone, 
  Clock, 
  ShoppingBag,
  Building2,
  Bot
} from 'lucide-react';

interface O2OAssistantProps {
  language: Language;
  onSelectLocationOnMap?: (locationName: string) => void;
  userCoords?: { lat: number; lng: number } | null;
}

interface O2OMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  topPlaces?: any[];
  toolExecuted?: boolean;
}

export const O2OAssistant: React.FC<O2OAssistantProps> = ({
  language,
  onSelectLocationOnMap,
  userCoords,
}) => {
  const [messages, setMessages] = useState<O2OMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Xin chào! Ta là Điều phối viên Trải nghiệm Thực tế O2O của Việt Phục Remix. Bạn đang ở khu vực nào và muốn tìm tiệm thuê, may đo hay bảo tàng trưng bày cổ phục? Cứ nói cho ta biết, ta sẽ quét ngay Top 3 địa điểm tối ưu nhất gần bạn kèm thời gian di chuyển và link chỉ đường Google Maps!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Tôi đang ở Quận 1, chỗ nào thuê áo ngũ thân gần nhất?',
    'Gần phố cổ Hà Nội có bảo tàng áo dài nào uy tín?',
    'Ở Huế muốn thuê áo Nhật Bình chụp Đại Nội thì đến đâu?',
    'Tìm tiệm may đo áo Tấc đẹp nhất tại Sài Gòn',
    'Bảo tàng nào ở Hà Nội có hiện vật hoàng bào triều Nguyễn?',
  ];

  const handleSend = async (customPrompt?: string) => {
    const q = customPrompt || input;
    if (!q.trim() || isLoading) return;

    const userMsg: O2OMessage = {
      id: String(Date.now()),
      role: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/o2o-coordinator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          userLat: userCoords?.lat || 21.0285,
          userLng: userCoords?.lng || 105.8542,
        }),
      });
      const data = await response.json();

      const assistantMsg: O2OMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: data.reply || 'Dạ, điều phối viên đã tìm thấy các địa điểm phù hợp cho bạn!',
        topPlaces: data.topPlaces || [],
        toolExecuted: data.toolExecuted,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          text: 'Hệ thống định vị O2O đang bận quét dữ liệu vệ tinh, xin bạn vui lòng thử lại câu hỏi nhé!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="bg-white rounded-2xl border border-[#E6D8C3] shadow-xs overflow-hidden flex flex-col h-[580px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#430C0C] via-[#651212] to-[#881818] p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
            <Compass size={18} className="text-[#DFCEB0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-vintage font-bold text-sm sm:text-base text-[#FAF7F2]">
                Điều Phối Viên O2O (Prompt 5 · Google Maps Tool)
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                Function Calling Live
              </span>
            </div>
            <p className="text-[11px] text-[#EDE3CF]">
              Định vị thông minh · Quét Top 3 địa điểm tối ưu · Tính khoảng cách & Link Maps
            </p>
          </div>
        </div>
      </div>

      {/* Suggested chips */}
      <div className="bg-[#FAF7F2] p-2.5 border-b border-[#E6D8C3] overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#881818] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles size={11} /> Gợi ý:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] bg-white hover:bg-[#881818] text-[#430C0C] hover:text-white border border-[#E6D8C3] hover:border-[#881818] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7F2]/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[#881818] text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                <Bot size={15} />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-[#881818] text-white rounded-br-xs'
                  : 'bg-white text-[#2C241E] border border-[#E6D8C3] rounded-bl-xs shadow-2xs'
              }`}
            >
              {/* Tool Execution Notification Pill */}
              {msg.toolExecuted && (
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                  <Compass size={11} className="text-amber-600" />
                  <span>Executed: search_nearby_heritage_shops (Top 3 Selected)</span>
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-line text-xs font-sans">
                {msg.text}
              </div>

              {/* Top 3 Interactive Recommendation Cards */}
              {msg.topPlaces && msg.topPlaces.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#F3ECE0]">
                  <div className="text-[11px] font-semibold text-[#881818] flex items-center gap-1">
                    <MapPin size={12} />
                    <span>Top 3 Điểm Đến Đã Được Thẩm Định:</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {msg.topPlaces.map((place, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6D8C3] hover:border-[#881818]/50 transition-all text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-serif-vintage font-bold text-[#430C0C] text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#881818] text-white text-[10px] flex items-center justify-center font-mono">
                              #{idx + 1}
                            </span>
                            <span>{place.name}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                            <Star size={11} fill="currentColor" />
                            <span>{place.rating || '4.9'}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#6B5A47] flex items-center gap-1">
                          <MapPin size={11} className="text-[#881818] shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-[#8C7A65] flex-wrap">
                          <span className="font-semibold text-[#881818]">
                            Khoảng cách: ~{place.calculatedDistanceKm || 2.5} km ({place.travelMinutes || 10} phút)
                          </span>
                          {place.phone && <span>Hotline: {place.phone}</span>}
                        </div>

                        {place.highlightAdvice && (
                          <p className="text-[11px] text-[#430C0C] bg-white p-2 rounded-lg border border-[#E6D8C3]/70 italic">
                            💡 {place.highlightAdvice}
                          </p>
                        )}

                        <div className="pt-1 flex items-center justify-between gap-2">
                          {onSelectLocationOnMap && (
                            <button
                              onClick={() => onSelectLocationOnMap(place.name)}
                              className="text-[11px] text-[#430C0C] hover:text-[#881818] font-medium underline"
                            >
                              Xem vị trí trên danh mục
                            </button>
                          )}

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              place.name + ' ' + place.address
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] bg-[#881818] hover:bg-[#A82020] text-white px-2.5 py-1 rounded-md font-semibold transition-colors ml-auto shadow-2xs"
                          >
                            <Navigation size={11} />
                            <span>Mở chỉ đường Google Maps</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#8C7A65] bg-white p-3 rounded-xl border border-[#E6D8C3] w-fit shadow-2xs">
            <span className="w-3.5 h-3.5 border-2 border-[#881818] border-t-transparent rounded-full animate-spin" />
            <span>Điều phối viên đang kích hoạt công cụ Google Maps quét bán kính và thẩm định Top 3 địa điểm...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input row */}
      <div className="p-3 bg-white border-t border-[#E6D8C3] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập vị trí hoặc quận của bạn (Ví dụ: Tôi đang ở Quận 1, tìm tiệm thuê áo Nhật Bình...)"
          className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] text-[#430C0C] rounded-lg border border-[#E6D8C3] focus:ring-2 focus:ring-[#881818]/20 focus:border-[#881818] outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-[#881818] hover:bg-[#A82020] disabled:bg-[#881818]/40 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          <Send size={13} />
          <span>Gửi</span>
        </button>
      </div>
    </div>
  );
};
