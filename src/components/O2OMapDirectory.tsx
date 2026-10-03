import React, { useState, useEffect } from 'react';
import { PlaceLocation, Language } from '../types';
import { VIET_LOCATIONS, calculateDistanceKm } from '../data/locations';
import { O2OAssistant } from './O2OAssistant';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  ExternalLink, 
  Search, 
  Filter, 
  Compass, 
  Building2, 
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Share2,
  Bot,
  Layers,
  Star
} from 'lucide-react';

interface O2OMapDirectoryProps {
  language: Language;
}

export const O2OMapDirectory: React.FC<O2OMapDirectoryProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'ai-coordinator'>('directory');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PlaceLocation | null>(VIET_LOCATIONS[0]);

  // Request user GPS
  const handleRequestLocation = () => {
    setIsLocating(true);
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError(language === 'vi' ? 'Trình duyệt không hỗ trợ Geolocation' : 'Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        // Default to Hanoi center coordinates if permission denied
        setUserLocation({ lat: 21.0285, lng: 105.8542 });
        setGeoError(
          language === 'vi'
            ? 'Đã đặt tọa độ mặc định (Hà Nội) do chưa cấp quyền GPS.'
            : 'Defaulted to Hanoi center coordinates (GPS permission not granted).'
        );
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    handleRequestLocation();
  }, []);

  const cities = ['all', 'Hà Nội', 'Huế', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bắc Ninh'];

  // Filter locations
  const filteredPlaces = VIET_LOCATIONS.filter((item) => {
    const matchCity = selectedCity === 'all' || item.city === selectedCity;
    const matchType = selectedType === 'all' || item.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.specialty[language].toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    return matchCity && matchType && matchQuery;
  }).map((item) => {
    const distanceKm = userLocation
      ? calculateDistanceKm(userLocation.lat, userLocation.lng, item.lat, item.lng)
      : null;
    return { ...item, distanceKm };
  }).sort((a, b) => {
    if (a.distanceKm !== null && b.distanceKm !== null) {
      return a.distanceKm - b.distanceKm;
    }
    return 0;
  });

  const handleSelectFromAi = (name: string) => {
    const found = VIET_LOCATIONS.find((l) => l.name.toLowerCase().includes(name.toLowerCase()));
    if (found) {
      setSelectedLocation(found);
      setActiveTab('directory');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header (Khối nổi màu đỏ) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-[#881818] via-[#751212] to-[#5C0C0C] p-6 rounded-2xl border border-[#E6C673]/60 shadow-xl text-[#FFF8ED]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDF88] uppercase tracking-wider">
            <Compass size={16} />
            <span>Mạng Lưới O2O · Bản Đồ Bảo Tàng & Cửa Hàng Toàn Quốc (Bước 2.2)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-vintage font-bold text-[#FFFDF8]">
            {language === 'vi' ? 'Khám Phá Điểm Đến Cổ Phục Gần Bạn' : 'Heritage Map & Local Rental Directory'}
          </h2>
          <p className="text-xs text-[#F5ECD8]">
            {language === 'vi'
              ? 'Tọa độ chuẩn xác các bảo tàng quốc gia lưu giữ hoàng bào và các tiệm may đo, cho thuê Việt phục uy tín nhất kết nối Google Maps.'
              : 'Verified GPS locations of state heritage museums and trusted traditional costume ateliers across Vietnam.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#420707] p-1 rounded-xl border border-[#E6C673]/40">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-[#E6C673] text-[#420707] font-bold shadow-xs'
                  : 'text-[#DFCEB0] hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>Danh Mục Bản Đồ</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-coordinator')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'ai-coordinator'
                  ? 'bg-[#E6C673] text-[#420707] font-bold shadow-xs'
                  : 'text-[#DFCEB0] hover:text-white'
              }`}
            >
              <Bot size={14} />
              <span>Điều Phối Viên O2O (Prompt 5)</span>
            </button>
          </div>

          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#520A0A] hover:bg-[#680E0E] border border-[#E6C673]/50 text-[#FFDF88] text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Navigation size={13} className={isLocating ? 'animate-spin text-[#E6C673]' : 'text-[#E6C673]'} />
            <span>{isLocating ? 'Đang định vị...' : 'Vị trí của tôi'}</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="text-xs text-[#8C7A65] bg-[#F3ECE0] px-4 py-2 rounded-lg border border-[#E6D8C3]">
          {geoError}
        </div>
      )}

      {/* Tab 2: AI O2O Coordinator Assistant (Prompt 5) */}
      {activeTab === 'ai-coordinator' && (
        <div className="space-y-4">
          <O2OAssistant
            language={language}
            userCoords={userLocation}
            onSelectLocationOnMap={handleSelectFromAi}
          />
        </div>
      )}

      {/* Tab 1: Map Directory & Places */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filter and search row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* City Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#F3ECE0] rounded-lg">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCity === city
                      ? 'bg-white text-[#430C0C] shadow-xs font-semibold'
                      : 'text-[#6B5A47] hover:text-[#430C0C]'
                  }`}
                >
                  {city === 'all' ? (language === 'vi' ? 'Toàn quốc' : 'All Vietnam') : city}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F3ECE0] rounded-lg">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedType === 'all' ? 'bg-white text-[#430C0C] shadow-xs font-semibold' : 'text-[#6B5A47]'
                }`}
              >
                {language === 'vi' ? 'Tất cả' : 'All Places'}
              </button>
              <button
                onClick={() => setSelectedType('museum')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-colors ${
                  selectedType === 'museum' ? 'bg-white text-[#430C0C] shadow-xs font-semibold' : 'text-[#6B5A47]'
                }`}
              >
                <Building2 size={13} />
                <span>{language === 'vi' ? 'Bảo tàng' : 'Museum'}</span>
              </button>
              <button
                onClick={() => setSelectedType('shop')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-colors ${
                  selectedType === 'shop' ? 'bg-white text-[#430C0C] shadow-xs font-semibold' : 'text-[#6B5A47]'
                }`}
              >
                <ShoppingBag size={13} />
                <span>{language === 'vi' ? 'Thuê / May' : 'Shops'}</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A65]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm tiệm thuê, bảo tàng, phố cổ...' : 'Search museum, rental atelier...'}
                className="w-full pl-9 pr-3 py-2 bg-white text-xs text-[#430C0C] rounded-lg border border-[#E6D8C3] focus:ring-2 focus:ring-[#881818]/20 focus:border-[#881818] outline-none"
              />
            </div>
          </div>

          {/* Main Two-Column Directory: List & Visual Map Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Scrollable List */}
            <div className="lg:col-span-7 space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredPlaces.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6B5A47] bg-white rounded-xl border border-[#E6D8C3]">
                  Không tìm thấy địa điểm phù hợp trong khu vực này.
                </div>
              ) : (
                filteredPlaces.map((item) => {
                  const isSelected = selectedLocation?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLocation(item)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-[#881818] shadow-sm ring-1 ring-[#881818]/20'
                          : 'bg-[#FAF7F2] hover:bg-white border-[#E6D8C3]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                                item.type === 'museum'
                                  ? 'bg-[#430C0C] text-[#FAF7F2]'
                                  : 'bg-[#FAF7F2] text-[#881818] border border-[#881818]/30'
                              }`}
                            >
                              {item.type === 'museum' ? 'Bảo tàng' : 'Tiệm cho thuê & may đo'}
                            </span>
                            <span className="text-xs text-[#8C7A65]">· {item.city}</span>
                            {item.distanceKm !== null && (
                              <span className="text-xs font-semibold text-[#881818] ml-auto">
                                ~{item.distanceKm} km
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-serif-vintage font-bold text-[#430C0C]">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#6B5A47] line-clamp-1 flex items-center gap-1">
                            <MapPin size={13} className="shrink-0 text-[#881818]" />
                            <span>{item.address}</span>
                          </p>
                        </div>

                        {item.rating && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 shrink-0">
                            <Star size={11} fill="currentColor" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#430C0C] mt-2 line-clamp-2 leading-relaxed bg-[#F6F1E7]/60 p-2.5 rounded-lg border border-[#E6D8C3]/50">
                        {item.specialty[language]}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F3ECE0] text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] text-[#8C7A65] bg-white px-2 py-0.5 rounded border border-[#E6D8C3]">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[#881818] hover:text-[#430C0C] font-semibold shrink-0"
                        >
                          <span>{language === 'vi' ? 'Chỉ đường' : 'Directions'}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right: Selected Place Focus Card & Interactive Google Maps Embed Link */}
            <div className="lg:col-span-5 space-y-4">
              {selectedLocation ? (
                <div className="bg-white p-6 rounded-2xl border border-[#E6D8C3] shadow-sm space-y-5 sticky top-20">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                        selectedLocation.type === 'museum'
                          ? 'bg-[#430C0C] text-[#FAF7F2]'
                          : 'bg-[#881818]/10 text-[#881818] border border-[#881818]/20'
                      }`}
                    >
                      {selectedLocation.type === 'museum' ? 'Bảo Tàng Di Sản' : 'Studio Thuê & May Đo Cổ Phục'}
                    </span>
                    <span className="text-xs text-[#8C7A65]">{selectedLocation.city}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif-vintage font-bold text-[#430C0C]">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-xs text-[#6B5A47] flex items-start gap-1.5 mt-2">
                      <MapPin size={15} className="shrink-0 text-[#881818] mt-0.5" />
                      <span>{selectedLocation.address}</span>
                    </p>
                    {selectedLocation.phone && (
                      <p className="text-xs text-[#6B5A47] flex items-center gap-1.5 mt-1.5">
                        <Phone size={14} className="shrink-0 text-[#881818]" />
                        <span>Hotline: {selectedLocation.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Highlights and Pricing */}
                  <div className="space-y-2 text-xs">
                    {selectedLocation.rentalPriceRange && (
                      <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900 flex items-center justify-between">
                        <span className="font-semibold">Mức giá tham khảo:</span>
                        <span>{selectedLocation.rentalPriceRange}</span>
                      </div>
                    )}
                    {selectedLocation.highlightAdvice && (
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-900 leading-relaxed">
                        <strong>💡 Mẹo trải nghiệm:</strong> {selectedLocation.highlightAdvice}
                      </div>
                    )}
                  </div>

                  {/* Map Graphic */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E6D8C3] flex items-center justify-center p-4">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#881818_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#881818] text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                        <MapPin size={20} />
                      </div>
                      <div className="text-xs font-semibold text-[#430C0C]">
                        Tọa độ: {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                      </div>
                      <div className="text-[11px] text-[#8C7A65]">
                        Tích hợp chỉ đường vệ tinh Google Maps trực tiếp
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#430C0C] uppercase tracking-wider">
                      {language === 'vi' ? 'Điểm nổi bật & Dịch vụ:' : 'Highlights & Offerings:'}
                    </h4>
                    <p className="text-xs text-[#430C0C] leading-relaxed bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6D8C3]">
                      {selectedLocation.specialty[language]}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedLocation.name + ' ' + selectedLocation.address
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-[#881818] hover:bg-[#A82020] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation size={14} />
                      <span>Mở Google Maps và Chỉ Đường Ngay</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#6B5A47] bg-white rounded-xl border border-[#E6D8C3]">
                  Chọn một địa điểm từ danh sách để xem chi tiết và đường đi.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
