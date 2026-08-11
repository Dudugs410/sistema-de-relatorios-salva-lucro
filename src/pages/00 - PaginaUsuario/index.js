import { useContext, useEffect, useState } from 'react'
import '../../styles/global.scss'
import './user.scss'
import { AuthContext } from '../../contexts/auth'
import { useUserPreferences } from '../../hooks/useUserPreferences/useUserPreferences'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  getSelectableColorIcons, 
  getAdminIcons, 
  getSecretIcons,
  getIconPathByCode,
  getUserDefaultIcon,
  getDefaultIconByVisualIdentity,
  getSelectableIcons
} from '../../util/iconRegistry'
import jwtDecode from 'jwt-decode'

const ENABLE_CUSTOMIZATION = true
//teste
// Your specific user ID - change this to your actual user ID
const SPECIAL_USER_ID = 167561 // Replace with your user ID

const Usuario = () => {
  const { userImg, setUserImg, loadUser, logout, updateUser, theme } = useContext(AuthContext)
  const { loadUserPrefs, saveUserPrefs } = useUserPreferences()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [imageLoading, setImageLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [activeRightPanel, setActiveRightPanel] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState('salvalucro')
  const [schemeColors, setSchemeColors] = useState({})
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [saving, setSaving] = useState(false)
  const [currentSavedIconCode, setCurrentSavedIconCode] = useState(null)
  const [defaultIcon, setDefaultIcon] = useState(null)
  
  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalScheme, setOriginalScheme] = useState('salvalucro')
  const [originalIconCode, setOriginalIconCode] = useState(null)
  
  // Modal state
  const [showNavigationModal, setShowNavigationModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [pendingDestination, setPendingDestination] = useState(null)
  
  const user = JSON.parse(localStorage.getItem('user')) || {}
  const currentUserId = user?.CODIGO || user?.USUCODIGO
  const isSpecialUser = currentUserId === SPECIAL_USER_ID
  // This should come from the user's group, not from preferences
  const identidadeVisual = user?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'

  // Get selectable icons based on user's role
  const colorIcons = getSelectableColorIcons() // Only the 5 basic colors
  const adminExclusiveIcons = getAdminIcons()
  const secretIcons = getSecretIcons()
  const isAdmin = user?.ADMIN === true || user?.role === 'admin' || user?.tipo === 'admin' || user?.GRUPO?.NOME === 'ADMINISTRADORES'

  // Set default icon based on user's visual identity (from GRUPO)
  useEffect(() => {
    const defaultIconData = getUserDefaultIcon(identidadeVisual)
    setDefaultIcon(defaultIconData)
  }, [identidadeVisual])

  // Get default icon path for fallback
  const getDefaultIconPath = () => {
    return getDefaultIconByVisualIdentity(identidadeVisual).path
  }

  // Handle browser refresh/close warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?'
        return e.returnValue
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Listen for sidebar navigation events
  useEffect(() => {
    const handleSidebarNavigation = (event) => {
      const { path } = event.detail || {}
      if (path && path !== location.pathname) {
        if (hasUnsavedChanges) {
          setPendingAction('navigate')
          setPendingDestination(path)
          setShowNavigationModal(true)
        } else {
          navigate(path)
        }
      }
    }
    
    window.addEventListener('sidebar-navigate', handleSidebarNavigation)
    return () => window.removeEventListener('sidebar-navigate', handleSidebarNavigation)
  }, [hasUnsavedChanges, location.pathname, navigate])

  // Function to get the default color scheme based on user's IDENTIDADEVISUAL
  const getDefaultColorScheme = () => {
    switch (identidadeVisual) {
      case 'sifra':
        return { id: 'sifra', name: 'Sifra (Padrão)' }
      case 'mg':
        return { id: 'mg', name: 'MG Soluções (Padrão)' }
      case 'superjur':
        return { id: 'superjur', name: 'SuperJur (Padrão)' }
      case 'carddigital':
        return { id: 'carddigital', name: 'Card Digital (Padrão)' }
      default:
        return { id: 'salvalucro', name: 'Salva Lucro (Padrão)' }
    }
  }

  // Function to get colors for a specific scheme and theme
  const getSchemeColors = (schemeId, theme) => {
    // For colorblind schemes, return the actual rendered colors immediately
    // without trying to read from DOM
    const colorblindColors = {
      'CB-PROTANOPIA': { 
        light: { primary: '#0055A4', secondary: '#FFB347' }, 
        dark: { primary: '#0A1520', secondary: '#FFAE33' } 
      },
      'CB-DEUTERANOPIA': { 
        light: { primary: '#0066CC', secondary: '#FF6B35' }, 
        dark: { primary: '#0A1520', secondary: '#FF8A5C' } 
      },
      'CB-TRITANOPIA': { 
        light: { primary: '#D45500', secondary: '#FFD700' }, 
        dark: { primary: '#2A1A0D', secondary: '#FFD700' } 
      },
      'CB-MONOCHROMACY': { 
        light: { primary: '#666666', secondary: '#DDDDDD' }, 
        dark: { primary: '#0D0D0D', secondary: '#444444' } 
      },
      'CB-HIGH-CONTRAST': { 
        light: { primary: '#0066CC', secondary: '#FFD700' }, 
        dark: { primary: '#000000', secondary: '#FFD700' } 
      }
    }

    // If it's a colorblind scheme, return the colors immediately
    if (colorblindColors[schemeId]) {
      const colors = colorblindColors[schemeId][theme] || colorblindColors[schemeId].light
      return { primary: colors.primary, secondary: colors.secondary }
    }

    // For regular schemes, try to read from DOM
    try {
      const tempDiv = document.createElement('div')
      tempDiv.setAttribute('data-context', schemeId)
      tempDiv.setAttribute('data-theme', theme)
      tempDiv.style.display = 'none'
      tempDiv.style.position = 'absolute'
      tempDiv.style.pointerEvents = 'none'
      document.body.appendChild(tempDiv)
      
      // Force multiple reflows to ensure styles are applied
      tempDiv.offsetHeight
      tempDiv.offsetHeight
      
      const computedStyle = getComputedStyle(tempDiv)
      let primaryColor = computedStyle.getPropertyValue('--primary-color').trim()
      let secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim()
      
      // Remove the temporary element
      document.body.removeChild(tempDiv)
      
      // Debug log to see what's being read
      
      // If colors were successfully read and are valid, return them
      if (primaryColor && primaryColor !== '' && primaryColor !== 'undefined') {
        return { primary: primaryColor, secondary: secondaryColor }
      }
    } catch (error) {
      console.warn('Error reading colors from DOM for scheme:', schemeId, error)
    }

    // Fallback for regular schemes when DOM reading fails
    const fallbackColors = {
      'salvalucro': { light: { primary: '#0a3d70', secondary: '#99cc33' }, dark: { primary: '#141414', secondary: '#99cc33' } },
      'sifra': { light: { primary: '#0a3d70', secondary: '#e0ca00' }, dark: { primary: '#141414', secondary: '#a19100' } },
      'mg': { light: { primary: '#6b74b5', secondary: '#99cc33' }, dark: { primary: '#141414', secondary: '#6b74b5' } },
      'superjur': { light: { primary: '#839b54', secondary: '#555555' }, dark: { primary: '#141414', secondary: '#839b54' } },
      'carddigital': { light: { primary: '#17669b', secondary: '#4cc593' }, dark: { primary: '#141414', secondary: '#17669b' } },
      'SPECIAL': { light: { primary: '#960064', secondary: '#ff66cc' }, dark: { primary: '#141414', secondary: '#ff66cc' } },
      'ALT-1': { light: { primary: '#006464', secondary: '#ff7f50' }, dark: { primary: '#121919', secondary: '#ff7f50' } },
      'ALT-2': { light: { primary: '#193778', secondary: '#ffd700' }, dark: { primary: '#0a1228', secondary: '#ffd700' } },
      'ALT-3': { light: { primary: '#285a32', secondary: '#ffc89a' }, dark: { primary: '#121e14', secondary: '#ffc89a' } },
      'ALT-4': { light: { primary: '#37465f', secondary: '#ffbe46' }, dark: { primary: '#191e28', secondary: '#ffbe46' } },
      'ALT-5': { light: { primary: '#6e2d5a', secondary: '#5ac8a0' }, dark: { primary: '#23121e', secondary: '#5ac8a0' } },
      'ALT-6': { light: { primary: '#5a3278', secondary: '#ffc850' }, dark: { primary: '#191223', secondary: '#ffc850' } },
      'ALT-7': { light: { primary: '#146478', secondary: '#ff826e' }, dark: { primary: '#0c232a', secondary: '#ff826e' } },
      'ALT-8': { light: { primary: '#46552d', secondary: '#d26e4b' }, dark: { primary: '#192012', secondary: '#d26e4b' } },
      'ALT-9': { light: { primary: '#373782', secondary: '#b4e650' }, dark: { primary: '#121228', secondary: '#b4e650' } },
      'ALT-10': { light: { primary: '#3c414b', secondary: '#e68296' }, dark: { primary: '#14161c', secondary: '#e68296' } },
      'ALT-11': { light: { primary: '#1e7882', secondary: '#0096e6' }, dark: { primary: '#0f373c', secondary: '#30b8f0' } },
      'ALT-12': { light: { primary: '#aa2d41', secondary: '#9aaab8' }, dark: { primary: '#371923', secondary: '#c8a8b4' } },
      'ALT-13': { light: { primary: '#007875', secondary: '#00b4aa' }, dark: { primary: '#004644', secondary: '#30d0cc' } },
      'ALT-14': { light: { primary: '#c83c78', secondary: '#e6a0c8' }, dark: { primary: '#501c37', secondary: '#e6b0d0' } }
    }
    
    return fallbackColors[schemeId]?.[theme] || { primary: '#cccccc', secondary: '#cccccc' }
  }

  // Available color schemes with names
  const colorSchemes = [
    getDefaultColorScheme(),
    { id: 'SPECIAL', name: 'Especial (Rosa/Roxo)' },
    { id: 'ALT-1', name: 'Verde Água & Coral' },
    { id: 'ALT-2', name: 'Azul Marinho & Dourado' },
    { id: 'ALT-3', name: 'Verde Floresta & Pêssego' },
    { id: 'ALT-4', name: 'Cinza Azulado & Âmbar' },
    { id: 'ALT-5', name: 'Frutos Vermelhos & Menta' },
    { id: 'ALT-6', name: 'Ameixa & Mel' },
    { id: 'ALT-7', name: 'Oceano & Salmão' },
    { id: 'ALT-8', name: 'Verde Oliva & Terracota' },
    { id: 'ALT-9', name: 'Índigo & Limão' },
    { id: 'ALT-10', name: 'Cinza Carvão & Rosa' },
    { id: 'ALT-11', name: 'Azul Turquesa' },
    { id: 'ALT-12', name: 'Vermelho Cereja' },
    { id: 'ALT-13', name: '2007 Original' },
    { id: 'ALT-14', name: 'Rosa' },
    // Colorblind-friendly options
    { id: 'CB-PROTANOPIA', name: '♿ Protanopia (Vermelho-Deficiente)' },
    { id: 'CB-DEUTERANOPIA', name: '♿ Deuteranopia (Verde-Deficiente)' },
    { id: 'CB-TRITANOPIA', name: '♿ Tritanopia (Azul-Deficiente)' },
    { id: 'CB-MONOCHROMACY', name: '♿ Monocromático (Preto & Branco)' },
    { id: 'CB-HIGH-CONTRAST', name: '♿ Alto Contraste' }
  ]

  // Load all scheme colors on component mount
  useEffect(() => {
    const colors = {}
    colorSchemes.forEach(scheme => {
      colors[scheme.id] = {
        light: getSchemeColors(scheme.id, 'light'),
        dark: getSchemeColors(scheme.id, 'dark')
      }
    })
    setSchemeColors(colors)
  }, [])

  // Load saved preferences from API on component mount
  useEffect(() => {
    const loadCurrentPreferences = async () => {
      const prefs = await loadUserPrefs()
      if (prefs?.ESQUEMACORES) {
        setSelectedScheme(prefs.ESQUEMACORES)
        setOriginalScheme(prefs.ESQUEMACORES)
        document.documentElement.setAttribute('data-context', prefs.ESQUEMACORES)
      }
      if (prefs?.ICONE) {
        setOriginalIconCode(prefs.ICONE)
        setCurrentSavedIconCode(prefs.ICONE)
      }
    }
    loadCurrentPreferences()
  }, [])

  // Save current changes
  const saveCurrentChanges = async () => {
    setSaving(true)
    
    try {
      // Save icon if selected and changed
      if (selectedIcon && originalIconCode !== selectedIcon.code) {
        const token = localStorage.getItem('token')
        const user = await loadUser(jwtDecode(token).id)
        const getCurrentDate = () => new Date().toISOString().split('T')[0]
        const date = getCurrentDate()
        const currentPrefs = await loadUserPrefs()
        
        const body = {
          "USUCODIGO": user.CODIGO,
          "TEMA": currentPrefs?.TEMA || false,
          "ICONE": selectedIcon.code,
          "ESQUEMACORES": currentPrefs?.ESQUEMACORES || 'salvalucro',
          "USUARIOMODIFICACAO": user.CODIGO,
          "DATAMODIFICACAO": date,
          "USUARIOINSERCAO": user.CODIGO,
          "DATAINSERCAO": date,
          "ATIVO": true,
        }
        
        if (currentPrefs?.CODIGO) {
          body.CODIGO = currentPrefs.CODIGO
        }
        
        await saveUserPrefs(body)
        setUserImg(selectedIcon.path)
        setOriginalIconCode(selectedIcon.code)
        setCurrentSavedIconCode(selectedIcon.code)
      }
      
      // Save color scheme if changed
      if (originalScheme !== selectedScheme) {
        const token = localStorage.getItem('token')
        const user = await loadUser(jwtDecode(token).id)
        const getCurrentDate = () => new Date().toISOString().split('T')[0]
        const date = getCurrentDate()
        const currentPrefs = await loadUserPrefs()
        
        const body = {
          "USUCODIGO": user.CODIGO,
          "TEMA": currentPrefs?.TEMA || false,
          "ICONE": currentPrefs?.ICONE || 1,
          "ESQUEMACORES": selectedScheme,
          "USUARIOMODIFICACAO": user.CODIGO,
          "DATAMODIFICACAO": date,
          "USUARIOINSERCAO": user.CODIGO,
          "DATAINSERCAO": date,
          "ATIVO": true,
        }
        
        if (currentPrefs?.CODIGO) {
          body.CODIGO = currentPrefs.CODIGO
        }
        
        await saveUserPrefs(body)
        document.documentElement.setAttribute('data-context', selectedScheme)
        setOriginalScheme(selectedScheme)
      }
      
      setHasUnsavedChanges(false)
      setSelectedIcon(null)
      return true
    } catch (error) {
      console.error('Error saving changes:', error)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Handle navigation/save/discard
  const handleNavigationConfirm = async (shouldSave) => {
    setShowNavigationModal(false)
    
    if (shouldSave) {
      const saved = await saveCurrentChanges()
      if (saved) {
        if (pendingAction === 'navigate' && pendingDestination) {
          navigate(pendingDestination)
        } else if (pendingAction === 'panel') {
          setActiveRightPanel(pendingDestination)
        } else if (pendingAction === 'logout') {
          logout()
        }
      }
    } else {
      // Discard changes
      setHasUnsavedChanges(false)
      setSelectedIcon(null)
      setSelectedScheme(originalScheme)
      document.documentElement.setAttribute('data-context', originalScheme)
      
      // Revert icon
      const prefs = await loadUserPrefs()
      const allSelectableIcons = [...colorIcons, ...adminExclusiveIcons, ...secretIcons, defaultIcon]
      const savedIcon = allSelectableIcons.find(icon => icon.code === prefs?.ICONE)
      if (savedIcon) {
        setUserImg(savedIcon.path)
      }
      
      if (pendingAction === 'navigate' && pendingDestination) {
        navigate(pendingDestination)
      } else if (pendingAction === 'panel') {
        setActiveRightPanel(pendingDestination)
      } else if (pendingAction === 'logout') {
        logout()
      }
    }
    
    setPendingAction(null)
    setPendingDestination(null)
  }

  // Function to handle icon selection
  const handleIconSelect = (icon) => {
    if (!ENABLE_CUSTOMIZATION) return
    setSelectedIcon(icon)
    setUserImg(icon.path)
    if (originalIconCode !== icon.code) {
      setHasUnsavedChanges(true)
    }
  }

  // Apply icon and save
  const handleApplyIcon = async () => {
    if (!ENABLE_CUSTOMIZATION || !selectedIcon) {
      alert('Por favor, selecione um ícone primeiro.')
      return
    }
    
    setSaving(true)
    
    const token = localStorage.getItem('token')
    const user = await loadUser(jwtDecode(token).id)
    const getCurrentDate = () => new Date().toISOString().split('T')[0]
    const date = getCurrentDate()
    const currentPrefs = await loadUserPrefs()
    
    const body = {
      "USUCODIGO": user.CODIGO,
      "TEMA": currentPrefs?.TEMA || false,
      "ICONE": selectedIcon.code,
      "ESQUEMACORES": currentPrefs?.ESQUEMACORES || 'salvalucro',
      "USUARIOMODIFICACAO": user.CODIGO,
      "DATAMODIFICACAO": date,
      "USUARIOINSERCAO": user.CODIGO,
      "DATAINSERCAO": date,
      "ATIVO": true,
    }
    
    if (currentPrefs?.CODIGO) {
      body.CODIGO = currentPrefs.CODIGO
    }
    
    const success = await saveUserPrefs(body)
    
    if (success) {
      setUserImg(selectedIcon.path)
      setCurrentSavedIconCode(selectedIcon.code)
      setOriginalIconCode(selectedIcon.code)
      setHasUnsavedChanges(false)
      alert(`Ícone "${selectedIcon.name}" salvo com sucesso!`)
      setActiveRightPanel(null)
      setSelectedIcon(null)
    } else {
      alert('Erro ao salvar o ícone. Tente novamente.')
    }
    setSaving(false)
  }

  // Function to trigger icon selection panel
  const handleImageClick = () => {
    if (!ENABLE_CUSTOMIZATION) return
    setActiveRightPanel('icons')
    setSelectedIcon(null)
    setHasUnsavedChanges(false)
  }

  // Apply color scheme and save
  const handleApplyColorScheme = async () => {
    if (!ENABLE_CUSTOMIZATION) return
    
    setSaving(true)
    
    const token = localStorage.getItem('token')
    const user = await loadUser(jwtDecode(token).id)
    const getCurrentDate = () => new Date().toISOString().split('T')[0]
    const date = getCurrentDate()
    const currentPrefs = await loadUserPrefs()
    
    const body = {
      "USUCODIGO": user.CODIGO,
      "TEMA": currentPrefs?.TEMA || false,
      "ICONE": currentPrefs?.ICONE || 1,
      "ESQUEMACORES": selectedScheme,
      "USUARIOMODIFICACAO": user.CODIGO,
      "DATAMODIFICACAO": date,
      "USUARIOINSERCAO": user.CODIGO,
      "DATAINSERCAO": date,
      "ATIVO": true,
    }
    
    if (currentPrefs?.CODIGO) {
      body.CODIGO = currentPrefs.CODIGO
    }
    
    const success = await saveUserPrefs(body)
    
    if (success) {
      document.documentElement.setAttribute('data-context', selectedScheme)
      setOriginalScheme(selectedScheme)
      setHasUnsavedChanges(false)
      alert(`Esquema de cores "${colorSchemes.find(s => s.id === selectedScheme)?.name}" salvo com sucesso!`)
      setActiveRightPanel(null)
    } else {
      alert('Erro ao salvar o esquema de cores. Tente novamente.')
    }
    setSaving(false)
  }

  // Preview color scheme
  const previewColorScheme = (schemeId) => {
    if (!ENABLE_CUSTOMIZATION) return
    document.documentElement.setAttribute('data-context', schemeId)
    setSelectedScheme(schemeId)
    if (originalScheme !== schemeId) {
      setHasUnsavedChanges(true)
    }
  }

  // Handle panel change
  const handlePanelChange = (panelName) => {
    if (hasUnsavedChanges && activeRightPanel !== panelName) {
      setPendingAction('panel')
      setPendingDestination(panelName)
      setShowNavigationModal(true)
    } else {
      setActiveRightPanel(panelName)
      setSelectedIcon(null)
      setHasUnsavedChanges(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    if (hasUnsavedChanges) {
      setPendingAction('logout')
      setShowNavigationModal(true)
    } else {
      logout()
    }
  }

  // Check if an icon is selected
  const isIconSelected = (icon) => {
    return selectedIcon && selectedIcon.id === icon.id
  }

  // Check if an icon is currently saved
  const isCurrentIcon = (icon) => {
    return currentSavedIconCode === icon.code
  }

  // Check if color scheme has pending changes
  const isSchemePending = (schemeId) => {
    return hasUnsavedChanges && selectedScheme === schemeId && originalScheme !== schemeId
  }

  // Check if icon has pending changes
  const isIconPending = (icon) => {
    return hasUnsavedChanges && isIconSelected(icon) && originalIconCode !== icon.code
  }

  // Close panel
  const handleClosePanel = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('Você tem alterações não salvas. Deseja sair sem salvar?')
      if (!confirmClose) return
    }
    
    setActiveRightPanel(null)
    if (hasUnsavedChanges) {
      setSelectedScheme(originalScheme)
      document.documentElement.setAttribute('data-context', originalScheme)
      setHasUnsavedChanges(false)
      setSelectedIcon(null)
    } else if (selectedIcon) {
      setSelectedIcon(null)
    }
  }

  const NavigationModal = () => {
    if (!showNavigationModal) return null
    return (
      <div className="prefs-modal-overlay">
        <div className="prefs-modal-container">
          <div className="prefs-modal-header">
            <h3>Alterações não salvas</h3>
          </div>
          <div className="prefs-modal-body">
            <p>Você tem alterações não salvas nas suas preferências.</p>
            <p>Deseja salvar antes de sair?</p>
          </div>
          <div className="prefs-modal-footer">
            <button 
              className="prefs-modal-btn prefs-modal-btn-discard"
              onClick={() => handleNavigationConfirm(false)}
            >
              Descartar
            </button>
            <button 
              className="prefs-modal-btn prefs-modal-btn-cancel"
              onClick={() => setShowNavigationModal(false)}
            >
              Cancelar
            </button>
            <button 
              className="prefs-modal-btn prefs-modal-btn-save"
              onClick={() => handleNavigationConfirm(true)}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div className='appPage'>
      <NavigationModal />
      <div className='page-background-global'>
        <div className='page-content-global user-page'>
          {/* Left/Menu Section */}
          <div className='user-menu-section'>
            <div className='user-card'>
              <div 
                className="image-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleImageClick}
                style={{ cursor: ENABLE_CUSTOMIZATION ? 'pointer' : 'default' }}
              >
                {imageLoading ? (
                  <div className="image-placeholder">Carregando...</div>
                ) : (
                  <>
                    <img 
                      className={`image ${isHovered && ENABLE_CUSTOMIZATION ? 'image-hover' : ''}`} 
                      src={userImg || getDefaultIconPath()} 
                      alt="Perfil do usuário"
                      onError={(e) => {
                        console.error('Failed to load image')
                        e.target.src = getDefaultIconPath()
                      }}
                    />
                    {isHovered && ENABLE_CUSTOMIZATION && (
                      <div className="image-overlay">
                        <span className="overlay-text">Trocar Ícone de Usuário</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className='user-info'>
                <b className='text-global' style={{'margin': '0'}}>{user?.NOME || 'Usuário'}</b>
                <b className='text-global' style={{'margin': '0'}}>{user?.EMAIL || ''}</b>
              </div>
              
              {/* Top buttons container */}
              {ENABLE_CUSTOMIZATION && (
                <div className='top-buttons-container'>
                  <button className='btn btn-global user-btn' onClick={() => handlePanelChange('icons')}>Trocar Ícone</button>
                  <button className='btn btn-global user-btn' onClick={() => handlePanelChange('preferences')}>Preferências de Cores</button>
                </div>
              )}
              
              {/* Sair button container */}
              <div className='sair-button-container'>
                <button className='btn btn-danger btn-global user-btn user-btn-sair' onClick={handleLogout}>Sair</button>
              </div>              
            </div>
          </div>

          {/* Right/Content Section */}
          {ENABLE_CUSTOMIZATION && (
            <div className={`user-content-section ${activeRightPanel ? 'active' : ''}`}>
              {/* Empty State - shown when no panel is active */}
              {!activeRightPanel && (
                <div className="empty-state">
                  <div className="empty-icon">✨</div>
                </div>
              )}
              
              {/* Icons Selection Panel */}
              {activeRightPanel === 'icons' && (
                <div className="preferences-panel icons-panel">
                  <div className="panel-header">
                    <h3>Escolher Ícone de Usuário</h3>
                    <button className="close-btn" onClick={handleClosePanel}>×</button>
                  </div>
                  
                  <div className="panel-content">
                    {/* Unsaved changes banner */}
                    {hasUnsavedChanges && (
                      <div className="unsaved-banner">
                        <span>⚠️ Você tem alterações não salvas</span>
                      </div>
                    )}
                    
                    {/* Exclusive Icons Section - Only for specific users */}
                    {isSpecialUser && secretIcons.length > 0 && (
                      <>
                        <div className="icons-section">
                          <h4 className="section-title" style={{ color: '#ff9800' }}>⭐ Ícones Exclusivos</h4>
                          <div className="icons-grid">
                            {secretIcons.map((icon) => (
                              <div
                                key={icon.id}
                                className={`icon-card ${isIconSelected(icon) ? 'selected' : ''} ${isCurrentIcon(icon) ? 'current' : ''} ${isIconPending(icon) ? 'pending' : ''}`}
                                onClick={() => handleIconSelect(icon)}
                              >
                                <div className="icon-image-wrapper">
                                  <img src={icon.path} alt={icon.name} className="icon-image" />
                                </div>
                                <span className="icon-name">{icon.name}</span>
                                {isCurrentIcon(icon) && !selectedIcon && <span className="current-badge">Atual</span>}
                                {isIconSelected(icon) && <span className="temp-badge">Selecionado</span>}
                                {isIconPending(icon) && <span className="pending-badge">Pendente</span>}
                                {!isCurrentIcon(icon) && !isIconSelected(icon) && <span className="exclusive-badge">⭐ Exclusivo</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="section-divider"></div>
                      </>
                    )}
                    
                    {/* Admin Exclusive Icons Section */}
                    {isAdmin && adminExclusiveIcons.length > 0 && (
                      <>
                        <div className="icons-section">
                          <h4 className="section-title admin-title">Ícones Exclusivos para Admin</h4>
                          <div className="icons-grid">
                            {adminExclusiveIcons.map((icon) => (
                              <div
                                key={icon.id}
                                className={`icon-card ${isIconSelected(icon) ? 'selected' : ''} ${isCurrentIcon(icon) ? 'current' : ''} ${isIconPending(icon) ? 'pending' : ''}`}
                                onClick={() => handleIconSelect(icon)}
                              >
                                <div className="icon-image-wrapper">
                                  <img src={icon.path} alt={icon.name} className="icon-image" />
                                </div>
                                <span className="icon-name">{icon.name}</span>
                                {isCurrentIcon(icon) && !selectedIcon && <span className="current-badge">Atual</span>}
                                {isIconSelected(icon) && <span className="temp-badge">Selecionado</span>}
                                {isIconPending(icon) && <span className="pending-badge">Pendente</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="section-divider"></div>
                      </>
                    )}
                    
                    {/* Color Icons Section - Only the 5 basic colors */}
                    <div className="icons-section">
                      <h4 className="section-title">Ícones de Cores</h4>
                      <div className="icons-grid">
                        {colorIcons.map((icon) => (
                          <div
                            key={icon.id}
                            className={`icon-card ${isIconSelected(icon) ? 'selected' : ''} ${isCurrentIcon(icon) ? 'current' : ''} ${isIconPending(icon) ? 'pending' : ''}`}
                            onClick={() => handleIconSelect(icon)}
                          >
                            <div className="icon-image-wrapper">
                              <img src={icon.path} alt={icon.name} className="icon-image" />
                            </div>
                            <span className="icon-name">{icon.name}</span>
                            {isCurrentIcon(icon) && !selectedIcon && <span className="current-badge">Atual</span>}
                            {isIconSelected(icon) && <span className="temp-badge">Selecionado</span>}
                            {isIconPending(icon) && <span className="pending-badge">Pendente</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Default Icon Section - Based on user's visual identity */}
                    {defaultIcon && (
                      <div className="icons-section">
                        <h4 className="section-title">Ícone Padrão da Empresa</h4>
                        <div className="icons-grid">
                          <div
                            key={defaultIcon.id}
                            className={`icon-card ${isIconSelected(defaultIcon) ? 'selected' : ''} ${isCurrentIcon(defaultIcon) ? 'current' : ''} ${isIconPending(defaultIcon) ? 'pending' : ''}`}
                            onClick={() => handleIconSelect(defaultIcon)}
                          >
                            <div className="icon-image-wrapper">
                              <img src={defaultIcon.path} alt={defaultIcon.name} className="icon-image" />
                            </div>
                            <span className="icon-name">{defaultIcon.name}</span>
                            {isCurrentIcon(defaultIcon) && !selectedIcon && <span className="current-badge">Atual</span>}
                            {isIconSelected(defaultIcon) && <span className="temp-badge">Selecionado</span>}
                            {isIconPending(defaultIcon) && <span className="pending-badge">Pendente</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="panel-footer">
                    <button 
                      className={`btn btn-global save-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
                      onClick={handleApplyIcon}
                      disabled={!selectedIcon || saving}
                    >
                      {saving ? 'Salvando...' : hasUnsavedChanges ? '💾 Salvar Alterações' : 'Salvar Ícone'}
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Panel */}
              {activeRightPanel === 'preferences' && (
                <div className="preferences-panel">
                  <div className="panel-header">
                    <h3>Esquemas de Cores</h3>
                    <button className="close-btn" onClick={handleClosePanel}>×</button>
                  </div>
                  
                  <div className="panel-content">
                    {/* Unsaved changes banner */}
                    {hasUnsavedChanges && (
                      <div className="unsaved-banner">
                        <span>⚠️ Você tem alterações não salvas</span>
                      </div>
                    )}
                    
                    <div className="color-schemes-grid">
                      {colorSchemes.map((scheme) => {
                        const colors = schemeColors[scheme.id]
                        const isSelected = selectedScheme === scheme.id
                        const isPending = isSchemePending(scheme.id)
                        const isColorblind = scheme.id.startsWith('CB-')
                        
                        return (
                          <div 
                            key={scheme.id}
                            className={`color-scheme-card ${isSelected ? 'selected' : ''} ${isPending ? 'pending' : ''}`}
                            onClick={() => previewColorScheme(scheme.id)}
                            data-colorblind={isColorblind ? "true" : "false"}
                          >
                            <div className="scheme-header">
                              <span className="scheme-name">
                                {scheme.name}
                                {isColorblind && <span className="accessibility-badge">♿ Acessível</span>}
                              </span>
                              {isPending && <span className="pending-badge">⚠️ Pendente</span>}
                            </div>
                            <div className="color-previews">
                              <div className="theme-preview">
                                <span className="theme-label">Claro</span>
                                <div className="color-chips">
                                  <div 
                                    className="color-chip primary"
                                    style={{ backgroundColor: colors?.light?.primary || '#cccccc' }}
                                  />
                                  <div 
                                    className="color-chip secondary"
                                    style={{ backgroundColor: colors?.light?.secondary || '#cccccc' }}
                                  />
                                </div>
                              </div>
                              <div className="theme-preview">
                                <span className="theme-label">Escuro</span>
                                <div className="color-chips">
                                  <div 
                                    className="color-chip primary"
                                    style={{ backgroundColor: colors?.dark?.primary || '#cccccc' }}
                                  />
                                  <div 
                                    className="color-chip secondary"
                                    style={{ backgroundColor: colors?.dark?.secondary || '#cccccc' }}
                                  />
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="checkmark">✓</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="panel-footer">
                    <button 
                      className={`btn btn-global save-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
                      onClick={handleApplyColorScheme}
                      disabled={saving}
                    >
                      {saving ? 'Salvando...' : hasUnsavedChanges ? '💾 Salvar Alterações' : 'Salvar Esquema de Cores'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Usuario