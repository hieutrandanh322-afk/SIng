import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Upload, RotateCcw, Disc3 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const AudioPlayer: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    trackTitle,
    trackArtist,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    seekTo,
    restart,
    loadCustomFile,
  } = useAudio();

  const [showExtendedControls, setShowExtendedControls] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadCustomFile(file);
    }
  };

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Elevated Red Card for Player */}
      <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#881818] via-[#751212] to-[#5C0C0C] text-[#FFF8ED] border border-[#E6C673]/60 px-3.5 py-1.5 rounded-full shadow-lg hover:border-[#E6C673] transition-all">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-[#E6C673] hover:bg-[#F3D78A] text-[#5C0C0C] flex items-center justify-center transition-transform hover:scale-105 shadow-sm shrink-0 cursor-pointer"
          title={isPlaying ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền Hello Vietnam — Phạm Quỳnh Anh'}
        >
          {isPlaying ? (
            <Pause size={14} className="fill-current" />
          ) : (
            <Play size={14} className="translate-x-0.5 fill-current" />
          )}
        </button>

        {/* Vinyl Disc Icon Spinning when playing */}
        <div className="relative shrink-0 hidden sm:block">
          <Disc3
            size={18}
            className={`text-[#E6C673] transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'opacity-70'}`}
          />
        </div>

        {/* Track Title and Artist click to expand */}
        <div
          onClick={() => setShowExtendedControls(!showExtendedControls)}
          className="flex flex-col cursor-pointer select-none text-left max-w-[130px] sm:max-w-[170px]"
        >
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-[#FFDF88] truncate">{trackTitle}</span>
            {isPlaying && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            )}
          </div>
          <span className="text-[10px] text-[#FFF8ED]/80 truncate">{trackArtist}</span>
        </div>

        {/* Mini progress bar on main bar */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-[#FFDF88]/90 font-mono">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="w-16 h-1 bg-[#5C0C0C] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
            title="Tua bài hát"
          />
        </div>

        {/* Volume button */}
        <button
          onClick={toggleMute}
          className="text-[#FFDF88] hover:text-white p-1 transition-colors cursor-pointer"
          title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
        >
          {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      {/* Extended Controls Popup on Click */}
      {showExtendedControls && (
        <div className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto z-50 w-72 bg-[#5C0C0C] text-[#FFF8ED] border-2 border-[#E6C673] rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6C673]/30">
            <div className="flex items-center gap-2">
              <Music size={16} className="text-[#FFDF88]" />
              <div className="text-xs font-bold text-[#FFDF88]">Nhạc Nền Tự Động</div>
            </div>
            <button
              onClick={() => setShowExtendedControls(false)}
              className="text-[#FFF8ED]/60 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="py-3 space-y-3">
            <div>
              <div className="text-sm font-semibold text-[#FFFDF8]">{trackTitle}</div>
              <div className="text-xs text-[#E6C673]">{trackArtist}</div>
            </div>

            {/* Seek Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#430C0C] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
              />
              <div className="flex justify-between text-[10px] text-[#FFF8ED]/70 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 pt-1">
              <button onClick={toggleMute} className="text-[#FFDF88]">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#430C0C] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
              />
              <span className="text-[10px] font-mono text-[#FFF8ED]/70 w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E6C673]/20 text-xs">
              <button
                onClick={restart}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#881818] hover:bg-[#A01C1C] text-[#FFFDF8] rounded-lg border border-[#E6C673]/40 cursor-pointer"
                title="Phát lại từ đầu"
              >
                <RotateCcw size={12} />
                <span>Phát lại</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#881818] hover:bg-[#A01C1C] text-[#FFDF88] rounded-lg border border-[#E6C673]/40 cursor-pointer"
                title="Tải lên tệp âm thanh của bạn"
              >
                <Upload size={12} />
                <span>Đổi bài hát</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
