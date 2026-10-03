import React from 'react';
import { Volume2, Music, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const AudioAutoplayPrompt: React.FC = () => {
  const { isPlaying, autoplayBlocked, playAudio } = useAudio();

  // If already playing or not blocked, do not show
  if (isPlaying || !autoplayBlocked) return null;

  return (
    <div
      onClick={() => playAudio()}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-[#881818] via-[#A01C1C] to-[#881818] text-[#FFFDF8] border-2 border-[#E6C673] shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all animate-bounce"
      title="Nhấn để bật nhạc nền"
    >
      <div className="w-8 h-8 rounded-full bg-[#E6C673] text-[#5C0C0C] flex items-center justify-center shrink-0 shadow-md">
        <Volume2 size={18} className="animate-pulse" />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFDF88]">
          <Music size={13} />
          <span>BẬT NHẠC NỀN VIỆT NAM</span>
          <Sparkles size={12} className="text-[#FFDF88]" />
        </div>
        <div className="text-[11px] text-[#FFF8ED]/90">
          Chạm vào đây để lắng nghe <strong>Hello Vietnam</strong> (Phạm Quỳnh Anh)
        </div>
      </div>
    </div>
  );
};
