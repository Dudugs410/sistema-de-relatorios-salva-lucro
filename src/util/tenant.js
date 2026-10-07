import salvaLucroLogo from '../assets/LogoTopo.png';
import sifraLogo from '../assets/logoSifra.png';
import mgLogo from '../assets/logoMG.png';
import cardDigitalLogo from '../assets/logoCardDigital outline.png';
import superJurLogo from '../assets/logoSuperjur outline.png';

export const TENANTS = {
  'salvalucro3': {
    id: 'SL',
    nome: 'Salva Lucro',
    logo: salvaLucroLogo,
    contextKey: 'salvalucro',
    label: 'Salva Lucro',
    path: 'salvalucro3',
  },
  'sifra_react': {
    id: 'Sifra',
    nome: 'Sifra',
    logo: sifraLogo,
    contextKey: 'sifra',
    label: 'Sifra',
    path: 'sifra_react',
  },
  'mg_react': {
    id: 'MG',
    nome: 'MG',
    logo: mgLogo,
    contextKey: 'mg',
    label: 'MG',
    path: 'mg_react',
  },
  'carddigital_react': {
    id: 'CardDigital',
    nome: 'Card Digital',
    logo: cardDigitalLogo,
    contextKey: 'carddigital',
    label: 'Card Digital',
    path: 'carddigital_react',
  },
  'superjur_react': {
    id: 'SuperJur',
    nome: 'Super Jur',
    logo: superJurLogo,
    contextKey: 'superjur',
    label: 'Super Jur',
    path: 'superjur_react',
  },
};

export const getTenantFromURL = () => {
  const path = window.location.pathname;
  const segments = path.split('/').filter((seg) => seg.length > 0);
  if (segments.length === 0) return null;
  const key = segments[0];
  return TENANTS[key] || null;
};

export const getTenantByContextKey = (contextKey) => {
  if (!contextKey) return null;
  return Object.values(TENANTS).find((t) => t.contextKey === contextKey) || null;
};

export const getLogoByContext = (contextKey) => {
  const tenant = getTenantByContextKey(contextKey);
  return tenant ? tenant.logo : TENANTS['salvalucro3'].logo;
};

export const getAvailableTenants = () => Object.values(TENANTS);