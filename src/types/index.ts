export type Language = 'vi' | 'en';

export interface BilingualText {
  vi: string;
  en: string;
}

export type DynastyEra = 'ly-tran' | 'hau-le' | 'trieu-nguyen' | 'dan-gian' | 'can-dai';

export interface Model3DData {
  title: string;
  format: 'GLTF' | 'OBJ' | 'Interactive-Three';
  verticesCount: string;
  meshPreset: 'nhat_binh' | 'ao_tac' | 'giao_linh' | 'vien_linh' | 'tu_than' | 'doi_kham';
  downloadUrl?: string;
  sourceCredit: string;
}

export interface Video360Data {
  title: BilingualText;
  embedUrl: string;
  is360: boolean;
  duration: string;
  channel: string;
}

export interface VietnameseCostume {
  id: string;
  name: BilingualText;
  era: BilingualText;
  dynastyKey: DynastyEra;
  century: string;
  description: BilingualText;
  structure: BilingualText;
  philosophy: BilingualText;
  occasion: BilingualText;
  hairAndMakeup: BilingualText;
  jewelry: BilingualText;
  notableColors: string[];
  imagePlaceholderUrl: string;
  videoUrl?: string;
  videoTitle?: BilingualText;
  video360?: Video360Data;
  model3d?: Model3DData;
  keyFeatures: BilingualText[];
  gender: 'female' | 'male' | 'unisex';
}

export interface SafeguardRule {
  id: string;
  title: BilingualText;
  summary: BilingualText;
  detailedRule: BilingualText;
  historicalContext: BilingualText;
  severity: 'CRITICAL' | 'WARNING';
}

export interface PlaceLocation {
  id: string;
  name: string;
  type: 'shop' | 'museum';
  city: 'Hà Nội' | 'Huế' | 'TP. Hồ Chí Minh' | 'Đà Nẵng' | 'Bắc Ninh';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  specialty: BilingualText;
  googleMapQuery: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  rentalPriceRange?: string;
  highlightAdvice?: string;
}

export interface AvatarState {
  gender: 'female' | 'male';
  heightCm: number;
  weightKg: number;
  skinTone: 'fair' | 'natural' | 'honey' | 'warm_olive';
  bodyType: 'slim' | 'balanced' | 'curvy' | 'athletic';
  selectedGarmentId: string;
  selectedGarmentColor: string;
  lowerGarment: 'quan_bach_lap' | 'vay_quan_den' | 'quan_au_dai' | 'quan_short_loi';
  headwear: 'khan_dong' | 'khan_vanh_xanh_lam' | 'van_tran' | 'non_quai_thao' | 'mao_le_mismatch' | 'none';
  jewelry: 'kieng_bac' | 'tram_phuong' | 'chuoi_ngoc' | 'quat_lua' | 'none';
  dragonPattern: 'none' | 'hoa_sen' | 'ngu_trao_long' | 'thuy_ba' | 'trong_dong_chim_lac';
  fabricType: 'gam_bao_loc' | 'lua_van_phuc' | 'voan_xuyen_thau';
  destination: string;
  occasionContext: 'le_chua_tam_linh' | 'da_tiec' | 'chup_anh_pho' | 'cuoi_hoi';
}

export interface CulturalCheckResult {
  status: 'Pass' | 'Fail';
  error_code: string;
  user_message: string;
  detailedRules: {
    ruleId: string;
    ruleName: string;
    passed: boolean;
    severity: 'CRITICAL' | 'WARNING' | 'SAFE';
    feedback: string;
  }[];
  historicalTrivia?: string;
}

export interface LookbookTrackItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  description: string;
}

export interface LookbookCardData {
  collectionName: string;
  heritageScore: number;
  remixScore: number;
  colorHarmony: string;
  review: string;
  elementMatch: string;
  trendingKeywords: string[];
  aestheticVibe?: string;
  // Prompt 10: Social Media Copywriter
  tiktok_caption?: string;
  instagram_caption?: string;
  hashtags?: string[];
  // Prompt 11: Soundtrack Matcher
  vibe?: string;
  instrumentation?: string;
  recommended_track_style?: string;
  matched_track?: LookbookTrackItem;
}

export interface RecommendedColor {
  color_name: string;
  hex_code: string;
  nguhanh_element: string;
  type: 'Chính sắc' | 'Tạp sắc';
  meaning?: string;
}

export interface Prompt6PersonalColorResult {
  undertone: 'Warm' | 'Cool' | 'Neutral' | string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | string;
  recommended_colors: RecommendedColor[];
  advice: string;
  contrastLevel?: string;
  avoidColors?: string[];
}

export interface Prompt7ArtDirectorResult {
  hair_style: string;
  makeup_style: string;
  image_generation_prompt: string;
  generated_image_url?: string;
  stylist_note?: string;
}

export interface PersonalColorAnalysis {
  season: string;
  undertone: string;
  contrastLevel: string;
  paletteSummary: string;
  recommendedVietColors: {
    nameVi: string;
    hex: string;
    meaning: string;
  }[];
  avoidColors?: string[];
  makeupHairAdvice: string;
  fiveElementsConnection?: string;
  // Prompt 6 structured data
  prompt6Data?: Prompt6PersonalColorResult;
}
