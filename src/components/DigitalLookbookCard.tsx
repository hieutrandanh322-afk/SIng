import React, { useState, useEffect, useRef } from 'react';
import { AvatarState, Language, LookbookCardData, LookbookTrackItem } from '../types';
import { VIET_COSTUMES } from '../data/vietCostumes';
import { 
  DongSonDrum, 
  LacBird, 
  DongSonBorderStrip, 
  HeritageCorner 
} from './HeritageMotifs';
import { 
  Sparkles, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Flame, 
  ShieldCheck, 
  Bot, 
  RefreshCw, 
  Award, 
  Layers, 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Tv, 
  Film, 
  Compass, 
  Video, 
  Radio, 
  Eye, 
  CheckCircle2, 
  Zap, 
  Hash, 
  ExternalLink 
} from 'lucide-react';

interface DigitalLookbookCardProps {
  language: Language;
  avatarState: AvatarState;
  onGoToWardrobe: () => void;
}

const INTERNAL_TRACKS: LookbookTrackItem[] = [
  {
    id: 'hello-vietnam-lofi',
    title: 'Hello Vietnam (Cổ Phong Lofi Remix)',
    artist: 'Việt Phục Remix feat. Đàn Tranh',
    genre: 'Nhã Nhạc Lofi / Chillhop',
    duration: '2:45',
    description: 'Giai điệu Hello Vietnam mượt mà trên nền đàn tranh và sáo trúc lãng đãng.',
  },
  {
    id: 'hao-khi-thang-long',
    title: 'Hào Khí Thăng Long (Epic Orchestral)',
    artist: 'Đại Việt Philharmonic',
    genre: 'Epic Trống Đồng / Cinematic',
    duration: '3:15',
    description: 'Trống đồng Đông Sơn kết hợp dàn giao hưởng bi tráng, hào hùng khí thế Đại Việt.',
  },
  {
    id: 'kinh-ky-cyberpunk',
    title: 'Kinh Kỳ Cyberpunk 2026',
    artist: 'Cổ Phong Synthwave feat. Đàn Bầu',
    genre: 'Cyberpunk / Future Bass',
    duration: '2:30',
    description: 'Tiếng đàn bầu điện tử réo rắt trên nền beat synthwave thời thượng.',
  },
  {
    id: 'duyen-dang-hoi-an',
    title: 'Duyên Dáng Hội An (Sáo Trúc Deep House)',
    artist: 'Hoài Phố Chill Collective',
    genre: 'Sáo Trúc Deep House',
    duration: '3:05',
    description: 'Sáo trúc ngân vang cùng tiếng sóng nước Hoài Giang và nhịp beat bay bổng.',
  },
  {
    id: 'da-co-chillhop',
    title: 'Dạ Cổ Hoài Lang (Acoustic Tơ Đồng)',
    artist: 'Tơ Đồng Phương Nam',
    genre: 'Acoustic Cải Lương Neo-Tradition',
    duration: '2:50',
    description: 'Ngón đờn kìm và đàn tranh mộc mạc lắng đọng tâm tư hoài niệm.',
  },
];

export const DigitalLookbookCard: React.FC<DigitalLookbookCardProps> = ({
  language,
  avatarState,
  onGoToWardrobe,
}) => {
  const [lookbookData, setLookbookData] = useState<LookbookCardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<'tiktok' | 'instagram' | 'link' | null>(null);
  const [showHUDOverlay, setShowHUDOverlay] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<LookbookTrackItem>(INTERNAL_TRACKS[0]);
  const [socialTab, setSocialTab] = useState<'tiktok' | 'instagram'>('tiktok');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const selectedCostume = VIET_COSTUMES.find((c) => c.id === avatarState.selectedGarmentId) || VIET_COSTUMES[0];

  const generateLookbook = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/lookbook-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeDetails: {
            name: selectedCostume.name.vi,
            era: selectedCostume.era.vi,
            lowerGarment: avatarState.lowerGarment,
            headwear: avatarState.headwear,
            jewelry: avatarState.jewelry,
            pattern: avatarState.dragonPattern,
          },
          colorsChosen: [avatarState.selectedGarmentColor],
          userProfile: {
            height: avatarState.heightCm,
            weight: avatarState.weightKg,
            skinTone: avatarState.skinTone,
          },
        }),
      });

      const data = await response.json();
      setLookbookData(data);
      if (data.matched_track) {
        setSelectedTrack(data.matched_track);
      }
    } catch (err) {
      console.error(err);
      // High-quality fallback preset
      setLookbookData({
        collectionName: 'Nhã Nhạc Cyberpunk 2026',
        heritageScore: 9.8,
        remixScore: 9.5,
        colorHarmony: 'Hỏa sinh Thổ: Sắc Đỏ Chu Sa quyện hòa cùng Lụa Trắng Bạch Lạp tạo thế uy quyền mà thanh nhã.',
        review: 'Visual kinh kỳ đỉnh nóc kịch trần! Phối đồ chuẩn sử nhưng mang năng lượng thời thượng không góc chết của Gen Z.',
        elementMatch: 'Hỏa vượng sinh Phú Quý',
        trendingKeywords: ['#VietPhucRemix', '#NhatBinhVibes', '#CoPhongGenZ', '#HeritageLookbook'],
        aestheticVibe: 'Imperial Haute Couture',
        tiktok_caption: 'Trời ơi set đồ này keo lỳ chưa từng thấy luôn á! 10 điểm không có nhưng cho visual cung đình này nha. Các bạn đã thử phối Việt phục trên app Việt Phục Remix chưa, vào chấm điểm cùng mình ngay đi nè!',
        instagram_caption: 'Một thoáng phong hoa ngàn năm của xứ Kinh Kỳ thu nhỏ trong từng nếp áo Nhật Bình đỏ chu sa. Khi truyền thống không chỉ nằm trong viện bảo tàng, mà sống động và kiêu hãnh giữa dòng chảy thời trang đương đại.',
        hashtags: ['#VietPhucRemix', '#AoNhatBinh', '#GenZCulture', '#OOTD', '#CoPhongHauteCouture', '#VietnamHeritage'],
        vibe: 'Thơ mộng hòa lẫn quý phái hoàng cung',
        instrumentation: 'Đàn tranh mix beat lo-fi, điểm xuyết sáo trúc du dương',
        recommended_track_style: 'Một bản remix lo-fi của Hello Vietnam kết hợp đàn tranh acoustic nhẹ nhàng',
        matched_track: INTERNAL_TRACKS[0],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateLookbook();
  }, [avatarState.selectedGarmentId, avatarState.selectedGarmentColor]);

  // Melodic Ambient Sound Synthesis for Track Preview
  const playSynthesizedTrack = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Pentatonic Scale (Hò, Xự, Xang, Xê, Cống in Vietnamese traditional scale)
      const pentatonicFreqs = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
      let step = 0;

      oscillatorIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = pentatonicFreqs[step % pentatonicFreqs.length];
        step = (step + Math.floor(Math.random() * 3) + 1) % pentatonicFreqs.length;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      }, 350);

      setIsPlayingMusic(true);
    } catch (e) {
      console.warn('Audio synthesis notice:', e);
    }
  };

  const stopSynthesizedTrack = () => {
    if (oscillatorIntervalRef.current) {
      clearInterval(oscillatorIntervalRef.current);
      oscillatorIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlayingMusic(false);
  };

  const toggleMusicPlayback = () => {
    if (isPlayingMusic) {
      stopSynthesizedTrack();
    } else {
      playSynthesizedTrack();
    }
  };

  useEffect(() => {
    return () => {
      stopSynthesizedTrack();
    };
  }, []);

  // Copy TikTok Caption
  const handleCopyTikTok = () => {
    const text = `${lookbookData?.tiktok_caption || 'Xem outfit Việt phục của mình nè!'} \n\n${(lookbookData?.hashtags || lookbookData?.trendingKeywords || ['#VietPhucRemix', '#OOTD']).join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedType('tiktok');
    setTimeout(() => setCopiedType(null), 3000);
  };

  // Copy Instagram Caption
  const handleCopyInstagram = () => {
    const text = `${lookbookData?.instagram_caption || 'Nét đẹp Việt phục đương đại.'} \n\n${(lookbookData?.hashtags || lookbookData?.trendingKeywords || ['#VietPhucRemix', '#GenZCulture']).join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedType('instagram');
    setTimeout(() => setCopiedType(null), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920; // 9:16 Social Story Format
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGradient.addColorStop(0, '#2A0606');
    bgGradient.addColorStop(0.4, '#430C0C');
    bgGradient.addColorStop(1, '#1A0404');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Gold borders
    ctx.strokeStyle = '#DFCEB0';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1840);
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, 970, 1810);

    // Header Branding
    ctx.fillStyle = '#DFCEB0';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIỆT PHỤC REMIX', 540, 140);

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#E6D8C3';
    ctx.fillText('THẺ LOOKBOOK KỸ THUẬT SỐ · LEVEL 99 HAUTE COUTURE', 540, 185);

    // Collection Name
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillStyle = '#FAF7F2';
    ctx.fillText(lookbookData?.collectionName || 'Di Sản Khởi Sắc', 540, 290);

    ctx.font = '32px sans-serif';
    ctx.fillStyle = '#DFCEB0';
    ctx.fillText(`${selectedCostume.name.vi} · ${selectedCostume.era.vi}`, 540, 345);

    // HUD Stats Box (HP & MP Bars)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(100, 420, 880, 220);
    ctx.strokeStyle = '#881818';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 420, 880, 220);

    // Heritage HP Bar
    const hScore = lookbookData?.heritageScore || 9.8;
    ctx.textAlign = 'left';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#F87171';
    ctx.fillText(`HERITAGE [HP]: ${hScore}/10 - TÔN TRỌNG DI SẢN`, 140, 480);
    ctx.fillStyle = '#3F1616';
    ctx.fillRect(140, 500, 800, 24);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(140, 500, (800 * hScore) / 10, 24);

    // Remix MP Bar
    const rScore = lookbookData?.remixScore || 9.5;
    ctx.fillStyle = '#60A5FA';
    ctx.fillText(`REMIX [MP]: ${rScore}/10 - SÁNG TẠO ĐƯƠNG ĐẠI`, 140, 570);
    ctx.fillStyle = '#16233B';
    ctx.fillRect(140, 590, 800, 24);
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(140, 590, (800 * rScore) / 10, 24);

    // BGM Soundtrack Matcher Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(100, 700, 880, 160);
    ctx.strokeStyle = '#DFCEB0';
    ctx.strokeRect(100, 700, 880, 160);

    ctx.textAlign = 'left';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#DFCEB0';
    ctx.fillText(`♪ SOUNDTRACK MATCH: ${selectedTrack.title}`, 140, 755);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#E6D8C3';
    ctx.fillText(`Vibe: ${lookbookData?.vibe || 'Thơ mộng quý phái'}`, 140, 795);
    ctx.fillText(`Nhạc cụ: ${lookbookData?.instrumentation || 'Đàn tranh & lofi chillhop'}`, 140, 830);

    // Review & Harmony
    ctx.textAlign = 'center';
    ctx.font = 'italic 30px Georgia, serif';
    ctx.fillStyle = '#FAF7F2';
    ctx.fillText(`"${lookbookData?.review || 'Visual chuẩn sử đầy khí chất.'}"`, 540, 960);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#F59E0B';
    ctx.fillText(`Ngũ Hành: ${lookbookData?.elementMatch || 'Hòa hợp Âm Dương'}`, 540, 1020);

    // TikTok & Instagram Captions Preview
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(100, 1100, 880, 420);
    ctx.strokeStyle = '#430C0C';
    ctx.strokeRect(100, 1100, 880, 420);

    ctx.textAlign = 'left';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#DFCEB0';
    ctx.fillText('TIKTOK VIRAL CAPTION:', 140, 1150);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#FFFFFF';

    // Wrap caption text
    const words = (lookbookData?.tiktok_caption || 'Outfit đỉnh nóc kịch trần cùng Việt Phục Remix!').split(' ');
    let line = '';
    let y = 1200;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 800 && n > 0) {
        ctx.fillText(line, 140, y);
        line = words[n] + ' ';
        y += 38;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 140, y);

    // Cultural Seal Circle
    ctx.beginPath();
    ctx.arc(540, 1630, 70, 0, Math.PI * 2);
    ctx.fillStyle = '#881818';
    ctx.fill();
    ctx.strokeStyle = '#DFCEB0';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FAF7F2';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('ĐÃ KIỂM ĐỊNH', 540, 1620);
    ctx.fillText('DI SẢN 2026', 540, 1648);

    // Hashtags
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#DFCEB0';
    ctx.fillText((lookbookData?.hashtags || ['#VietPhucRemix', '#OOTD']).join('   '), 540, 1770);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#8C7A65';
    ctx.fillText('vietphucremix.studio · Powered by Google AI Studio Gemini 3.8 Flash', 540, 1830);

    const link = document.createElement('a');
    link.download = `Lookbook-${selectedCostume.id}-Story.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      {/* LOOKBOOK HEADER BANNER WITH DONG SON MOTIFS (Khối nổi màu đỏ) */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-6 sm:p-7 rounded-3xl border border-[#E6C673]/60 shadow-xl text-[#FFF8ED]">
        {/* Background Drum Watermark */}
        <div className="absolute -right-8 -top-8 text-[#E6C673] opacity-15 pointer-events-none">
          <DongSonDrum size={220} color="currentColor" />
        </div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDF88] uppercase tracking-wider">
            <LacBird size={18} color="#FFDF88" />
            <span>Giai đoạn 5 · Âm Nhạc, Gamification & Chia Sẻ Viral (Prompt 10 & 11)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-vintage font-bold text-[#FFFDF8]">
            Cỗ Máy Sản Xuất Content & Lookbook Gamification
          </h2>
          <p className="text-xs sm:text-sm text-[#F5ECD8] max-w-3xl">
            Tự động chấm điểm HUD game, sinh caption bắt trend TikTok & Instagram kèm Call-to-Action, và giám tuyển nhạc nền 360° với Gemini 3.8 Flash siêu tốc.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={generateLookbook}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#520A0A] hover:bg-[#680E0E] border border-[#E6C673]/50 text-xs font-bold text-[#FFDF88] rounded-xl transition-all shadow-sm"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#FFDF88]' : 'text-[#FFDF88]'} />
            <span>Chấm lại điểm AI</span>
          </button>
          <button
            onClick={handleDownloadCard}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E6C673] hover:bg-[#F5D88A] text-[#500808] text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Download size={15} />
            <span>Xuất Thẻ Story 9:16 (PNG)</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 3D / VIDEO FRAME WITH GAMING HUD OVERLAY */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-vintage text-[#430C0C] flex items-center gap-2">
              <Tv size={18} className="text-[#881818]" />
              <span>Giao Diện Video 360° & Gaming HUD Overlay</span>
            </h3>

            <button
              onClick={() => setShowHUDOverlay(!showHUDOverlay)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                showHUDOverlay
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-600 border-stone-300'
              }`}
            >
              <Eye size={13} />
              <span>HUD Game: {showHUDOverlay ? 'Bật' : 'Tắt'}</span>
            </button>
          </div>

          {/* THE 3D/VIDEO CANVAS WITH HUD */}
          <div
            ref={cardRef}
            className="relative w-full aspect-4/5 sm:aspect-3/4 rounded-3xl overflow-hidden border-4 border-[#881818] shadow-2xl bg-black flex items-center justify-center group select-none"
          >
            {/* 4 Họa tiết góc Cổ Phong Hoàng Gia mạ vàng */}
            <div className="absolute top-2 left-2 z-30 opacity-80 pointer-events-none">
              <HeritageCorner position="top-left" size={32} color="#DFCEB0" />
            </div>
            <div className="absolute top-2 right-2 z-30 opacity-80 pointer-events-none">
              <HeritageCorner position="top-right" size={32} color="#DFCEB0" />
            </div>
            <div className="absolute bottom-2 left-2 z-30 opacity-80 pointer-events-none">
              <HeritageCorner position="bottom-left" size={32} color="#DFCEB0" />
            </div>
            <div className="absolute bottom-2 right-2 z-30 opacity-80 pointer-events-none">
              <HeritageCorner position="bottom-right" size={32} color="#DFCEB0" />
            </div>

            {/* Background 3D/Video Simulation */}
            <img
              src={selectedCostume.imagePlaceholderUrl}
              alt={selectedCostume.name[language]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
            />
            <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />

            {/* GAMING HUD OVERLAY (Prompts 3 & Gamification) */}
            {showHUDOverlay && (
              <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none z-20 font-mono">
                {/* TOP HUD BAR */}
                <div className="flex items-start justify-between">
                  {/* Left: Player Stats & Energy Bars */}
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white space-y-2 max-w-[240px] shadow-lg">
                    <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Zap size={10} />
                        LV.99 HAUTE COUTURE
                      </span>
                      <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded-xs font-bold">
                        RANK S
                      </span>
                    </div>

                    {/* Heritage HP Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-bold text-red-300">
                        <span>HP DI SẢN:</span>
                        <span>{lookbookData ? `${lookbookData.heritageScore}/10` : '9.8/10'}</span>
                      </div>
                      <div className="w-full bg-red-950 h-2.5 rounded-full overflow-hidden border border-red-500/40">
                        <div
                          className="bg-linear-to-r from-red-600 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000 shadow-xs shadow-red-500"
                          style={{ width: `${((lookbookData?.heritageScore || 9.8) / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Remix MP Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-bold text-cyan-300">
                        <span>MP SÁNG TẠO:</span>
                        <span>{lookbookData ? `${lookbookData.remixScore}/10` : '9.5/10'}</span>
                      </div>
                      <div className="w-full bg-cyan-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/40">
                        <div
                          className="bg-linear-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-xs shadow-cyan-400"
                          style={{ width: `${((lookbookData?.remixScore || 9.5) / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Camera Status & Culture Seal */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-red-600/90 text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-md border border-red-400">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      <span>● REC 360° CAM</span>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-white text-[10px] flex items-center gap-1.5">
                      <LacBird size={14} color="#34D399" />
                      <span className="text-emerald-400 font-bold">CULTURAL SECURE</span> · 60 FPS
                    </div>
                  </div>
                </div>

                {/* CENTER WATERMARK TARGET: HỘ TÂM KÍNH TRỐNG ĐỒNG ĐÔNG SƠN & CHIM HẠC */}
                <div className="self-center text-center space-y-1">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    {/* Trống đồng Đông Sơn xoay tròn chậm như radar HUD */}
                    <DongSonDrum 
                      size={96} 
                      color="#DFCEB0" 
                      className="opacity-40 animate-[spin_24s_linear_infinite]" 
                    />
                    {/* Đôi chim Lạc bay chầu tâm */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <LacBird size={24} color="#FBBF24" className="drop-shadow-xs" />
                    </div>
                  </div>
                  <span className="text-[9px] text-[#DFCEB0]/80 tracking-widest uppercase block font-semibold">
                    TRỐNG ĐỒNG · 360° AVATAR
                  </span>
                </div>

                {/* BOTTOM HUD BAR */}
                <div className="space-y-2">
                  {/* BGM Now Playing Pill */}
                  <div className="bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Music size={14} className="text-amber-400 shrink-0 animate-pulse" />
                      <span className="truncate">
                        <span className="text-amber-300 font-bold">BGM:</span> {selectedTrack.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-300 shrink-0 ml-2 bg-white/10 px-2 py-0.5 rounded-md">
                      {selectedTrack.genre}
                    </span>
                  </div>

                  {/* Garment Identification */}
                  <div className="bg-linear-to-r from-[#430C0C]/90 to-black/80 backdrop-blur-md p-3 rounded-2xl border border-[#DFCEB0]/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-vintage font-bold text-white text-base">
                        {lookbookData?.collectionName || 'Di Sản Khởi Sắc'}
                      </h4>
                      <p className="text-[11px] text-[#DFCEB0]">
                        {selectedCostume.name.vi} · {selectedCostume.era.vi}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-amber-300 font-bold block">
                        {lookbookData?.elementMatch || 'Hòa hợp Ngũ Hành'}
                      </span>
                      <span className="text-[9px] text-white/60">
                        #VietPhucRemix 2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SOUNDTRACK MATCHER & AUDIO CONTROLS (Prompt 11 - Khối nổi màu đỏ) */}
          <div className="bg-linear-to-b from-[#881818] via-[#701010] to-[#500808] p-5 rounded-2xl border-2 border-[#E6C673]/60 shadow-xl text-[#FFF8ED] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-[#FFDF88]" />
                <h4 className="text-sm font-bold text-[#FFDF88]">
                  Đạo Diễn Âm Nhạc & Nhạc Nền 360° (Prompt 11)
                </h4>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={toggleMusicPlayback}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isPlayingMusic
                    ? 'bg-amber-400 text-[#430C0C]'
                    : 'bg-[#E6C673] hover:bg-[#F5D88A] text-[#430C0C]'
                }`}
              >
                {isPlayingMusic ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlayingMusic ? 'Dừng Nhạc' : 'Nghe Thử Nhạc BGM'}</span>
              </button>
            </div>

            {/* AI Soundtrack Match Analysis */}
            <div className="bg-[#420707] p-3.5 rounded-xl border border-[#E6C673]/40 text-xs space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-[#DFCEB0] font-semibold shrink-0">Bầu không khí (Vibe):</span>
                <span className="text-[#FFDF88] font-bold">
                  {lookbookData?.vibe || 'Thơ mộng hòa lẫn quý phái hoàng cung'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#DFCEB0] font-semibold shrink-0">Nhạc cụ phối (Instrumentation):</span>
                <span className="text-[#FFF8ED] font-medium">
                  {lookbookData?.instrumentation || 'Đàn tranh mix beat lo-fi, điểm xuyết sáo trúc du dương'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#DFCEB0] font-semibold shrink-0">Phong cách đề xuất:</span>
                <span className="text-[#FFDE88] font-medium italic">
                  "{lookbookData?.recommended_track_style || 'Một bản remix lo-fi của Hello Vietnam'}"
                </span>
              </div>
            </div>

            {/* Internal Royalty-Free Track Catalog Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-[#FFDF88] uppercase tracking-wider block">
                Kho nhạc bản quyền nội bộ (Lồng tự động vào video 360°):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTERNAL_TRACKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrack(t);
                      if (isPlayingMusic) {
                        stopSynthesizedTrack();
                        setTimeout(playSynthesizedTrack, 100);
                      }
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      selectedTrack.id === t.id
                        ? 'bg-[#3B0606] text-white border-2 border-[#E6C673] shadow-xs'
                        : 'bg-[#550A0A] hover:bg-[#680D0D] text-[#FFF8ED] border border-[#E6C673]/30'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-bold truncate text-[#FFDF88]">{t.title}</div>
                      <div className="text-[10px] text-[#DFCEB0]">
                        {t.genre} · {t.duration}
                      </div>
                    </div>
                    {selectedTrack.id === t.id && (
                      <CheckCircle2 size={15} className="text-[#E6C673] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SOCIAL MEDIA COPYWRITER & VIRAL SHARING (Prompt 10 - Khối nổi màu đỏ) */}
        <div className="lg:col-span-6 space-y-6">
          {/* TAB SELECTOR: TIKTOK VS INSTAGRAM */}
          <div className="bg-linear-to-b from-[#881818] via-[#701010] to-[#500808] p-6 rounded-3xl border-2 border-[#E6C673]/60 shadow-xl text-[#FFF8ED] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6C673]/40 pb-3">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#FFDF88]" />
                <h3 className="text-base font-bold font-serif-vintage text-[#FFDF88]">
                  Tự Động Hóa Nội Dung Viral (Prompt 10)
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-[#420707] p-1 rounded-xl border border-[#E6C673]/40">
                <button
                  onClick={() => setSocialTab('tiktok')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    socialTab === 'tiktok'
                      ? 'bg-[#E6C673] text-[#420707] shadow-xs'
                      : 'text-[#DFCEB0] hover:text-white'
                  }`}
                >
                  TikTok
                </button>
                <button
                  onClick={() => setSocialTab('instagram')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    socialTab === 'instagram'
                      ? 'bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-xs'
                      : 'text-[#DFCEB0] hover:text-pink-300'
                  }`}
                >
                  Instagram
                </button>
              </div>
            </div>

            {/* TAB CONTENT: TIKTOK */}
            {socialTab === 'tiktok' && (
              <div className="space-y-4">
                <div className="bg-black/5 p-4 rounded-2xl border border-black/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <Zap size={13} className="text-amber-500" />
                      TikTok Caption (Gen Z Bắt Trend & Call To Action)
                    </span>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-md font-mono">
                      TikTok Optimized
                    </span>
                  </div>

                  <p className="text-sm font-sans text-[#2C241E] leading-relaxed font-medium">
                    {lookbookData?.tiktok_caption ||
                      'Trời ơi set đồ này keo lỳ chưa từng thấy luôn á! 10 điểm không có nhưng cho visual cung đình này nha. Các bạn đã thử phối Việt phục trên app Việt Phục Remix chưa, vào chấm điểm cùng mình ngay đi nè!'}
                  </p>
                </div>

                <button
                  onClick={handleCopyTikTok}
                  className="w-full py-3 bg-black hover:bg-stone-900 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {copiedType === 'tiktok' ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span>Đã sao chép TikTok Caption vào Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Share to TikTok (Sao chép Caption & CTA)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB CONTENT: INSTAGRAM */}
            {socialTab === 'instagram' && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-pink-50 via-purple-50 to-amber-50 p-4 rounded-2xl border border-pink-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1">
                      <Sparkles size={13} className="text-pink-600" />
                      Instagram Caption (Aesthetic & Chiều Sâu Di Sản)
                    </span>
                    <span className="text-[10px] bg-linear-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded-md font-mono">
                      IG Aesthetic
                    </span>
                  </div>

                  <p className="text-sm font-serif-vintage text-[#2C241E] leading-relaxed italic">
                    "{lookbookData?.instagram_caption ||
                      'Một thoáng phong hoa ngàn năm của xứ Kinh Kỳ thu nhỏ trong từng nếp áo Nhật Bình đỏ chu sa. Khi truyền thống không chỉ nằm trong viện bảo tàng, mà sống động và kiêu hãnh giữa dòng chảy thời trang đương đại.'}"
                  </p>
                </div>

                <button
                  onClick={handleCopyInstagram}
                  className="w-full py-3 bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {copiedType === 'instagram' ? (
                    <>
                      <Check size={16} className="text-emerald-300" />
                      <span>Đã sao chép Instagram Caption vào Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Share to Instagram (Sao chép Caption Nghệ Thuật)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* HASHTAGS ROW */}
            <div className="pt-2 border-t border-[#F3ECE0] space-y-2">
              <span className="text-xs text-[#8C7A65] font-semibold flex items-center gap-1">
                <Hash size={13} className="text-[#881818]" />
                Hashtags xu hướng (Tự động gắn vào caption):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(lookbookData?.hashtags || lookbookData?.trendingKeywords || [
                  '#VietPhucRemix',
                  '#AoTac',
                  '#GenZCulture',
                  '#OOTD',
                  '#CoPhongHauteCouture',
                  '#VietnamHeritage',
                ]).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-[#881818] bg-[#FAF7F2] hover:bg-[#881818] hover:text-white px-3 py-1 rounded-lg border border-[#E6D8C3] font-medium transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CREATIVE DIRECTOR REVIEW & ELEMENTS HARMONY */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6D8C3] shadow-xs space-y-4">
            <h4 className="text-sm font-bold font-serif-vintage text-[#430C0C] flex items-center gap-2">
              <Award size={16} className="text-[#881818]" />
              <span>Đánh Giá Giám Đốc Sáng Tạo & Triết Lý Ngũ Hành</span>
            </h4>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6D8C3] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#881818]">
                <Flame size={14} />
                <span>{lookbookData?.elementMatch || 'Hỏa sinh Thổ - Quyến rũ & Điềm đạm'}</span>
              </div>
              <p className="text-xs text-[#430C0C] leading-relaxed">
                {lookbookData?.colorHarmony ||
                  'Sắc Đỏ Chu Sa quyện hòa cùng Lụa Trắng Bạch Lạp tạo thế uy quyền mà thanh nhã, tôn lên khí sắc rạng ngời.'}
              </p>
            </div>

            <div className="bg-linear-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 text-xs italic text-[#430C0C] leading-relaxed">
              “{lookbookData?.review ||
                'Visual kinh kỳ đỉnh nóc kịch trần! Phối đồ chuẩn sử nhưng mang năng lượng thời thượng không góc chết của Gen Z.'}”
              <div className="text-[10px] text-right font-bold text-[#881818] mt-1 not-italic">
                — Gemini 3.8 Flash Fashion AI
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="py-2.5 bg-[#FAF7F2] hover:bg-[#E6D8C3] text-[#430C0C] text-xs font-bold rounded-xl border border-[#DFCEB0] transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedType === 'link' ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                <span>{copiedType === 'link' ? 'Đã chép link!' : 'Sao chép link web'}</span>
              </button>

              <button
                onClick={onGoToWardrobe}
                className="py-2.5 bg-[#430C0C] hover:bg-[#2C241E] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Layers size={14} />
                <span>Quay lại Thử Đồ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
