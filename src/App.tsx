import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage.tsx';
import { CaracterizacionPage } from './pages/CaracterizacionPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ModuloPage } from './pages/ModuloPage.tsx';
import { EvaluacionPage } from './pages/EvaluacionPage.tsx';
import { CertificadoPage } from './pages/CertificadoPage.tsx';
import { CapacitacionReglamentoPage } from './pages/CapacitacionReglamentoPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { AcuerdoJsonPage } from './pages/AcuerdoJsonPage.tsx';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash.replace('#', '') || '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  // Router mapping
  if (currentRoute === '/') {
    return <HomePage onNavigate={navigate} />;
  }

  if (currentRoute === '/caracterizacion') {
    return <CaracterizacionPage onNavigate={navigate} />;
  }

  if (currentRoute === '/dashboard') {
    return <DashboardPage onNavigate={navigate} />;
  }

  if (currentRoute === '/capacitacion') {
    return <CapacitacionReglamentoPage onNavigate={navigate} />;
  }

  if (currentRoute === '/admin') {
    return <AdminPage onNavigate={navigate} />;
  }

  if (currentRoute === '/acuerdo-json') {
    return <AcuerdoJsonPage onNavigate={navigate} />;
  }

  if (currentRoute === '/certificado') {
    return <CertificadoPage onNavigate={navigate} />;
  }

  if (currentRoute.startsWith('/modulo/') && currentRoute.endsWith('/evaluacion')) {
    const slug = currentRoute.replace('/modulo/', '').replace('/evaluacion', '');
    return <EvaluacionPage slug={slug} onNavigate={navigate} />;
  }

  if (currentRoute.startsWith('/modulo/')) {
    const slug = currentRoute.replace('/modulo/', '');
    return <ModuloPage slug={slug} onNavigate={navigate} />;
  }

  // Fallback to Home
  return <HomePage onNavigate={navigate} />;
}
