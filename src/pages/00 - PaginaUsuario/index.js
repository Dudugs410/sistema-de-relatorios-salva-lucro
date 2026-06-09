import { useContext, useEffect, useState } from 'react'
import '../../styles/global.scss'
import './user.scss'
import { AuthContext } from '../../contexts/auth'
import { useUserPreferences } from '../../hooks/useUserPreferences/useUserPreferences'
import icon1 from '../../assets/user_icons/ICON_LOGO_AZUL.png'
import icon2 from '../../assets/user_icons/ICON_LOGO_BRANCO.png'
import icon3 from '../../assets/user_icons/ICON_LOGO_PRETO.png'
import icon4 from '../../assets/user_icons/ICON_LOGO_ROSA.png'
import icon5 from '../../assets/user_icons/ICON_LOGO_VERDE.png'
import icon6 from '../../assets/user_icons/ICON_MG_SOLUCOES.png'
import icon7 from '../../assets/user_icons/ICON_SIFRA.png'
import icon8 from '../../assets/user_icons/ICON_SUPERJUR.png'
import icon9 from '../../assets/user_icons/ICON_CARD_DIGITAL.png'

// Admin icons
import adminIcon1 from '../../assets/user_icons/ADMIN_ICON_1.png'
import adminIcon2 from '../../assets/user_icons/ADMIN_ICON_2.png'
import adminIcon3 from '../../assets/user_icons/ADMIN_ICON_3.png'
import jwtDecode from 'jwt-decode'

const ENABLE_CUSTOMIZATION = true

const Usuario = () => {
  const { userImg, setUserImg, loadUser, logout, updateUser, theme } = useContext(AuthContext)
  const { loadUserPrefs, saveUserPrefs } = useUserPreferences()
  
  const [imageLoading, setImageLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [activeRightPanel, setActiveRightPanel] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState('salvalucro')
  const [schemeColors, setSchemeColors] = useState({})
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [saving, setSaving] = useState(false)
  const [currentSavedIconCode, setCurrentSavedIconCode] = useState(null)
  
  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalScheme, setOriginalScheme] = useState('salvalucro')
  const [originalIconCode, setOriginalIconCode] = useState(null)
  
  const user = JSON.parse(localStorage.getItem('user')) || {}

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

  const isAdmin = user?.ADMIN === true || user?.role === 'admin' || user?.tipo === 'admin' || user?.GRUPO?.NOME === 'ADMINISTRADORES'

  const getDefaultIcon = () => {
    const identidadeVisual = user?.GRUPO?.IDENTIDADEVISUAL || ''
    
    switch (identidadeVisual) {
      case 'sifra':
        return icon7
      case 'mg':
        return icon6
      case 'superjur':
        return icon8
      case 'carddigital':
        return icon9
      default:
        return icon1
    }
  }

  // Default icon based on user's identity visual
  const defaultIdentityIcon = { 
    id: 'default', 
    name: 'Padrão', 
    path: getDefaultIcon(),
    code: 0,
    isDefault: true,
    description: `Baseado na identidade visual: ${user?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'}`
  }

  // Color icons with explicit codes
  const colorIcons = [
    { id: 'icon1', name: 'Azul', path: icon1, code: 1 },
    { id: 'icon2', name: 'Branco', path: icon2, code: 2 },
    { id: 'icon3', name: 'Preto', path: icon3, code: 3 },
    { id: 'icon4', name: 'Rosa', path: icon4, code: 4 },
    { id: 'icon5', name: 'Verde', path: icon5, code: 5 },
  ]

  // Admin exclusive icons with explicit codes
  const adminExclusiveIcons = [
    { id: 'admin1', name: 'Admin Especial 1', path: adminIcon1, code: 10 },
    { id: 'admin2', name: 'Admin Especial 2', path: adminIcon2, code: 11 },
    { id: 'admin3', name: 'Admin Especial 3', path: adminIcon3, code: 12 },
  ]

  // All icons combined
  const allIcons = [...colorIcons, ...adminExclusiveIcons, defaultIdentityIcon]

  // Function to get the default color scheme based on user's IDENTIDADEVISUAL
  const getDefaultColorScheme = () => {
    const identidadeVisual = user?.GRUPO?.IDENTIDADEVISUAL || ''
    
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

  // Get current saved scheme ID
  const getCurrentSchemeId = async () => {
    const prefs = await loadUserPrefs()
    return prefs?.ESQUEMACORES || getDefaultColorScheme().id
  }

  // Available color schemes with names in Brazilian Portuguese
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
    { id: 'ALT-14', name: 'Rosa' }
  ]

  // Function to get colors for a specific scheme and theme
  const getSchemeColors = (schemeId, theme) => {
    const tempDiv = document.createElement('div')
    tempDiv.setAttribute('data-context', schemeId)
    tempDiv.setAttribute('data-theme', theme)
    tempDiv.style.display = 'none'
    document.body.appendChild(tempDiv)
    
    const computedStyle = getComputedStyle(tempDiv)
    const primaryColor = computedStyle.getPropertyValue('--primary-color').trim()
    const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim()
    
    document.body.removeChild(tempDiv)
    
    return {
      primary: primaryColor || '#cccccc',
      secondary: secondaryColor || '#cccccc'
    }
  }

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

  // Function to handle icon selection with unsaved changes tracking
  const handleIconSelect = (icon) => {
    if (!ENABLE_CUSTOMIZATION) return
    setSelectedIcon(icon)
    // Preview the selected icon temporarily
    setUserImg(icon.path)
    // Mark that there are unsaved changes
    if (originalIconCode !== icon.code) {
      setHasUnsavedChanges(true)
    }
  }

  // Apply icon and save to database
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
    
    // Get current preferences to preserve other values
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
    
    // Add CODIGO if it exists (for PUT)
    if (currentPrefs?.CODIGO) {
      body.CODIGO = currentPrefs.CODIGO
    }
    
    console.log('Saving icon with body:', body)
    
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

  // Apply color scheme and save to database
  const handleApplyColorScheme = async () => {
    if (!ENABLE_CUSTOMIZATION) return
    
    setSaving(true)
    
    const token = localStorage.getItem('token')
    const user = await loadUser(jwtDecode(token).id)
    const getCurrentDate = () => new Date().toISOString().split('T')[0]
    const date = getCurrentDate()
    
    // Get current preferences to preserve icon
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
    
    // Add CODIGO if it exists (for PUT)
    if (currentPrefs?.CODIGO) {
      body.CODIGO = currentPrefs.CODIGO
    }
    
    console.log('Saving color scheme with body:', body)
    
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

  // Preview color scheme with unsaved changes tracking
  const previewColorScheme = (schemeId) => {
    if (!ENABLE_CUSTOMIZATION) return
    document.documentElement.setAttribute('data-context', schemeId)
    setSelectedScheme(schemeId)
    // Mark that there are unsaved changes
    if (originalScheme !== schemeId) {
      setHasUnsavedChanges(true)
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

  // Close panel with unsaved changes warning
  const handleClosePanel = async () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('Você tem alterações não salvas. Deseja sair sem salvar?')
      if (!confirmClose) {
        return
      }
    }
    
    setActiveRightPanel(null)
    if (hasUnsavedChanges) {
      // Revert to saved values
      setSelectedScheme(originalScheme)
      document.documentElement.setAttribute('data-context', originalScheme)
      
      if (selectedIcon) {
        const prefs = await loadUserPrefs()
        const savedIcon = allIcons.find(icon => icon.code === prefs?.ICONE)
        if (savedIcon) {
          setUserImg(savedIcon.path)
        }
        setSelectedIcon(null)
      }
      setHasUnsavedChanges(false)
    } else if (selectedIcon) {
      const prefs = await loadUserPrefs()
      const savedIcon = allIcons.find(icon => icon.code === prefs?.ICONE)
      if (savedIcon) {
        setUserImg(savedIcon.path)
      }
      setSelectedIcon(null)
    }
  }

  return(
    <div className='appPage'>
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
                      src={userImg || getDefaultIcon()} 
                      alt="Perfil do usuário"
                      onError={(e) => {
                        console.error('Failed to load image')
                        e.target.src = getDefaultIcon()
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
                  <button className='btn btn-global user-btn' onClick={() => setActiveRightPanel('icons')}>Trocar Ícone</button>
                  <button className='btn btn-global user-btn' onClick={() => setActiveRightPanel('preferences')}>Preferências de Cores</button>
                </div>
              )}
              
              {/* Sair button container */}
              <div className='sair-button-container'>
                <button className='btn btn-danger btn-global user-btn user-btn-sair' onClick={() => { logout() }}>Sair</button>
              </div>              
            </div>
          </div>

          {/* Right/Content Section */}
          {ENABLE_CUSTOMIZATION && (
            <div className={`user-content-section ${activeRightPanel ? 'active' : ''}`}>
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
                    
                    {/* Color Icons Section */}
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

                    {/* Default Icon Section */}
                    <div className="icons-section">
                      <h4 className="section-title">Ícone Padrão da Empresa</h4>
                      <div className="icons-grid">
                        <div
                          key={defaultIdentityIcon.id}
                          className={`icon-card ${isIconSelected(defaultIdentityIcon) ? 'selected' : ''} ${isCurrentIcon(defaultIdentityIcon) ? 'current' : ''} ${isIconPending(defaultIdentityIcon) ? 'pending' : ''}`}
                          onClick={() => handleIconSelect(defaultIdentityIcon)}
                        >
                          <div className="icon-image-wrapper">
                            <img src={defaultIdentityIcon.path} alt={defaultIdentityIcon.name} className="icon-image" />
                          </div>
                          <span className="icon-name">{defaultIdentityIcon.name}</span>
                          <span className="icon-description">{defaultIdentityIcon.description}</span>
                          {isCurrentIcon(defaultIdentityIcon) && !selectedIcon && <span className="current-badge">Atual</span>}
                          {isIconSelected(defaultIdentityIcon) && <span className="temp-badge">Selecionado</span>}
                          {isIconPending(defaultIdentityIcon) && <span className="pending-badge">Pendente</span>}
                        </div>
                      </div>
                    </div>
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
                        
                        return (
                          <div 
                            key={scheme.id}
                            className={`color-scheme-card ${isSelected ? 'selected' : ''} ${isPending ? 'pending' : ''}`}
                            onClick={() => previewColorScheme(scheme.id)}
                          >
                            <div className="scheme-header">
                              <span className="scheme-name">{scheme.name}</span>
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