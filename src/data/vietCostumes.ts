import { VietnameseCostume } from '../types';

export const VIET_COSTUMES: VietnameseCostume[] = [
  {
    id: 'ao-nhat-binh',
    name: {
      vi: 'Áo Nhật Bình',
      en: 'Nhat Binh Robe',
    },
    era: {
      vi: 'Triều Nguyễn (Thế kỷ 19 - Đầu thế kỷ 20)',
      en: 'Nguyen Dynasty (19th - Early 20th Century)',
    },
    dynastyKey: 'trieu-nguyen',
    century: 'XIX - XX',
    gender: 'female',
    description: {
      vi: 'Áo Nhật Bình là thường phục cao quý của Hoàng thái hậu, Hoàng hậu, Công chúa và mệnh phụ quý tộc triều Nguyễn; đồng thời là đại lễ phục của các bậc phi tần và cung tần tam giai, tứ giai.',
      en: 'The Nhat Binh robe was the noble daily attire of Queen Mothers, Empresses, Princesses, and noble consorts during the Nguyen Dynasty; it also served as ceremonial grand court attire for lower-rank consorts.',
    },
    structure: {
      vi: 'Đặc trưng với cổ áo hình chữ nhật bản to kéo dài từ trước ngực xuống tận gấu áo (khi ghép hai vạt tạo thành hình vuông góc chữ Nhật 日). Tay áo thụng may dải ngũ sắc (xanh, vàng, trắng, đỏ, đen) đại diện cho Ngũ hành. Thân áo cố định bằng dải dây buộc hoặc cúc ngọc, tà áo thêu hoa văn phượng, loan hoặc hoa thị tinh xảo.',
      en: 'Characterized by a prominent rectangular collar running down the chest forming the Chinese character "Ri" (Sun / Nhật 日). Wide sleeves adorned with five-color bands (blue, yellow, white, red, black) symbolizing the Five Elements. Secured by jade buttons or silk sashes, embroidered with exquisite phoenixes and floral motifs.',
    },
    philosophy: {
      vi: 'Dải ngũ sắc tượng trưng cho ngũ hành tương sinh (Kim, Mộc, Thủy, Hỏa, Thổ), hàm ý đất trời che chở và sự hài hòa vũ trụ. Cổ áo vuông vắn đại diện cho sự đoan chính, lễ nghi khuôn phép chốn cung đình.',
      en: 'The five-colored sleeve cuffs symbolize the generating cycle of the Five Elements, embodying celestial harmony. The rectangular collar signifies imperial dignity, righteousness, and courtly decorum.',
    },
    occasion: {
      vi: 'Nghi lễ cung đình, tế lễ tôn miếu, đại thọ hoàng tộc, lễ cưới của hoàng nữ và mệnh phụ. Ngày nay được ưa chuộng bậc nhất trong lễ cưới truyền thống trang trọng và chụp ảnh cổ phục di sản.',
      en: 'Court rituals, ancestral rites, imperial jubilees, royal weddings. Today it is deeply cherished for solemn traditional Vietnamese weddings and heritage photo projects.',
    },
    hairAndMakeup: {
      vi: 'Khăn vành dây quấn nhiều vòng màu lam hoặc lục viền kim tuyến, hoặc tóc búi trâm phượng hoàng. Lối trang điểm thanh nhã kinh kỳ: lông mày lá liễu, môi chu sa tươi tắn.',
      en: 'Multi-layered blue or teal silk turban (Khan Vanh Day) threaded with gold, or phoenix hairpins. Refined court makeup: willow-leaf eyebrows and vermilion lips.',
    },
    jewelry: {
      vi: 'Vòng kiềng vàng/bạc chạm hoa cúc hoặc mây lành, trâm ngọc phượng hoàng ngũ lạt, hoa tai nụ cúc, chuỗi ngọc đeo ngực, quạt lụa thêu chim trĩ.',
      en: 'Gold/silver collar torque with auspicious cloud carvings, jade phoenix hairpins, pearl necklaces, silk folding fans with pheasant embroidery.',
    },
    notableColors: ['#C81E1E', '#881818', '#1A4D6B', '#8E4A49', '#D4AF37', '#2E5A44'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYJvYg_C72g',
    videoTitle: {
      vi: 'Phim tài liệu phục dựng Áo Nhật Bình Cung Đình Huế',
      en: 'Hue Imperial Court Nhat Binh Robe Restoration Documentary',
    },
    video360: {
      title: {
        vi: 'Trải nghiệm 360° Phục dựng Áo Nhật Bình Triều Nguyễn',
        en: '360° Virtual Exhibit: Nguyen Dynasty Nhat Binh Robe',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '4:25',
      channel: 'VTV Heritage',
    },
    model3d: {
      title: 'Mô hình 3D Áo Nhật Bình Cung Đình Đỏ Chu Sa (Mesh 4 Chiều)',
      format: 'Interactive-Three',
      verticesCount: '52,400 Polygons',
      meshPreset: 'nhat_binh',
      downloadUrl: '#3d-ao-nhat-binh.glb',
      sourceCredit: 'Việt Phục Remix 3D Heritage Lab - Tư liệu 4 góc chụp phục dựng thực tế',
    },
    keyFeatures: [
      { vi: 'Cổ áo chữ Nhật thêu hoa cúc vắt qua ngực kèm giải thùy', en: 'Rectangular collar with chrysanthemum embroidery & ribbon sashes' },
      { vi: 'Khăn Vành Xanh Lam Bảo Thạch lộ búi tóc cung đình', en: 'Sapphire royal blue turban framing traditional hair bun' },
      { vi: 'Hoa văn Thủy Ba Tam Sơn (Sóng nước & Núi thiêng) ở chân vạt', en: 'Tam Son Thuy Ba (Sacred mountain & wave surges) along hem' },
      { vi: 'Họa tiết Bổ Đoàn hoa tròn trên ngực, tay áo và chính giữa lưng', en: 'Circular floral medallions on chest, sleeves, and back' },
      { vi: 'Dải ngũ sắc đặc trưng ở hai đầu tay áo thụng', en: 'Five-colored bands on wide sleeve cuffs' },
    ],
  },
  {
    id: 'ao-tac-nguyen',
    name: {
      vi: 'Áo Tấc (Ngũ Thân Tay Thụng)',
      en: 'Ao Tac (Broad-Sleeved Five-Panel Robe)',
    },
    era: {
      vi: 'Triều Nguyễn (Thế kỷ 19 - Thế kỷ 20)',
      en: 'Nguyen Dynasty (19th - 20th Century)',
    },
    dynastyKey: 'trieu-nguyen',
    century: 'XIX - XX',
    gender: 'unisex',
    description: {
      vi: 'Áo Tấc là lễ phục quốc hồn quốc túy của triều Nguyễn, sử dụng phổ quát cho từ bậc vua quan cho tới thường dân trong các dịp đại lễ trọng thể. Cả nam và nữ đều mặc được.',
      en: 'Ao Tac was the universal ceremonial attire of the Nguyen era, worn across social classes from emperors and mandarins to commoners during solemn rites. Suitable for both men and women.',
    },
    structure: {
      vi: 'Áo có dáng ngũ thân (5 mảnh vải ghép lại: 2 thân trước, 2 thân sau và 1 thân con bên trong), cổ áo đứng tròn ôm sát gài 5 cúc. Đặc điểm quan trọng nhất là tay áo may thụng rộng và dài quá bàn tay 1 tấc (khoảng 30-40cm), vạt áo xòe nhẹ chấm gối.',
      en: 'Crafted from five fabric panels representing the five virtues, high standing collar secured by five buttons. The signature feature is its very wide, flowing sleeves extending one "tac" (approx. 30-40cm) past the fingertips.',
    },
    philosophy: {
      vi: '5 thân áo tượng trưng cho Tứ thân phụ mẫu (cha mẹ đẻ, cha mẹ chồng/vợ) ôm lấy thân con (chính mình), thể hiện đạo hiếu thảo. 5 cúc áo tượng trưng cho Ngũ thường: Nhân - Lễ - Nghĩa - Trí - Tín.',
      en: 'The 5 panels represent the four parents sheltering the child, honoring filial piety. The 5 buttons symbolize the five cardinal virtues: Benevolence, Decorum, Righteousness, Wisdom, and Faithfulness.',
    },
    occasion: {
      vi: 'Lễ cưới, giỗ chạp, tế đình, tết Nguyên đán, nghi thức ngoại giao và lễ hội truyền thống. Là lựa chọn trang nghiêm bậc nhất cho lễ tơ hồng cổ phong.',
      en: 'Weddings, ancestral anniversaries, communal ceremonies, Lunar New Year, diplomacy. The paramount solemn choice for traditional marriage vows.',
    },
    hairAndMakeup: {
      vi: 'Nam giới đội khăn đóng (khăn xếp) màu đen hoặc gấm; nữ giới vấn khăn nhung đen hoặc khăn lọng, tóc búi gọn gàng thể hiện sự khiêm cung, tôn kính.',
      en: 'Men wear structured black fabric turbans (khan dong); women wear velvet headbands or coiled hair, displaying humility and reverence.',
    },
    jewelry: {
      vi: 'Vòng kiềng bạc đúc trơn hoặc chạm hoa mai, ngọc bội đeo thắt lưng, túi gấm thêu chữ Phúc Lộc thọ, giày hạ hoặc hài thêu.',
      en: 'Polished silver torcs with apricot blossoms, jade pendants at waist, embroidered brocade sachets, hand-stitched slippers.',
    },
    notableColors: ['#651212', '#23395B', '#40534C', '#887B6C', '#1B1B1B'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYJvYg_C72g',
    videoTitle: {
      vi: 'Tìm hiểu lễ phục Áo Tấc trong nghi lễ truyền thống Việt',
      en: 'Exploring Ao Tac in Traditional Vietnamese Ceremonies',
    },
    video360: {
      title: {
        vi: 'Phim tài liệu 360° Không gian Lễ nghi Áo Tấc',
        en: '360° Documentary: Ao Tac in Sacred Ceremonies',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '6:10',
      channel: 'Đại Việt Cổ Phong',
    },
    model3d: {
      title: 'Mô hình 3D Áo Tấc Ngũ Thân Tay Thụng',
      format: 'Interactive-Three',
      verticesCount: '36,500 Polygons',
      meshPreset: 'ao_tac',
      downloadUrl: '#3d-ao-tac.glb',
      sourceCredit: 'Đại Nam Cổ Truyền Lab',
    },
    keyFeatures: [
      { vi: 'Tay thụng dài qua đầu ngón tay', en: 'Flowing broad sleeves past hands' },
      { vi: '5 cúc cài tượng trưng cho Ngũ thường', en: '5 buttons embodying the Five Cardinal Virtues' },
      { vi: 'Bắt buộc mặc cùng quần dài trắng tinh khôi', en: 'Must be paired with pristine long white trousers' },
    ],
  },
  {
    id: 'ao-giao-linh',
    name: {
      vi: 'Áo Giao Lĩnh (Giao Khâm)',
      en: 'Giao Linh (Cross-Collared Robe)',
    },
    era: {
      vi: 'Triều Lý - Trần - Hậu Lê (Thế kỷ 11 - Thế kỷ 18)',
      en: 'Ly, Tran & Later Le Dynasties (11th - 18th Century)',
    },
    dynastyKey: 'ly-tran',
    century: 'XI - XVIII',
    gender: 'unisex',
    description: {
      vi: 'Áo Giao Lĩnh là một trong những dạng thức y phục cổ xưa nhất của nền văn minh Đại Việt, tồn tại liên tục qua các triều đại Lý, Trần, Lê cho đến tiền kỳ nhà Nguyễn.',
      en: 'Giao Linh is one of the oldest foundational garments of Dai Viet civilization, enduring through the Ly, Tran, and Le dynasties into the early Nguyen era.',
    },
    structure: {
      vi: 'Áo có hai vạt cổ đan chéo nhau trước ngực (vạt bên trái đè lên vạt bên phải - Tả Nhâm hoặc Hữu Nhâm tùy thời kỳ). Thân áo dài thướt tha, tay áo có thể là tay rộng hoặc tay chẽn, buộc bằng đai lưng hoặc dải lụa mềm thắt nút bên sườn.',
      en: 'Two collars cross symmetrically over the chest (traditionally right side over left in Later Le court code). Long graceful drape, wide sleeves, fastened with a fabric belt or silk sash knotted gracefully at the waist.',
    },
    philosophy: {
      vi: 'Vạt áo giao nhau thể hiện sự hòa hợp Âm Dương của trời đất. Dải đai thắt lưng tượng trưng cho sự giữ gìn phép tắc, phong thái khoan thai tao nhã của người quân tử và thục nữ.',
      en: 'The crossed collars represent the Yin-Yang balance of the universe. The sash symbolizes temperance and the dignified elegance of noble scholars and gentlewomen.',
    },
    occasion: {
      vi: 'Hội hè thời Lý-Trần, dạ tiệc cung đình thời Hậu Lê, ngâm thơ thưởng trà, lễ tế trời đất, du xuân trẩy hội non sông.',
      en: 'Spring festivals in Ly-Tran eras, court banquets in Later Le, poetry and tea gatherings, ancestral ceremonies, springtime promenades.',
    },
    hairAndMakeup: {
      vi: 'Nữ giới xõa tóc cài trâm bạc hoặc búi tóc cao đính hoa, điểm xuyết chấm son nụ đào giữa trán phong cách Đại Việt thời Trần.',
      en: 'Long flowing hair with silver hairpins or high coiled chignon, subtle forehead cosmetic red dot inspired by Tran dynasty aesthetic.',
    },
    jewelry: {
      vi: 'Đai lưng gấm đính ngọc, trâm cài hình rồng phượng thời Lý-Trần, vòng ngọc bích hòa điền, hài cong nhọn đầu.',
      en: 'Silk sash with jade plaques, dragon-phoenix hairpins with Ly-Tran cloud motifs, hetian jade bracelets, curved pointed shoes.',
    },
    notableColors: ['#7C2D12', '#1E3A8A', '#065F46', '#831843', '#451A03'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYJvYg_C72g',
    videoTitle: {
      vi: 'Nghiên cứu phục dựng áo Giao Lĩnh triều Lý - Trần',
      en: 'Ly-Tran Cross-Collared Giao Linh Robe Reconstruction Research',
    },
    video360: {
      title: {
        vi: 'Phục dựng 3D 360° Trang phục Hoàng gia thời Trần',
        en: '360° Royal Attire of Tran Dynasty Reconstruction',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '5:45',
      channel: 'Kinh Kỳ Heritage',
    },
    model3d: {
      title: 'Mô hình 3D Áo Giao Lĩnh Thời Lý - Trần',
      format: 'Interactive-Three',
      verticesCount: '42,100 Polygons',
      meshPreset: 'giao_linh',
      downloadUrl: '#3d-ao-giao-linh.glb',
      sourceCredit: 'Việt Phục Remix Lab',
    },
    keyFeatures: [
      { vi: 'Cổ áo vạt chéo duyên dáng', en: 'Signature crossed collar design' },
      { vi: 'Đai thắt lưng lụa mềm mại', en: 'Flowing silk waist sash' },
      { vi: 'Phối cùng váy quây hoặc quần lụa mềm', en: 'Worn with wrap-around skirt or silk trousers' },
    ],
  },
  {
    id: 'ao-vien-linh',
    name: {
      vi: 'Áo Viên Lĩnh (Cổ Tròn)',
      en: 'Vien Linh (Round-Collared Court Robe)',
    },
    era: {
      vi: 'Triều Lý - Trần - Lê (Thế kỷ 11 - 18)',
      en: 'Ly, Tran & Le Dynasties (11th - 18th Century)',
    },
    dynastyKey: 'hau-le',
    century: 'XI - XVIII',
    gender: 'male',
    description: {
      vi: 'Áo Viên Lĩnh (áo cổ tròn) là quan phục và thường phục cao cấp của các bậc quan lại, quý tộc và hoàng đế Đại Việt từ thời Lý - Trần đến thời Hậu Lê.',
      en: 'Vien Linh (round-collared robe) served as official mandarin court attire and high-class garment for nobility and monarchs of Dai Viet from Ly-Tran through Later Le dynasties.',
    },
    structure: {
      vi: 'Cổ áo tròn khép kín gài cúc bên vai phải. Thân áo thụng dài phủ qua mắt cá chân, hai bên xẻ tà hoặc may nếp gấp tạo phom dáng bệ vệ, tay áo rộng thùng thình uy nghiêm.',
      en: 'Circular enclosed collar fastened with buttons at the right shoulder. Long flowing drape extending past ankles, wide majestic sleeves creating an authoritative silhouette.',
    },
    philosophy: {
      vi: 'Cổ tròn tượng trưng cho "Trời tròn Đất vuông" (Thiên viên Địa phương), thể hiện sự thuận theo đạo trời, sự công chính nghiêm minh của người trị quốc.',
      en: 'The round collar embodies the ancient cosmic philosophy "Round Heaven, Square Earth" (Thiên Viên Địa Phương), denoting divine rectitude and governance justice.',
    },
    occasion: {
      vi: 'Buổi thiết triều, nghi lễ công đường, các kỳ thi đình Hương thi Hội, lễ nghênh đón sứ thần ngoại bang.',
      en: 'Royal court audiences, state ceremonies, imperial examinations, receptions of foreign ambassadors.',
    },
    hairAndMakeup: {
      vi: 'Nam giới búi tóc cao, đội mũ Phác Đầu (triều Lý-Trần) hoặc mũ Ô Sa hai cánh chuồn (triều Lê). Râu tỉa thanh tú phong thái danh sĩ.',
      en: 'High hair topknot under winged mandarin caps (Phac Dau in Ly-Tran, O Sa in Le dynasty), well-groomed dignified presence.',
    },
    jewelry: {
      vi: 'Đai lưng da hoặc gấm nẹp ngọc/vàng (Ngọc đái), Bổ tử (miếng vải vuông thêu chim công, bạch hạc hoặc sư tử trước ngực và sau lưng chỉ phẩm hàm), hốt ngà voi cầm tay.',
      en: 'Jade-ornamented ceremonial belt, rank badges (Bo Tu) with embroidered cranes or lions, ivory court tablets (Hot Nga).',
    },
    notableColors: ['#4A0E0E', '#14213D', '#1B4332', '#6B2D5C'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYJvYg_C72g',
    videoTitle: {
      vi: 'Mã số trang phục quan viên triều Hậu Lê',
      en: 'Later Le Dynasty Mandarin Attire Codes',
    },
    video360: {
      title: {
        vi: 'Thước phim 360° Quan phục triều Hậu Lê',
        en: '360° Documentary: Later Le Court Mandarin Attire',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '7:02',
      channel: 'Di Sản Sử Việt',
    },
    model3d: {
      title: 'Mô hình 3D Áo Viên Lĩnh Bổ Tử Quan Chế Lê Sơ',
      format: 'Interactive-Three',
      verticesCount: '52,800 Polygons',
      meshPreset: 'vien_linh',
      downloadUrl: '#3d-ao-vien-linh.glb',
      sourceCredit: 'Viện Nghiên cứu Cổ phục',
    },
    keyFeatures: [
      { vi: 'Cổ áo tròn gài cúc bên vai phải', en: 'Round collar buttoned at right shoulder' },
      { vi: 'Bổ tử trước ngực định danh phẩm trật', en: 'Rank badge defining bureaucratic rank' },
      { vi: 'Đai ngọc thắt ngang lưng uy nghiêm', en: 'Jade-inlaid ceremonial belt' },
    ],
  },
  {
    id: 'ao-doi-kham',
    name: {
      vi: 'Áo Đối Khâm',
      en: 'Doi Kham (Parallel-Collared Long Robe)',
    },
    era: {
      vi: 'Triều Lý - Trần - Lê - Nguyễn',
      en: 'Ly, Tran, Le & Nguyen Dynasties',
    },
    dynastyKey: 'ly-tran',
    century: 'XI - XIX',
    gender: 'female',
    description: {
      vi: 'Áo Đối Khâm có hai vạt áo trước song song buông thẳng, thường dùng làm áo khoác ngoài cho phái nữ quý tộc hoặc mặc thường nhật thanh tao.',
      en: 'Doi Kham features two parallel front panels hanging straight down without overlapping, commonly worn as an outer robe by noble ladies or for refined daily occasions.',
    },
    structure: {
      vi: 'Hai vạt áo đối xứng song song, để mở lộ lớp áo trong (như yếm thêu hoặc áo giao lĩnh mỏng). Tay áo thường buông rộng hoặc lửng, tạo độ bay bổng và nhiều lớp layer thời trang.',
      en: 'Symmetrical open front panels showcasing the inner garments (such as an embroidered yem halter bodice or inner robe). Flowing sleeves creating layered movement.',
    },
    philosophy: {
      vi: 'Đối xứng hài hòa thể hiện sự cởi mở, phong thái ung dung tự tại nhưng vẫn giữ được nét kín đáo e ấp của người phụ nữ phương Đông.',
      en: 'Symmetry embodies open-hearted balance, nonchalant grace and the gentle poetic modesty of Eastern femininity.',
    },
    occasion: {
      vi: 'Dạo chơi xuân đình, thưởng nguyệt, các buổi nhã nhạc tri âm, chụp ảnh dã ngoại và ứng dụng phối đồ remix hiện đại cực kỳ xuất sắc.',
      en: 'Garden strolls, moon festivals, chamber music gatherings, aesthetic outdoor portraits, and outstanding modern fashion layering remix.',
    },
    hairAndMakeup: {
      vi: 'Tóc búi nửa đầu buông lơi, cài hoa tươi hoặc trâm ngọc bích, tông trang điểm mỏng nhẹ cánh hoa đào mùa xuân.',
      en: 'Half-up flowing hair adorned with fresh jasmine or jade hairpins, delicate peach blossom makeup.',
    },
    jewelry: {
      vi: 'Vòng cổ bạc nhiều tầng, túi thơm hương quế hồi, quạt lụa tròn tiêu tương, hài thêu hoa sen.',
      en: 'Multi-strand silver torque, scented botanical sachet, round silk fan with lotus embroidery.',
    },
    notableColors: ['#831843', '#065F46', '#B45309', '#3730A3', '#9D174D'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    video360: {
      title: {
        vi: 'Trải nghiệm 360° Phong thái Áo Đối Khâm Kinh Thành',
        en: '360° Elegance of Imperial Court Doi Kham',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '3:50',
      channel: 'Vân Pok Studio',
    },
    model3d: {
      title: 'Mô hình 3D Áo Đối Khâm Layering Quý Tộc',
      format: 'Interactive-Three',
      verticesCount: '39,400 Polygons',
      meshPreset: 'doi_kham',
      downloadUrl: '#3d-ao-doi-kham.glb',
      sourceCredit: 'Việt Phục Remix Lab',
    },
    keyFeatures: [
      { vi: 'Hai vạt áo mở song song khoe lớp yếm lót', en: 'Parallel open lapels showcasing inner layers' },
      { vi: 'Dáng áo bay bổng tuyệt mỹ khi di chuyển', en: 'Airy flowing drape upon movement' },
      { vi: 'Rất thích hợp cho phong cách Layering Remix', en: 'Ideal for contemporary layering remix styling' },
    ],
  },
  {
    id: 'ao-dai-ngu-than',
    name: {
      vi: 'Áo Dài Ngũ Thân Tay Chẽn',
      en: 'Five-Panel Fitted Robe (Ancestor of Modern Ao Dai)',
    },
    era: {
      vi: 'Thời Chúa Nguyễn & Triều Nguyễn (Thế kỷ 18 - 20)',
      en: 'Nguyen Lords & Nguyen Dynasty (18th - 20th Century)',
    },
    dynastyKey: 'trieu-nguyen',
    century: 'XVIII - XX',
    gender: 'unisex',
    description: {
      vi: 'Được định hình từ cuộc cải cách y phục của Chúa Nguyễn Phúc Khoát (1744) và vua Minh Mạng (1827-1837), đây chính là tiền thân trực hệ của chiếc Áo Dài Việt Nam danh tiếng thế giới.',
      en: 'Standardized by Lord Nguyen Phuc Khoat (1744) and Emperor Minh Mang (1827-1837), this is the direct lineage ancestor of the globally celebrated Vietnamese Ao Dai.',
    },
    structure: {
      vi: 'Áo gồm 5 thân vải khâu nối, cổ đứng cao 2-3cm tròn ôm khít, gài 5 cúc nghiêng từ cổ xuống nách rồi dọc sườn phải. Tay áo may chẽn ôm sát cổ tay linh hoạt, vạt áo dài qua gối.',
      en: 'Built with five fabric panels, a snug mandarin standing collar (2-3cm), fastened with 5 buttons curving under the right arm. Fitted sleeves at the wrist allowing agile movement.',
    },
    philosophy: {
      vi: 'Thể hiện trọn vẹn tinh thần "Quốc phục" thống nhất Bắc Nam: khiêm nhường, kín đáo, đoan trang mà phóng khoáng, biểu trưng cho nề nếp gia phong và nhân cách chính trực.',
      en: 'Expresses the unified national soul: modest, respectful, poised yet comfortable, symbolizing moral integrity and family virtues.',
    },
    occasion: {
      vi: 'Thường phục thường nhật của trí thức nho nhã, văn nhân, quan lại khi không thiết triều, lễ hỏi cưới, khánh tiết, ngày lễ Tết truyền thống.',
      en: 'Daily attire of scholars, intellectuals, diplomats, weddings, Tet holidays, cultural exchanges.',
    },
    hairAndMakeup: {
      vi: 'Nam giới quấn khăn đóng chữ Nhân hoặc chữ Nhất; nữ giới vấn khăn trần hoặc tóc dài tự nhiên kẹp nửa.',
      en: 'Men with wrapped turbans (Khan Dong); women with bare hair coils or natural sleek long hair.',
    },
    jewelry: {
      vi: 'Đồng hồ quả quýt bỏ túi áo con, quạt xếp tre, guốc mộc quai cong hoặc giày da cổ điển phong cách tân cổ giao duyên.',
      en: 'Pocket watch in inner pocket, bamboo folding fan, wooden clogs or vintage leather shoes.',
    },
    notableColors: ['#1C1917', '#1E3A5F', '#57534E', '#854D0E', '#991B1B'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kYJvYg_C72g',
    videoTitle: {
      vi: 'Sự ra đời và hồi sinh của Áo Dài Ngũ Thân nam nữ',
      en: 'The Heritage Revival of Five-Panel Ao Dai',
    },
    video360: {
      title: {
        vi: 'Góc nhìn 360°: Hồi sinh Áo Dài Ngũ Thân',
        en: '360° Perspective: Revival of Five-Panel Ao Dai',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '8:15',
      channel: 'Áo Dài Heritage',
    },
    model3d: {
      title: 'Mô hình 3D Áo Dài Ngũ Thân Tay Chẽn Tiền Thân Áo Dài',
      format: 'Interactive-Three',
      verticesCount: '31,200 Polygons',
      meshPreset: 'ao_tac',
      downloadUrl: '#3d-ngu-than.glb',
      sourceCredit: 'Việt Phục Remix 3D Lab',
    },
    keyFeatures: [
      { vi: 'Tay chẽn gọn gàng, cổ đứng nghiêm trang', en: 'Fitted sleeves and dignified high collar' },
      { vi: '5 cúc cài dọc nách phải tượng trưng Ngũ Thường', en: '5 side buttons honoring the 5 virtues' },
      { vi: 'Tôn dáng thanh lịch cho cả nam và nữ', en: 'Flattering silhouette for both men and women' },
    ],
  },
  {
    id: 'ao-tu-than-yem-dao',
    name: {
      vi: 'Áo Tứ Thân & Yếm Đào',
      en: 'Four-Panel Tunic & Bodice (Ao Tu Than & Yem)',
    },
    era: {
      vi: 'Dân gian Đồng bằng Bắc Bộ (Thế kỷ 12 - Thế kỷ 20)',
      en: 'Northern Delta Folk Tradition (12th - 20th Century)',
    },
    dynastyKey: 'dan-gian',
    century: 'XII - XX',
    gender: 'female',
    description: {
      vi: 'Biểu tượng bình dị và quyến rũ bất hủ của người phụ nữ nông thôn và kinh kỳ đồng bằng sông Hồng. Gắn liền với các liền chị quan họ Kinh Bắc và hội làng thanh bình.',
      en: 'The immortal poetic symbol of women in the Red River Delta and historic northern plains. Deeply tied to Quan Ho folk singing culture and village spring festivals.',
    },
    structure: {
      vi: 'Áo ngoài xẻ 4 thân: hai thân sau khâu liền sống lưng, hai thân trước buông dài để thắt nút trước bụng. Bên trong mặc Yếm đào (yếm cổ xây hoặc cổ nhạn) thêu hoa, quấn bao thắt lưng xanh đỏ nhiều tầng, váy đầm đen lụa buông dài.',
      en: 'Four long panels: two back pieces stitched together, two front panels tied loosely at the waist. Worn over an inner Yem (halter bodice), accented with vibrant silk waist sashes and a flowing black silk skirt.',
    },
    philosophy: {
      vi: 'Bốn vạt áo tượng trưng cho tứ thân phụ mẫu luôn chở che. Hai vạt trước buộc lại như tình cảm vợ chồng keo sơn gắn kết, chiếc nón quai thao che chở nắng mưa cuộc đời lam lũ.',
      en: 'The four panels represent four parents nurturing their child. The front knot symbolizes devotion between husband and wife; the conical hat shields through life hardships.',
    },
    occasion: {
      vi: 'Hội Lim, chèo truyền thống, hát then ca trù, ngày hội mùa lúa chín, nghệ thuật biểu diễn dân ca.',
      en: 'Lim Festival, traditional opera, folk folk singing, harvest celebrations, stage performances.',
    },
    hairAndMakeup: {
      vi: 'Tóc đuôi gà vấn trần nhung đen, hoa tai quả nhót bạc, nụ cười răng đen nhánh hoặc môi đỏ trầu thắm đượm tình duyên quê hương.',
      en: 'Ponytail wrapped in black velvet band, silver teardrop earrings, radiant natural country charm.',
    },
    jewelry: {
      vi: 'Nón quai thao quai thao thao lụa thao, ruột tượng thắt lưng ngũ sắc, xà tích bạc đong đưa bên hông.',
      en: 'Large flat palm hat (Non Quai Thao) with silk ribbons, multi-colored silk sash, dangling silver hip chain (Xa Tich).',
    },
    notableColors: ['#991B1B', '#C2410C', '#854D0E', '#065F46', '#1E293B'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    video360: {
      title: {
        vi: 'Không gian 360° Hội Lim & Liền Chị Quan Họ',
        en: '360° Experience: Lim Festival & Quan Ho Attire',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '5:12',
      channel: 'Dân Ca Bắc Ninh',
    },
    model3d: {
      title: 'Mô hình 3D Áo Tứ Thân & Nón Quai Thao Dân Gian',
      format: 'Interactive-Three',
      verticesCount: '34,900 Polygons',
      meshPreset: 'tu_than',
      downloadUrl: '#3d-tu-than.glb',
      sourceCredit: 'Kinh Bắc Folk Lab',
    },
    keyFeatures: [
      { vi: 'Yếm đào cổ điển bên trong gợi cảm', en: 'Sensual inner silk Yem bodice' },
      { vi: 'Hai vạt trước thắt nút duyên dáng', en: 'Front panels tied gracefully at the waist' },
      { vi: 'Nón quai thao và xà tích bạc truyền thống', en: 'Non Quai Thao hat and silver hip chain' },
    ],
  },
  {
    id: 'ao-dai-lemur-phong-hoa',
    name: {
      vi: 'Áo Dài Le Mur & Phong Hóa',
      en: 'Ao Dai Le Mur (1930s Avant-Garde Wave)',
    },
    era: {
      vi: 'Phong trào Thơ Mới & Tự Lực Văn Đoàn (1934 - 1940)',
      en: 'New Poetry Movement & Tu Luc Van Doan (1934 - 1940)',
    },
    dynastyKey: 'can-dai',
    century: 'XX (1930s)',
    gender: 'female',
    description: {
      vi: 'Cột mốc cách tân trang phục rực rỡ do họa sĩ Cát Tường (Le Mur) khởi xướng trên tuần báo Phong Hóa, kết hợp phom dáng Áo Dài truyền thống với nét lãng mạn phương Tây.',
      en: 'The pioneering modern reform led by artist Cat Tuong (Le Mur) in Phong Hoa magazine, marrying traditional Ao Dai geometry with romantic French Art Deco tailoring.',
    },
    structure: {
      vi: 'Áo ôm sát đường cong cơ thể, cổ bẻ lá sen hoặc khoét hình trái tim, vai phồng nhún bèo, tay raglan tân kỳ, vạt áo dài tha thướt chạm gót giày cao gót.',
      en: 'Fitted silhouette hugging female contours, lotus leaf or heart-shaped collars, ruffled puff shoulders, flowing panels sweeping over high-heeled shoes.',
    },
    philosophy: {
      vi: 'Biểu tượng của sự giải phóng phụ nữ trí thức tân thời những năm 1930, khát vọng khẳng định cá tính tự do và vẻ đẹp thanh tân rạng rỡ của người phụ nữ Việt Nam hiện đại.',
      en: 'A symbol of liberation for educated women in the 1930s, seeking artistic freedom and celebrating modern Vietnamese feminine allure.',
    },
    occasion: {
      vi: 'Dạo phố Tràng Tiền Hà Nội, triển lãm hội họa, tiệc khiêu vũ tân thời, các buổi hòa nhạc thính phòng giao duyên.',
      en: 'Strolling Trang Tien street in Hanoi, art exhibitions, modern dance soirees, salon recitals.',
    },
    hairAndMakeup: {
      vi: 'Tóc uốn lọn sóng nước cổ điển (finger waves), kẻ mắt cat-eye tinh nghịch, son môi đỏ Bordeaux quý phái.',
      en: 'Classic 1930s finger wave curls, subtle winged eyeliner, bold vintage Bordeaux lipstick.',
    },
    jewelry: {
      vi: 'Chuỗi vòng ngọc trai Art Deco, ví cầm tay đính hạt cườm, giày gót nhọn satin, kính râm gọng đồi mồi.',
      en: 'Art Deco pearl strands, beaded clutch purse, satin stilettos, tortoiseshell sunglasses.',
    },
    notableColors: ['#9F1239', '#1E40AF', '#15803D', '#FAF5FF', '#0F172A'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    video360: {
      title: {
        vi: 'Ký sự 360°: Làn sóng Thơ Mới & Áo Dài Cát Tường',
        en: '360° Modern Poetry & 1930s Ao Dai Revolution',
      },
      embedUrl: 'https://www.youtube.com/embed/kYJvYg_C72g',
      is360: true,
      duration: '4:40',
      channel: 'Văn Hóa Nghệ Thuật',
    },
    model3d: {
      title: 'Mô hình 3D Áo Dài Le Mur Tân Thời Thập Niên 1930',
      format: 'Interactive-Three',
      verticesCount: '29,800 Polygons',
      meshPreset: 'ao_tac',
      downloadUrl: '#3d-lemur.glb',
      sourceCredit: 'Tân Phong 1930 Lab',
    },
    keyFeatures: [
      { vi: 'Cổ bẻ lá sen và vai bồng phong cách Pháp', en: 'Puff shoulders and French lotus collar' },
      { vi: 'Đường eo chiết gọn tôn vinh đường cong', en: 'Hourglass tailoring celebrating the figure' },
      { vi: 'Cầu nối giữa di sản cổ phong và thời trang đương đại', en: 'Bridge between heritage and modern couture' },
    ],
  },
];
