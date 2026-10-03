import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  CloudSun, 
  Thermometer, 
  CloudRain, 
  Sun, 
  Compass, 
  RotateCcw, 
  Bot, 
  User, 
  Layers, 
  Radio, 
  AlertCircle,
  HelpCircle,
  Play,
  Square
} from 'lucide-react';

interface VoiceStylistTuProps {
  language: Language;
  onSelectForFitting?: (costumeId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tu';
  text: string;
  rawText?: string;
  timestamp: string;
  weatherData?: {
    location: string;
    temperatureC: number;
    condition: string;
    isHot: boolean;
    isCold: boolean;
    isRain: boolean;
    guideline: string;
  };
  toolExecuted?: boolean;
}

export const VoiceStylistTu: React.FC<VoiceStylistTuProps> = ({
  language,
  onSelectForFitting,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'tu',
      text: 'Tú chào bạn nha! Hôm nay bạn tính xúng xính Việt phục đi đâu hay cần Tú xem thời tiết để phối set đồ cháy phố nào?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [voicePersona, setVoicePersona] = useState<'tu_ba' | 'tu_ong'>('tu_ba');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
        setSpeechTranscript('');
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript;
        }
        setSpeechTranscript(current);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setMicError(`Lỗi nhận diện: ${event.error}. Bạn có thể nhập tin nhắn hoặc thử lại.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      setSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Text-To-Speech Function
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const cleanSpoken = text
      .replace(/[*#_`~>\[\]\(\)\-\+]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpoken);
    utterance.lang = 'vi-VN';

    // Set voice persona characteristics
    if (voicePersona === 'tu_ba') {
      utterance.pitch = 1.15;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 0.88;
      utterance.rate = 1.0;
    }

    // Try finding Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(
      (v) => v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam')
    );
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      if (speechTranscript.trim()) {
        handleSendMessage(speechTranscript.trim());
      }
    } else {
      stopSpeaking();
      setMicError(null);
      setSpeechTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err: any) {
          console.warn('Recognition start error:', err);
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (_) {}
          }, 200);
        }
      }
    }
  };

  // Submit recognized transcript when finished
  useEffect(() => {
    if (!isListening && speechTranscript.trim().length > 2) {
      const recognized = speechTranscript.trim();
      setSpeechTranscript('');
      handleSendMessage(recognized);
    }
  }, [isListening]);

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || isProcessing) return;

    stopSpeaking();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/gemini/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          voicePersona,
          locationHint: 'Hà Nội',
        }),
      });

      const data = await response.json();

      const tuReply: ChatMessage = {
        id: `tu-${Date.now()}`,
        sender: 'tu',
        text: data.reply || 'Tú nghe bạn rồi, để Tú tính set đồ cho bạn nha!',
        rawText: data.rawReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        weatherData: data.weatherData,
        toolExecuted: data.toolExecuted,
      };

      setMessages((prev) => [...prev, tuReply]);

      if (autoSpeak && tuReply.text) {
        speakText(tuReply.text);
      }
    } catch (err: any) {
      console.error('Voice assistant request error:', err);
      const errorMsg: ChatMessage = {
        id: `tu-err-${Date.now()}`,
        sender: 'tu',
        text: 'Tú đang lạc giữa kho vải lụa một tẹo, bạn hỏi lại câu nữa cho Tú nghe nha!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleVoicePrompts = [
    {
      title: 'Hôm nay ở Hà Nội mặc gì đi dạo phố được Tú ơi?',
      tag: 'Thời tiết Hà Nội (<20°C)',
      icon: <Thermometer size={13} className="text-blue-500" />,
    },
    {
      title: 'Sài Gòn đang 33 độ nắng gắt thì nên mặc trang phục gì cho mát?',
      tag: 'Nắng nóng (>30°C)',
      icon: <Sun size={13} className="text-amber-500" />,
    },
    {
      title: 'Huế hôm nay mưa se lạnh 18 độ, phối đồ thế nào để vừa ấm vừa đẹp?',
      tag: 'Trời mưa & lạnh',
      icon: <CloudRain size={13} className="text-indigo-500" />,
    },
    {
      title: 'Mặc Áo Ngũ Thân đi Văn Miếu thì phối phụ kiện gì cho chuẩn bài?',
      tag: 'Văn Miếu check-in',
      icon: <Compass size={13} className="text-emerald-500" />,
    },
    {
      title: 'Vì sao rồng năm móng chỉ dành riêng cho Hoàng Đế vậy Tú?',
      tag: 'Điển chế lịch sử',
      icon: <Sparkles size={13} className="text-[#881818]" />,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E6D8C3] shadow-md overflow-hidden flex flex-col h-[740px]">
      {/* HEADER */}
      <div className="bg-linear-to-r from-[#430C0C] via-[#651212] to-[#881818] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#DFCEB0] shadow-sm">
              <Bot size={26} className="text-[#FAF7F2]" />
            </div>
            {/* Live Indicator */}
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#430C0C]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-serif-vintage tracking-wide text-white">
                Trợ Lý Giọng Nói Tú · Stylist AI
              </h2>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium tracking-wider uppercase">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-[#E6D8C3]">
              Giao tiếp giọng nói thời gian thực · Tự động kiểm tra thời tiết (Prompt 8 & 9)
            </p>
          </div>
        </div>

        {/* Persona & TTS Settings */}
        <div className="flex items-center gap-2">
          {/* Persona selector */}
          <div className="bg-black/20 rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setVoicePersona('tu_ba')}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
                voicePersona === 'tu_ba'
                  ? 'bg-[#DFCEB0] text-[#430C0C] shadow-xs'
                  : 'text-[#E6D8C3] hover:text-white'
              }`}
              title="Tú Bà: Giọng nữ Gen Z sành điệu, tươi tắn"
            >
              Tú Bà (Nữ)
            </button>
            <button
              onClick={() => setVoicePersona('tu_ong')}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium ${
                voicePersona === 'tu_ong'
                  ? 'bg-[#DFCEB0] text-[#430C0C] shadow-xs'
                  : 'text-[#E6D8C3] hover:text-white'
              }`}
              title="Tú Ông: Giọng nam trầm ấm, hóm hỉnh"
            >
              Tú Ông (Nam)
            </button>
          </div>

          {/* Auto speak toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-2 rounded-xl transition-all ${
              autoSpeak ? 'bg-[#DFCEB0]/20 text-[#DFCEB0]' : 'bg-black/20 text-white/40'
            }`}
            title={autoSpeak ? 'Tự động phát giọng đọc: Bật' : 'Tự động phát giọng đọc: Tắt'}
          >
            {autoSpeak ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* QUICK PROMPT CHIPS */}
      <div className="bg-[#FAF7F2] border-b border-[#E6D8C3] px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[#881818] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles size={12} />
          Gợi ý hỏi giọng nói:
        </span>
        {sampleVoicePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.title)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white hover:bg-[#881818] hover:text-white text-[#430C0C] border border-[#E6D8C3] hover:border-[#881818] transition-all shadow-2xs font-medium"
          >
            {p.icon}
            <span>{p.title}</span>
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F2]/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#881818] text-white'
                    : 'bg-[#DFCEB0] text-[#430C0C] border border-[#C5B495]'
                }`}
              >
                {msg.sender === 'user' ? <User size={15} /> : 'Tú'}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs transition-all ${
                    msg.sender === 'user'
                      ? 'bg-[#881818] text-white rounded-tr-xs'
                      : 'bg-white text-[#2C241E] border border-[#E6D8C3] rounded-tl-xs'
                  }`}
                >
                  <p className="font-sans text-sm sm:text-[15px]">{msg.text}</p>
                </div>

                {/* Weather Tool Badge (Prompt 9) */}
                {msg.weatherData && (
                  <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <CloudSun size={15} className="text-amber-600" />
                        <span>Kích hoạt Tool: get_current_weather("{msg.weatherData.location}")</span>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                        {msg.weatherData.temperatureC}°C · {msg.weatherData.condition}
                      </span>
                    </div>

                    <p className="text-xs text-amber-950 font-medium">
                      🎯 <span className="font-bold">Quy tắc phối đồ:</span> {msg.weatherData.guideline}
                    </p>

                    {onSelectForFitting && (
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (msg.weatherData?.isCold) {
                              onSelectForFitting('ao-giao-linh');
                            } else if (msg.weatherData?.isHot) {
                              onSelectForFitting('ao-ba-ba');
                            } else {
                              onSelectForFitting('ao-tac-nguyen');
                            }
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold bg-[#881818] hover:bg-[#651212] text-white px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                        >
                          <Layers size={13} />
                          <span>Thử set đồ này trong Phòng Thử Đồ 3D</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls below message */}
                <div
                  className={`flex items-center gap-2 text-[11px] text-[#8C7A65] ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'tu' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-[#881818] flex items-center gap-1 p-0.5 transition-colors"
                      title="Phát lại bằng giọng nói"
                    >
                      <Volume2 size={13} />
                      <span>Nghe lại</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DFCEB0] text-[#430C0C] flex items-center justify-center text-xs font-bold border border-[#C5B495]">
              Tú
            </div>
            <div className="bg-white border border-[#E6D8C3] p-3.5 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#881818] animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#881818] animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#881818] animate-bounce"></span>
              </div>
              <span className="text-xs text-[#6B5A47] font-medium">
                Tú đang đối chiếu thời tiết & suy nghĩ câu trả lời...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AUDIO WAVEFORM & LIVE LISTENING BANNER */}
      {isListening && (
        <div className="bg-[#430C0C] text-[#FAF7F2] px-4 py-3 flex items-center justify-between border-t border-[#651212] animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.6s]"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.4s]"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.7s]"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.5s]"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-duration:0.8s]"></span>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                Đang lắng nghe giọng nói của bạn...
              </span>
              <p className="text-[11px] text-[#DFCEB0] truncate max-w-md">
                {speechTranscript || 'Hãy nói vào micro: Ví dụ "Hôm nay ở Hà Nội mặc gì Tú ơi?"'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleListening}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Hoàn tất nói
          </button>
        </div>
      )}

      {/* SPEAKING BANNER */}
      {isSpeaking && !isListening && (
        <div className="bg-[#881818] text-white px-4 py-2 flex items-center justify-between border-t border-[#A22020]">
          <div className="flex items-center gap-2">
            <Radio size={15} className="animate-spin text-[#DFCEB0]" />
            <span className="text-xs font-medium">
              Tú ({voicePersona === 'tu_ba' ? 'Tú Bà' : 'Tú Ông'}) đang nói...
            </span>
          </div>
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1 text-[11px] bg-black/30 hover:bg-black/50 px-2.5 py-1 rounded-md transition-colors"
          >
            <Square size={11} />
            <span>Dừng đọc</span>
          </button>
        </div>
      )}

      {/* MIC ERROR NOTICE */}
      {micError && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-xs flex items-center gap-2 border-t border-red-200">
          <AlertCircle size={14} className="shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* INPUT CONTROLS BAR */}
      <div className="p-4 bg-white border-t border-[#E6D8C3] space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          {/* Main Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`relative p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 ${
              isListening
                ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-md ring-4 ring-emerald-200 animate-pulse'
                : 'bg-[#881818] hover:bg-[#651212] text-white active:scale-95'
            }`}
            title={isListening ? 'Bấm để hoàn tất nói' : 'Bấm để nói chuyện trực tiếp với Tú qua micro'}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Text Input Fallback */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Đang nghe giọng nói của bạn...'
                  : 'Bấm micro để nói, hoặc gõ câu hỏi cho Tú...'
              }
              disabled={isListening}
              className="w-full bg-[#FAF7F2] border border-[#E6D8C3] rounded-2xl px-4 py-3 text-sm text-[#2C241E] placeholder-[#8C7A65] focus:outline-hidden focus:ring-2 focus:ring-[#881818] focus:border-transparent transition-all"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className={`p-3.5 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
              inputText.trim() && !isProcessing
                ? 'bg-[#430C0C] hover:bg-[#2C241E] text-white shadow-xs active:scale-95'
                : 'bg-stone-100 text-stone-300 cursor-not-allowed'
            }`}
            title="Gửi câu hỏi"
          >
            <Send size={18} />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-[#8C7A65] px-1">
          <span>
            {speechRecognitionSupported
              ? '🎤 Nhấn biểu tượng Micro để nói tiếng Việt trực tiếp với Tú'
              : 'Trình duyệt chưa hỗ trợ Web Speech, bạn có thể gõ văn bản'}
          </span>
          <span className="font-semibold text-[#881818]">
            {isListening ? '● Đang ghi âm' : 'Hệ thống sẵn sàng'}
          </span>
        </div>
      </div>
    </div>
  );
};
