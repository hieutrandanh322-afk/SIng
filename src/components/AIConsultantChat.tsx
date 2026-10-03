import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { VoiceStylistTu } from './VoiceStylistTu';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Compass, 
  HelpCircle, 
  BookOpen,
  MessageSquareQuote,
  Mic,
  MessageSquare
} from 'lucide-react';

interface AIConsultantChatProps {
  language: Language;
  onSelectForFitting?: (costumeId: string) => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({ 
  language,
  onSelectForFitting,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Gia môn bái kiến! Ta là Tú Gia Cổ Phong - cố vấn phục sức và điển chế y phục Việt. Bạn đang chuẩn bị xiêm y cho dịp lễ hội nào hay cần hỏi thăm điển tích, cấu trúc áo, điểm đến check-in?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfChatRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Đi Văn Miếu Quốc Tử Giám nên mặc Áo Tấc hay Giao Lĩnh?',
    'Phân biệt cấu trúc Áo Nhật Bình và Áo Đối Khâm?',
    'Tại sao Rồng 5 móng chỉ dành riêng cho Hoàng đế?',
    'Lễ cưới cổ phong thì cô dâu chú rể nên chọn trang phục gì?',
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply || 'Gia môn xin nghe, ta luôn sẵn lòng giải đáp!' },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Tú gia đang bận chút việc nghiên cứu sử liệu. Bạn hãy gửi lại câu hỏi nhé!' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      {/* MODE SELECTOR TABS (Khối nổi màu đỏ) */}
      <div className="flex items-center justify-between bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-2.5 rounded-2xl border border-[#E6C673]/60 shadow-lg text-[#FFF8ED]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'voice'
                ? 'bg-[#E6C673] text-[#430C0C] shadow-sm'
                : 'text-[#F3E7CD] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Mic size={16} />
            <span>Trợ Lý Giọng Nói Tú (Live Voice & Thời Tiết)</span>
            <span className="text-[10px] bg-black/30 text-[#E6C673] px-2 py-0.5 rounded-full uppercase font-medium border border-[#E6C673]/40">
              Giai đoạn 4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-[#E6C673] text-[#430C0C] shadow-sm'
                : 'text-[#F3E7CD] hover:bg-white/10 hover:text-white'
            }`}
          >
            <MessageSquare size={16} />
            <span>Vấn Đáp Sử Liệu Sâu (Text / Điển Chế)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#FFDF88] pr-2 font-semibold">
          <Sparkles size={14} className="text-[#E6C673]" />
          <span>Gemini 3.8 Flash Engine</span>
        </div>
      </div>

      {/* TAB 1: VOICE ASSISTANT TÚ (PROMPT 8 & 9) */}
      {activeTab === 'voice' && (
        <VoiceStylistTu 
          language={language}
          onSelectForFitting={onSelectForFitting}
        />
      )}

      {/* TAB 2: TEXT HISTORICAL CONSULTANT (Khối nổi màu đỏ) */}
      {activeTab === 'text' && (
        <div className="bg-linear-to-b from-[#881818] via-[#701010] to-[#500808] rounded-2xl border-2 border-[#E6C673]/60 shadow-2xl overflow-hidden flex flex-col h-[650px] text-[#FFF8ED]">
          {/* Header */}
          <div className="bg-[#430C0C] text-[#FAF7F2] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#881818] flex items-center justify-center border border-[#DFCEB0]">
                <Bot size={18} className="text-[#FAF7F2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif-vintage tracking-wide">
                  Tú Gia Cổ Phong (Cố Vấn Văn Phục AI)
                </h3>
                <span className="text-[10px] text-[#DFCEB0] block">
                  Trợ lý thông thái · Tri thức sử liệu Đại Việt & Phong cách Gen Z
                </span>
              </div>
            </div>

            <span className="text-[11px] text-[#DFCEB0] bg-[#651212] px-2.5 py-1 rounded-md">
              Gemini 3.8 Flash Engine
            </span>
          </div>

          {/* Quick suggestions */}
          <div className="bg-[#FAF7F2] border-b border-[#E6D8C3] p-3 overflow-x-auto whitespace-nowrap flex gap-2">
            <span className="text-xs text-[#881818] font-bold flex items-center gap-1 px-1">
              <Sparkles size={12} />
              Gợi ý hỏi:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs bg-white text-[#430C0C] hover:bg-[#881818] hover:text-white border border-[#E6D8C3] px-3 py-1 rounded-full transition-colors shrink-0 shadow-2xs font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#881818] text-[#FAF7F2] flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    Tú
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-sm ${
                    m.role === 'user'
                      ? 'bg-[#881818] text-white rounded-br-xs'
                      : 'bg-[#FAF7F2] text-[#2C241E] border border-[#E6D8C3] rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#430C0C] text-[#FAF7F2] flex items-center justify-center shrink-0 mt-1">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#881818] text-[#FAF7F2] flex items-center justify-center shrink-0 text-xs font-bold">
                  Tú
                </div>
                <div className="bg-[#FAF7F2] border border-[#E6D8C3] rounded-2xl p-3.5 text-sm text-[#6B5A47] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#881818] animate-ping" />
                  <span>Tú gia đang tra cứu điển tích văn hiến...</span>
                </div>
              </div>
            )}
            <div ref={endOfChatRef} />
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-[#E6D8C3] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi Tú Gia về trang phục, cách phối khăn vành, điển lệ cổ phong..."
              className="flex-1 bg-[#FAF7F2] border border-[#E6D8C3] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#881818]"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-[#881818] hover:bg-[#651212] disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-xs"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
