import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VietnameseCostume } from '../types';
import { 
  Rotate3d, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Eye, 
  Download, 
  Layers, 
  Sparkles, 
  Compass, 
  X,
  Palette,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface Costume3DViewerProps {
  costume: VietnameseCostume;
  onClose?: () => void;
  onSelectForFitting?: (id: string) => void;
}

export const Costume3DViewer: React.FC<Costume3DViewerProps> = ({
  costume,
  onClose,
  onSelectForFitting,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [currentColor, setCurrentColor] = useState(costume.notableColors[0] || '#881818');
  const [activePart, setActivePart] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const materialMapRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#1F1813'); // Deep museum bronze dark

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 3.8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 0.6);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xff6b6b, 0.8, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.15, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x332820,
      roughness: 0.4,
      metalness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.25;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Ring accent
    const ringGeo = new THREE.RingGeometry(1.0, 1.15, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x881818, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.17;
    scene.add(ring);

    // 5. Build Procedural 3D Garment Mesh Model based on Costume Type
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const mainColor = new THREE.Color(currentColor);

    // Main silk material
    const silkMaterial = new THREE.MeshStandardMaterial({
      color: mainColor,
      roughness: 0.35,
      metalness: 0.15,
      wireframe: wireframe,
    });
    materialMapRef.current.set('silk', silkMaterial);

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      roughness: 0.25,
      metalness: 0.8,
    });
    materialMapRef.current.set('gold', goldMaterial);

    const whiteSilkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FAF7F2'),
      roughness: 0.4,
      metalness: 0.05,
    });

    // Mannequin Head & Neck
    const headGeo = new THREE.SphereGeometry(0.24, 32, 24);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.35;
    head.castShadow = true;
    modelGroup.add(head);

    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.2, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 1.18;
    modelGroup.add(neck);

    // Torso / Core Robe
    const torsoGeo = new THREE.CylinderGeometry(0.35, 0.55, 1.3, 32);
    const torso = new THREE.Mesh(torsoGeo, silkMaterial);
    torso.position.y = 0.5;
    torso.castShadow = true;
    torso.receiveShadow = true;
    modelGroup.add(torso);

    // Lower skirt / Long robe drape
    const robeLowerGeo = new THREE.ConeGeometry(0.85, 1.5, 32, 1, true);
    const robeLower = new THREE.Mesh(robeLowerGeo, silkMaterial);
    robeLower.position.y = -0.4;
    robeLower.castShadow = true;
    modelGroup.add(robeLower);

    // Lower pristine trousers peeking beneath
    const trouserGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.7, 16);
    const trousers = new THREE.Mesh(trouserGeo, whiteSilkMaterial);
    trousers.position.y = -0.9;
    modelGroup.add(trousers);

    // Sleeves
    const isBroadSleeves = costume.id === 'ao-tac-nguyen' || costume.id === 'ao-nhat-binh' || costume.id === 'ao-vien-linh';
    const sleeveRadius = isBroadSleeves ? 0.28 : 0.16;
    const sleeveLength = isBroadSleeves ? 1.1 : 0.85;

    // Left Sleeve
    const leftSleeveGeo = new THREE.CylinderGeometry(0.18, sleeveRadius, sleeveLength, 16);
    const leftSleeve = new THREE.Mesh(leftSleeveGeo, silkMaterial);
    leftSleeve.position.set(-0.6, 0.55, 0);
    leftSleeve.rotation.z = 0.45;
    leftSleeve.castShadow = true;
    modelGroup.add(leftSleeve);

    // Right Sleeve
    const rightSleeveGeo = new THREE.CylinderGeometry(0.18, sleeveRadius, sleeveLength, 16);
    const rightSleeve = new THREE.Mesh(rightSleeveGeo, silkMaterial);
    rightSleeve.position.set(0.6, 0.55, 0);
    rightSleeve.rotation.z = -0.45;
    rightSleeve.castShadow = true;
    modelGroup.add(rightSleeve);

    // Five-colored bands on sleeves if Nhat Binh
    if (costume.id === 'ao-nhat-binh') {
      const bandColors = [0x2563eb, 0xeab308, 0xfaf7f2, 0xdc2626, 0x18181b];
      bandColors.forEach((hex, i) => {
        const bandGeo = new THREE.TorusGeometry(sleeveRadius + 0.01, 0.015, 8, 24);
        const bandMat = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.3 });

        const bandL = new THREE.Mesh(bandGeo, bandMat);
        bandL.position.set(-0.85 - i * 0.04, 0.18 - i * 0.04, 0);
        bandL.rotation.z = 0.45;
        bandL.rotation.x = Math.PI / 2;
        modelGroup.add(bandL);

        const bandR = new THREE.Mesh(bandGeo, bandMat);
        bandR.position.set(0.85 + i * 0.04, 0.18 - i * 0.04, 0);
        bandR.rotation.z = -0.45;
        bandR.rotation.x = Math.PI / 2;
        modelGroup.add(bandR);
      });

      // Signature Rectangular Collar for Nhat Binh
      const collarRectGeo = new THREE.BoxGeometry(0.24, 0.9, 0.06);
      const collarRect = new THREE.Mesh(collarRectGeo, goldMaterial);
      collarRect.position.set(0, 0.65, 0.32);
      collarRect.castShadow = true;
      modelGroup.add(collarRect);
    } else if (costume.id === 'ao-giao-linh') {
      // Cross-lapels (X shape)
      const lapelLGeo = new THREE.BoxGeometry(0.12, 0.8, 0.04);
      const lapelL = new THREE.Mesh(lapelLGeo, goldMaterial);
      lapelL.position.set(-0.08, 0.75, 0.3);
      lapelL.rotation.z = 0.35;
      modelGroup.add(lapelL);

      const lapelRGeo = new THREE.BoxGeometry(0.12, 0.8, 0.04);
      const lapelR = new THREE.Mesh(lapelRGeo, whiteSilkMaterial);
      lapelR.position.set(0.08, 0.75, 0.28);
      lapelR.rotation.z = -0.35;
      modelGroup.add(lapelR);
    } else {
      // High standing mandarin collar (Ao Tac / Ngu Than)
      const collarGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.12, 24);
      const collar = new THREE.Mesh(collarGeo, goldMaterial);
      collar.position.set(0, 1.1, 0.02);
      modelGroup.add(collar);
    }

    // Interactive Drag to Rotate Camera Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const domElement = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, modelGroupRef.current.rotation.x + deltaY * 0.004));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.2, Math.min(6.5, camera.position.z + e.deltaY * 0.003));
    };

    // Touch events for mobile/tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !modelGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      modelGroupRef.current.rotation.y += deltaX * 0.01;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotate && !isDragging && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 480;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);

      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [costume.id]);

  // Sync color changes
  useEffect(() => {
    const silkMat = materialMapRef.current.get('silk');
    if (silkMat) {
      silkMat.color.set(currentColor);
    }
  }, [currentColor]);

  // Sync wireframe
  useEffect(() => {
    const silkMat = materialMapRef.current.get('silk');
    if (silkMat) {
      silkMat.wireframe = wireframe;
    }
  }, [wireframe]);

  const handleDownloadModel = () => {
    setDownloadSuccess(true);
    // Simulate generation of GLTF binary container download
    const blob = new Blob(
      [
        JSON.stringify({
          asset: { version: '2.0', generator: 'Viet Phuc Remix 3D Studio' },
          costumeId: costume.id,
          costumeName: costume.name.vi,
          era: costume.era.vi,
          polygons: costume.model3d?.verticesCount || '48,200',
          format: 'GLTF-Binary-Ready',
          timestamp: new Date().toISOString(),
        }),
      ],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${costume.id}-3d-model.gltf`;
    link.click();
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleResetCamera = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div
      className={`relative bg-[#181310] text-[#FAF7F2] rounded-2xl overflow-hidden border border-[#A82020]/40 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="bg-[#2A1F17]/90 backdrop-blur-md px-5 py-3 border-b border-[#430C0C] flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#881818] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-vintage font-bold text-base sm:text-lg text-[#FAF7F2]">
                {costume.name.vi}
              </h3>
              <span className="text-[10px] bg-[#881818]/60 text-[#DFCEB0] px-2 py-0.5 rounded border border-[#DFCEB0]/20 font-mono">
                {costume.model3d?.verticesCount || '48,200 Polygons'}
              </span>
            </div>
            <span className="text-[11px] text-[#A89885] block">{costume.era.vi}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-[#DFCEB0] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-[#DFCEB0] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[500px]">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {/* Auto rotate toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A1F17]/80 hover:bg-[#2A1F17] backdrop-blur-md rounded-lg text-xs font-medium border border-[#DFCEB0]/20 text-[#FAF7F2] transition-colors shadow-xs"
          >
            {isAutoRotate ? <Pause size={13} /> : <Play size={13} />}
            <span>{isAutoRotate ? 'Tạm dừng xoay' : 'Tự động xoay 360°'}</span>
          </button>

          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-xs ${
              wireframe
                ? 'bg-[#881818] border-[#DFCEB0] text-white'
                : 'bg-[#2A1F17]/80 hover:bg-[#2A1F17] border-[#DFCEB0]/20 text-[#FAF7F2]'
            }`}
          >
            <Layers size={13} />
            <span>{wireframe ? 'Chế độ Khung lưới (Wireframe)' : 'Chế độ Vải gấm (Silk Shader)'}</span>
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A1F17]/80 hover:bg-[#2A1F17] backdrop-blur-md rounded-lg text-xs font-medium border border-[#DFCEB0]/20 text-[#FAF7F2] transition-colors shadow-xs"
          >
            <Rotate3d size={13} />
            <span>Góc nhìn chính diện</span>
          </button>
        </div>

        {/* Color Switcher Pill */}
        <div className="absolute top-4 right-4 bg-[#2A1F17]/85 backdrop-blur-md p-2 rounded-xl border border-[#DFCEB0]/20 flex flex-col gap-1.5 z-10">
          <span className="text-[10px] text-[#A89885] px-1 font-semibold uppercase">Đổi sắc áo:</span>
          <div className="flex items-center gap-1.5">
            {costume.notableColors.map((hex, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentColor(hex)}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  currentColor === hex ? 'scale-125 border-white ring-2 ring-[#881818]' : 'border-white/40'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Helper Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xs px-3.5 py-1 rounded-full text-[11px] text-[#DFCEB0] pointer-events-none text-center">
          Kéo chuột / vuốt chạm để xoay 360° · Cuộn chuột để phóng to / thu nhỏ
        </div>
      </div>

      {/* Bottom Bar: Action Links & Metadata */}
      <div className="bg-[#2A1F17] px-5 py-3.5 border-t border-[#430C0C] flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2 text-xs text-[#DFCEB0]">
          <Sparkles size={14} className="text-[#D4AF37]" />
          <span>
            Nguồn mô hình: <strong>{costume.model3d?.sourceCredit || 'Việt Phục Remix 3D Lab'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={handleDownloadModel}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-[#DFCEB0]/30 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            {downloadSuccess ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Download size={14} />}
            <span>{downloadSuccess ? 'Đã tải tệp GLTF' : 'Tải Mô Hình 3D (GLTF)'}</span>
          </button>

          {onSelectForFitting && (
            <button
              onClick={() => onSelectForFitting(costume.id)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#881818] hover:bg-[#A82020] rounded-lg text-xs font-semibold text-white shadow-sm transition-all"
            >
              <Layers size={14} />
              <span>Đưa vào Phòng Thử Đồ 3D</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
