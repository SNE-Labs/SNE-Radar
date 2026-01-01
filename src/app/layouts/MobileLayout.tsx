import { Suspense, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLazyMobileComponents, useMobilePrefetch } from '../../hooks/useLazyMobileComponents';

// Lazy load mobile pages
const MobileHome = lazy(() => import('../pages/mobile/Home'));
const MobileRadar = lazy(() => import('../pages/mobile/Radar'));
const MobileVault = lazy(() => import('../pages/mobile/Vault'));
const MobilePass = lazy(() => import('../pages/mobile/Pass'));
const MobilePricing = lazy(() => import('../pages/mobile/Pricing'));
const MobileStatus = lazy(() => import('../pages/mobile/Status'));
const MobileDocs = lazy(() => import('../pages/mobile/Docs'));

// Loading component for mobile
function MobileSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Map routes to components
const routeComponents = {
  '/': MobileHome,
  '/radar': MobileRadar,
  '/vault': MobileVault,
  '/pass': MobilePass,
  '/pricing': MobilePricing,
  '/status': MobileStatus,
  '/docs': MobileDocs,
};

export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lazy loading dos componentes mobile
  const { TabBar, Container, tabBarLoaded, containerLoaded } = useLazyMobileComponents();

  // Prefetch de rotas adjacentes
  useMobilePrefetch(location.pathname);
  const [activeTab, setActiveTab] = useState(() => {
    // Determinar tab ativa baseada na rota atual
    const path = location.pathname;
    if (path.includes('/radar')) return 'radar';
    if (path.includes('/vault')) return 'vault';
    if (path.includes('/pass')) return 'pass';
    if (path.includes('/status')) return 'status';
    return 'radar'; // default
  });

  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [direction, setDirection] = useState(1);

  const tabs = [
    { id: 'radar', label: 'Radar', icon: 'Activity' as const },
    { id: 'vault', label: 'Vault', icon: 'Shield' as const },
    { id: 'pass', label: 'Pass', icon: 'Key' as const },
    { id: 'status', label: 'Status', icon: 'BarChart3' as const },
  ];

  // Atualizar rota quando tab muda
  useEffect(() => {
    const tabRoutes = {
      radar: '/radar',
      vault: '/vault',
      pass: '/pass',
      status: '/status'
    };

    const newRoute = tabRoutes[activeTab as keyof typeof tabRoutes] || '/radar';
    if (currentRoute !== newRoute) {
      setDirection(currentRoute < newRoute ? 1 : -1);
      setCurrentRoute(newRoute);
      navigate(newRoute, { replace: true });
    }
  }, [activeTab, currentRoute, navigate]);

  // Atualizar tab quando rota muda (para navegação direta)
  useEffect(() => {
    const path = location.pathname;
    let newTab = 'radar';

    if (path.includes('/radar')) newTab = 'radar';
    else if (path.includes('/vault')) newTab = 'vault';
    else if (path.includes('/pass')) newTab = 'pass';
    else if (path.includes('/status')) newTab = 'status';

    if (newTab !== activeTab) {
      setDirection(activeTab < newTab ? 1 : -1);
      setActiveTab(newTab);
    }
    setCurrentRoute(path);
  }, [location.pathname, activeTab]);

  // Get current component
  const CurrentComponent = routeComponents[currentRoute as keyof typeof routeComponents] || MobileRadar;

  return (
    <div className="mobile-layout">
      {/* Main Content Area with Container Navigation */}
      <div className="mobile-content-area">
        {Container ? (
          <Container
            direction={direction}
            onSwipeLeft={() => {
              // Swipe left - next tab
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              const nextIndex = (currentIndex + 1) % tabs.length;
              setActiveTab(tabs[nextIndex].id);
            }}
            onSwipeRight={() => {
              // Swipe right - previous tab
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
              setActiveTab(tabs[prevIndex].id);
            }}
            enableSwipe={true}
          >
            <Suspense fallback={<MobileSkeleton />}>
              <CurrentComponent />
            </Suspense>
          </Container>
        ) : (
          <MobileSkeleton />
        )}
      </div>

      {/* iOS-style Tab Bar */}
      {TabBar ? (
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      ) : (
        <div className="mobile-tab-placeholder" />
      )}
    </div>
  );
}
