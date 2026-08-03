// Centralized icon registry - single source of truth for all icons
import icon1 from '../assets/user_icons/ICON_LOGO_AZUL.png'
import icon2 from '../assets/user_icons/ICON_LOGO_BRANCO.png'
import icon3 from '../assets/user_icons/ICON_LOGO_PRETO.png'
import icon4 from '../assets/user_icons/ICON_LOGO_ROSA.png'
import icon5 from '../assets/user_icons/ICON_LOGO_VERDE.png'
import icon6 from '../assets/user_icons/ICON_MG_SOLUCOES.png'
import icon7 from '../assets/user_icons/ICON_SIFRA.png'
import icon8 from '../assets/user_icons/ICON_SUPERJUR.png'
import icon9 from '../assets/user_icons/ICON_CARD_DIGITAL.png'
import adminIcon1 from '../assets/user_icons/ADMIN_ICON_1.png'
import adminIcon2 from '../assets/user_icons/ADMIN_ICON_2.png'
import adminIcon3 from '../assets/user_icons/ADMIN_ICON_3.png'
import secret00 from '../assets/user_icons/secret00.jpg'
import secret01 from '../assets/user_icons/secret01.png'

// Icon mapping - code to path
export const ICON_MAP = {
  1: icon1,
  2: icon2,
  3: icon3,
  4: icon4,
  5: icon5,
  6: icon6,
  7: icon7,
  8: icon8,
  9: icon9,
  10: adminIcon1,
  11: adminIcon2,
  12: adminIcon3,
  97: secret01,
  98: secret00,
}

// VISUAL IDENTITY ICONS - These are company logos (white-label partners)
export const VISUAL_IDENTITY_ICONS = {
  'salvalucro': { code: 1, path: icon1, name: 'Salva Lucro' },
  'sifra': { code: 7, path: icon7, name: 'Sifra' },
  'mg': { code: 6, path: icon6, name: 'MG Soluções' },
  'superjur': { code: 8, path: icon8, name: 'SuperJur' },
  'carddigital': { code: 9, path: icon9, name: 'Card Digital' },
}

// Get default icon based on user's visual identity
export const getDefaultIconByVisualIdentity = (identidadeVisual) => {
  // Normalize the identity - trim and lowercase
  const normalizedIdentity = (identidadeVisual || 'salvalucro').trim().toLowerCase()
  
  // Direct lookup
  if (VISUAL_IDENTITY_ICONS[normalizedIdentity]) {
    const visualIcon = VISUAL_IDENTITY_ICONS[normalizedIdentity]
    return {
      id: `default_${normalizedIdentity}`,
      name: `Padrão (${visualIcon.name})`,
      path: visualIcon.path,
      code: visualIcon.code,
      isDefault: true,
      description: `Baseado na identidade visual: ${normalizedIdentity}`
    }
  }
  
  // Fallback
  console.warn(`⚠️ Identity "${normalizedIdentity}" not found, using salvalucro`)
  const fallbackIcon = VISUAL_IDENTITY_ICONS['salvalucro']
  return {
    id: 'default_salvalucro',
    name: 'Padrão (Salva Lucro)',
    path: fallbackIcon.path,
    code: fallbackIcon.code,
    isDefault: true,
    description: 'Baseado na identidade visual: salvalucro (fallback)'
  }
}

// Get the user's current default icon (based on visual identity)
export const getUserDefaultIcon = getDefaultIconByVisualIdentity

// Get selectable color icons (only the 5 basic colors)
export const getSelectableColorIcons = () => {
  return [
    { id: 'icon1', name: 'Azul', path: icon1, code: 1, category: 'color' },
    { id: 'icon2', name: 'Branco', path: icon2, code: 2, category: 'color' },
    { id: 'icon3', name: 'Preto', path: icon3, code: 3, category: 'color' },
    { id: 'icon4', name: 'Rosa', path: icon4, code: 4, category: 'color' },
    { id: 'icon5', name: 'Verde', path: icon5, code: 5, category: 'color' },
  ]
}

// Get admin icons (only for admin users)
export const getAdminIcons = () => {
  return [
    { id: 'admin1', name: 'Admin Especial 1', path: adminIcon1, code: 10, category: 'admin' },
    { id: 'admin2', name: 'Admin Especial 2', path: adminIcon2, code: 11, category: 'admin' },
    { id: 'admin3', name: 'Admin Especial 3', path: adminIcon3, code: 12, category: 'admin' },
  ]
}

// Get secret icons (only for special user)
export const getSecretIcons = () => {
  return [
    { id: 'secret00', name: 'Ícone Secreto 00', path: secret00, code: 98, category: 'secret' },
    { id: 'secret01', name: 'Ícone Secreto 01', path: secret01, code: 97, category: 'secret' },
  ]
}

// Get all selectable icons for a user based on their role
export const getSelectableIcons = (isAdminUser, isSpecialUser, visualIdentity) => {
  let icons = [...getSelectableColorIcons()]
  if (isAdminUser) icons = [...icons, ...getAdminIcons()]
  if (isSpecialUser) icons = [...icons, ...getSecretIcons()]
  return icons
}

export const DEFAULT_ICON_CODE = 1
export const DEFAULT_ICON_PATH = ICON_MAP[DEFAULT_ICON_CODE]

export const getIconPathByCode = (code) => {
  if (!code || typeof code !== 'number') {
    console.warn(`Invalid icon code: ${code}, using default`)
    return ICON_MAP[1]
  }
  const icon = ICON_MAP[code]
  if (!icon) {
    console.warn(`Icon code ${code} not found, using default`)
    return ICON_MAP[1]
  }
  return icon
}

// Get default icon safely - ALWAYS returns a valid path
export const getSafeDefaultIcon = (userData = null) => {
  try {
    const identidadeVisual = userData?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'
    const normalized = identidadeVisual.trim().toLowerCase()
    const defaultIcon = VISUAL_IDENTITY_ICONS[normalized] || VISUAL_IDENTITY_ICONS['salvalucro']
    return defaultIcon.path
  } catch (error) {
    console.error('Error getting safe default icon:', error)
    return ICON_MAP[1]
  }
}

// Export individual icons for components that need direct access
export {
  icon1, icon2, icon3, icon4, icon5,
  icon6, icon7, icon8, icon9,
  adminIcon1, adminIcon2, adminIcon3,
  secret00, secret01
}