import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { AvatarState, Language } from '../types';
import { VIET_COSTUMES } from '../data/vietCostumes';
import { 
  Rotate3d, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Camera, 
  User, 
  Image as ImageIcon,
  CheckCircle2,
  ZoomIn,
  Compass
} from 'lucide-react';

interface VirtualFitting3DViewerProps {
  avatarState: AvatarState;
  setAvatarState: React.Dispatch<React.SetStateAction<AvatarState>>;
  language: Language;
}

// 1. Realistic Vietnamese Human Face Texture Generator
function generateRealisticFaceTexture(skinToneHex: string = '#F6E2D5'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Porcelain Vietnamese complexion gradient
  const grad = ctx.createRadialGradient(512, 480, 80, 512, 512, 512);
  grad.addColorStop(0, '#FFF5ED');
  grad.addColorStop(0.5, skinToneHex);
  grad.addColorStop(1, '#DDB49D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft peach blush on cheekbones (Gò má ửng hồng phấn)
  ctx.save();
  ctx.filter = 'blur(18px)';
  ctx.fillStyle = 'rgba(235, 125, 125, 0.38)';
  ctx.beginPath();
  ctx.ellipse(360, 550, 85, 52, 0, 0, Math.PI * 2);
  ctx.ellipse(664, 550, 85, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Natural dark hairline contour (Đường chân tóc đen nhánh chải mượt)
  ctx.fillStyle = '#0B0908';
  ctx.beginPath();
  ctx.moveTo(240, 0);
  ctx.quadraticCurveTo(512, 220, 784, 0);
  ctx.lineTo(1024, 0);
  ctx.lineTo(1024, 420);
  ctx.quadraticCurveTo(800, 480, 760, 620);
  ctx.quadraticCurveTo(720, 520, 730, 360);
  ctx.quadraticCurveTo(512, 290, 294, 360);
  ctx.quadraticCurveTo(304, 520, 264, 620);
  ctx.quadraticCurveTo(224, 480, 0, 420);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // Delicate Willow-Leaf Eyebrows (Chân mày lá liễu thanh tú như thiếu nữ Huế)
  const drawEyebrow = (isRight: boolean) => {
    ctx.save();
    ctx.fillStyle = '#1E1612';
    ctx.beginPath();
    if (!isRight) {
      ctx.moveTo(340, 420);
      ctx.quadraticCurveTo(415, 382, 470, 412);
      ctx.quadraticCurveTo(415, 395, 340, 420);
    } else {
      ctx.moveTo(684, 420);
      ctx.quadraticCurveTo(609, 382, 554, 412);
      ctx.quadraticCurveTo(609, 395, 684, 420);
    }
    ctx.fill();
    ctx.restore();
  };
  drawEyebrow(false);
  drawEyebrow(true);

  // Expressive Almond Eyes (Mắt phượng đen láy với ánh sáng long lanh)
  const drawEye = (cx: number, cy: number, isRight: boolean) => {
    ctx.save();
    // Double eyelid crease (Nếp mí mắt)
    ctx.strokeStyle = 'rgba(90, 45, 35, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 52, cy - 24);
    ctx.quadraticCurveTo(cx, cy - 38, cx + 52, cy - 20);
    ctx.stroke();

    // Eye whites (Tròng trắng)
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(cx - 56, cy);
    ctx.quadraticCurveTo(cx, cy - 26, cx + 56, cy);
    ctx.quadraticCurveTo(cx, cy + 22, cx - 56, cy);
    ctx.closePath();
    ctx.fill();

    // Dark brown iris (Tròng mắt nâu đen Á Đông)
    ctx.fillStyle = '#26150C';
    ctx.beginPath();
    ctx.arc(cx + (isRight ? -4 : 4), cy, 22, 0, Math.PI * 2);
    ctx.fill();

    // Deep black pupil
    ctx.fillStyle = '#090605';
    ctx.beginPath();
    ctx.arc(cx + (isRight ? -4 : 4), cy, 11, 0, Math.PI * 2);
    ctx.fill();

    // Specular light reflection
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + (isRight ? -9 : -1), cy - 6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Upper dark eyeliner & fine lashes
    ctx.strokeStyle = '#120A06';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 58, cy + 2);
    ctx.quadraticCurveTo(cx, cy - 28, cx + 62, cy - 4);
    ctx.stroke();

    // Lower soft lash line
    ctx.strokeStyle = 'rgba(40, 20, 15, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 2);
    ctx.quadraticCurveTo(cx, cy + 20, cx + 52, cy + 1);
    ctx.stroke();
    ctx.restore();
  };

  drawEye(410, 456, false);
  drawEye(614, 456, true);

  // Refined Sculpted Nose (Sống mũi thon thanh tú)
  ctx.save();
  const noseGrad = ctx.createLinearGradient(512, 430, 512, 570);
  noseGrad.addColorStop(0, 'rgba(160, 95, 75, 0.12)');
  noseGrad.addColorStop(1, 'rgba(160, 95, 75, 0.35)');
  ctx.fillStyle = noseGrad;
  ctx.beginPath();
  ctx.moveTo(502, 430);
  ctx.lineTo(522, 430);
  ctx.lineTo(528, 565);
  ctx.lineTo(496, 565);
  ctx.closePath();
  ctx.fill();

  // Nose tip soft highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.arc(512, 562, 10, 0, Math.PI * 2);
  ctx.fill();

  // Delicate nostrils
  ctx.strokeStyle = 'rgba(110, 50, 35, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(495, 574, 9, Math.PI * 0.8, Math.PI * 1.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(529, 574, 9, Math.PI * 1.2, Math.PI * 0.2);
  ctx.stroke();
  ctx.restore();

  // Vermilion Cinnabar Lips (Môi son chu sa tươi tắn, khuôn miệng cười đoan trang)
  ctx.save();
  const lipCenterY = 650;

  // Upper lip with defined Cupid's bow
  ctx.fillStyle = '#C82323';
  ctx.beginPath();
  ctx.moveTo(456, lipCenterY);
  ctx.quadraticCurveTo(490, lipCenterY - 24, 504, lipCenterY - 14);
  ctx.quadraticCurveTo(512, lipCenterY - 22, 520, lipCenterY - 14);
  ctx.quadraticCurveTo(534, lipCenterY - 24, 568, lipCenterY);
  ctx.quadraticCurveTo(512, lipCenterY + 4, 456, lipCenterY);
  ctx.closePath();
  ctx.fill();

  // Lower lip (Môi dưới mềm mại đầy đặn)
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(458, lipCenterY);
  ctx.quadraticCurveTo(512, lipCenterY + 38, 566, lipCenterY);
  ctx.quadraticCurveTo(512, lipCenterY + 4, 458, lipCenterY);
  ctx.closePath();
  ctx.fill();

  // Lip gloss sheen
  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.beginPath();
  ctx.ellipse(512, lipCenterY + 14, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner crease
  ctx.strokeStyle = '#680A0A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(462, lipCenterY);
  ctx.quadraticCurveTo(512, lipCenterY + 3, 562, lipCenterY);
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 2. Procedural Canvas Texture for Nhat Binh Damask & Tam Sơn Thủy Ba
function generateNhatBinhTexture(baseColorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Vermilion Cinnabar Damask base
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 1024, 1024);

  // Woven damask texture
  ctx.fillStyle = 'rgba(255, 230, 180, 0.08)';
  for (let y = 20; y < 700; y += 40) {
    for (let x = 20; x < 1024; x += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Tam Sơn Thủy Ba at lower hem
  const hemY = 720;
  const hemHeight = 304;
  ctx.fillStyle = '#0F2B48';
  ctx.fillRect(0, hemY, 1024, hemHeight);

  const colors = ['#FACC15', '#38BDF8', '#FAF7F2', '#DC2626', '#0284C7'];
  const stripeWidth = 24;

  for (let center of [256, 768]) {
    for (let r = 0; r < 14; r++) {
      ctx.fillStyle = colors[r % colors.length];
      const w = (14 - r) * stripeWidth;
      ctx.beginPath();
      ctx.moveTo(center - w, 1024);
      ctx.lineTo(center, hemY + 90 + r * 12);
      ctx.lineTo(center + w, 1024);
      ctx.closePath();
      ctx.fill();
    }

    // Sacred Mountain Rock (Tam Sơn)
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.moveTo(center - 50, hemY + 90);
    ctx.quadraticCurveTo(center, hemY - 10, center + 50, hemY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(center, hemY + 10, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rolling waves
  ctx.fillStyle = '#E0F2FE';
  for (let x = 0; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.arc(x + 32, hemY + 30, 28, Math.PI, 0);
    ctx.fill();
  }

  // Circular Floral Medallions (Bổ Đoàn hoa tròn hoàng gia)
  const drawMedallion = (cx: number, cy: number, radius: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
    ctx.fillStyle = '#B91C1C';
    ctx.fill();

    ctx.fillStyle = '#FDE047';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const px = cx + Math.cos(angle) * radius * 0.45;
      const py = cy + Math.sin(angle) * radius * 0.45;
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Large Royal Medallion on Upper Back (Mặt sau - chính giữa lưng như ảnh 2)
  drawMedallion(768, 260, 68);

  // Front breast medallions
  drawMedallion(180, 270, 48);
  drawMedallion(332, 270, 48);

  // Side and waist medallions
  drawMedallion(160, 480, 40);
  drawMedallion(352, 480, 40);
  drawMedallion(680, 480, 42);
  drawMedallion(856, 480, 42);
  drawMedallion(768, 580, 45);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. Rectangular Embroidered Collar Texture
function generateCollarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFDF5';
  ctx.fillRect(0, 0, 256, 1024);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, 242, 1010);

  ctx.strokeStyle = '#1E3A8A';
  ctx.lineWidth = 5;
  ctx.strokeRect(22, 22, 212, 980);

  for (let y = 60; y < 980; y += 80) {
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.arc(128, y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(128, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const VirtualFitting3DViewer: React.FC<VirtualFitting3DViewerProps> = ({
  avatarState,
  setAvatarState,
  language,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewType, setViewType] = useState<'3d_human' | 'real_photos'>('3d_human');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activePhotoAngle, setActivePhotoAngle] = useState<'front' | 'back' | 'side' | 'top' | 'free'>('front');
  const [selectedRealPhoto, setSelectedRealPhoto] = useState<number>(0);

  // References to Three.js elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ y: 0, x: 0 });
  const currentRotationRef = useRef({ y: 0, x: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  const selectedCostume = VIET_COSTUMES.find((c) => c.id === avatarState.selectedGarmentId) || VIET_COSTUMES[0];

  // Skin tone mapping
  const getSkinToneHex = (tone: AvatarState['skinTone']): string => {
    switch (tone) {
      case 'fair':
        return '#fbeae3';
      case 'natural':
        return '#f2d3be';
      case 'honey':
        return '#d8a581';
      case 'warm_olive':
        return '#c8936c';
      default:
        return '#f2d3be';
    }
  };

  // Re-build 3D Human Avatar Model with Realistic Features
  const buildAvatarModel = useCallback((scene: THREE.Scene) => {
    if (avatarGroupRef.current) {
      scene.remove(avatarGroupRef.current);
      avatarGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
      avatarGroupRef.current = null;
    }

    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;

    // Body scaling from Height & Weight
    const baseHeight = 165;
    const heightScale = avatarState.heightCm / baseHeight;
    const heightM = avatarState.heightCm / 100;
    const bmi = avatarState.weightKg / (heightM * heightM);
    const girthFactor = Math.sqrt(bmi / 20.5);
    const widthScale = Math.max(0.78, Math.min(1.45, girthFactor));
    const depthScale = Math.max(0.8, Math.min(1.4, girthFactor * 0.95));

    const skinToneColor = getSkinToneHex(avatarState.skinTone);
    const isNhatBinh = avatarState.selectedGarmentId === 'ao-nhat-binh';
    const garmentColorHex = avatarState.selectedGarmentColor || '#C81E1E';

    // Textures
    const faceTexture = generateRealisticFaceTexture(skinToneColor);
    const nhatBinhTexture = isNhatBinh ? generateNhatBinhTexture(garmentColorHex) : null;
    const collarTexture = isNhatBinh ? generateCollarTexture() : null;

    // Materials
    const realisticFaceMaterial = new THREE.MeshStandardMaterial({
      map: faceTexture,
      roughness: 0.45,
      metalness: 0.05,
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinToneColor),
      roughness: 0.48,
      metalness: 0.06,
    });

    const robeMaterial = isNhatBinh && nhatBinhTexture
      ? new THREE.MeshStandardMaterial({
          map: nhatBinhTexture,
          roughness: 0.38,
          metalness: 0.18,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshStandardMaterial({
          color: new THREE.Color(garmentColorHex),
          roughness: 0.45,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });

    const collarMaterial = isNhatBinh && collarTexture
      ? new THREE.MeshStandardMaterial({
          map: collarTexture,
          roughness: 0.3,
          metalness: 0.25,
        })
      : new THREE.MeshStandardMaterial({
          color: 0xfffdf5,
          roughness: 0.3,
          metalness: 0.2,
        });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.25,
      metalness: 0.85,
    });

    const jadeMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.3,
    });

    const whiteSilkMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf7f2,
      roughness: 0.38,
      side: THREE.DoubleSide,
    });

    // 1. Imperial Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.98, 1.08, 0.14, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x2e0606,
      roughness: 0.4,
      metalness: 0.45,
    });
    const pedestal = new THREE.Mesh(baseGeo, baseMat);
    pedestal.position.y = -1.2;
    pedestal.receiveShadow = true;
    avatarGroup.add(pedestal);

    const ringGeo = new THREE.TorusGeometry(1.0, 0.025, 8, 36);
    const ringMesh = new THREE.Mesh(ringGeo, goldMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.13;
    avatarGroup.add(ringMesh);

    // Body Rig for Scaled Proportions
    const bodyRig = new THREE.Group();
    bodyRig.position.y = -1.13;
    bodyRig.scale.set(widthScale, heightScale, depthScale);
    avatarGroup.add(bodyRig);

    // 2. Realistic Human Head & Face
    const headRadius = 0.21;
    const headGeo = new THREE.SphereGeometry(headRadius, 36, 28);
    // Orient texture to front
    const headMesh = new THREE.Mesh(headGeo, realisticFaceMaterial);
    headMesh.rotation.y = -Math.PI / 2;
    headMesh.position.y = 2.45;
    headMesh.castShadow = true;
    bodyRig.add(headMesh);

    // Earlobes with Pearl/Jade Stud Earrings (Hoa tai ngọc trai)
    const earringGeo = new THREE.SphereGeometry(0.015, 12, 8);
    const earringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.4 });
    const earringL = new THREE.Mesh(earringGeo, earringMat);
    earringL.position.set(-0.21, 2.41, -0.01);
    bodyRig.add(earringL);

    const earringR = new THREE.Mesh(earringGeo, earringMat);
    earringR.position.set(0.21, 2.41, -0.01);
    bodyRig.add(earringR);

    // Sleek Royal Hair Bun inside Turban Hole (Búi tóc bới cao ở giữa lòng khăn vành)
    const hairBunGeo = new THREE.SphereGeometry(0.11, 24, 16);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.7 });
    const hairBun = new THREE.Mesh(hairBunGeo, hairMat);
    hairBun.position.set(0, 2.65, -0.02);
    hairBun.castShadow = true;
    bodyRig.add(hairBun);

    // Natural Neck
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.095, 0.18, 16);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.y = 2.27;
    neck.castShadow = true;
    bodyRig.add(neck);

    // Inner White Standing Collar
    const innerCollarGeo = new THREE.CylinderGeometry(0.092, 0.105, 0.12, 20);
    const innerCollar = new THREE.Mesh(innerCollarGeo, whiteSilkMaterial);
    innerCollar.position.set(0, 2.29, 0);
    bodyRig.add(innerCollar);

    // Throat Jade Brooch
    const throatBroochGeo = new THREE.SphereGeometry(0.022, 12, 8);
    const throatBrooch = new THREE.Mesh(throatBroochGeo, jadeMaterial);
    throatBrooch.position.set(0, 2.31, 0.102);
    bodyRig.add(throatBrooch);

    // 3. Royal Blue Khăn Vành (Khăn Vành Dây Hoàng Phái Triều Nguyễn)
    const useRoyalBlueTurban = isNhatBinh || avatarState.headwear === 'khan_vanh_xanh_lam' || avatarState.headwear === 'khan_dong';
    if (useRoyalBlueTurban) {
      const turbanOuterRadius = headRadius + 0.18;
      const turbanInnerRadius = headRadius + 0.01;
      const turbanThickness = 0.09;

      const turbanGeo = new THREE.CylinderGeometry(
        turbanOuterRadius,
        turbanInnerRadius,
        turbanThickness,
        36,
        1,
        true
      );
      const turbanMat = new THREE.MeshStandardMaterial({
        color: 0x1545b5, // Sapphire Royal Blue
        roughness: 0.4,
        metalness: 0.25,
        side: THREE.DoubleSide,
      });
      const turban = new THREE.Mesh(turbanGeo, turbanMat);
      turban.rotation.x = 0.26;
      turban.position.set(0, 2.58, -0.02);
      turban.castShadow = true;
      bodyRig.add(turban);

      const rimGeo = new THREE.TorusGeometry(turbanOuterRadius, 0.008, 8, 36);
      const rimMesh = new THREE.Mesh(rimGeo, goldMaterial);
      rimMesh.rotation.x = Math.PI / 2 + 0.26;
      rimMesh.position.set(0, 2.62, -0.02);
      bodyRig.add(rimMesh);
    }

    // 4. Lower Garments & Shoes
    const isBareLegs = avatarState.lowerGarment === 'quan_short_loi';
    if (isBareLegs) {
      const shortGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.35, 16);
      const shorts = new THREE.Mesh(shortGeo, new THREE.MeshStandardMaterial({ color: 0x2563eb }));
      shorts.position.y = 1.05;
      bodyRig.add(shorts);

      const legGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.85, 16);
      const legL = new THREE.Mesh(legGeo, skinMaterial);
      legL.position.set(-0.12, 0.5, 0);
      bodyRig.add(legL);
      const legR = new THREE.Mesh(legGeo, skinMaterial);
      legR.position.set(0.12, 0.5, 0);
      bodyRig.add(legR);
    } else {
      const underSkirtGeo = new THREE.CylinderGeometry(0.35, 0.59, 1.35, 32, 1, true);
      const underSkirtMat = new THREE.MeshStandardMaterial({
        color: 0x172554,
        roughness: 0.45,
        side: THREE.DoubleSide,
      });
      const underSkirt = new THREE.Mesh(underSkirtGeo, underSkirtMat);
      underSkirt.position.y = 0.55;
      underSkirt.castShadow = true;
      bodyRig.add(underSkirt);

      const trouserLegGeo = new THREE.CylinderGeometry(0.16, 0.24, 1.25, 20);
      const legL = new THREE.Mesh(trouserLegGeo, whiteSilkMaterial);
      legL.position.set(-0.13, 0.65, 0);
      bodyRig.add(legL);
      const legR = new THREE.Mesh(trouserLegGeo, whiteSilkMaterial);
      legR.position.set(0.13, 0.65, 0);
      bodyRig.add(legR);

      // Court red shoes with white platform soles
      const shoeSoleGeo = new THREE.BoxGeometry(0.1, 0.035, 0.18);
      const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const shoeTopGeo = new THREE.BoxGeometry(0.09, 0.045, 0.15);
      const shoeTopMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });

      const soleL = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
      soleL.position.set(-0.13, 0.02, 0.03);
      bodyRig.add(soleL);
      const topL = new THREE.Mesh(shoeTopGeo, shoeTopMat);
      topL.position.set(-0.13, 0.05, 0.03);
      bodyRig.add(topL);

      const soleR = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
      soleR.position.set(0.13, 0.02, 0.03);
      bodyRig.add(soleR);
      const topR = new THREE.Mesh(shoeTopGeo, shoeTopMat);
      topR.position.set(0.13, 0.05, 0.03);
      bodyRig.add(topR);
    }

    // 5. Main Traditional Robe Body
    const chestRadius = 0.3;
    const waistRadius = 0.28;
    const torsoGeo = new THREE.CylinderGeometry(chestRadius, waistRadius, 0.88, 32);
    const torso = new THREE.Mesh(torsoGeo, robeMaterial);
    torso.position.y = 1.76;
    torso.castShadow = true;
    bodyRig.add(torso);

    const robeLowerGeo = new THREE.CylinderGeometry(waistRadius + 0.015, 0.65, 1.48, 36, 1, true);
    const robeLower = new THREE.Mesh(robeLowerGeo, robeMaterial);
    robeLower.position.y = 0.82;
    robeLower.castShadow = true;
    bodyRig.add(robeLower);

    // 6. Broad Sleeves with Dải Ngũ Sắc
    const sleeveLength = 1.08;
    const sleeveWidth = 0.28;

    const sleeveLGeo = new THREE.CylinderGeometry(0.15, sleeveWidth, sleeveLength, 24);
    const sleeveL = new THREE.Mesh(sleeveLGeo, robeMaterial);
    sleeveL.position.set(-0.52, 1.74, 0);
    sleeveL.rotation.z = 0.58;
    sleeveL.castShadow = true;
    bodyRig.add(sleeveL);

    const sleeveRGeo = new THREE.CylinderGeometry(0.15, sleeveWidth, sleeveLength, 24);
    const sleeveR = new THREE.Mesh(sleeveRGeo, robeMaterial);
    sleeveR.position.set(0.52, 1.74, 0);
    sleeveR.rotation.z = -0.58;
    sleeveR.castShadow = true;
    bodyRig.add(sleeveR);

    // Five-color cuff bands
    const fiveColorHexes = [0x0284c7, 0xfacc15, 0xfaf7f2, 0xdc2626, 0x0f172a];
    fiveColorHexes.forEach((hex, idx) => {
      const bandGeo = new THREE.TorusGeometry(sleeveWidth + 0.006, 0.014, 8, 24);
      const bandMat = new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.35,
        metalness: 0.15,
      });

      const bandL = new THREE.Mesh(bandGeo, bandMat);
      bandL.position.set(-0.74 - idx * 0.028, 1.41 - idx * 0.028, 0);
      bandL.rotation.z = 0.58;
      bandL.rotation.x = Math.PI / 2;
      bodyRig.add(bandL);

      const bandR = new THREE.Mesh(bandGeo, bandMat);
      bandR.position.set(0.74 + idx * 0.028, 1.41 - idx * 0.028, 0);
      bandR.rotation.z = -0.58;
      bandR.rotation.x = Math.PI / 2;
      bodyRig.add(bandR);
    });

    // 7. Realistic Human Hands with Sculpted Slender Fingers
    // Left Hand Group
    const handGroupL = new THREE.Group();
    handGroupL.position.set(-0.06, 1.42, chestRadius + 0.06);
    const palmL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.06, 0.02), skinMaterial);
    handGroupL.add(palmL);
    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.045, 8), skinMaterial);
      finger.position.set(-0.015 + f * 0.01, -0.045, 0);
      handGroupL.add(finger);
    }
    bodyRig.add(handGroupL);

    // Right Hand Group
    const handGroupR = new THREE.Group();
    handGroupR.position.set(0.06, 1.42, chestRadius + 0.06);
    const palmR = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.06, 0.02), skinMaterial);
    handGroupR.add(palmR);
    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.045, 8), skinMaterial);
      finger.position.set(-0.015 + f * 0.01, -0.045, 0);
      handGroupR.add(finger);
    }
    bodyRig.add(handGroupR);

    // 8. Rectangular Collar & Hanging Ribbon Sashes
    if (isNhatBinh) {
      const collarWidth = 0.22;
      const collarLength = 0.98;
      const collarThickness = 0.035;
      const collarGeo = new THREE.BoxGeometry(collarWidth, collarLength, collarThickness);
      const collarMesh = new THREE.Mesh(collarGeo, collarMaterial);
      collarMesh.position.set(0, 1.78, chestRadius + 0.018);
      collarMesh.castShadow = true;
      bodyRig.add(collarMesh);

      // Gold Brooch Button at chest center
      const broochGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
      const broochMesh = new THREE.Mesh(broochGeo, goldMaterial);
      broochMesh.rotation.x = Math.PI / 2;
      broochMesh.position.set(0, 1.95, chestRadius + 0.045);
      bodyRig.add(broochMesh);

      // Hanging Silk Sashes with Jade Tassels (Dải Giải Thùy)
      const sashRibbonGeo = new THREE.BoxGeometry(0.04, 0.82, 0.015);
      const sashRibbonMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.3,
      });

      const ribbonL = new THREE.Mesh(sashRibbonGeo, sashRibbonMat);
      ribbonL.position.set(-0.045, 1.48, chestRadius + 0.035);
      bodyRig.add(ribbonL);

      const ribbonR = new THREE.Mesh(sashRibbonGeo, sashRibbonMat);
      ribbonR.position.set(0.045, 1.48, chestRadius + 0.035);
      bodyRig.add(ribbonR);

      const tasselGeo = new THREE.ConeGeometry(0.025, 0.12, 12);
      const tasselMat = new THREE.MeshStandardMaterial({ color: 0x059669 });
      const tasselL = new THREE.Mesh(tasselGeo, tasselMat);
      tasselL.rotation.x = Math.PI;
      tasselL.position.set(-0.045, 1.02, chestRadius + 0.035);
      bodyRig.add(tasselL);

      const tasselR = new THREE.Mesh(tasselGeo, tasselMat);
      tasselR.rotation.x = Math.PI;
      tasselR.position.set(0.045, 1.02, chestRadius + 0.035);
      bodyRig.add(tasselR);
    }

    scene.add(avatarGroup);
  }, [avatarState]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    if (viewType !== '3d_human') return;
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 4.3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting for Real Human Skin & Vermilion Silk
    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.92);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainKeyLight.position.set(3, 5, 4);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const warmFill = new THREE.DirectionalLight(0xffe099, 0.75);
    warmFill.position.set(-3, 2, -2);
    scene.add(warmFill);

    const rimLight = new THREE.PointLight(0xff7766, 0.85, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Build model
    buildAvatarModel(scene);

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (avatarGroupRef.current) {
        if (isAutoRotate && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.007;
        }

        if (!isDraggingRef.current) {
          targetRotationRef.current.y += rotationVelocityRef.current.y;
          targetRotationRef.current.x += rotationVelocityRef.current.x;
          rotationVelocityRef.current.y *= 0.92;
          rotationVelocityRef.current.x *= 0.92;
        }

        targetRotationRef.current.x = Math.max(-0.25, Math.min(0.65, targetRotationRef.current.x));

        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;

        avatarGroupRef.current.rotation.y = currentRotationRef.current.y;
        avatarGroupRef.current.rotation.x = currentRotationRef.current.x;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [buildAvatarModel, isAutoRotate, viewType]);

  useEffect(() => {
    if (sceneRef.current && viewType === '3d_human') {
      buildAvatarModel(sceneRef.current);
    }
  }, [avatarState, buildAvatarModel, viewType]);

  // Pointer drag controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
    rotationVelocityRef.current = { x: 0, y: 0 };
    setActivePhotoAngle('free');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerRef.current.x;
    const deltaY = e.clientY - previousPointerRef.current.y;

    const rotSpeed = 0.008;
    targetRotationRef.current.y += deltaX * rotSpeed;
    targetRotationRef.current.x += deltaY * (rotSpeed * 0.6);

    rotationVelocityRef.current = {
      y: deltaX * rotSpeed * 0.4,
      x: deltaY * rotSpeed * 0.2,
    };

    previousPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // 4 View Preset Angles
  const setPhotoAngle = (angle: 'front' | 'back' | 'side' | 'top') => {
    setActivePhotoAngle(angle);
    setIsAutoRotate(false);

    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.45, 4.3);
    }

    if (angle === 'front') {
      targetRotationRef.current = { x: 0, y: 0 };
    } else if (angle === 'back') {
      targetRotationRef.current = { x: 0, y: Math.PI };
    } else if (angle === 'side') {
      targetRotationRef.current = { x: 0, y: Math.PI / 2 };
    } else if (angle === 'top') {
      targetRotationRef.current = { x: 0.58, y: 0 };
    }
  };

  const resetView = () => {
    setActivePhotoAngle('front');
    targetRotationRef.current = { x: 0, y: 0 };
    currentRotationRef.current = { x: 0, y: 0 };
    rotationVelocityRef.current = { x: 0, y: 0 };
    setIsAutoRotate(true);
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.45, 4.3);
    }
  };

  // BMI calculations
  const heightM = avatarState.heightCm / 100;
  const bmiValue = parseFloat((avatarState.weightKg / (heightM * heightM)).toFixed(1));
  const getBmiDescription = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Thanh mảnh · Phom cung đình', color: 'text-amber-300' };
    if (bmi <= 23) return { label: 'Cân đối chuẩn mẫu người thật', color: 'text-emerald-300' };
    if (bmi <= 27) return { label: 'Đầy đặn phúc hậu · Sang quý', color: 'text-amber-200' };
    return { label: 'Oai nghiêm bề thế', color: 'text-orange-300' };
  };
  const bmiInfo = getBmiDescription(bmiValue);

  // 4 Real Human Photo Data from User's Uploaded Image
  const realHumanPhotos = [
    {
      id: 'front',
      title: 'Ảnh 1: Mặt Trước Chính Diện (Người Thật Mặc Áo)',
      desc: 'Thiếu nữ cung đình trong trang phục Áo Nhật Bình Đỏ Chu Sa, Khăn Vành Xanh Lam Bảo Thạch, Cổ chữ Nhật lụa thêu hoa cúc, Dải Giải Thùy ngọc bích và Dải Ngũ Sắc trên tay áo.',
      angle: 'front' as const,
      details: ['Khăn Vành Xanh Lam Bảo Thạch lộ búi tóc', 'Cổ áo Nhật Bình chữ Nhật vắt ngực thêu hoa', 'Dải Giải Thùy lụa vàng buông ngực', 'Dải Ngũ Sắc cửa tay áo thụng', 'Chân vạt hoa văn Tam Sơn Thủy Ba'],
    },
    {
      id: 'back',
      title: 'Ảnh 2: Mặt Sau Lưng (Người Thật Mặc Áo)',
      desc: 'Góc nhìn toàn vẹn phía sau lưng: Chiêm ngưỡng đóa Bổ Đoàn hoàng gia tròn lớn thêu giữa hai bả vai, búi tóc đen cung đình nằm gọn trong lòng Khăn Vành xanh, và sóng nước Thủy Ba bao quanh vạt sau.',
      angle: 'back' as const,
      details: ['Đóa Bổ Đoàn hoàng gia tròn lớn chính giữa lưng', 'Búi tóc bới cao trong lòng khăn vành', 'Các đóa hoa đoàn rải đều thân áo sau', 'Hoa văn Tam Sơn Thủy Ba sóng nước vạt sau'],
    },
    {
      id: 'side',
      title: 'Ảnh 3: Góc Nghiêng Bên (Người Thật Mặc Áo)',
      desc: 'Góc nghiêng thể hiện phom dáng suông thanh thoát, độ dốc 15 độ của Khăn Vành và độ xòe buông rủ uyển chuyển của ống tay thụng cùng tà áo dài.',
      angle: 'side' as const,
      details: ['Độ nghiêng 15 độ thanh thoát của Khăn Vành', 'Độ phồng và buông dài của ống tay thụng', 'Vạt áo suông thẳng chuẩn mực đoan chính', 'Hài đỏ mũi nhọn đế trắng truyền thống'],
    },
    {
      id: 'top',
      title: 'Ảnh 4: Góc Nhìn Từ Trên Xuống (Người Thật Cung Kính)',
      desc: 'Tư thế cung kính chốn cung đình nhìn từ trên cao: Thấy rõ vòng tròn hoàn hảo của Khăn Vành xanh lam, búi tóc đen ở tâm, và biên độ sải rộng của hai ống tay áo thụng.',
      angle: 'top' as const,
      details: ['Vòng tròn đồng tâm Khăn Vành xanh lam', 'Búi tóc đen cung đình ở tâm điểm', 'Hai tay thụng cung kính xếp phía trước', 'Dải Ngũ Sắc nổi bật trên nền đỏ'],
    },
  ];

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Top Switcher: 3D Human Avatar vs Real-Photo Lookbook */}
      <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-[#E6C673]/30 z-20">
        <div className="flex items-center gap-1 bg-[#430808] p-0.5 rounded-lg border border-[#E6C673]/40">
          <button
            onClick={() => setViewType('3d_human')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewType === '3d_human'
                ? 'bg-[#E6C673] text-[#5C0C0C] shadow-sm'
                : 'text-[#FFF8ED]/80 hover:text-white'
            }`}
          >
            <User size={13} />
            <span>Mô Hình 3D Người Thật (360°)</span>
          </button>

          <button
            onClick={() => setViewType('real_photos')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewType === 'real_photos'
                ? 'bg-[#E6C673] text-[#5C0C0C] shadow-sm'
                : 'text-[#FFF8ED]/80 hover:text-white'
            }`}
          >
            <ImageIcon size={13} />
            <span>Ảnh Người Thật (4 Chiều)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#FFF8ED]/90 bg-[#520A0A] px-2.5 py-0.5 rounded-full border border-[#E6C673]/30">
          <span>{avatarState.heightCm}cm</span>
          <span>·</span>
          <span>{avatarState.weightKg}kg</span>
        </div>
      </div>

      {/* MODE 1: 3D REALISTIC HUMAN AVATAR (Xoay 360 độ) */}
      {viewType === '3d_human' && (
        <>
          <div
            className="relative w-full h-[370px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none overflow-hidden my-1 rounded-xl"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Three.js Canvas */}
            <div ref={mountRef} className="w-full h-full" />

            {/* 4 Photo Presets corresponding to User's 4 Photos */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`px-2 py-1 text-[10px] font-semibold rounded-md border backdrop-blur-md transition-all cursor-pointer ${
                  isAutoRotate
                    ? 'bg-[#E6C673] text-[#5C0C0C] border-[#FFDF88] shadow-md'
                    : 'bg-[#5C0C0C]/80 text-[#FFF8ED] border-[#E6C673]/40 hover:bg-[#721111]'
                }`}
                title="Bật/Tắt tự động xoay 360 độ"
              >
                {isAutoRotate ? '⏸ Dừng xoay' : '▶ Tự xoay 360°'}
              </button>

              <button
                onClick={() => setPhotoAngle('front')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-md transition-all cursor-pointer ${
                  activePhotoAngle === 'front'
                    ? 'bg-[#E6C673] text-[#5C0C0C] border-[#FFDF88]'
                    : 'bg-[#5C0C0C]/80 text-[#FFF8ED] border-[#E6C673]/40 hover:bg-[#721111]'
                }`}
                title="Ảnh 1: Góc chụp chính diện người thật"
              >
                Mặt trước (Ảnh 1)
              </button>

              <button
                onClick={() => setPhotoAngle('back')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-md transition-all cursor-pointer ${
                  activePhotoAngle === 'back'
                    ? 'bg-[#E6C673] text-[#5C0C0C] border-[#FFDF88]'
                    : 'bg-[#5C0C0C]/80 text-[#FFF8ED] border-[#E6C673]/40 hover:bg-[#721111]'
                }`}
                title="Ảnh 2: Mặt sau lưng Bổ Đoàn người thật"
              >
                Mặt sau (Ảnh 2)
              </button>

              <button
                onClick={() => setPhotoAngle('side')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-md transition-all cursor-pointer ${
                  activePhotoAngle === 'side'
                    ? 'bg-[#E6C673] text-[#5C0C0C] border-[#FFDF88]'
                    : 'bg-[#5C0C0C]/80 text-[#FFF8ED] border-[#E6C673]/40 hover:bg-[#721111]'
                }`}
                title="Ảnh 3: Góc chụp nghiêng bên người thật"
              >
                Nghiêng bên (Ảnh 3)
              </button>

              <button
                onClick={() => setPhotoAngle('top')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border backdrop-blur-md transition-all cursor-pointer ${
                  activePhotoAngle === 'top'
                    ? 'bg-[#E6C673] text-[#5C0C0C] border-[#FFDF88]'
                    : 'bg-[#5C0C0C]/80 text-[#FFF8ED] border-[#E6C673]/40 hover:bg-[#721111]'
                }`}
                title="Ảnh 4: Góc chụp từ trên xuống cung kính"
              >
                Trên xuống (Ảnh 4)
              </button>

              <button
                onClick={resetView}
                className="p-1 rounded-md bg-[#5C0C0C]/80 hover:bg-[#721111] text-[#FFDF88] border border-[#E6C673]/40 flex items-center justify-center cursor-pointer"
                title="Đặt lại góc nhìn"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Drag Hint Overlay */}
            <div className="absolute bottom-2 left-2 z-10 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded bg-[#330808]/75 border border-[#E6C673]/30 text-[10px] text-[#FFF8ED]/90 backdrop-blur-xs">
              <Rotate3d size={12} className="text-[#FFDF88]" />
              <span>Người thật 3D · Vuốt để xoay 360°</span>
            </div>
          </div>

          {/* Direct Interactive Sliders for Height & Weight */}
          <div className="w-full bg-[#520A0A]/90 border border-[#E6C673]/50 rounded-xl p-3 space-y-2.5 z-20 backdrop-blur-sm shadow-inner">
            {/* Height Adjuster */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#FFFDF8] mb-1">
                <span className="flex items-center gap-1">
                  <span>Chiều cao:</span>
                  <span className="text-[#FFDF88] font-mono text-sm">{avatarState.heightCm} cm</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, heightCm: Math.max(140, prev.heightCm - 1) }))}
                    className="w-5 h-5 rounded bg-[#330808] hover:bg-[#680E0E] text-[#FFF8ED] text-xs flex items-center justify-center border border-[#E6C673]/30 cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, heightCm: Math.min(205, prev.heightCm + 1) }))}
                    className="w-5 h-5 rounded bg-[#330808] hover:bg-[#680E0E] text-[#FFF8ED] text-xs flex items-center justify-center border border-[#E6C673]/30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="140"
                max="205"
                step="1"
                value={avatarState.heightCm}
                onChange={(e) => setAvatarState((prev) => ({ ...prev, heightCm: parseInt(e.target.value, 10) }))}
                className="w-full h-1.5 bg-[#2B0505] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
              />
              <div className="flex justify-between text-[9px] text-[#FFF8ED]/50 font-mono mt-0.5">
                <span>140 cm</span>
                <span>162 cm (Chuẩn mẫu)</span>
                <span>205 cm</span>
              </div>
            </div>

            {/* Weight Adjuster */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#FFFDF8] mb-1">
                <span className="flex items-center gap-1">
                  <span>Cân nặng:</span>
                  <span className="text-[#FFDF88] font-mono text-sm">{avatarState.weightKg} kg</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, weightKg: Math.max(38, prev.weightKg - 1) }))}
                    className="w-5 h-5 rounded bg-[#330808] hover:bg-[#680E0E] text-[#FFF8ED] text-xs flex items-center justify-center border border-[#E6C673]/30 cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setAvatarState((prev) => ({ ...prev, weightKg: Math.min(115, prev.weightKg + 1) }))}
                    className="w-5 h-5 rounded bg-[#330808] hover:bg-[#680E0E] text-[#FFF8ED] text-xs flex items-center justify-center border border-[#E6C673]/30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="38"
                max="115"
                step="1"
                value={avatarState.weightKg}
                onChange={(e) => setAvatarState((prev) => ({ ...prev, weightKg: parseInt(e.target.value, 10) }))}
                className="w-full h-1.5 bg-[#2B0505] rounded-lg appearance-none cursor-pointer accent-[#E6C673]"
              />
              <div className="flex justify-between text-[9px] text-[#FFF8ED]/50 font-mono mt-0.5">
                <span>38 kg</span>
                <span>49 kg (Chuẩn mẫu)</span>
                <span>115 kg</span>
              </div>
            </div>

            {/* Real-time Proportions Feedback */}
            <div className="pt-2 border-t border-[#E6C673]/20 flex items-center justify-between text-[11px]">
              <span className="text-[#F5ECD8]/80 font-mono">
                BMI: <strong className="text-[#FFF8ED]">{bmiValue}</strong>
              </span>
              <span className={`font-semibold ${bmiInfo.color} truncate max-w-[210px]`}>
                {bmiInfo.label}
              </span>
            </div>
          </div>
        </>
      )}

      {/* MODE 2: REAL-HUMAN PHOTO LOOKBOOK (Tư liệu 4 ảnh người thật) */}
      {viewType === 'real_photos' && (
        <div className="w-full flex-1 flex flex-col space-y-3 p-1 my-1">
          {/* Main Selected Photo Showcase */}
          <div className="relative bg-[#3F0A0A] rounded-xl border border-[#E6C673]/50 p-4 shadow-xl flex flex-col items-center justify-center min-h-[350px]">
            {/* Visual Header */}
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FFDF88] flex items-center gap-1.5">
                <Camera size={14} className="text-[#E6C673]" />
                <span>{realHumanPhotos[selectedRealPhoto].title}</span>
              </span>
              <button
                onClick={() => {
                  setViewType('3d_human');
                  setPhotoAngle(realHumanPhotos[selectedRealPhoto].angle);
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-[#881818] hover:bg-[#A82020] text-[#FFFDF8] rounded-md border border-[#E6C673]/50 transition-colors cursor-pointer flex items-center gap-1"
                title="Đưa góc này vào mô hình 3D người thật xoay 360 độ"
              >
                <Rotate3d size={12} className="text-[#FFDF88]" />
                <span>Xoay 3D góc này</span>
              </button>
            </div>

            {/* Detail Badges from Photo */}
            <div className="w-full bg-[#520A0A]/80 rounded-lg p-3 border border-[#E6C673]/30 my-2 space-y-2 text-left">
              <div className="text-xs text-[#FFF8ED] leading-relaxed">
                {realHumanPhotos[selectedRealPhoto].desc}
              </div>
              <div className="pt-2 border-t border-[#E6C673]/20">
                <div className="text-[10px] font-bold text-[#FFDF88] uppercase tracking-wider mb-1.5">
                  Đặc điểm nổi bật từ góc chụp thực tế:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {realHumanPhotos[selectedRealPhoto].details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#F5ECD8]">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Angle Thumbnails Selector */}
            <div className="w-full grid grid-cols-4 gap-2 pt-2 border-t border-[#E6C673]/30 mt-auto">
              {realHumanPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedRealPhoto(index)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedRealPhoto === index
                      ? 'bg-[#881818] border-[#FFDF88] shadow-md ring-1 ring-[#FFDF88]'
                      : 'bg-[#520A0A]/60 border-[#E6C673]/30 hover:bg-[#680E0E]'
                  }`}
                >
                  <div className="text-[11px] font-bold text-[#FFDF88]">Ảnh {index + 1}</div>
                  <div className="text-[9px] text-[#FFF8ED]/80 truncate">
                    {index === 0 ? 'Mặt trước' : index === 1 ? 'Mặt sau' : index === 2 ? 'Nghiêng' : 'Trên xuống'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#520A0A] border border-[#E6C673]/40 text-xs text-[#FFF8ED]/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#FFDF88]" />
              <span>Chuyển sang <strong>Mô Hình 3D Người Thật</strong> để xoay 360° tự do và co giãn chiều cao cân nặng.</span>
            </span>
            <button
              onClick={() => setViewType('3d_human')}
              className="px-2.5 py-1 bg-[#E6C673] hover:bg-[#F3D78A] text-[#5C0C0C] font-bold text-[11px] rounded transition-all shrink-0 cursor-pointer ml-2"
            >
              Xem 3D 360°
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
