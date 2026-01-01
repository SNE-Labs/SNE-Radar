import { useState, useEffect } from 'react';

/**
 * Hook para detectar plataforma e capacidades do dispositivo
 * Essencial para otimizações mobile vs desktop
 */
export function usePlatform() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    hasTouch: false,
    hasGyroscope: false,
    isLowEndDevice: false,
    prefersReducedMotion: false,
    supportsWebGL: false,
    supportsWebRTC: false,
  });

  useEffect(() => {
    // Media queries para detectar plataforma
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');

    const updatePlatform = () => {
      const mobile = mobileQuery.matches;
      const tablet = tabletQuery.matches && !mobile;
      const desktop = !mobile && !tablet;

      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsDesktop(desktop);
    };

    // Verificar capacidades do dispositivo
    const checkCapabilities = async () => {
      const capabilities = {
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasGyroscope: 'DeviceOrientationEvent' in window,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        supportsWebGL: (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
              canvas.getContext('webgl'));
          } catch (e) {
            return false;
          }
        })(),
        supportsWebRTC: !!(
          window.RTCPeerConnection ||
          (window as any).webkitRTCPeerConnection ||
          (window as any).mozRTCPeerConnection
        ),
        // Detectar dispositivos low-end baseado em memória e CPU
        isLowEndDevice: (() => {
          const memory = (navigator as any).deviceMemory;
          const cores = navigator.hardwareConcurrency;

          // Estimativa de low-end: < 4GB RAM ou < 4 cores
          return (memory && memory < 4) || (cores && cores < 4);
        })(),
      };

      setDeviceCapabilities(capabilities);
    };

    // Listeners para mudanças de viewport
    mobileQuery.addEventListener('change', updatePlatform);
    tabletQuery.addEventListener('change', updatePlatform);

    // Inicialização
    updatePlatform();
    checkCapabilities();

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', updatePlatform);
      tabletQuery.removeEventListener('change', updatePlatform);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceCapabilities,
    platform: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
}

/**
 * Hook para detectar se devemos usar animações reduzidas
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook para detectar orientação do dispositivo
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
}
