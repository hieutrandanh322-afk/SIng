import React, { useState, useRef, useEffect } from 'react';
import { VietnameseCostume, Language } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Play, 
  Rotate3d, 
  Download, 
  BookOpen, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface MuseumGuideAssistantProps {
  language: Language;
  onOpen3DViewer: (costume: VietnameseCostume) => void;
  onOpen360Video: (costume: VietnameseCostume) => void;
  onSelectForFitting: (costumeId: string) => void;
}

interface GuideMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  costumeMatch?: VietnameseCostume;
  toolExecuted?: boolean;
}

export const MuseumGuideAssistant: React.FC<MuseumGuideAssistantProps> = ({
  language,
  onOpen3DViewer,
  onOpen360Video,
  onSelectForFitting,
}) => {
  const [messages, setMessages] = useState<GuideMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Chào mừng quý khách đến với Bảo Tàng Số Việt Phục Remix! Ta là Hướng Dẫn Viên ảo, luôn sẵn sàng kể cho bạn nghe câu chuyện ngàn năm của từng nếp áo, từ Áo Giao Lĩnh thời Lý - Trần đến Nhật Bình, Áo Tấc triều Nguyễn. Hãy hỏi ta bất cứ trang phục nào để nhận ngay video 360 độ và mô hình 3D tương tác nhé!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Kể cho tôi nghe về Áo Tấc triều Nguyễn và cho tôi xem mô hình 3D',
    'Cho tôi xem video 360 độ và mô hình Áo Nhật Bình Cung Đình',
    'Trang phục Áo Giao Lĩnh thời Lý - Trần có gì đặc biệt?',
    'Áo Viên Lĩnh thời Hậu Lê có cấu trúc như thế nào?',
    'Tìm hiểu Áo Tứ Thân & Nón Quai Thao đồng bằng Bắc Bộ',
  ];

  const handleSend = async (customPrompt?: string) => {
    const q = customPrompt || input;
    if (!q.trim() || isLoading) return;

    const userMsg: GuideMessage = {
      id: String(Date.now()),
      role: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/museum-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const data = await response.json();

      const assistantMsg: GuideMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: data.reply || 'Dạ, hướng dẫn viên xin nghe! Mời bạn tiếp tục chuyến du hành cổ phong.',
        costumeMatch: data.matchedCostume,
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
          text: 'Hướng dẫn viên đang tra cứu thư tịch cổ, bạn hãy thử lại câu hỏi nhé!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl border border-[#E6D8C3] shadow-sm flex flex-col h-[680px] overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#430C0C] via-[#651212] to-[#881818] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#881818] flex items-center justify-center font-bold text-sm shadow-md">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-vintage font-bold text-base sm:text-lg text-[#FAF7F2]">
                Hướng Dẫn Viên Bảo Tàng Số AI
              </h3>
              <span className="text-[10px] bg-[#FAF7F2]/20 text-[#DFCEB0] px-2 py-0.5 rounded font-mono">
                Prompt 4 · Function Calling
              </span>
            </div>
            <p className="text-xs text-[#DFCEB0] font-light">
              Tự động gọi hàm `get_costume_database` trích xuất video 360° & mô hình 3D
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Question Chips */}
      <div className="bg-[#FAF7F2] px-4 py-2.5 border-b border-[#E6D8C3] flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold text-[#8C7A65] shrink-0">Gợi ý hỏi:</span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sp)}
            className="text-xs text-[#430C0C] bg-white hover:bg-[#F3ECE0] px-3 py-1.5 rounded-full border border-[#E6D8C3] whitespace-nowrap transition-colors shadow-2xs shrink-0"
          >
            {sp}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF7F2]">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                  isUser ? 'bg-[#881818] text-white' : 'bg-[#430C0C] text-[#FAF7F2]'
                }`}
              >
                {isUser ? 'Bạn' : <Bot size={16} />}
              </div>

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-[#881818] text-white rounded-tr-xs'
                    : 'bg-white text-[#2C241E] rounded-tl-xs border border-[#E6D8C3] shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* If tool was executed and matched costume, display Interactive 3D & 360 Video Launchpad */}
                {!isUser && m.costumeMatch && (
                  <div className="pt-3 border-t border-[#F3ECE0] space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#881818]">
                      <Sparkles size={14} />
                      <span>Tài Nguyên Đa Phương Tiện Được Trích Xuất:</span>
                    </div>

                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6D8C3] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-[#430C0C] text-xs block">
                          {m.costumeMatch.name.vi}
                        </span>
                        <span className="text-[11px] text-[#8C7A65]">
                          {m.costumeMatch.era.vi} · {m.costumeMatch.model3d?.verticesCount || '3D Mesh Ready'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onOpen3DViewer(m.costumeMatch!)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#430C0C] hover:bg-[#651212] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                        >
                          <Rotate3d size={14} />
                          <span>Mở Mô Hình 3D Xoay</span>
                        </button>

                        <button
                          onClick={() => onOpen360Video(m.costumeMatch!)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                        >
                          <Play size={13} fill="white" />
                          <span>Xem Video 360°</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#8C7A65] pl-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#881818] animate-ping"></span>
            <span>Hướng dẫn viên đang gọi hàm `get_costume_database` và tải dữ liệu 3D...</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-[#E6D8C3] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hỏi về Áo Tấc, Nhật Bình, Giao Lĩnh... để xem mô hình 3D và video 360°..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] text-[#430C0C] rounded-xl border border-[#E6D8C3] focus:ring-2 focus:ring-[#881818]/20 focus:border-[#881818] outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 bg-[#881818] hover:bg-[#A82020] disabled:bg-[#881818]/50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Send size={15} />
          <span>Gửi</span>
        </button>
      </div>
    </div>
  );
};
