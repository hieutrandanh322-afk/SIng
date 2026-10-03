import React from 'react';
import { VietnameseCostume } from '../types';
import { X, Video, Sparkles, ExternalLink, Compass, ShieldCheck } from 'lucide-react';

interface Video360PlayerProps {
  costume: VietnameseCostume;
  onClose: () => void;
  onOpen3DViewer?: () => void;
}

export const Video360Player: React.FC<Video360PlayerProps> = ({
  costume,
  onClose,
  onOpen3DViewer,
}) => {
  const videoData = costume.video360 || {
    title: costume.videoTitle || { vi: 'Thước phim tư liệu cổ phục', en: 'Heritage Documentary' },
    embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
    is360: true,
    duration: '4:30',
    channel: 'VTV Heritage',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-[#1E1712] w-full max-w-4xl rounded-2xl border border-[#DFCEB0]/30 shadow-2xl overflow-hidden my-6 text-[#FAF7F2]">
        {/* Header */}
        <div className="bg-[#2A1F17] px-6 py-4 flex items-center justify-between border-b border-[#430C0C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#881818] flex items-center justify-center text-white">
              <Video size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-vintage font-bold text-lg text-[#FAF7F2]">
                  {videoData.title.vi}
                </h3>
                <span className="text-[10px] bg-[#881818] text-[#FAF7F2] px-2 py-0.5 rounded font-semibold uppercase">
                  360° VR Exhibit
                </span>
              </div>
              <span className="text-xs text-[#A89885]">
                {costume.name.vi} · Kênh sản xuất: {videoData.channel} · Thời lượng: {videoData.duration}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#DFCEB0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Embed Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`${videoData.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={videoData.title.vi}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info & cross-navigation */}
        <div className="p-5 bg-[#2A1F17] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#430C0C]">
          <div className="text-xs text-[#DFCEB0] leading-relaxed">
            <span className="font-bold text-[#881818]">Gợi ý trải nghiệm:</span> Bạn có thể xoay điện thoại hoặc kéo chuột trên khung video để quan sát góc nhìn 360 độ các nếp thêu và chi tiết tà áo.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {onOpen3DViewer && (
              <button
                onClick={() => {
                  onClose();
                  onOpen3DViewer();
                }}
                className="px-4 py-2 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                Mở Mô Hình 3D Xoay Tương Tác
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
