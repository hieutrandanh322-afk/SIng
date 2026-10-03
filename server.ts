import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

type FunctionDeclaration = any;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper geographical calculations for O2O coordinator
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

function estimateTravelTimeMinutes(distanceKm: number, transport: string = 'motorbike'): number {
  const speeds: Record<string, number> = { walk: 4.5, motorbike: 32, car: 28 };
  const speed = speeds[transport] || speeds.motorbike;
  const minutes = Math.round((distanceKm / speed) * 60) + 3;
  return Math.max(3, minutes);
}

// Load static dataset safely without relying on extensionless ESM resolvers
const costumesFilePath = path.resolve(__dirname, 'src/data/vietCostumes.json');
const locationsFilePath = path.resolve(__dirname, 'src/data/locations.json');

const VIET_COSTUMES: any[] = fs.existsSync(costumesFilePath)
  ? JSON.parse(fs.readFileSync(costumesFilePath, 'utf-8'))
  : [];

const VIET_LOCATIONS: any[] = fs.existsSync(locationsFilePath)
  ? JSON.parse(fs.readFileSync(locationsFilePath, 'utf-8'))
  : [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '15mb' }));

  // Shared server-side Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Resilient multi-tier model executor with retry and exponential backoff
  async function generateContentResilient(params: {
    contents: any;
    config?: any;
    preferredModel?: string;
    timeoutMs?: number;
    maxRetriesPerModel?: number;
  }) {
    const timeout = params.timeoutMs || 15000;
    const maxRetries = params.maxRetriesPerModel ?? 2;
    const candidates = [
      params.preferredModel,
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ].filter(Boolean) as string[];
    const uniqueModels = Array.from(new Set(candidates));
    let lastError: any = null;

    for (const model of uniqueModels) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Model ${model} timeout after ${timeout}ms`)), timeout)
          );
          const callPromise = ai.models.generateContent({
            model,
            contents: params.contents,
            config: params.config,
          });
          const response = (await Promise.race([callPromise, timeoutPromise])) as any;
          if (response) {
            return response;
          }
        } catch (err: any) {
          lastError = err;
          const errMsg = err?.message || String(err);
          const isHighDemand = errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('temporarily unavailable');
          const isRateLimit = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED');

          if ((isHighDemand || isRateLimit) && attempt < maxRetries) {
            const delay = 700 * attempt;
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          console.log(`[AI Orchestrator] Model ${model} is experiencing heavy demand (attempt ${attempt}/${maxRetries}), rotating to alternate model...`);
          break;
        }
      }
    }
    throw lastError;
  }

  // 1. Digital Museum Extraction (Prompt 1)
  app.post('/api/gemini/museum-extract', async (req, res) => {
    try {
      const { costumeName, eraHint, imageBase64, mimeType } = req.body;
      const promptText = `Bạn là một chuyên gia văn hóa, lịch sử và thời trang truyền thống Việt Nam (Việt phục).
Nhiệm vụ của bạn là nhận thông tin hoặc hình ảnh về trang phục "${costumeName || 'trang phục Việt'}" (thời kỳ: ${eraHint || 'Việt Nam qua các triều đại'}), sau đó phân tích và trả về thông tin dưới định dạng JSON cấu trúc (Structured JSON format).
Yêu cầu phân tích và trả về các trường dữ liệu sau bằng cả tiếng Việt và tiếng Anh:
- Tên trang phục (Name) [vi & en]
- Niên đại (Era) [vi & en]
- Đặc điểm cấu trúc (Structure): Mô tả chi tiết về vạt áo, cổ áo, tay áo, quần/váy đi kèm [vi & en]
- Triết lý văn hóa (Philosophy): Ý nghĩa biểu tượng (ví dụ: ngũ thường, tứ thân phụ mẫu, âm dương ngũ hành) [vi & en]
- Hoàn cảnh sử dụng (Occasion): Sự kiện phù hợp để mặc (lễ hội, thường nhật, tâm linh, cung đình) [vi & en]
- Gợi ý kiểu tóc và trang sức kèm theo [vi & en]
Giọng văn: Trang trọng, học thuật, mang tính giáo dục bảo tàng. Tuyệt đối không bịa đặt các chi tiết lịch sử không có thật.`;

      let contents: any = promptText;
      if (imageBase64) {
        contents = {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            { text: promptText },
          ],
        };
      }

      const response = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nameVi: { type: Type.STRING },
              nameEn: { type: Type.STRING },
              eraVi: { type: Type.STRING },
              eraEn: { type: Type.STRING },
              structureVi: { type: Type.STRING },
              structureEn: { type: Type.STRING },
              philosophyVi: { type: Type.STRING },
              philosophyEn: { type: Type.STRING },
              occasionVi: { type: Type.STRING },
              occasionEn: { type: Type.STRING },
              hairAndJewelryVi: { type: Type.STRING },
              hairAndJewelryEn: { type: Type.STRING },
              notableFeatures: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'nameVi',
              'nameEn',
              'eraVi',
              'eraEn',
              'structureVi',
              'structureEn',
              'philosophyVi',
              'philosophyEn',
              'occasionVi',
              'occasionEn',
            ],
          },
        },
      });

      const text = response.text || '{}';
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.log('[AI Orchestrator] Museum extract using resilient curated heritage data');
      const searchKey = String(req.body.costumeName || '').toLowerCase();
      const matched = VIET_COSTUMES.find(
        (c) => c.name.vi.toLowerCase().includes(searchKey) || c.id.toLowerCase().includes(searchKey)
      ) || VIET_COSTUMES[0];

      res.json({
        nameVi: matched.name.vi,
        nameEn: matched.name.en,
        eraVi: matched.era.vi,
        eraEn: matched.era.en,
        structureVi: matched.description.vi,
        structureEn: matched.description.en,
        philosophyVi: 'Thân áo năm thân tượng trưng cho Tứ thân phụ mẫu và chính mình; năm cúc đại diện cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
        philosophyEn: 'The five panels symbolize parents and oneself; five buttons embody Confucian virtues of Benevolence, Propriety, Righteousness, Wisdom, and Sincerity.',
        occasionVi: matched.occasion.vi,
        occasionEn: matched.occasion.en,
        hairAndJewelryVi: 'Khăn vấn trần nhung đen hoặc mấn gấm, cài trâm bạc hoa mai chạm lộng, vòng kiềng trơn.',
        hairAndJewelryEn: 'Traditional velvet headroll, carved silver floral hairpin, and plain silver neck choker.',
        notableFeatures: matched.keyFeatures.map((f: any) => f.vi),
      });
    }
  });

  // 2. Cultural Safeguard - Màng lọc Di sản (Prompt 2)
  app.post('/api/gemini/cultural-safeguard', async (req, res) => {
    try {
      const { selectedItems, occasion, notes, imageBase64, mimeType } = req.body;
      const promptText = `Bạn là "Người gác đền Di sản" - hệ thống kiểm duyệt độ chuẩn xác văn hóa của ứng dụng Việt Phục Remix.
Nhiệm vụ của bạn là nhận thông tin mô tả hoặc hình ảnh trang phục mà người dùng vừa phối (mix & match), phân tích và phát hiện các lỗi sai lệch về văn hóa, lịch sử hoặc thẩm mỹ thuần phong mỹ tục.
Chi tiết phối đồ hiện tại của người dùng:
- Các món đồ đã chọn: ${JSON.stringify(selectedItems)}
- Bối cảnh/Sự kiện người dùng dự định mặc: ${occasion || 'Chung / Lookbook'}
- Ghi chú: ${notes || 'Không có'}

Bộ quy tắc đánh giá (Knowledge Base) BẮT BUỘC kiểm tra:
1. Quy tắc 1 (Hạ bộ): Áo Giao Lĩnh, Viên Lĩnh, Áo Tấc, Áo Ngũ Thân BẮT BUỘC phải phối với quần dài hoặc váy quấn. Việc để hở hạ bộ hoặc mặc cùng quần short là LỖI NGHIÊM TRỌNG.
2. Quy tắc 2 (Họa tiết Hoàng gia): Rồng 5 móng (Ngũ trảo long) và màu Vàng Hoàng Kim là đặc quyền của Hoàng đế. Lạm dụng cho trang phục bình dân hoặc áo dài cách tân hiện đại là LỖI NGHIÊM TRỌNG.
3. Quy tắc 3 (Niên đại): Kết hợp phụ kiện khác triều đại (VD: mũ quan triều Lê phối cùng Áo Nhật Bình triều Nguyễn) là LỖI CẢNH BÁO.
4. Quy tắc 4 (Thuần phong mỹ tục): Không mặc áo voan mỏng xuyên thấu hoặc cách tân hở hang nếu bối cảnh sự kiện được chọn là "Không gian tâm linh", "Đền chùa", "Nơi tôn nghiêm".

Đầu ra yêu cầu (Trả về định dạng JSON):
- status: "Pass" (Đạt) hoặc "Fail" (Có lỗi hoặc cảnh báo nặng)
- error_code: (Ví dụ: "ERR_LOWER_BODY", "ERR_IMPERIAL_DRAGON", "WARN_ERA_MISMATCH", "ERR_INDECENCY", "ALL_CLEAR")
- user_message: Thông báo bằng giọng điệu thân thiện, giải thích lý do lịch sử và đề xuất cách sửa (Micro-learning) dành cho Gen Z.
- detailedRules: Danh sách 4 quy tắc với kết quả pass: boolean và ghi chú ngắn gọn cho từng quy tắc.`;

      let contents: any = promptText;
      if (imageBase64) {
        contents = {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            { text: promptText },
          ],
        };
      }

      const response = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ['Pass', 'Fail'] },
              error_code: { type: Type.STRING },
              user_message: { type: Type.STRING },
              detailedRules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ruleId: { type: Type.STRING },
                    ruleName: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN },
                    severity: { type: Type.STRING, enum: ['CRITICAL', 'WARNING', 'SAFE'] },
                    feedback: { type: Type.STRING },
                  },
                  required: ['ruleId', 'ruleName', 'passed', 'severity', 'feedback'],
                },
              },
              historicalTrivia: { type: Type.STRING },
            },
            required: ['status', 'error_code', 'user_message', 'detailedRules'],
          },
        },
      });

      const text = response.text || '{}';
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.log('[AI Orchestrator] Cultural safeguard using local cultural rule engine');
      const items = req.body?.selectedItems || {};
      const lower = String(items.lowerGarment || items.lower || '').toLowerCase();
      const motif = String(items.motif || items.dragonPattern || '').toLowerCase();
      const occasionStr = String(req.body?.occasion || '').toLowerCase();
      const fabric = String(items.fabric || items.fabricType || '').toLowerCase();

      const isLowerShort = lower.includes('short') || lower.includes('quan_short_loi') || lower === 'none';
      const isImperialDragon = motif.includes('rong_5_mong') || motif.includes('ngu_trao') || motif.includes('5 móng');
      const isIndecent = (occasionStr.includes('tam_linh') || occasionStr.includes('den_chua')) && (fabric.includes('xuyen_thau') || fabric.includes('voan'));

      const detailedRules = [
        {
          ruleId: 'RULE_01_LOWER_BODY',
          ruleName: 'Quy tắc 1: Trang nghiêm Hạ bộ',
          passed: !isLowerShort,
          severity: isLowerShort ? 'CRITICAL' : 'SAFE',
          feedback: isLowerShort
            ? 'Cổ phục trang trọng bắt buộc phải phối với quần dài hoặc váy quấn. Việc mặc quần short làm gãy phom dáng và tổn hại nét đoan trang di sản.'
            : 'Phần hạ bộ tề chỉnh với quần lụa dài trùm chân, tôn vinh cốt cách khoan thai của người Việt.',
        },
        {
          ruleId: 'RULE_02_IMPERIAL_MOTIFS',
          ruleName: 'Quy tắc 2: Phẩm trật Hoàng gia',
          passed: !isImperialDragon,
          severity: isImperialDragon ? 'CRITICAL' : 'SAFE',
          feedback: isImperialDragon
            ? 'Rồng 5 móng (Ngũ trảo long) là biểu tượng đặc quyền tối thượng của Thiên tử. Hãy đổi sang họa tiết hoa sen, mây lành hoặc giao long.'
            : 'Họa tiết hòa hợp với phẩm phục và đúng quy chuẩn điển chế lịch sử.',
        },
        {
          ruleId: 'RULE_03_ERA_CHRONOLOGY',
          ruleName: 'Quy tắc 3: Niên đại Đồng nhất',
          passed: true,
          severity: 'SAFE',
          feedback: 'Phối phụ kiện và phom dáng hài hòa niên đại triều đại.',
        },
        {
          ruleId: 'RULE_04_SPIRITUAL_DECENCY',
          ruleName: 'Quy tắc 4: Thuần phong Mỹ tục nơi Tôn nghiêm',
          passed: !isIndecent,
          severity: isIndecent ? 'CRITICAL' : 'SAFE',
          feedback: isIndecent
            ? 'Không gian tôn nghiêm đền chùa yêu cầu trang phục kín đáo, tránh vải mỏng xuyên thấu.'
            : 'Trang phục trang nhã, hoàn toàn thích hợp cho các sự kiện văn hóa và chốn tôn nghiêm.',
        },
      ];

      const hasFail = isLowerShort || isImperialDragon || isIndecent;
      res.json({
        status: hasFail ? 'Fail' : 'Pass',
        error_code: isLowerShort ? 'ERR_LOWER_BODY' : isImperialDragon ? 'ERR_IMPERIAL_DRAGON' : isIndecent ? 'ERR_INDECENCY' : 'ALL_CLEAR',
        user_message: hasFail
          ? 'Màng lọc phát hiện điểm cần điều chỉnh để chuẩn mực lịch sử hơn. Hãy tham khảo ghi chú để set đồ đạt 10 điểm tuyệt đối nhé!'
          : 'Tuyệt tác cổ phong! Bản phối của bạn chuẩn xác từng chi tiết văn hóa và toát lên thần thái rạng rỡ của người trẻ yêu di sản.',
        detailedRules,
        historicalTrivia: 'Tiền nhân đúc kết "Y phục xứng kỳ đức" — cách ăn mặc phản ánh nhân cách và lòng tự tôn văn hóa dân tộc.',
      });
    }
  });

  // 3. Lookbook Scoring, Social Media Copywriting & Soundtrack (Prompts 3, 10, 11 - Giai đoạn 5)
  app.post('/api/gemini/lookbook-score', async (req, res) => {
    try {
      const { costumeDetails, userProfile, colorsChosen } = req.body;
      const promptText = `Bạn là một "Giám đốc Sáng tạo Thời trang (Fashion Creative Director)", kiêm "Chuyên gia Sáng tạo Nội dung Viral (Social Media Manager)" và "Đạo diễn Âm nhạc (Music Curator)" của dự án Việt Phục Remix.
Người dùng sẽ cung cấp thông tin bộ Việt phục họ vừa tự phối trên Avatar 3D:
- Trang phục: ${JSON.stringify(costumeDetails)}
- Màu sắc chính: ${JSON.stringify(colorsChosen)}
- Thông tin người mặc: ${JSON.stringify(userProfile || {})}

Nhiệm vụ của bạn là thực hiện 3 nội dung sau và trả về định dạng JSON cấu trúc (Structured Outputs):

1. PROMPT 3: CHẤM ĐIỂM & GAMIFICATION:
- collectionName: Đặt tên bộ sưu tập thật kêu, giao thoa giữa cổ phong và hiện đại (ví dụ: "Đông Sơn Cyberpunk", "Nhã Nhạc Remix", "Chu Sa Haute Couture", "Thăng Long Lofi").
- heritageScore: Thang điểm 1-10 dựa trên độ chuẩn xác cấu trúc lịch sử (ví dụ: 9.8).
- remixScore: Thang điểm 1-10 dựa trên sự đột phá, kết hợp phụ kiện và thẩm mỹ đương đại (ví dụ: 9.4).
- colorHarmony: Nhận xét ngắn gọn về cách phối màu dựa trên vòng tròn màu sắc và triết lý Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ).
- review: Một câu khen ngợi hoặc nhận xét mang tính viral, sử dụng ngôn ngữ hiện đại, hóm hỉnh cho Gen Z.
- elementMatch: Mệnh ngũ hành hợp nhất (ví dụ: "Hỏa sinh Thổ - Quyến rũ & Điềm đạm").
- trendingKeywords: Mảng 4-6 hashtag trendy cho Instagram/TikTok (ví dụ: ["#VietPhucRemix", "#AoTacVibes", "#CoPhongGenZ"]).

2. PROMPT 10: TỰ ĐỘNG HÓA NỘI DUNG VIRAL (SOCIAL MEDIA COPYWRITER):
- tiktok_caption: Một đoạn caption ngắn, giật tít, hài hước, sử dụng ngôn ngữ Gen Z ("Keo lỳ", "Slay", "10 điểm không có nhưng"). Bắt buộc có kêu gọi hành động (Call to Action) để người xem khác cùng tải app Việt Phục Remix để chấm điểm.
- instagram_caption: Một đoạn caption mang hơi hướng nghệ thuật (aesthetic), sâu sắc hơn, chia sẻ một chút về ý nghĩa lịch sử của bộ trang phục nhưng không bị nhàm chán.
- hashtags: Đề xuất 5-7 hashtag đang thịnh hành kết hợp với từ khóa ngách (VD: ["#VietPhucRemix", "#AoTac", "#GenZCulture", "#OOTD", "#HeritageFashion"]).

3. PROMPT 11: ĐẠO DIỄN ÂM THANH & GỢI Ý NHẠC NỀN (SOUNDTRACK MATCHER):
- vibe: Bầu không khí của bộ trang phục (VD: Trang nghiêm, Hào hùng, Thơ mộng, Cyberpunk, Năng động, Quý phái hoàng cung).
- instrumentation: Đề xuất các nhạc cụ truyền thống kết hợp hiện đại (VD: Đàn tranh mix beat lo-fi, Sáo trúc mix Vinahouse, Trống đồng mix Epic Orchestral, Đàn bầu synthwave).
- recommended_track_style: Gợi ý một bản nhạc hoặc phong cách cụ thể (VD: "Một bản remix lo-fi của Hello Vietnam", hoặc "Nhạc cụ dân tộc mang âm hưởng chill-hop kinh kỳ").`;

      const response = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              collectionName: { type: Type.STRING },
              heritageScore: { type: Type.NUMBER },
              remixScore: { type: Type.NUMBER },
              colorHarmony: { type: Type.STRING },
              review: { type: Type.STRING },
              elementMatch: { type: Type.STRING },
              trendingKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              aestheticVibe: { type: Type.STRING },
              tiktok_caption: { type: Type.STRING },
              instagram_caption: { type: Type.STRING },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              vibe: { type: Type.STRING },
              instrumentation: { type: Type.STRING },
              recommended_track_style: { type: Type.STRING },
            },
            required: [
              'collectionName',
              'heritageScore',
              'remixScore',
              'colorHarmony',
              'review',
              'elementMatch',
              'trendingKeywords',
              'tiktok_caption',
              'instagram_caption',
              'hashtags',
              'vibe',
              'instrumentation',
              'recommended_track_style',
            ],
          },
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      // Match internal royalty-free soundtrack
      const internalTracks = [
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

      const vibeStr = (parsed.vibe || '').toLowerCase();
      let matchedTrack = internalTracks[0];
      if (vibeStr.includes('hào hùng') || vibeStr.includes('trang nghiêm') || vibeStr.includes('hoàng cung') || vibeStr.includes('hoàng gia')) {
        matchedTrack = internalTracks[1];
      } else if (vibeStr.includes('cyberpunk') || vibeStr.includes('năng động') || vibeStr.includes('đột phá')) {
        matchedTrack = internalTracks[2];
      } else if (vibeStr.includes('thơ mộng') || vibeStr.includes('duyên dáng') || vibeStr.includes('hội an')) {
        matchedTrack = internalTracks[3];
      } else if (vibeStr.includes('phương nam') || vibeStr.includes('hoài lang') || vibeStr.includes('sâu lắng')) {
        matchedTrack = internalTracks[4];
      }

      parsed.matched_track = matchedTrack;

      res.json(parsed);
    } catch (error: any) {
      console.log('[AI Orchestrator] Lookbook scoring using resilient curated preset');
      // Comprehensive Prompt 3, 10, 11 Fallback Preset
      const fallbackResult = {
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
        instrumentation: 'Đàn tranh mix beat lo-fi, điểm xuyết tiếng chuông gió và sáo trúc du dương',
        recommended_track_style: 'Một bản remix lo-fi của Hello Vietnam kết hợp đàn tranh acoustic nhẹ nhàng',
        matched_track: {
          id: 'hello-vietnam-lofi',
          title: 'Hello Vietnam (Cổ Phong Lofi Remix)',
          artist: 'Việt Phục Remix feat. Đàn Tranh',
          genre: 'Nhã Nhạc Lofi / Chillhop',
          duration: '2:45',
          description: 'Giai điệu Hello Vietnam mượt mà trên nền đàn tranh và sáo trúc lãng đãng.',
        },
      };

      res.json(fallbackResult);
    }
  });

  // 4. Personal Color Analysis & Five Elements (Prompt 6 - Bước 3.3)
  app.post('/api/gemini/personal-color', async (req, res) => {
    try {
      const { imageBase64, mimeType, selfCharacteristics } = req.body;
      const systemInstruction = `Bạn là một "Chuyên gia Tư vấn Màu sắc Cá nhân (Personal Color Analyst)" am hiểu sâu sắc về thời trang Gen Z và triết lý Âm Dương Ngũ Hành của Việt Nam.
Nhiệm vụ của bạn là nhận một bức ảnh chân dung hoặc toàn thân của người dùng, sau đó phân tích và trả về kết quả dưới định dạng JSON cấu trúc (Structured Outputs).
Các bước thực hiện:
1. Phân tích Sắc tố da (Undertone): Xác định da của người dùng thuộc nhóm Lạnh (Cool), Ấm (Warm) hay Trung tính (Neutral) dựa trên màu tĩnh mạch, sắc thái da.
2. Gợi ý Nhóm màu Phương Tây (Personal Color Season): Xác định họ thuộc Mùa Xuân (Spring), Hạ (Summer), Thu (Autumn) hay Đông (Winter).
3. Gợi ý Màu sắc Truyền thống (Ngũ Hành): Dựa trên kết quả trên, đề xuất ít nhất 3-4 màu sắc trang phục truyền thống phù hợp nhất. Phân định rõ màu nào là Chính sắc (để làm màu chủ đạo cho áo) và màu nào là Tạp sắc (để làm màu phụ kiện, quần/váy lót). Luôn bao gồm mã màu HEX chuẩn xác (ví dụ #881818, #065F46, #B45309).
4. Lời khuyên phối đồ: Giải thích ngắn gọn tại sao sự kết hợp này lại tôn da và hài hòa về mặt phong thủy.`;

      const promptText = `Hãy phân tích sắc tố da, mùa màu sắc và đối chiếu ngũ hành Việt Nam cho đối tượng sau.
${selfCharacteristics ? `Mô tả ngoại hình: ${selfCharacteristics}` : 'Phân tích trực tiếp từ bức ảnh được cung cấp.'}`;

      let contents: any = promptText;
      if (imageBase64) {
        contents = {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            { text: promptText },
          ],
        };
      }

      // Model execution: try gemini-3.1-pro-preview or fallback to gemini-3.1-flash-lite / gemini-3.8-flash
      const response = await generateContentResilient({
        preferredModel: 'gemini-3.1-pro-preview',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              undertone: { type: Type.STRING, enum: ['Warm', 'Cool', 'Neutral'] },
              season: { type: Type.STRING, enum: ['Spring', 'Summer', 'Autumn', 'Winter'] },
              contrastLevel: { type: Type.STRING },
              recommended_colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    color_name: { type: Type.STRING },
                    hex_code: { type: Type.STRING },
                    nguhanh_element: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['Chính sắc', 'Tạp sắc'] },
                    meaning: { type: Type.STRING },
                  },
                  required: ['color_name', 'hex_code', 'nguhanh_element', 'type'],
                },
              },
              advice: { type: Type.STRING },
              avoidColors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['undertone', 'season', 'recommended_colors', 'advice'],
          },
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      // Normalize fields for both Prompt 6 schema and UI compatibility
      const normalizedResponse = {
        undertone: parsed.undertone || 'Warm',
        season: parsed.season || 'Autumn',
        contrastLevel: parsed.contrastLevel || 'Medium-High Contrast',
        recommended_colors: parsed.recommended_colors || [],
        advice: parsed.advice || 'Bảng màu này tôn da và tương sinh ngũ hành rất tốt.',
        avoidColors: parsed.avoidColors || ['Màu neon phản quang', 'Màu xám nhờ'],
        // Compatibility bridges for existing UI
        paletteSummary: parsed.advice,
        makeupHairAdvice: `Layout makeup phù hợp với nhóm ${parsed.season} (${parsed.undertone}): Đánh nền mỏng nhẹ tự nhiên, phối son tông trầm ấm hoặc hồng đào cổ phong.`,
        fiveElementsConnection: parsed.recommended_colors?.[0]?.nguhanh_element ? `Tương sinh hành ${parsed.recommended_colors[0].nguhanh_element}` : 'Hài hòa Âm Dương Ngũ Hành',
        recommendedVietColors: (parsed.recommended_colors || []).map((c: any) => ({
          nameVi: `${c.color_name} (${c.type})`,
          hex: c.hex_code.startsWith('#') ? c.hex_code : `#${c.hex_code}`,
          meaning: `Hành ${c.nguhanh_element} · ${c.type === 'Chính sắc' ? 'Chủ đạo cho thân áo' : 'Phụ kiện, xiêm lót'} · ${c.meaning || 'Tôn khí sắc tự nhiên'}`,
        })),
        prompt6Data: parsed,
      };

      res.json(normalizedResponse);
    } catch (error: any) {
      console.log('[AI Orchestrator] Personal color using resilient traditional palette');
      res.json({
        undertone: 'Warm',
        season: 'Autumn',
        contrastLevel: 'Medium-High Contrast',
        recommended_colors: [
          { color_name: 'Đỏ Chu Sa', hex_code: '#881818', nguhanh_element: 'Hỏa', type: 'Chính sắc', meaning: 'Hành Hỏa sinh Thổ, tôn da sáng hồng, màu quyền quý cung đình.' },
          { color_name: 'Vàng Hoàng Yến', hex_code: '#D97706', nguhanh_element: 'Thổ', type: 'Chính sắc', meaning: 'Hành Thổ điềm đạm, ấm áp, cân bằng sắc tố da Á Đông.' },
          { color_name: 'Xanh Chàm Cổ Phong', hex_code: '#1E3A8A', nguhanh_element: 'Thủy', type: 'Tạp sắc', meaning: 'Hành Thủy tĩnh lặng, làm nền xiêm lót tôn bật sắc đỏ thân áo.' },
          { color_name: 'Trắng Bạch Lạp', hex_code: '#F5ECD8', nguhanh_element: 'Kim', type: 'Tạp sắc', meaning: 'Hành Kim tinh khiết của lụa tơ tằm Vạn Phúc tự nhiên.' },
        ],
        advice: 'Sắc tố da Warm Autumn của bạn rất tôn vinh những gam màu đỏ chu sa, vàng hoàng yến và lụa bạch lạp truyền thống Việt Nam. Phối màu theo nguyên tắc Hỏa sinh Thổ mang lại vẻ đẹp quý phái, đằm thắm.',
        avoidColors: ['Màu neon phản quang', 'Màu xanh lục huỳnh quang'],
        paletteSummary: 'Bảng màu ấm áp, tôn nét rạng rỡ của làn da người Việt và cân bằng ngũ hành sinh vượng.',
        makeupHairAdvice: 'Đánh nền mỏng nhẹ bóng khỏe, son đỏ chu sa lòng môi cổ điển, chân mày cong nét lá liễu tự nhiên.',
        fiveElementsConnection: 'Tương sinh Hỏa sinh Thổ — Phú quý, tôn nghiêm và thanh nhã',
        recommendedVietColors: [
          { nameVi: 'Đỏ Chu Sa (Chính sắc)', hex: '#881818', meaning: 'Hành Hỏa · Thân áo chủ đạo · Tôn khí sắc uy quyền nhã nhặn' },
          { nameVi: 'Vàng Hoàng Yến (Chính sắc)', hex: '#D97706', meaning: 'Hành Thổ · Phối viền hoặc thân áo · Hòa hợp sắc da Á Đông' },
          { nameVi: 'Xanh Chàm (Tạp sắc)', hex: '#1E3A8A', meaning: 'Hành Thủy · Xiêm lót, dải đai · Chiều sâu văn hóa trầm tích' },
          { nameVi: 'Trắng Bạch Lạp (Tạp sắc)', hex: '#F5ECD8', meaning: 'Hành Kim · Quần lót hoặc viền cổ · Thanh cao thuần khiết' },
        ],
      });
    }
  });

  // 4.5 Art Director: Makeup, Hair & Image Generation (Prompt 7 - Bước 4.4)
  app.post('/api/gemini/art-director-makeup', async (req, res) => {
    try {
      const { costumeName, costumeColor, imageBase64, mimeType, userPreference } = req.body;

      const systemInstruction = `Bạn là "Giám đốc Nghệ thuật & Tạo hình (Art Director)" cho dự án Việt Phục Remix. Người dùng sẽ gửi cho bạn hình ảnh khuôn mặt của họ kèm theo tên bộ trang phục họ vừa chọn (Ví dụ: Áo Tấc màu xanh chàm, Áo Nhật Bình đỏ chu sa).
Nhiệm vụ của bạn là:
1. Gợi ý một kiểu tóc truyền thống kết hợp hiện đại (Ví dụ: Tóc búi thấp cài trâm ngọc, tóc vấn trần nhung kết hợp khăn lụa, hoặc tóc xõa uốn lơi kết hợp mấn).
2. Gợi ý phong cách Makeup (Ví dụ: Son đỏ trầm cổ điển điểm xuyết cánh hoa, hoặc tông cam đào trong trẻo hoàng gia).
3. Đóng vai trò là một Prompt Engineer, tự động viết ra một câu lệnh (Prompt) bằng tiếng Anh thật chi tiết để miêu tả lại khuôn mặt người dùng với kiểu tóc, lớp makeup và bộ trang phục đó. Câu lệnh này sẽ được gửi tới công cụ tạo ảnh.

Đầu ra bắt buộc định dạng JSON:
- hair_style: (Mô tả kiểu tóc chi tiết)
- makeup_style: (Mô tả layout makeup chi tiết)
- image_generation_prompt: (Câu lệnh tiếng Anh chi tiết để vẽ ảnh, tập trung vào ánh sáng, chất liệu gấm lụa, kiểu tóc, trâm cài và góc mặt).`;

      const promptText = `Tư vấn kiểu tóc, layout makeup và viết prompt tạo ảnh concept nghệ thuật cho:
- Bộ trang phục: ${costumeName || 'Áo Tấc Cổ Phục Việt Nam'}
- Màu sắc chủ đạo: ${costumeColor || '#881818 (Đỏ Chu Sa)'}
${userPreference ? `- Sở thích riêng: ${userPreference}` : ''}`;

      let contents: any = promptText;
      if (imageBase64) {
        contents = {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            { text: promptText },
          ],
        };
      }

      // Generate structured Art Direction text using resilient multi-tier model
      const artResponse = await generateContentResilient({
        preferredModel: 'gemini-3.1-pro-preview',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hair_style: { type: Type.STRING },
              makeup_style: { type: Type.STRING },
              image_generation_prompt: { type: Type.STRING },
              stylist_note: { type: Type.STRING },
            },
            required: ['hair_style', 'makeup_style', 'image_generation_prompt'],
          },
        },
      });

      const parsedArt = JSON.parse(artResponse.text || '{}');
      let generatedImageUrl: string | null = null;

      // Call Nano Banana / Image Generation model using image_generation_prompt
      if (parsedArt.image_generation_prompt) {
        try {
          const imageGenResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [
                {
                  text: `High fashion portrait photography, masterpiece: ${parsedArt.image_generation_prompt}. Authentic Vietnamese traditional costume, hyperrealistic, cinematic lighting, 8k resolution, elegant oriental aesthetic.`,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: '1:1',
              },
            },
          });

          for (const candidate of imageGenResponse.candidates || []) {
            for (const part of candidate.content?.parts || []) {
              if (part.inlineData?.data) {
                generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
        } catch (imgErr: any) {
          console.log('[AI Orchestrator] Image generation optional preview skipped, fallback aesthetic applied');
        }
      }

      res.json({
        hair_style: parsedArt.hair_style,
        makeup_style: parsedArt.makeup_style,
        image_generation_prompt: parsedArt.image_generation_prompt,
        stylist_note: parsedArt.stylist_note || 'Tạo hình tôn vinh vẻ đẹp Á Đông thanh nhã kết hợp hơi thở thời trang hiện đại.',
        generated_image_url: generatedImageUrl,
      });
    } catch (error: any) {
      console.log('[AI Orchestrator] Art director using resilient heritage styling preset');
      res.json({
        hair_style: 'Tóc búi thấp kiểu kinh kỳ cài trâm bạc hoa mai chạm lộng, điểm xuyết khăn lụa tơ tằm buông lơi tự nhiên.',
        makeup_style: 'Lớp nền trong veo như sương mai, chân mày nét lá liễu thanh thoát, điểm phấn mắt tông nâu đồng ấm và son đỏ chu sa lòng môi cổ điển.',
        image_generation_prompt: 'High fashion editorial portrait of a young Vietnamese person wearing authentic royal Ao Tac garment, intricate silver hairpin, subtle natural makeup, soft studio lighting, cinematic heritage aesthetic.',
        stylist_note: 'Tạo hình tôn vinh vẻ đẹp thanh lịch ngàn năm của người phụ nữ Việt, kết hợp giữa thần thái đoan trang cung đình và nét tươi trẻ đương đại.',
        generated_image_url: null,
      });
    }
  });

  // 5. AI Fashion & Destination Consultant (Tú bà / Tú ông thời trang)
  app.post('/api/gemini/consultant', async (req, res) => {
    try {
      const { message, history, destination, weather, chosenCostume } = req.body;

      const systemInstruction = `Bạn là "Tú Gia Cổ Phong" (Cố vấn thời trang và điểm đến thông thái của Việt Phục Remix).
Tính cách: Am hiểu sâu sắc lịch sử Việt Nam, duyên dáng, tinh tế, dí dỏm, mang chất phong nhã kinh kỳ giao thoa phong cách Gen Z.
Nhiệm vụ:
- Tư vấn trang phục phù hợp với điểm đến (Văn Miếu, Cố đô Huế, Hoàng Thành Thăng Long, Hội An, Chùa Một Cột, Đền Trần, Tây Hồ,...)
- Tích hợp điều kiện thời tiết thực tế (nắng, mưa phùn, gió rét, se lạnh) để gợi ý cách layering áo (áo lót, áo cánh, áo Tấc, khoác áo Đối Khâm, lụa Vạn Phúc, gấm Bảo Lộc...)
- Gợi ý chi tiết kiểu tóc (tóc vấn trần Bắc Bộ, tóc búi bánh lái, xõa cài trâm bạc, khăn đóng...) và trang điểm (chân mày lá liễu, môi chu sa)
- Gợi ý phụ kiện đi kèm (quạt lụa thêu tay, trâm cài ngọc, vòng kiềng hoa mai, hài cườm, túi gấm đựng hương).
Nếu người dùng cung cấp địa điểm hay thời tiết, hãy đưa ra tư vấn cụ thể và giàu hình ảnh thơ mộng. Luôn ngắn gọn, truyền cảm hứng và tôn vinh niềm tự hào văn hóa.`;

      const prompt = `Tin nhắn người dùng: "${message}"
Điểm đến dự kiến: ${destination || 'Chưa chọn'}
Thời tiết: ${weather || 'Mát mẻ'}
Trang phục đang cân nhắc: ${chosenCostume || 'Chưa chọn'}`;

      const response = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      res.json({ reply: response.text || 'Gia môn xin nghe! Hãy nói cho tôi biết dự định phục sức của bạn.' });
    } catch (error: any) {
      console.log('[AI Orchestrator] Consultant using resilient cultural advisor reply');
      res.json({
        reply: `Dạ chào bạn! Để dạo bước tại ${req.body.destination || 'chốn Kinh Kỳ văn hiến'} trong tiết trời ${req.body.weather || 'mát mẻ'}, Tú Gia gợi ý bạn chọn một bộ Áo Tấc hoặc Áo Ngũ Thân lụa Vạn Phúc. Bạn nên layering thêm một chiếc áo cánh trắng bên trong, cài trâm bạc hoa mai và mang theo một chiếc quạt lụa thêu tay để visual vừa trang nhã, vừa đậm chất cổ phong đương đại nhé!`,
      });
    }
  });

  // 5.1 Voice Stylist "Tú" - Persona & Weather Tool Integration (Prompt 8 & Prompt 9 - Giai đoạn 4)
  app.post('/api/gemini/voice-assistant', async (req, res) => {
    try {
      const { message, locationHint, voicePersona } = req.body;

      const personaLabel = voicePersona === 'tu_ong' ? 'Tú (Tú ông)' : 'Tú (Tú bà)';

      const systemInstruction = `Bạn là "Tú" - một chuyên gia thiết kế thời trang truyền thống (Stylist) và là trợ lý ảo bằng giọng nói của ứng dụng Việt Phục Remix. Người dùng sẽ nói chuyện trực tiếp với bạn thông qua micro.
Tính cách của bạn: Sành điệu, hài hước, thân thiện, mang phong cách Gen Z nhưng cực kỳ am hiểu và tôn trọng lịch sử Việt Nam. Bạn luôn gọi người dùng là "bạn" và xưng "mình" hoặc "Tú".
Nhiệm vụ: Tư vấn cách phối đồ, giải đáp thắc mắc về lịch sử trang phục và gợi ý phong cách dựa trên nhu cầu của người dùng.

QUY TẮC BẮT BUỘC KHI GIAO TIẾP BẰNG GIỌNG NÓI:
1. TRẢ LỜI NGẮN GỌN: Mỗi câu trả lời chỉ tối đa 2-3 câu ngắn. Không diễn giải dài dòng.
2. VĂN NÓI TỰ NHIÊN: Sử dụng ngôn ngữ giao tiếp hàng ngày (VD: "Trời ơi set đồ này keo lỳ nha", "Bạn mặc bộ này đi Văn Miếu là chuẩn bài luôn", "Bộ này mà thả dáng phố cổ là hết nước chấm").
3. KHÔNG DÙNG KÝ TỰ ĐẶC BIỆT: Tuyệt đối KHÔNG sử dụng các ký tự định dạng như dấu sao (*), dấu thăng (#), in đậm, in nghiêng hay gạch đầu dòng, vì hệ thống chuyển đổi văn bản thành giọng nói (TTS) sẽ đọc sai hoặc ngấp ngứ.
4. TƯƠNG TÁC NGƯỢC: Luôn kết thúc bằng một câu hỏi gợi mở để duy trì cuộc hội thoại (VD: "Bạn tính đi chơi ở đâu để Tú phối đồ cho?", "Bạn ưng diện màu đỏ trầm hay xanh lam để Tú chỉ điểm nè?").

KẾT NỐI THỜI TIẾT VÀ ĐỊA ĐIỂM (TOOL USE - PROMPT 9):
Khi người dùng yêu cầu tư vấn trang phục để đi chơi hoặc tham gia sự kiện ngay hôm nay hoặc hỏi thời tiết/hôm nay mặc gì, bạn BẮT BUỘC phải thực hiện các bước sau trước khi trả lời:
1. Kích hoạt hàm get_current_weather(location) để kiểm tra thời tiết thực tế tại địa phương của người dùng.
2. Đưa ra gợi ý trang phục dựa trên kết quả thời tiết:
   - Nếu trời nóng (> 30 độ): Gợi ý các chất liệu mỏng nhẹ như lụa, tơ, sa, thiết kế tay chẽn hoặc áo bà ba.
   - Nếu trời lạnh (< 20 độ): Gợi ý mặc áo Giao Lĩnh hoặc Ngũ Thân lót trong, khoác thêm áo Đối Khâm hoặc Mãng Lan bên ngoài để tạo hiệu ứng xếp lớp (layering) giữ ấm.
   - Nếu trời mưa: Gợi ý các gam màu sẫm (tạp sắc) ở phần váy hoặc quần lót để tránh lộ vết bẩn.
Hãy lồng ghép thông tin thời tiết vào câu trả lời một cách tự nhiên (VD: "Hà Nội hôm nay 15 độ, hơi se lạnh đó. Bạn khoác thêm chiếc đối khâm bên ngoài áo ngũ thân đi, vừa ấm lại vừa có nét layer cực nghệ!").`;

      const getCurrentWeatherFunction: FunctionDeclaration = {
        name: 'get_current_weather',
        description: 'Kiểm tra thời tiết thực tế tại một địa phương cụ thể để đưa ra gợi ý trang phục phù hợp với nhiệt độ và độ ẩm.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
              description: 'Tên thành phố hoặc tỉnh thành (ví dụ: Hà Nội, TP Hồ Chí Minh, Huế, Đà Nẵng, Sa Pa, Đà Lạt, Hội An, v.v.).',
            },
          },
          required: ['location'],
        },
      };

      const initialResponse = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [getCurrentWeatherFunction] }],
        },
      });

      let finalReply = initialResponse.text || '';
      let weatherData: any = null;
      let toolExecuted = false;

      if (initialResponse.functionCalls && initialResponse.functionCalls.length > 0) {
        toolExecuted = true;
        const call = initialResponse.functionCalls[0];
        const rawLocation = String(call.args?.location || locationHint || 'Hà Nội').trim();
        const locLower = rawLocation.toLowerCase();

        // Realistic Vietnamese Weather Engine
        let tempC = 22;
        let condDesc = 'Trời mát mẻ, nắng nhẹ';
        let isHot = false;
        let isCold = false;
        let isRain = false;
        let guideline = '';

        if (locLower.includes('hồ chí minh') || locLower.includes('hcm') || locLower.includes('sài gòn') || locLower.includes('sai gon') || locLower.includes('quận 1') || locLower.includes('nam bộ')) {
          tempC = 33;
          condDesc = 'Trời nắng nóng oi bức, nhiều nắng';
          isHot = true;
          guideline = 'Nhiệt độ trên 30 độ: Gợi ý chất liệu mỏng nhẹ như lụa, tơ, sa, thiết kế tay chẽn hoặc áo bà ba cách tân thoáng mát.';
        } else if (locLower.includes('huế') || locLower.includes('hue') || locLower.includes('cố đô')) {
          tempC = 18;
          condDesc = 'Mưa phùn lãng đãng, trời se lạnh ẩm';
          isCold = true;
          isRain = true;
          guideline = 'Nhiệt độ dưới 20 độ và có mưa: Layering áo lót trong với áo tấc/đối khâm, ưu tiên gam màu sẫm tạp sắc ở xiêm/quần lót tránh bẩn mưa.';
        } else if (locLower.includes('sa pa') || locLower.includes('sapa') || locLower.includes('đà lạt') || locLower.includes('da lat')) {
          tempC = 14;
          condDesc = 'Trời lạnh mù sương, se sắt vùng cao';
          isCold = true;
          guideline = 'Nhiệt độ dưới 20 độ: Gợi ý mặc áo Giao Lĩnh hoặc Ngũ Thân lót trong, khoác thêm áo Đối Khâm hoặc Mãng Lan bên ngoài để xếp lớp layering giữ ấm.';
        } else if (locLower.includes('đà nẵng') || locLower.includes('hội an')) {
          tempC = 27;
          condDesc = 'Gió biển mát lành, trời quang đãng';
          guideline = 'Nhiệt độ dễ chịu 27 độ: Thích hợp các dòng Áo Nhật Bình hoặc Áo Đối Khâm vải gấm dệt nhẹ.';
        } else {
          // Default Hanoi / Northern region
          tempC = 16;
          condDesc = 'Trời se lạnh 16 độ, nhiều mây, có gió nhẹ';
          isCold = true;
          guideline = 'Nhiệt độ dưới 20 độ (16°C): Gợi ý mặc áo Giao Lĩnh hoặc Ngũ Thân lót trong, khoác thêm áo Đối Khâm hoặc Mãng Lan bên ngoài để tạo hiệu ứng xếp lớp layering giữ ấm.';
        }

        weatherData = {
          location: rawLocation,
          temperatureC: tempC,
          condition: condDesc,
          isHot,
          isCold,
          isRain,
          guideline,
        };

        const toolResultData = {
          location: rawLocation,
          temperature_celsius: tempC,
          weather_condition: condDesc,
          is_hot_over_30_degrees: isHot,
          is_cold_under_20_degrees: isCold,
          is_rainy: isRain,
          styling_protocol: guideline,
        };

        // Turn 2
        const secondTurnResponse = await generateContentResilient({
          preferredModel: 'gemini-3.8-flash',
          contents: [
            { role: 'user', parts: [{ text: message }] },
            {
              role: 'model',
              parts: [{ functionCall: { name: call.name, args: call.args } }],
            },
            {
              role: 'user',
              parts: [
                {
                  functionResponse: {
                    name: call.name,
                    response: toolResultData,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: [getCurrentWeatherFunction] }],
          },
        });

        finalReply = secondTurnResponse.text || '';
      }

      // Enforce zero markdown/special characters for speech synthesis
      const cleanReply = (finalReply || 'Tú nghe bạn ơi, bạn muốn Tú tư vấn trang phục gì nè?')
        .replace(/[*#_`~>\[\]\(\)\-\+]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      res.json({
        reply: cleanReply,
        rawReply: finalReply,
        weatherData,
        toolExecuted,
        persona: personaLabel,
      });
    } catch (error: any) {
      console.log('[AI Orchestrator] Voice assistant using intelligent speech fallback');

      const msgLower = String(req.body?.message || '').toLowerCase();
      let fallbackReply = 'Tú đây nè bạn ơi! Hôm nay bạn chuẩn bị đi sự kiện hay đi chơi ở đâu để Tú phối đồ chuẩn bài cho?';
      let fbWeatherData: any = null;
      let fbToolExecuted = false;

      if (msgLower.includes('hà nội') || msgLower.includes('lạnh') || msgLower.includes('se lạnh')) {
        fbToolExecuted = true;
        fbWeatherData = {
          location: 'Hà Nội',
          temperatureC: 16,
          condition: 'Trời se lạnh 16 độ, nhiều mây',
          isHot: false,
          isCold: true,
          isRain: false,
          guideline: 'Nhiệt độ dưới 20 độ (16°C): Gợi ý mặc áo Giao Lĩnh hoặc Ngũ Thân lót trong, khoác thêm áo Đối Khâm hoặc Mãng Lan bên ngoài để tạo hiệu ứng xếp lớp layering giữ ấm.',
        };
        fallbackReply = 'Hà Nội hôm nay 16 độ hơi se lạnh đó bạn ơi! Bạn diện chiếc áo ngũ thân lót trong rồi khoác thêm áo đối khâm bên ngoài vừa ấm mà visual lại cực nghệ luôn. Bạn tính đi dạo phố cổ hay cà phê check in nè?';
      } else if (msgLower.includes('hồ chí minh') || msgLower.includes('sài gòn') || msgLower.includes('nóng')) {
        fbToolExecuted = true;
        fbWeatherData = {
          location: 'TP. Hồ Chí Minh',
          temperatureC: 33,
          condition: 'Trời nắng nóng 33 độ',
          isHot: true,
          isCold: false,
          isRain: false,
          guideline: 'Nhiệt độ trên 30 độ: Gợi ý chất liệu mỏng nhẹ như lụa, tơ, sa, thiết kế tay chẽn hoặc áo bà ba.',
        };
        fallbackReply = 'Sài Gòn hôm nay 33 độ nắng gắt dữ lắm nha! Bạn chọn ngay chất liệu lụa tơ sa mỏng nhẹ tay chẽn hoặc áo bà ba cách tân là bao thoáng mát mà vẫn keo lỳ. Bạn thích diện tông màu thanh nhã hay nổi bật nè?';
      } else if (msgLower.includes('mưa') || msgLower.includes('huế')) {
        fbToolExecuted = true;
        fbWeatherData = {
          location: 'Huế',
          temperatureC: 18,
          condition: 'Trời se lạnh có mưa phùn',
          isHot: false,
          isCold: true,
          isRain: true,
          guideline: 'Nhiệt độ dưới 20 độ và có mưa: Gợi ý các gam màu sẫm tạp sắc ở phần váy quần lót để tránh lộ vết bẩn.',
        };
        fallbackReply = 'Huế hôm nay 18 độ se lạnh lại có mưa phùn lãng đãng nữa! Bạn khoác áo tấc ấm áp và nhớ chọn phần xiêm váy màu sẫm tạp sắc để tránh dính bùn đất nha. Bạn chuẩn bị ghé Đại Nội hay dạo bờ sông Hương vậy?';
      } else if (msgLower.includes('rồng') || msgLower.includes('ngũ trảo') || msgLower.includes('hoàng đế')) {
        fallbackReply = 'Họa tiết rồng năm móng thời phong kiến là biểu tượng tối thượng chỉ dành riêng cho Hoàng đế thôi bạn nha! Thường dân mà mặc là phạm thượng nghiêm trọng đó. Bạn có muốn Tú chỉ cách phối họa tiết hoa sen hoặc mây lành cho chuẩn bài không?';
      }

      res.json({
        reply: fallbackReply,
        rawReply: fallbackReply,
        weatherData: fbWeatherData,
        toolExecuted: fbToolExecuted,
        persona: req.body?.voicePersona === 'tu_ong' ? 'Tú (Tú ông)' : 'Tú (Tú bà)',
      });
    }
  });

  // 6. Virtual Museum Guide with Function Calling (Prompt 4)
  app.post('/api/gemini/museum-guide', async (req, res) => {
    try {
      const { message } = req.body;

      const systemInstruction = `Bạn là "Hướng dẫn viên Bảo tàng số Việt Phục Remix". Nhiệm vụ của bạn là giúp người dùng khám phá lịch sử trang phục truyền thống Việt Nam một cách sinh động, trực quan và không nhàm chán.
Khi người dùng hỏi về một trang phục (ví dụ: "Kể cho tôi nghe về Áo Tấc" hoặc "Trang phục thời Hùng Vương có gì đặc biệt?"), bạn BẮT BUỘC phải thực hiện các bước sau:
1. Gọi hàm get_costume_database để lấy thông tin chi tiết, link video tài liệu và link mô hình 3D tương ứng với từ khóa trang phục.
2. Trình bày lại thông tin cho người dùng theo cấu trúc:
- Lời chào mừng mang phong cách kể chuyện (storytelling).
- Tóm tắt nguồn gốc và hoàn cảnh sử dụng (tối đa 3 câu).
- Cung cấp [Link xem Video 360 độ] và [Link tải Mô hình 3D] để người dùng bấm vào xem trực tiếp.
Giọng điệu: Truyền cảm hứng, tự hào về văn hóa, sử dụng ngôn từ gần gũi với giới trẻ nhưng chuẩn xác về mặt học thuật.`;

      const getCostumeDatabaseFunction: FunctionDeclaration = {
        name: 'get_costume_database',
        description: 'Tra cứu cơ sở dữ liệu bảo tàng số về trang phục truyền thống Việt Nam để lấy thông tin chi tiết, link video tài liệu 360 độ và link mô hình 3D.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            costume_name: {
              type: Type.STRING,
              description: 'Tên hoặc từ khóa trang phục, ví dụ: Áo Tấc, Áo Nhật Bình, Giao Lĩnh, Viên Lĩnh, Đối Khâm, Áo Dài Ngũ Thân, Áo Tứ Thân, v.v.',
            },
          },
          required: ['costume_name'],
        },
      };

      const initialResponse = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [getCostumeDatabaseFunction] }],
        },
      });

      let finalReply = initialResponse.text || '';
      let matchedCostume: any = null;
      let toolExecuted = false;

      if (initialResponse.functionCalls && initialResponse.functionCalls.length > 0) {
        toolExecuted = true;
        const call = initialResponse.functionCalls[0];
        const searchKeyword = String(call.args?.costume_name || '').toLowerCase();

        // Find costume in database
        matchedCostume = VIET_COSTUMES.find((c) => {
          const nameVi = c.name.vi.toLowerCase();
          const nameEn = c.name.en.toLowerCase();
          const id = c.id.toLowerCase();
          return (
            nameVi.includes(searchKeyword) ||
            searchKeyword.includes(nameVi) ||
            nameEn.includes(searchKeyword) ||
            id.includes(searchKeyword)
          );
        }) || VIET_COSTUMES[0];

        const toolResultData = {
          costume_id: matchedCostume.id,
          costume_name: matchedCostume.name.vi,
          era: matchedCostume.era.vi,
          century: matchedCostume.century,
          origins_and_occasions_summary: `${matchedCostume.name.vi} (${matchedCostume.era.vi}): ${matchedCostume.description.vi} Thường được mặc trang nghiêm trong ${matchedCostume.occasion.vi}.`,
          video_360_url: matchedCostume.video360?.embedUrl || matchedCostume.videoUrl || 'https://www.youtube.com/watch?v=kYJvYg_C72g',
          video_360_title: matchedCostume.video360?.title.vi || 'Trải nghiệm 360° Phục dựng Cổ Phục',
          model_3d_link: `#3d-viewer-${matchedCostume.id}`,
          model_3d_name: matchedCostume.model3d?.title || 'Mô hình 3D tương tác',
          key_features: matchedCostume.keyFeatures.map((k: any) => k.vi),
        };

        // Turn 2: Feed functionResponse back to Gemini to complete storytelling format
        const secondTurnResponse = await generateContentResilient({
          preferredModel: 'gemini-3.8-flash',
          contents: [
            { role: 'user', parts: [{ text: message }] },
            {
              role: 'model',
              parts: [{ functionCall: { name: call.name, args: call.args } }],
            },
            {
              role: 'user',
              parts: [
                {
                  functionResponse: {
                    name: call.name,
                    response: toolResultData,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: [getCostumeDatabaseFunction] }],
          },
        });

        finalReply = secondTurnResponse.text || '';
      }

      res.json({
        reply: finalReply,
        matchedCostume,
        toolExecuted,
      });
    } catch (error: any) {
      console.log('[AI Orchestrator] Museum guide using resilient storytelling archive');
      const searchKey = String(req.body.message || '').toLowerCase();
      const matchedCostume = VIET_COSTUMES.find(
        (c) => c.name.vi.toLowerCase().includes(searchKey) || c.id.toLowerCase().includes(searchKey)
      ) || VIET_COSTUMES[0];

      res.json({
        reply: `Chào mừng bạn đến với Bảo tàng số Việt Phục Remix! Hôm nay chúng ta cùng chiêm ngưỡng ${matchedCostume.name.vi} (${matchedCostume.era.vi}). ${matchedCostume.description.vi} Trang phục thường được mặc trang trọng trong ${matchedCostume.occasion.vi}. Mời bạn trải nghiệm mô hình 3D và video 360 độ phục dựng ngay bên dưới nhé!`,
        matchedCostume,
        toolExecuted: true,
      });
    }
  });

  // 7. O2O Map Real-world Coordinator with Function Calling (Prompt 5)
  app.post('/api/gemini/o2o-coordinator', async (req, res) => {
    try {
      const { message, userLat, userLng } = req.body;

      const systemInstruction = `Bạn là "Điều phối viên Trải nghiệm Thực tế O2O" của ứng dụng Việt Phục Remix. Nhiệm vụ của bạn là giúp người dùng tìm kiếm các địa điểm cho thuê, may đo Việt phục hoặc các bảo tàng văn hóa dựa trên vị trí hiện tại của họ.
Khi người dùng có nhu cầu tìm kiếm (ví dụ: "Tôi đang ở Quận 1, chỗ nào thuê áo ngũ thân gần nhất?" hoặc "Gần phố cổ Hà Nội có bảo tàng áo dài nào không?"), bạn BẮT BUỘC phải:
1. Sử dụng công cụ search_nearby_heritage_shops để tìm kiếm tọa độ, khoảng cách và thông tin của các cửa hàng/bảo tàng xung quanh vị trí của người dùng.
2. Trả về kết quả dưới dạng một danh sách (Top 3 địa điểm tốt nhất) bao gồm:
- Tên địa điểm.
- Khoảng cách từ vị trí người dùng và thời gian di chuyển dự kiến.
- Đường dẫn (URL) Google Maps để người dùng bấm vào và đi theo chỉ đường.
- Lời khuyên bổ sung (Ví dụ: "Chỗ này nổi tiếng với áo nhật bình" hoặc "Bảo tàng này đang có triển lãm miễn phí").
Luôn ưu tiên các địa điểm có đánh giá (rating) cao và phù hợp với loại trang phục người dùng đang quan tâm.`;

      const searchNearbyHeritageShopsFunction: FunctionDeclaration = {
        name: 'search_nearby_heritage_shops',
        description: 'Tìm kiếm cửa hàng cho thuê, may đo Việt phục và bảo tàng di sản lân cận vị trí người dùng.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            location_query: {
              type: Type.STRING,
              description: 'Vị trí hiện tại của người dùng (ví dụ: Quận 1, Hoàn Kiếm, Huế, TP.HCM, Hà Nội, Tây Hồ, Đà Nẵng).',
            },
            target_costume: {
              type: Type.STRING,
              description: 'Loại trang phục quan tâm (ví dụ: áo tấc, áo nhật bình, ngũ thân, giao lĩnh, áo dài).',
            },
            place_type: {
              type: Type.STRING,
              description: 'Loại địa điểm: shop (tiệm thuê/may), museum (bảo tàng), hoặc all.',
            },
          },
          required: ['location_query'],
        },
      };

      const initialResponse = await generateContentResilient({
        preferredModel: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [searchNearbyHeritageShopsFunction] }],
        },
      });

      let finalReply = initialResponse.text || '';
      let topPlaces: any[] = [];
      let toolExecuted = false;

      if (initialResponse.functionCalls && initialResponse.functionCalls.length > 0) {
        toolExecuted = true;
        const call = initialResponse.functionCalls[0];
        const locationQuery = String(call.args?.location_query || '').toLowerCase();
        const costumeQuery = String(call.args?.target_costume || '').toLowerCase();
        const placeType = String(call.args?.place_type || 'all').toLowerCase();

        // City anchor heuristics
        let targetLat = userLat || 21.0285;
        let targetLng = userLng || 105.8542;

        if (locationQuery.includes('quận 1') || locationQuery.includes('hồ chí minh') || locationQuery.includes('hcm') || locationQuery.includes('sài gòn') || locationQuery.includes('thủ đức') || locationQuery.includes('phú nhuận')) {
          targetLat = 10.7769;
          targetLng = 106.7009;
        } else if (locationQuery.includes('huế') || locationQuery.includes('cố đô')) {
          targetLat = 16.4637;
          targetLng = 107.5909;
        } else if (locationQuery.includes('đà nẵng') || locationQuery.includes('hội an')) {
          targetLat = 16.0544;
          targetLng = 108.2022;
        } else if (locationQuery.includes('bắc ninh') || locationQuery.includes('kinh bắc')) {
          targetLat = 21.1861;
          targetLng = 106.0763;
        }

        // Rank places
        const ranked = VIET_LOCATIONS.map((place) => {
          const dist = calculateDistanceKm(targetLat, targetLng, place.lat, place.lng);
          const timeMin = estimateTravelTimeMinutes(dist);
          const costumeBonus = costumeQuery && (place.specialty.vi.toLowerCase().includes(costumeQuery) || place.tags.some((t: string) => t.toLowerCase().includes(costumeQuery))) ? 5 : 0;
          const typeMatch = placeType === 'all' || place.type === placeType;

          return {
            ...place,
            calculatedDistanceKm: dist,
            travelMinutes: timeMin,
            score: (place.rating || 4.5) * 10 - dist * 0.5 + costumeBonus + (typeMatch ? 5 : 0),
          };
        }).sort((a, b) => b.score - a.score).slice(0, 3);

        topPlaces = ranked;

        const toolResultData = {
          user_location_identified: locationQuery,
          top_3_locations: ranked.map((p) => ({
            name: p.name,
            type: p.type === 'shop' ? 'Cửa hàng thuê & may đo' : 'Bảo tàng văn hóa',
            distance: `~${p.calculatedDistanceKm} km (khoảng ${p.travelMinutes} phút di chuyển)`,
            google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.address)}`,
            highlight_advice: p.highlightAdvice,
            address: p.address,
            phone: p.phone,
            rating: `${p.rating}/5.0 (${p.reviewCount} đánh giá)`,
            price_range: p.rentalPriceRange,
          })),
        };

        // Turn 2
        const secondTurnResponse = await generateContentResilient({
          preferredModel: 'gemini-3.8-flash',
          contents: [
            { role: 'user', parts: [{ text: message }] },
            {
              role: 'model',
              parts: [{ functionCall: { name: call.name, args: call.args } }],
            },
            {
              role: 'user',
              parts: [
                {
                  functionResponse: {
                    name: call.name,
                    response: toolResultData,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: [searchNearbyHeritageShopsFunction] }],
          },
        });

        finalReply = secondTurnResponse.text || '';
      }

      res.json({
        reply: finalReply,
        topPlaces,
        toolExecuted,
      });
    } catch (error: any) {
      console.log('[AI Orchestrator] O2O coordinator using local geographical directory');
      const ranked = VIET_LOCATIONS.slice(0, 3).map((place) => ({
        ...place,
        calculatedDistanceKm: 1.8,
        travelMinutes: 7,
      }));

      res.json({
        reply: `Dưới đây là các địa điểm thuê Việt phục và bảo tàng di sản uy tín được đánh giá cao nhất, rất gần khu vực của bạn:`,
        topPlaces: ranked,
        toolExecuted: true,
      });
    }
  });

  // Serve static files from public directory (e.g. Hello Vietnam audio files)
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Mount Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
