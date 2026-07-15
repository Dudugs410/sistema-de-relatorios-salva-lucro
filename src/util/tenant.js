// src/util/tenant.js

// Importação das logos
import salvaLucroLogo from '../assets/LogoTopo.png';
import sifraLogo from '../assets/logoSifra.png';
import mgLogo from '../assets/logoMG.png';
import cardDigitalLogo from '../assets/logoCardDigital outline.png';
import superJurLogo from '../assets/logoSuperjur outline.png';

// Mapeamento de tenants com seus contextos
export const TENANTS = {
  'salvalucro3': {
    id: 'SL',
    nome: 'Salva Lucro',
    logo: salvaLucroLogo,
    contextKey: 'SL',
    label: 'Salva Lucro',
    path: 'salvalucro3'
  },
  'sifra': {
    id: 'Sifra',
    nome: 'Sifra',
    logo: sifraLogo,
    contextKey: 'Sifra',
    label: 'Sifra',
    path: 'sifra'
  },
  'mg': {
    id: 'MG',
    nome: 'MG',
    logo: mgLogo,
    contextKey: 'MG',
    label: 'MG',
    path: 'mg'
  },

  'carddigital': {
     id: 'CardDigital',
     nome: 'Card Digital',
     logo: cardDigitalLogo,
     contextKey: 'CardDigital',
     label: 'Card Digital',
     path: 'carddigital'
   },
   'superjur': {
     id: 'SuperJur',
     nome: 'Super Jur',
     logo: superJurLogo,
     contextKey: 'SuperJur',
     label: 'Super Jur',
     path: 'superjur'
   }
};

// Função para identificar o tenant baseado na URL
export const getTenantFromURL = () => {
  const path = window.location.pathname;
  const basename = '/salvalucro3'; // Seu basename atual
  
  // Remove o basename do path se existir
  let relativePath = path;
  if (path.startsWith(basename)) {
    relativePath = path.substring(basename.length);
  }
  
  // Pega o primeiro segmento após o basename
  const pathSegments = relativePath.split('/').filter(seg => seg.length > 0);
  const tenantKey = pathSegments[0] || 'salvalucro3';
  
  console.log('🔍 Tenant detectado:', tenantKey, 'Path:', path);
  
  return TENANTS[tenantKey] || TENANTS['salvalucro3'];
};

// Função para obter tenant atual (prioriza localStorage para compatibilidade)
export const getCurrentTenant = () => {
  const savedContext = localStorage.getItem('selectedContext');
  const urlTenant = getTenantFromURL();
  
  console.log('📦 Tenant da URL:', urlTenant);
  console.log('💾 Contexto salvo:', savedContext);
  
  // Se tiver um contexto salvo que corresponde a um tenant, usa ele
  if (savedContext) {
    const tenantByContext = Object.values(TENANTS).find(
      t => t.contextKey === savedContext
    );
    if (tenantByContext) {
      console.log('✅ Usando tenant do localStorage:', tenantByContext);
      return tenantByContext;
    }
  }
  
  console.log('✅ Usando tenant da URL:', urlTenant);
  return urlTenant;
};

// Função para obter a logo baseada no contexto
export const getLogoByContext = (contextKey) => {
  const tenant = Object.values(TENANTS).find(t => t.contextKey === contextKey);
  return tenant ? tenant.logo : TENANTS['salvalucro3'].logo;
};

// Função para obter todos os tenants disponíveis (para o seletor)
export const getAvailableTenants = () => {
  return Object.values(TENANTS);
};