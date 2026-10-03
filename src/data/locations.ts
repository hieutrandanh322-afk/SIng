import { PlaceLocation } from '../types';

export const VIET_LOCATIONS: PlaceLocation[] = [
  // HÀ NỘI - MUSEUMS
  {
    id: 'hanoi-museum-history',
    name: 'Bảo tàng Lịch sử Quốc gia',
    type: 'museum',
    city: 'Hà Nội',
    address: 'Số 1 Tràng Tiền & 216 Trần Quang Khải, Hoàn Kiếm, Hà Nội',
    lat: 21.0252,
    lng: 105.8586,
    phone: '024 3825 2853',
    rating: 4.8,
    reviewCount: 1420,
    openingHours: '08:00 - 17:00 (Thứ 3 - Chủ Nhật)',
    rentalPriceRange: 'Vé tham quan: 40.000đ (Học sinh/Sinh viên: 15.000đ)',
    highlightAdvice: 'Lưu giữ các bộ long bào hoàng gia nguyên bản quý hiếm nhất Việt Nam. Rất đáng ghé thăm trước khi đặt may cổ phục.',
    specialty: {
      vi: 'Trưng bày bảo vật hoàng cung từ thời đồ đá, Đông Sơn, Lý, Trần, Lê sơ đến triều Nguyễn. Lưu giữ các bộ long bào, mũ bình thiên, áo nhật bình nguyên bản quý hiếm.',
      en: 'Displays imperial treasures from Dong Son bronze drums, Ly-Tran-Le dynasties to Nguyen court. Houses original imperial dragon robes and rare court headdresses.',
    },
    googleMapQuery: 'Bảo tàng Lịch sử Quốc gia 1 Tràng Tiền Hà Nội',
    tags: ['Triều Nguyễn', 'Đại Việt', 'Long bào', 'Bảo vật quốc gia'],
  },
  {
    id: 'hanoi-museum-women',
    name: 'Bảo tàng Phụ nữ Việt Nam',
    type: 'museum',
    city: 'Hà Nội',
    address: '36 Lý Thường Kiệt, Hàng Bài, Hoàn Kiếm, Hà Nội',
    lat: 21.0234,
    lng: 105.8521,
    phone: '024 3825 9936',
    rating: 4.9,
    reviewCount: 3250,
    openingHours: '08:00 - 17:00 hàng ngày',
    rentalPriceRange: 'Vé tham quan: 40.000đ',
    highlightAdvice: 'Bộ sưu tập tiến trình phát triển của Áo Dài từ thế kỷ 18 đến nay. Triển lãm yếm đào và nón quai thao Bắc Bộ cực kỳ đặc sắc.',
    specialty: {
      vi: 'Bộ sưu tập trang phục phụ nữ 54 dân tộc, lịch sử cách tân Áo Dài qua các thời kỳ, áo Tứ Thân quan họ Kinh Bắc và yếm đào truyền thống.',
      en: 'Comprehensive collection of attire across 54 ethnic groups, evolutionary history of Ao Dai through modern eras, northern Ao Tu Than, and traditional silk yems.',
    },
    googleMapQuery: 'Bảo tàng Phụ nữ Việt Nam 36 Lý Thường Kiệt Hà Nội',
    tags: ['Áo Dài', 'Áo Tứ Thân', '54 Dân tộc', 'Thời trang phụ nữ'],
  },

  // HÀ NỘI - SHOPS
  {
    id: 'shop-dai-viet-co-phong',
    name: 'Đại Việt Cổ Phong Studio (Vân Pok)',
    type: 'shop',
    city: 'Hà Nội',
    address: 'Số 8 Ngõ 12 Đặng Thai Mai, Quảng An, Tây Hồ, Hà Nội',
    lat: 21.0628,
    lng: 105.8284,
    phone: '098 765 4321',
    rating: 4.9,
    reviewCount: 460,
    openingHours: '09:00 - 21:00 hàng ngày',
    rentalPriceRange: 'Thuê từ 300.000đ - 750.000đ / ngày (kèm trâm cài)',
    highlightAdvice: 'Chuyên trang phục thời Lý - Trần - Hậu Lê chuẩn sử học bậc nhất Hà Thành. Có dịch vụ trang điểm cổ phong và gói chụp ảnh concept Tây Hồ.',
    specialty: {
      vi: 'Chuyên nghiên cứu, phục dựng và cho thuê cổ phục chuẩn xác niên đại Lý - Trần - Hậu Lê (Giao Lĩnh, Đối Khâm, Viên Lĩnh). Chụp ảnh concept hoàng cung.',
      en: 'Specializes in academic restoration and rental of Ly-Tran-Le garments (Giao Linh, Doi Kham, Vien Linh). Royal heritage photography concepts.',
    },
    googleMapQuery: 'Đại Việt Cổ Phong Studio Tây Hồ Hà Nội',
    tags: ['Thuê cổ phục', 'Thời Lý Trần Lê', 'Chụp ảnh Cổ Phong', 'Tây Hồ'],
  },
  {
    id: 'shop-hoa-nien-hanoi',
    name: 'Hoa Niên - Năm Tháng Tươi Đẹp',
    type: 'shop',
    city: 'Hà Nội',
    address: 'Tầng 3, 26 Hàng Bông, Hàng Gai, Hoàn Kiếm, Hà Nội',
    lat: 21.0315,
    lng: 105.8492,
    phone: '091 234 5678',
    rating: 4.8,
    reviewCount: 890,
    openingHours: '08:30 - 21:30 hàng ngày',
    rentalPriceRange: 'Thuê từ 350.000đ - 900.000đ / ngày (Áo Tấc & Nhật Bình)',
    highlightAdvice: 'Nằm ngay trung tâm phố cổ Hoàn Kiếm, cực kỳ tiện thuê đồ đi dạo hồ Gươm hoặc check-in phố sách, Nhà Chung.',
    specialty: {
      vi: 'May đo và cho thuê Áo Tấc, Áo Nhật Bình may tay thủ công bằng lụa Vạn Phúc và gấm dệt hoa văn cổ truyền. Cung cấp đầy đủ hài thêu, quạt lụa và trâm cài.',
      en: 'Tailoring and rental of Ao Tac and Nhat Binh hand-stitched from Van Phuc silk and traditional brocade. Fully equipped with embroidered shoes and hairpins.',
    },
    googleMapQuery: 'Hoa Niên Cổ Phục Hàng Bông Hoàn Kiếm Hà Nội',
    tags: ['Áo Nhật Bình', 'Áo Tấc', 'Lụa Vạn Phúc', 'Phố Cổ'],
  },

  // HUẾ - MUSEUMS & SHOPS
  {
    id: 'hue-museum-court-antiquities',
    name: 'Bảo tàng Cổ vật Cung đình Huế (Điện Long An)',
    type: 'museum',
    city: 'Huế',
    address: 'Số 3 Lê Trực, Phú Hậu, TP. Huế, Thừa Thiên Huế',
    lat: 16.4716,
    lng: 107.5791,
    phone: '0234 352 4462',
    rating: 4.9,
    reviewCount: 1870,
    openingHours: '07:30 - 17:00 hàng ngày',
    rentalPriceRange: 'Vé tham quan: 50.000đ (bao gồm bảo vật cung đình)',
    highlightAdvice: 'Không gian Điện Long An bằng gỗ lim tuyệt tác, nơi lưu giữ phượng bào và áo thụ đán của các hoàng đế, hoàng thái hậu triều Nguyễn.',
    specialty: {
      vi: 'Điện Long An tráng lệ lưu giữ hàng trăm hiện vật trang phục cung đình triều Nguyễn: Áo Thụ Đán, Áo Giao Tụ, Áo Tấc, Mão cửu long của Vua và Phượng bào của Hoàng hậu.',
      en: 'Magnificent Long An Palace housing hundreds of royal Nguyen Dynasty vestments: ceremonial dragon robes, phoenix gowns, empress crowns and royal slippers.',
    },
    googleMapQuery: 'Bảo tàng Cổ vật Cung đình Huế Điện Long An',
    tags: ['Cố đô Huế', 'Cung đình Nguyễn', 'Điện Long An', 'Phượng bào'],
  },
  {
    id: 'shop-co-trang-hue',
    name: 'Nhật Bình Các - Cổ Phục Cố Đô',
    type: 'shop',
    city: 'Huế',
    address: '48 Thạch Hãn, Thuận Hòa, TP. Huế, Thừa Thiên Huế',
    lat: 16.4745,
    lng: 107.5721,
    phone: '090 512 3456',
    rating: 5.0,
    reviewCount: 630,
    openingHours: '07:00 - 22:00 hàng ngày',
    rentalPriceRange: 'Thuê từ 250.000đ - 600.000đ / ngày (Tặng kèm quạt & trâm)',
    highlightAdvice: 'Chỉ cách Đại Nội Huế 300 mét, tiệm có dịch vụ trang điểm cung đình chuẩn Huế và cho mượn ô che nắng cổ phong.',
    specialty: {
      vi: 'Cho thuê Áo Nhật Bình và Áo Tấc đi kèm gói hướng dẫn check-in Đại Nội, lăng tẩm vua triều Nguyễn và sông Hương. Make up phong cách hoàng tộc Huế.',
      en: 'Rental of Nhat Binh and Ao Tac with guided imperial citadel check-in packages at Nguyen royal tombs and Perfume River. Authentic royal court makeup.',
    },
    googleMapQuery: 'Cổ Phục Nhật Bình Cố Đô Huế Thạch Hãn',
    tags: ['Đại Nội Huế', 'Thuê Nhật Bình', 'Check-in Lăng tẩm', 'Make up Huế'],
  },

  // TP. HỒ CHÍ MINH - MUSEUMS & SHOPS
  {
    id: 'hcm-museum-ao-dai',
    name: 'Bảo tàng Áo Dài TP. Hồ Chí Minh',
    type: 'museum',
    city: 'TP. Hồ Chí Minh',
    address: '206/19/30 Long Thuận, Long Phước, Quận 9 (TP. Thủ Đức), TP.HCM',
    lat: 10.8242,
    lng: 106.8436,
    phone: '091 472 6948',
    rating: 4.8,
    reviewCount: 2100,
    openingHours: '08:30 - 17:30 (Thứ 3 - Chủ Nhật)',
    rentalPriceRange: 'Vé vào cổng: 50.000đ; Có dịch vụ thuê áo chụp ảnh tại chỗ',
    highlightAdvice: 'Không gian sinh thái nhà rường cổ kính, hồ sen bát ngát. Nơi tuyệt vời nhất Sài Gòn để chụp ảnh Áo Dài và tìm hiểu lịch sử y phục.',
    specialty: {
      vi: 'Không gian sinh thái vườn xưa lưu giữ hàng trăm mẫu Áo Dài lịch sử: Áo Dài tứ thân, Áo Dài ngũ thân, Áo Dài Lemur, Áo Dài hở cổ bà Nhu đến Áo Dài đương đại.',
      en: 'Serene garden museum preserving hundreds of historic Ao Dai: four-panel, five-panel, Lemur 1930s, open-collar 1960s, to contemporary designer pieces.',
    },
    googleMapQuery: 'Bảo tàng Áo Dài Long Thuận TP Thủ Đức TP HCM',
    tags: ['Bảo tàng Áo Dài', 'Sĩ Hoàng', 'Không gian xanh', 'Lịch sử Áo Dài'],
  },
  {
    id: 'hcm-museum-history',
    name: 'Bảo tàng Lịch sử TP. Hồ Chí Minh',
    type: 'museum',
    city: 'TP. Hồ Chí Minh',
    address: 'Số 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, TP.HCM',
    lat: 10.7878,
    lng: 106.7042,
    phone: '028 3829 8146',
    rating: 4.7,
    reviewCount: 3800,
    openingHours: '08:00 - 17:00 hàng ngày',
    rentalPriceRange: 'Vé tham quan: 30.000đ',
    highlightAdvice: 'Nằm ngay trung tâm Quận 1 bên cạnh Thảo Cầm Viên, kiến trúc Đông Dương tráng lệ, thuận tiện kết hợp tham quan các di tích Sài Gòn.',
    specialty: {
      vi: 'Trưng bày trang phục văn hóa Phù Nam - Chân Lạp, cổ vật miền Nam thời khẩn hoang và y phục triều Nguyễn khu vực Nam Bộ.',
      en: 'Exhibits Fu-nan culture attire, southern frontier migration relics, and southern regional Nguyen Dynasty vestments.',
    },
    googleMapQuery: 'Bảo tàng Lịch sử TP Hồ Chí Minh số 2 Nguyễn Bỉnh Khiêm',
    tags: ['Lịch sử Nam Bộ', 'Quận 1', 'Cổ vật phương Nam'],
  },
  {
    id: 'shop-chieu-minh-cac',
    name: 'Chiêu Minh Các - May Đo & Cho Thuê Cổ Phục',
    type: 'shop',
    city: 'TP. Hồ Chí Minh',
    address: '14/8 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP.HCM',
    lat: 10.7934,
    lng: 106.6719,
    phone: '097 889 9112',
    rating: 4.9,
    reviewCount: 750,
    openingHours: '09:00 - 21:00 hàng ngày',
    rentalPriceRange: 'Thuê từ 300.000đ - 800.000đ / ngày; May đo theo yêu cầu',
    highlightAdvice: 'Tiệm may đo và cho thuê cổ phục uy tín hàng đầu Sài Gòn. Cực kỳ nổi tiếng với các mẫu Áo Tấc nam nữ và Áo Dài Ngũ Thân tay chẽn.',
    specialty: {
      vi: 'Thương hiệu phục dựng cổ phục hàng đầu miền Nam. Cung cấp may đo và cho thuê Áo Tấc, Nhật Bình, Áo Dài Ngũ Thân nam nữ chuẩn phom dáng xưa.',
      en: 'Premier heritage restoration brand in Southern Vietnam. Bespoke tailoring and rentals of Ao Tac, Nhat Binh, and five-panel Ao Dai crafted to historical cuts.',
    },
    googleMapQuery: 'Chiêu Minh Các Cổ Phục Đặng Văn Ngữ Phú Nhuận',
    tags: ['May đo Cổ phục', 'Phú Nhuận', 'Ngũ Thân nam nữ', 'Chụp ảnh Sài Gòn'],
  },

  // ĐÀ NẴNG & BẮC NINH
  {
    id: 'shop-danang-co-phong',
    name: 'Hội An - Đà Nẵng Cổ Phục Các',
    type: 'shop',
    city: 'Đà Nẵng',
    address: '128 Nguyễn Chí Thanh, Hải Châu, Đà Nẵng',
    lat: 16.0694,
    lng: 108.2215,
    phone: '093 543 2198',
    rating: 4.8,
    reviewCount: 420,
    openingHours: '08:00 - 21:30 hàng ngày',
    rentalPriceRange: 'Thuê từ 250.000đ - 650.000đ / ngày (Hỗ trợ ship sang Hội An)',
    highlightAdvice: 'Có sẵn gói kết hợp xe đưa đón chụp ảnh phố cổ Hội An và Cầu Rồng Đà Nẵng. Áo Đối Khâm và Áo Nhật Bình ở đây rất đa dạng màu sắc.',
    specialty: {
      vi: 'Cho thuê cổ phục chụp ảnh phố cổ Hội An và Cầu Vàng Bà Nà. Dịch vụ đưa đón và make-up trọn gói chuyên nghiệp.',
      en: 'Garment rental for Hoi An Ancient Town and Ba Na Hills. Professional full-package makeup and shuttle services.',
    },
    googleMapQuery: 'Cổ Phục Đà Nẵng Nguyễn Chí Thanh',
    tags: ['Đà Nẵng', 'Hội An', 'Phố Cổ', 'Thuê trang phục'],
  },
  {
    id: 'museum-bac-ninh',
    name: 'Bảo tàng Dân ca Quan họ Bắc Ninh',
    type: 'museum',
    city: 'Bắc Ninh',
    address: 'Khu Diềm Xá, Viêm Xá, TP. Bắc Ninh',
    lat: 21.2065,
    lng: 106.0521,
    phone: '0222 382 2541',
    rating: 4.9,
    reviewCount: 510,
    openingHours: '08:00 - 17:00 (Thứ 3 - Chủ Nhật)',
    rentalPriceRange: 'Vé tham quan: 20.000đ; Trải nghiệm mặc thử Áo Tứ Thân miễn phí',
    highlightAdvice: 'Nơi duy nhất bạn có thể tận mắt chiêm ngưỡng các bộ yếm lụa cổ, nón quai thao thế kỷ trước và nghe các nghệ nhân hát canh quan họ truyền thống.',
    specialty: {
      vi: 'Cái nôi lưu giữ trang phục truyền thống của Liền anh Liền chị: áo Tứ Thân, khăn mỏ quạ, nón quai thao, thắt lưng ngũ sắc và xà tích bạc.',
      en: 'The cradle preserving authentic Quan Ho folk attire: four-panel Ao Tu Than, crow-beak scarves, broad flat hats, and traditional silver accessories.',
    },
    googleMapQuery: 'Bảo tàng Dân ca Quan họ Bắc Ninh Viêm Xá',
    tags: ['Quan họ Kinh Bắc', 'Áo Tứ Thân', 'Nón quai thao', 'Di sản UNESCO'],
  },
];

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Estimate travel duration (e.g. 25km/h city speed)
export function estimateTravelTimeMinutes(distanceKm: number): number {
  return Math.max(5, Math.round((distanceKm / 25) * 60));
}
