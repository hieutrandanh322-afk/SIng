import { AvatarState, CulturalCheckResult, SafeguardRule } from '../types';

export const CULTURAL_SAFEGUARD_RULES: SafeguardRule[] = [
  {
    id: 'RULE_01_LOWER_BODY',
    title: {
      vi: 'Quy tắc 1: Trang nghiêm Hạ bộ (Bảo hộ Lễ nghi)',
      en: 'Rule 1: Lower Body Decorum & Form',
    },
    summary: {
      vi: 'Áo Giao Lĩnh, Viên Lĩnh, Áo Tấc, Áo Ngũ Thân BẮT BUỘC phối với quần dài hoặc váy quấn kín đáo.',
      en: 'Giao Linh, Vien Linh, Ao Tac, and Ao Ngu Than MUST be worn with full-length trousers or wrap skirts.',
    },
    detailedRule: {
      vi: 'Trang phục truyền thống Việt Nam coi trọng sự tề chỉnh "kín cổng cao tường". Tuyệt đối không để hở hạ bộ hoặc mặc quần short ngắn cũn cỡn bên trong các tà áo dài trang trọng. Đây là lỗi nghiêm trọng làm mất đi phom dáng và sự tôn nghiêm của cổ phục.',
      en: 'Vietnamese traditional costume design prioritizes grace and modesty. Wearing shorts or exposing bare legs under long ceremonial robes is a severe violation that destroys the garment silhouette and cultural dignity.',
    },
    historicalContext: {
      vi: 'Khâm định Đại Nam hội điển sự lệ quy định rõ: nam nữ khi mặc áo dài phải có quần lụa trắng hoặc sẫm màu dài trùm mắt cá chân, ống quần rộng tạo bước đi khoan thai, che giấu thân thể trang nhã.',
      en: 'Imperial statutes recorded that all formal dress codes strictly dictated full-length silk trousers falling past the ankles, ensuring poised steps and immaculate poise.',
    },
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_02_IMPERIAL_MOTIFS',
    title: {
      vi: 'Quy tắc 2: Phẩm trật Hoàng gia (Rồng 5 móng & Vàng Hoàng Kim)',
      en: 'Rule 2: Imperial Hierarchy (Five-Clawed Dragon & Pure Gold)',
    },
    summary: {
      vi: 'Rồng 5 móng (Ngũ trảo long) và sắc Vàng Hoàng Kim nguyên bản là đặc quyền tối thượng của Hoàng đế.',
      en: 'Five-clawed dragons (Ngũ Trảo Long) and Imperial Yellow were strictly reserved for the Emperor.',
    },
    detailedRule: {
      vi: 'Trong điển chế triều đình Đại Việt và triều Nguyễn, chỉ Hoàng đế mới được mặc áo thêu Rồng 5 móng với màu vàng chính sắc (Hoàng kim). Hoàng tử, quan lại và thứ dân chỉ được dùng hình tượng Mãng (rồng 4 móng), Giao long hoặc hoa sen, hạc trắng, mây lành. Lạm dụng rồng 5 móng trên trang phục thường dân là phạm thượng lịch sử.',
      en: 'Imperial sumptuary laws dictated that only the Sovereign could wear robes with five-clawed dragons and imperial gold. Princes and mandarins used four-clawed pythons (Mang) or cranes and lotuses. Misappropriating 5-claw dragons is a historical imperial violation.',
    },
    historicalContext: {
      vi: 'Luật pháp thời Lê và Nguyễn trừng phạt rất nặng tội "tiếm dụng long bào" (lấy trộm hoặc bắt chước trang phục Thiên tử).',
      en: 'Historical criminal codes severely punished sumptuary overstepping (tiếm dụng long bào) to maintain cosmic order and civil hierarchy.',
    },
    severity: 'CRITICAL',
  },
  {
    id: 'RULE_03_ERA_CHRONOLOGY',
    title: {
      vi: 'Quy tắc 3: Niên đại Đồng nhất (Tránh râu ông nọ cắm cằm bà kia)',
      en: 'Rule 3: Chronological Dynasty Harmony',
    },
    summary: {
      vi: 'Không nên kết hợp phụ kiện hoặc mũ mão của triều đại này với phom áo của triều đại khác cách nhau hàng thế kỷ.',
      en: 'Avoid pairing distinctive dynasty headwear with costumes from vastly different eras (e.g. Later Le cap with Nguyen robe).',
    },
    detailedRule: {
      vi: 'Mỗi triều đại (Lý, Trần, Lê, Nguyễn) đều có hệ thống quan chế, thẩm mỹ mũ mão và phụ kiện hoàn toàn khác nhau. Việc phối Mũ Ô Sa hai cánh chuồn thời Hậu Lê cùng Áo Nhật Bình triều Nguyễn tuy có thể coi là remix đương đại nhưng sẽ gây hiểu lầm tai hại về niên đại lịch sử.',
      en: 'Each dynasty bore distinctive crown structures and regalia. Mixing a winged Later Le court cap with a 19th-century Nguyen Nhat Binh robe creates severe anachronism and cultural confusion.',
    },
    historicalContext: {
      vi: 'Vua Minh Mạng từng thực hiện cải cách quy mô lớn từ năm 1827 để chuẩn hóa y phục cả nước, xóa bỏ hoàn toàn tàn dư trang phục thời Lê - Trịnh ở Bắc Hà để định hình một chuẩn mực mới.',
      en: 'Emperor Minh Mang led landmark uniform dress reforms between 1827 and 1837 to unify northern and southern attire into a cohesive national identity.',
    },
    severity: 'WARNING',
  },
  {
    id: 'RULE_04_SPIRITUAL_DECENCY',
    title: {
      vi: 'Quy tắc 4: Thuần phong Mỹ tục nơi Tôn nghiêm',
      en: 'Rule 4: Cultural Decency in Sacred Sanctuaries',
    },
    summary: {
      vi: 'Không mặc chất liệu mỏng xuyên thấu, cắt xẻ táo bạo khi chọn bối cảnh Đền chùa, Chốn tâm linh.',
      en: 'Never wear sheer see-through textiles or provocative cutouts in sacred temples, pagodas, or ancestral shrines.',
    },
    detailedRule: {
      vi: 'Khi check-in hoặc mặc cổ phục tại các không gian tín ngưỡng tôn nghiêm (Văn Miếu, Đền Hùng, chùa cổ), trang phục cần chất liệu dày dặn, đoan trang, lịch thiệp. Dùng vải voan mỏng lộ yếm trong hoặc hở lưng tại nơi thờ tự là hành vi bất kính với tổ tiên và di sản văn hóa.',
      en: 'In venerated ancestral spaces (Temple of Literature, Hung King Temple, ancient shrines), fabrics must be respectful, opaque, and dignified. Revealing undergarments in sacred spaces breaches spiritual propriety.',
    },
    historicalContext: {
      vi: 'Văn hóa Việt Nam nghìn đời xem "Y phục xứng kỳ đức" - trang phục phản ánh cốt cách và lòng thành kính đối với thần linh, tiên tổ và cộng đồng.',
      en: 'Vietnamese traditional values uphold that "attire reflects inner virtue" - dress embodies reverence towards ancestors and community.',
    },
    severity: 'CRITICAL',
  },
];

export function evaluateLocalSafeguard(state: AvatarState): CulturalCheckResult {
  const detailedRules: {
    ruleId: string;
    ruleName: string;
    passed: boolean;
    severity: 'CRITICAL' | 'WARNING' | 'SAFE';
    feedback: string;
  }[] = [];

  let overallStatus: 'Pass' | 'Fail' = 'Pass';
  let errorCode = 'ALL_CLEAR';
  const errorMessages: string[] = [];

  // Check Rule 1: Lower body
  if (state.lowerGarment === 'quan_short_loi') {
    detailedRules.push({
      ruleId: 'RULE_01_LOWER_BODY',
      ruleName: 'Quy tắc 1: Trang nghiêm Hạ bộ',
      passed: false,
      severity: 'CRITICAL',
      feedback: 'LỖI NGHIÊM TRỌNG: Mặc quần short cộc bên trong tà áo cổ phục trang trọng! Hãy đổi ngay sang quần lụa trắng hoặc váy quấn đen dài phủ chân.',
    });
    overallStatus = 'Fail';
    errorCode = 'ERR_LOWER_BODY';
    errorMessages.push('Hạ bộ không tề chỉnh (quần short làm hỏng phom dáng truyền thống)');
  } else {
    detailedRules.push({
      ruleId: 'RULE_01_LOWER_BODY',
      ruleName: 'Quy tắc 1: Trang nghiêm Hạ bộ',
      passed: true,
      severity: 'SAFE',
      feedback: 'ĐẠT CHUẨN: Lớp hạ bộ phủ dài chấm mắt cá chân, kín đáo và đúng phong thái cổ phong.',
    });
  }

  // Check Rule 2: Imperial dragon & imperial gold
  const isImperialDragon = state.dragonPattern === 'ngu_trao_long';
  const isImperialYellow = state.selectedGarmentColor === '#FFD700' || state.selectedGarmentColor === '#F59E0B';
  const isRoyalRobe = state.selectedGarmentId === 'ao-nhat-binh';

  if (isImperialDragon && !isRoyalRobe) {
    detailedRules.push({
      ruleId: 'RULE_02_IMPERIAL_MOTIFS',
      ruleName: 'Quy tắc 2: Phẩm trật Hoàng gia',
      passed: false,
      severity: 'CRITICAL',
      feedback: 'LỖI NGHIÊM TRỌNG: Rồng 5 móng (Ngũ trảo long) là đặc quyền tối cao của Hoàng đế! Hãy chọn họa tiết hoa sen thanh khiết hoặc hoa văn thủy ba ngũ sắc.',
    });
    overallStatus = 'Fail';
    if (errorCode === 'ALL_CLEAR') errorCode = 'ERR_IMPERIAL_DRAGON';
    errorMessages.push('Sử dụng rồng ngũ trảo sai phẩm trật (đặc quyền Thiên tử)');
  } else if (isImperialYellow && state.selectedGarmentId === 'ao-tu-than-yem-dao') {
    detailedRules.push({
      ruleId: 'RULE_02_IMPERIAL_MOTIFS',
      ruleName: 'Quy tắc 2: Phẩm trật Hoàng gia',
      passed: false,
      severity: 'CRITICAL',
      feedback: 'LỖI CẢNH BÁO: Sắc vàng hoàng kim chói lọi không thuộc về áo Tứ Thân dân gian đồng bằng Bắc Bộ.',
    });
    overallStatus = 'Fail';
    if (errorCode === 'ALL_CLEAR') errorCode = 'ERR_IMPERIAL_DRAGON';
    errorMessages.push('Màu vàng hoàng kim không phù hợp với y phục dân dã');
  } else {
    detailedRules.push({
      ruleId: 'RULE_02_IMPERIAL_MOTIFS',
      ruleName: 'Quy tắc 2: Phẩm trật Hoàng gia',
      passed: true,
      severity: 'SAFE',
      feedback: 'ĐẠT CHUẨN: Họa tiết và màu sắc nằm trong giới hạn phẩm trật hài hòa.',
    });
  }

  // Check Rule 3: Era mismatch
  const isLeCap = state.headwear === 'mao_le_mismatch';
  const isNguyenCostume = state.selectedGarmentId === 'ao-nhat-binh' || state.selectedGarmentId === 'ao-tac-nguyen';

  if (isLeCap && isNguyenCostume) {
    detailedRules.push({
      ruleId: 'RULE_03_ERA_CHRONOLOGY',
      ruleName: 'Quy tắc 3: Niên đại Đồng nhất',
      passed: false,
      severity: 'WARNING',
      feedback: 'LỖI CẢNH BÁO: Bạn đang phối Mũ cánh chuồn triều Lê với Áo Nhật Bình / Áo Tấc triều Nguyễn (cách nhau hơn 200 năm). Hãy đổi sang khăn vấn trần hoặc khăn vành dây để chuẩn sử!',
    });
    if (overallStatus !== 'Fail') {
      overallStatus = 'Fail';
      errorCode = 'WARN_ERA_MISMATCH';
    }
    errorMessages.push('Niên đại mũ mão và trang phục không đồng bộ (Lê x Nguyễn)');
  } else {
    detailedRules.push({
      ruleId: 'RULE_03_ERA_CHRONOLOGY',
      ruleName: 'Quy tắc 3: Niên đại Đồng nhất',
      passed: true,
      severity: 'SAFE',
      feedback: 'ĐẠT CHUẨN: Phụ kiện mũ nón và triều đại trang phục tương thích.',
    });
  }

  // Check Rule 4: Spiritual decency
  const isSacredContext = state.occasionContext === 'le_chua_tam_linh';
  const isSheer = state.fabricType === 'voan_xuyen_thau';

  if (isSacredContext && isSheer) {
    detailedRules.push({
      ruleId: 'RULE_04_SPIRITUAL_DECENCY',
      ruleName: 'Quy tắc 4: Thuần phong Mỹ tục nơi Tôn nghiêm',
      passed: false,
      severity: 'CRITICAL',
      feedback: 'LỖI NGHIÊM TRỌNG: Không gian đền chùa tôn nghiêm tuyệt đối không mặc chất vải voan mỏng xuyên thấu! Hãy chọn lụa tơ tằm Vạn Phúc hoặc gấm dệt Bảo Lộc trang nhã.',
    });
    overallStatus = 'Fail';
    if (errorCode === 'ALL_CLEAR') errorCode = 'ERR_INDECENCY';
    errorMessages.push('Chất liệu xuyên thấu tại chốn tâm linh đền chùa');
  } else {
    detailedRules.push({
      ruleId: 'RULE_04_SPIRITUAL_DECENCY',
      ruleName: 'Quy tắc 4: Thuần phong Mỹ tục nơi Tôn nghiêm',
      passed: true,
      severity: 'SAFE',
      feedback: 'ĐẠT CHUẨN: Phù hợp thuần phong mỹ tục và không gian bối cảnh.',
    });
  }

  let userMessage = 'Tuyệt vời! Bộ trang phục của bạn đạt chuẩn Di Sản 100%. Hãy tự tin chia sẻ hoặc dạo bước kinh kỳ!';
  if (overallStatus === 'Fail') {
    userMessage = `Màng lọc Di sản phát hiện điểm chưa chuẩn xác: ${errorMessages.join(', ')}. Hãy điều chỉnh theo gợi ý micro-learning để chuẩn di sản nhé!`;
  }

  return {
    status: overallStatus,
    error_code: errorCode,
    user_message: userMessage,
    detailedRules,
    historicalTrivia: 'Người xưa quan niệm: "Y phục xứng kỳ đức" - mỗi nếp áo, nút cài đều ẩn chứa đạo hiếu và trật tự đất trời.',
  };
}
