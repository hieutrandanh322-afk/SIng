import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  trackTitle: string;
  trackArtist: string;
  autoplayBlocked: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  handleVolumeChange: (val: number) => void;
  seekTo: (time: number) => void;
  restart: () => void;
  playAudio: () => Promise<void>;
  loadCustomFile: (file: File) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

const PRIMARY_AUDIO_URL = '/hello-vietnam.mp3';
const FALLBACK_AUDIO_URL = '/Hello%20Vietnam.mp3';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(188); // ~3:08
  const [trackTitle, setTrackTitle] = useState('Hello Vietnam');
  const [trackArtist, setTrackArtist] = useState('Phạm Quỳnh Anh');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);

  // Initialize single HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src = PRIMARY_AUDIO_URL;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('timeupdate', () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    });
    audio.addEventListener('loadedmetadata', () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    });
    audio.addEventListener('error', () => {
      // Try fallback url if primary fails
      if (audio.src.includes('hello-vietnam.mp3')) {
        audio.src = FALLBACK_AUDIO_URL;
        audio.load();
        audio.play().catch(() => {});
      }
    });

    // Strategy 1: Attempt immediate unmuted autoplay upon mounting
    const attemptImmediatePlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        userInteractedRef.current = true;
      } catch (err) {
        // Browser autoplay policy prevented unmuted audio without gesture
        setAutoplayBlocked(true);
      }
    };

    attemptImmediatePlay();

    // Strategy 2: Global capture listener on ANY user interaction anywhere on the screen
    // Modern browsers whitelist: pointerdown, click, touchstart, keydown, scroll
    const unlockAndPlay = () => {
      if (audioRef.current && !userInteractedRef.current) {
        userInteractedRef.current = true;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {});
      }
      removeGlobalListeners();
    };

    const removeGlobalListeners = () => {
      window.removeEventListener('pointerdown', unlockAndPlay, { capture: true });
      window.removeEventListener('touchstart', unlockAndPlay, { capture: true });
      window.removeEventListener('click', unlockAndPlay, { capture: true });
      window.removeEventListener('keydown', unlockAndPlay, { capture: true });
      window.removeEventListener('scroll', unlockAndPlay, { capture: true });
    };

    window.addEventListener('pointerdown', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('touchstart', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('click', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('keydown', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('scroll', unlockAndPlay, { capture: true, passive: true });

    return () => {
      removeGlobalListeners();
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playAudio = async () => {
    if (!audioRef.current) return;
    try {
      userInteractedRef.current = true;
      await audioRef.current.play();
      setIsPlaying(true);
      setAutoplayBlocked(false);
    } catch (err) {
      console.warn('Playback error:', err);
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
    audioRef.current.volume = newMuted ? 0 : volume;
  };

  const handleVolumeChange = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      playAudio();
    }
  };

  const loadCustomFile = (file: File) => {
    if (!audioRef.current) return;
    const objectUrl = URL.createObjectURL(file);
    audioRef.current.src = objectUrl;
    setTrackTitle(file.name.replace(/\.[^/.]+$/, ''));
    setTrackArtist('Tệp của bạn');
    audioRef.current.load();
    playAudio();
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTime,
        duration,
        trackTitle,
        trackArtist,
        autoplayBlocked,
        togglePlay,
        toggleMute,
        handleVolumeChange,
        seekTo,
        restart,
        playAudio,
        loadCustomFile,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
