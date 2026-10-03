import React from 'react';

interface MotifProps {
  className?: string;
  size?: number | string;
  color?: string;
  opacity?: number;
}

/**
 * Mặt Trống Đồng Đông Sơn (Ngọc Lũ / Hoàng Hạ)
 * Gồm: Tâm mặt trời 14 tia sáng, các vành vòng tròn đồng tâm,
 * vành chim Lạc bay ngược chiều kim đồng hồ, vành hoa văn răng cưa, hình người giã gạo/chèo thuyền.
 */
export const DongSonDrum: React.FC<MotifProps> = ({ 
  className = '', 
  size = 120, 
  color = 'currentColor',
  opacity = 1 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Vòng ngoài cùng */}
      <circle cx="200" cy="200" r="195" stroke={color} strokeWidth="3" />
      <circle cx="200" cy="200" r="188" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="200" cy="200" r="180" stroke={color} strokeWidth="2" />

      {/* Vành 1: Họa tiết răng cưa tam giác ngoài */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const x1 = 200 + 179 * Math.cos(angle);
        const y1 = 200 + 179 * Math.sin(angle);
        const nextAngle = ((i * 10 + 5) * Math.PI) / 180;
        const x2 = 200 + 171 * Math.cos(nextAngle);
        const y2 = 200 + 171 * Math.sin(nextAngle);
        const endAngle = ((i * 10 + 10) * Math.PI) / 180;
        const x3 = 200 + 179 * Math.cos(endAngle);
        const y3 = 200 + 179 * Math.sin(endAngle);
        return (
          <path
            key={`sawtooth-${i}`}
            d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`}
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
        );
      })}

      <circle cx="200" cy="200" r="170" stroke={color} strokeWidth="1.5" />
      <circle cx="200" cy="200" r="148" stroke={color} strokeWidth="1.5" />

      {/* Vành 2: Chim Lạc / Chim Hạc bay ngược chiều kim đồng hồ (16 con) */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angleDeg = (i * (360 / 14));
        return (
          <g key={`bird-ring-${i}`} transform={`rotate(${angleDeg} 200 200)`}>
            {/* Chim Lạc cách điệu với mỏ dài, đuôi dài, sải cánh bay */}
            <path
              d="M 200 42 C 208 42, 218 45, 226 50 C 220 52, 214 55, 206 54 C 215 58, 224 64, 228 72 C 220 68, 210 65, 202 65 C 205 72, 207 80, 206 88 C 202 82, 198 75, 195 68 C 190 68, 185 69, 180 72 C 183 66, 188 62, 194 59 C 187 58, 178 57, 170 58 C 180 54, 190 52, 198 48 C 195 45, 192 43, 188 42 Z"
              fill={color}
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Hạt tròn hoặc chấm nối tiếp tượng trưng cho hạt thóc / tinh tú */}
            <circle cx="190" cy="50" r="1.5" fill={color} />
          </g>
        );
      })}

      <circle cx="200" cy="200" r="128" stroke={color} strokeWidth="1.5" />
      <circle cx="200" cy="200" r="120" stroke={color} strokeWidth="1" strokeDasharray="4 2" />
      <circle cx="200" cy="200" r="112" stroke={color} strokeWidth="1.5" />

      {/* Vành 3: Họa tiết người giã gạo và vũ công chèo thuyền cách điệu (8 điểm) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angleDeg = i * 45;
        return (
          <g key={`dancer-${i}`} transform={`rotate(${angleDeg} 200 200)`}>
            {/* Hình người đội mũ lông chim xòe */}
            <path
              d="M 197 86 L 200 81 L 203 86 L 200 89 Z"
              fill={color}
            />
            {/* Lông chim trên đầu */}
            <path
              d="M 200 81 Q 206 74 212 76 M 200 81 Q 194 74 188 76"
              stroke={color}
              strokeWidth="1.2"
              fill="none"
            />
            {/* Thân người chày giã cối */}
            <path
              d="M 200 89 L 200 102 M 195 95 L 205 95 M 194 105 L 206 105"
              stroke={color}
              strokeWidth="1.2"
            />
          </g>
        );
      })}

      <circle cx="200" cy="200" r="82" stroke={color} strokeWidth="2" />
      <circle cx="200" cy="200" r="76" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="200" cy="200" r="68" stroke={color} strokeWidth="1.5" />

      {/* Tâm trống: Mặt trời 14 tia sáng biểu tượng cho sự sống và dương khí */}
      <circle cx="200" cy="200" r="24" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="200" cy="200" r="8" fill={color} />
      
      {Array.from({ length: 14 }).map((_, i) => {
        const angleDeg = (i * 360) / 14;
        const rad = (angleDeg * Math.PI) / 180;
        const radPrev = ((angleDeg - 7) * Math.PI) / 180;
        const radNext = ((angleDeg + 7) * Math.PI) / 180;

        const tipX = 200 + 64 * Math.cos(rad);
        const tipY = 200 + 64 * Math.sin(rad);

        const baseX1 = 200 + 24 * Math.cos(radPrev);
        const baseY1 = 200 + 24 * Math.sin(radPrev);

        const baseX2 = 200 + 24 * Math.cos(radNext);
        const baseY2 = 200 + 24 * Math.sin(radNext);

        return (
          <g key={`sunray-${i}`}>
            <polygon
              points={`${tipX},${tipY} ${baseX1},${baseY1} ${baseX2},${baseY2}`}
              fill={color}
              stroke={color}
              strokeWidth="0.8"
            />
            {/* Họa tiết lông công / họa tiết đan giữa 2 tia sáng */}
            <circle
              cx={200 + 44 * Math.cos(((angleDeg + 12.8) * Math.PI) / 180)}
              cy={200 + 44 * Math.sin(((angleDeg + 12.8) * Math.PI) / 180)}
              r="2"
              fill={color}
            />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Họa tiết Chim Hạc / Chim Lạc Vươn Cánh (Lạc Điểu)
 * Đại diện cho truyền thuyết con Rồng cháu Tiên, khát vọng tự do, thanh cao và trường tồn.
 */
export const LacBird: React.FC<MotifProps & { direction?: 'left' | 'right' }> = ({
  className = '',
  size = 64,
  color = 'currentColor',
  opacity = 1,
  direction = 'left',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        opacity,
        transform: direction === 'right' ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* Thân và Mỏ Chim Lạc cổ truyền */}
      <path
        d="M 175 40 
           C 165 42, 140 44, 125 55
           C 115 48, 100 35, 75 25
           C 85 35, 90 48, 92 60
           C 78 52, 60 45, 30 42
           C 45 52, 58 64, 65 78
           C 50 78, 32 82, 10 92
           C 30 95, 48 95, 62 92
           C 60 102, 55 115, 38 135
           C 55 125, 72 110, 80 96
           C 95 105, 115 108, 140 102
           C 155 98, 170 88, 185 75
           C 192 68, 196 55, 175 40 Z"
        fill={color}
      />
      {/* Mỏ dài thanh tú đặc trưng Lạc Điểu */}
      <path
        d="M 175 40 L 198 34 L 180 44 Z"
        fill={color}
      />
      {/* Lông mào trên đỉnh đầu */}
      <path
        d="M 160 38 Q 165 25 178 20 Q 168 30 162 36"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Vòng mắt chim */}
      <circle cx="165" cy="46" r="3" fill="#FAF7F2" stroke={color} strokeWidth="1.5" />
      <circle cx="165" cy="46" r="1.2" fill={color} />
      {/* Chi tiết sải cánh lượn sóng */}
      <path
        d="M 120 60 Q 95 40 75 32 M 110 70 Q 85 55 68 50 M 100 80 Q 75 75 55 75"
        stroke="#FAF7F2"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Đuôi xòe dài kiểu Đông Sơn */}
      <path
        d="M 75 100 Q 55 120 30 145 M 82 104 Q 68 128 48 152"
        stroke="#FAF7F2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Viền Dải Hoa Văn Đông Sơn (Diềm Trống Đồng - Border Strip)
 * Dùng làm đường phân cách, viền card, header hoặc footer
 */
export const DongSonBorderStrip: React.FC<{
  className?: string;
  color?: string;
  height?: number;
}> = ({ className = '', color = '#881818', height = 24 }) => {
  return (
    <div 
      className={`w-full overflow-hidden flex items-center select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat-x"
        viewBox="0 0 400 24"
      >
        <pattern
          id="dong-son-border-pattern"
          x="0"
          y="0"
          width="100"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          {/* Đường biên trên dưới */}
          <line x1="0" y1="2" x2="100" y2="2" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="22" x2="100" y2="22" stroke={color} strokeWidth="1" opacity="0.4" />

          {/* Dãy răng cưa tam giác */}
          <polyline
            points="0,6 5,2 10,6 15,2 20,6 25,2 30,6 35,2 40,6 45,2 50,6 55,2 60,6 65,2 70,6 75,2 80,6 85,2 90,6 95,2 100,6"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.7"
          />

          {/* Họa tiết chim Lạc cách điệu nối tiếp */}
          <path
            d="M 12 14 C 20 12, 28 13, 34 16 C 30 17, 25 18, 18 16 Z"
            fill={color}
            opacity="0.8"
          />
          <circle cx="36" cy="14" r="1.5" fill={color} opacity="0.8" />

          <path
            d="M 62 14 C 70 12, 78 13, 84 16 C 80 17, 75 18, 68 16 Z"
            fill={color}
            opacity="0.8"
          />
          <circle cx="86" cy="14" r="1.5" fill={color} opacity="0.8" />

          {/* Dãy xoắn ốc vòng tròn tiếp tuyến (Sóng nước Đông Sơn) */}
          <circle cx="48" cy="12" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="98" cy="12" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />

          {/* Răng cưa đáy */}
          <polyline
            points="0,18 5,22 10,18 15,22 20,18 25,22 30,18 35,22 40,18 45,22 50,18 55,22 60,18 65,22 70,18 75,22 80,18 85,22 90,18 95,22 100,18"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.7"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dong-son-border-pattern)" />
      </svg>
    </div>
  );
};

/**
 * Họa Tiết Góc Cổ Phong Hoàng Gia (Corner Ornament)
 * Dùng ở 4 góc của Card, Banner hoặc Modal
 */
export const HeritageCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  className?: string;
}> = ({ position = 'top-left', size = 32, color = '#881818', className = '' }) => {
  const rotationMap = {
    'top-left': 'rotate(0)',
    'top-right': 'rotate(90deg)',
    'bottom-right': 'rotate(180deg)',
    'bottom-left': 'rotate(270deg)',
  };

  return (
    <div
      className={`pointer-events-none select-none inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: rotationMap[position],
        transformOrigin: 'center center',
      }}
    >
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Đường góc vuông kép */}
        <path d="M 2 38 L 2 2 L 38 2" stroke={color} strokeWidth="2.5" />
        <path d="M 7 35 L 7 7 L 35 7" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
        
        {/* Hoa văn chim Lạc cách điệu ở góc */}
        <path
          d="M 12 12 Q 18 10 24 16 Q 16 18 12 12 Z"
          fill={color}
        />
        {/* Đốm sao mặt trời nhỏ */}
        <circle cx="6" cy="6" r="2" fill={color} />
      </svg>
    </div>
  );
};

/**
 * Watermark Nền Mờ Trống Đồng Đông Sơn & Đàn Chim Hạc
 * Được hiển thị rõ nét trên nền vàng be nhạt của ứng dụng
 */
export const DongSonBackgroundWatermark: React.FC<{
  opacity?: number;
  className?: string;
}> = ({ opacity = 0.085, className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Trống đồng Đông Sơn lớn góc trên bên phải */}
      <div 
        className="absolute -top-36 -right-36 text-[#8B2500]"
        style={{ opacity }}
      >
        <DongSonDrum size={780} color="currentColor" />
      </div>

      {/* Trống đồng góc dưới bên trái */}
      <div 
        className="absolute -bottom-48 -left-48 text-[#881818]"
        style={{ opacity: opacity * 0.95 }}
      >
        <DongSonDrum size={820} color="currentColor" />
      </div>

      {/* Trống đồng mờ ở giữa trang */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#A33A3A]"
        style={{ opacity: opacity * 0.45 }}
      >
        <DongSonDrum size={900} color="currentColor" />
      </div>

      {/* Đàn chim Hạc / Chim Lạc Đông Sơn sải cánh bay lượn */}
      {/* Chim hạc 1: bay hướng sang phải góc trên */}
      <div 
        className="absolute top-24 left-16 text-[#881818]"
        style={{ opacity: opacity * 1.8 }}
      >
        <LacBird size={160} direction="right" color="currentColor" />
      </div>

      {/* Chim hạc 2: bay nối tiếp */}
      <div 
        className="absolute top-44 left-52 text-[#A33A3A]"
        style={{ opacity: opacity * 1.4 }}
      >
        <LacBird size={110} direction="right" color="currentColor" />
      </div>

      {/* Chim hạc 3: bay bên phải */}
      <div 
        className="absolute top-1/3 right-16 text-[#881818]"
        style={{ opacity: opacity * 1.7 }}
      >
        <LacBird size={180} direction="left" color="currentColor" />
      </div>

      {/* Chim hạc 4: bay hướng về trống đồng */}
      <div 
        className="absolute top-1/2 right-48 text-[#A33A3A]"
        style={{ opacity: opacity * 1.3 }}
      >
        <LacBird size={120} direction="left" color="currentColor" />
      </div>

      {/* Chim hạc 5: bay góc dưới bên trái */}
      <div 
        className="absolute bottom-28 left-28 text-[#881818]"
        style={{ opacity: opacity * 1.7 }}
      >
        <LacBird size={170} direction="right" color="currentColor" />
      </div>

      {/* Chim hạc 6: sải cánh góc dưới bên phải */}
      <div 
        className="absolute bottom-16 right-36 text-[#881818]"
        style={{ opacity: opacity * 1.6 }}
      >
        <LacBird size={150} direction="left" color="currentColor" />
      </div>
    </div>
  );
};

