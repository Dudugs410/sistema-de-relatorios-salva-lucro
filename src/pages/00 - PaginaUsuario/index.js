import { useContext, useEffect, useState } from 'react'
import '../../styles/global.scss'
import './user.scss'
import { AuthContext } from '../../contexts/auth'
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

const ENABLE_CUSTOMIZATION = true

const Usuario = () => {
  const { userImg, setUserImg, logout, updateUser } = useContext(AuthContext)
  const [imageLoading, setImageLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(icon1) // Always start with LOGO AZUL
  const [activeRightPanel, setActiveRightPanel] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(() => {
    // Load from localStorage but don't apply to document (preview only)
    return localStorage.getItem('colorScheme') || 'SPECIAL'
  })
  const [schemeColors, setSchemeColors] = useState({})
  const [selectedIcon, setSelectedIcon] = useState(null) // Track selected icon (not applied yet)
  
  const user = JSON.parse(localStorage.getItem('user')) || {}
  
  // Check if user is admin
  const isAdmin = user?.ADMIN === true || user?.role === 'admin' || user?.tipo === 'admin' || user?.GRUPO?.NOME === 'ADMINISTRADORES'

  // Function to get default icon based on user's IDENTIDADEVISUAL
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
    isDefault: true,
    description: `Baseado na identidade visual: ${user?.GRUPO?.IDENTIDADEVISUAL || 'salvalucro'}`
  }

  // Color icons (available to all users)
  const colorIcons = [
    { id: 'icon1', name: 'Azul', path: icon1 },
    { id: 'icon2', name: 'Branco', path: icon2 },
    { id: 'icon3', name: 'Preto', path: icon3 },
    { id: 'icon4', name: 'Rosa', path: icon4 },
    { id: 'icon5', name: 'Verde', path: icon5 },
  ]

  // Admin exclusive icons (only visible to admin users)
  const adminExclusiveIcons = [
    { id: 'admin1', name: 'Admin Especial 1', path: adminIcon1 },
    { id: 'admin2', name: 'Admin Especial 2', path: adminIcon2 },
    { id: 'admin3', name: 'Admin Especial 3', path: adminIcon3 },
  ]

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

  // On component mount, set the actual theme from database (if any)
  useEffect(() => {
    const savedScheme = localStorage.getItem('colorScheme')
    const defaultScheme = getDefaultColorScheme().id
    const schemeToApply = savedScheme || defaultScheme
    
    // Apply the stored/database theme to the document
    document.documentElement.setAttribute('data-context', schemeToApply)
    setSelectedScheme(schemeToApply)
  }, [])

  // Load current user icon - ALWAYS use LOGO AZUL (icon1) on refresh
  useEffect(() => {
    // FOR NOW: Always use LOGO AZUL as the displayed image
    setPreviewUrl(icon1)
  }, []) // Empty dependency array ensures this only runs once on mount

  // Function to handle icon selection (just selects, doesn't preview)
  const handleIconSelect = (icon) => {
    if (!ENABLE_CUSTOMIZATION) return
    setSelectedIcon(icon)
  }

  // Function to apply the selected icon (changes the displayed image)
  const handleApplyIcon = () => {
    if (!ENABLE_CUSTOMIZATION || !selectedIcon) {
      alert('Por favor, selecione um ícone primeiro.')
      return
    }
    
    // Update the displayed image
    setPreviewUrl(selectedIcon.path)
    alert(`Ícone "${selectedIcon.name}" aplicado! (Apenas visualização - não salvo no banco)`)
    // Keep panel open
  }

  // Function to trigger icon selection panel
  const handleImageClick = () => {
    if (!ENABLE_CUSTOMIZATION) return
    setActiveRightPanel('icons')
    setSelectedIcon(null) // Reset selection when opening panel
  }

  // Apply color scheme preview (does NOT save to localStorage)
  const previewColorScheme = (schemeId) => {
    if (!ENABLE_CUSTOMIZATION) return
    
    // Just preview the colors, don't save to localStorage
    document.documentElement.setAttribute('data-context', schemeId)
    setSelectedScheme(schemeId)
  }

  // Save color scheme - PREVIEW ONLY, no database save
  const handleApplyColorScheme = () => {
    if (!ENABLE_CUSTOMIZATION) return
    
    // Don't save to localStorage, just show message
    // The preview is already applied from previewColorScheme
    alert(`Esquema de cores "${colorSchemes.find(s => s.id === selectedScheme)?.name}" aplicado! (Apenas visualização - não salvo no banco)`)
    // Panel stays open
  }

  // Get the current saved scheme from database (or default)
  const getCurrentSchemeId = () => {
    // Return the database value or default
    const savedScheme = localStorage.getItem('colorScheme')
    const defaultScheme = getDefaultColorScheme().id
    return savedScheme || defaultScheme
  }

  // Check if an icon is selected
  const isIconSelected = (icon) => {
    return selectedIcon && selectedIcon.id === icon.id
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
                      src={previewUrl} 
                      alt="Perfil do usuário"
                      onError={(e) => {
                        console.error('Failed to load image')
                        e.target.src = icon1
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
              
              {/* Top buttons container - only show if customization is enabled */}
              {ENABLE_CUSTOMIZATION && (
                <div className='top-buttons-container'>
                  <button className='btn btn-global user-btn' onClick={() => setActiveRightPanel('icons')}>Trocar Ícone</button>
                  <button className='btn btn-global user-btn' onClick={() => setActiveRightPanel('preferences')}>Preferências</button>
                </div>
              )}
              
              {/* Sair button container */}
              <div className='sair-button-container'>
                <button className='btn btn-danger btn-global user-btn user-btn-sair' onClick={() => { logout() }}>Sair</button>
              </div>              
            </div>
          </div>

          {/* Right/Content Section - Dynamic Panel - Only render if customization is enabled */}
          {ENABLE_CUSTOMIZATION && (
            <div className={`user-content-section ${activeRightPanel ? 'active' : ''}`}>
              {/* Icons Selection Panel */}
              {activeRightPanel === 'icons' && (
                <div className="preferences-panel icons-panel">
                  <div className="panel-header">
                    <h3>Escolher Ícone de Usuário</h3>
                    <button className="close-btn" onClick={() => setActiveRightPanel(null)}>×</button>
                  </div>
                  
                  <div className="panel-content icons-content">
                    {/* Default Icon Section - Based on user's identity visual */}
                    <div className="icons-section">
                      <h4 className="section-title">Ícone Padrão da Empresa</h4>
                      <div className="icons-grid">
                        <div
                          key={defaultIdentityIcon.id}
                          className={`icon-option ${isIconSelected(defaultIdentityIcon) ? 'selected' : ''}`}
                          onClick={() => handleIconSelect(defaultIdentityIcon)}
                        >
                          <div className="icon-image-wrapper">
                            <img src={defaultIdentityIcon.path} alt={defaultIdentityIcon.name} className="icon-image" />
                          </div>
                          <span className="icon-name">{defaultIdentityIcon.name}</span>
                          {isIconSelected(defaultIdentityIcon) && (
                            <div className="selection-checkmark">✓</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="section-divider"></div>
                    
                    {/* Admin Exclusive Icons Section - Only visible to admin users */}
                    {isAdmin && adminExclusiveIcons.length > 0 && (
                      <>
                        <div className="icons-section">
                          <h4 className="section-title admin-title">Ícones Exclusivos para Admin</h4>
                          <div className="icons-grid">
                            {adminExclusiveIcons.map((icon) => (
                              <div
                                key={icon.id}
                                className={`icon-option ${isIconSelected(icon) ? 'selected' : ''}`}
                                onClick={() => handleIconSelect(icon)}
                              >
                                <div className="icon-image-wrapper">
                                  <img src={icon.path} alt={icon.name} className="icon-image" />
                                </div>
                                <span className="icon-name">{icon.name}</span>
                                {isIconSelected(icon) && (
                                  <div className="selection-checkmark">✓</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="section-divider"></div>
                      </>
                    )}
                    
                    {/* Color Icons Section - Available to all users */}
                    <div className="icons-section">
                      <h4 className="section-title">Ícones de Cores</h4>
                      <div className="icons-grid">
                        {colorIcons.map((icon) => (
                          <div
                            key={icon.id}
                            className={`icon-option ${isIconSelected(icon) ? 'selected' : ''}`}
                            onClick={() => handleIconSelect(icon)}
                          >
                            <div className="icon-image-wrapper">
                              <img src={icon.path} alt={icon.name} className="icon-image" />
                            </div>
                            <span className="icon-name">{icon.name}</span>
                            {isIconSelected(icon) && (
                              <div className="selection-checkmark">✓</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="panel-footer">
                    <button 
                      className="btn btn-global save-btn"
                      onClick={handleApplyIcon}
                      disabled={!selectedIcon}
                      style={{ opacity: !selectedIcon ? 0.5 : 1, cursor: !selectedIcon ? 'not-allowed' : 'pointer' }}
                    >
                      Aplicar Visualização
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Panel */}
              {activeRightPanel === 'preferences' && (
                <div className="preferences-panel">
                  <div className="panel-header">
                    <h3>Esquemas de Cores</h3>
                    <button className="close-btn" onClick={() => setActiveRightPanel(null)}>×</button>
                  </div>
                  
                  <div className="panel-content">
                    {colorSchemes.map((scheme) => {
                      const colors = schemeColors[scheme.id]
                      const isCurrentScheme = scheme.id === getCurrentSchemeId()
                      const isSelected = selectedScheme === scheme.id
                      
                      return (
                        <div 
                          key={scheme.id}
                          className={`color-scheme-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => previewColorScheme(scheme.id)}
                        >
                          <div className="scheme-info">
                            <span className="scheme-name">
                              {scheme.name}
                              {isCurrentScheme && <span className="current-badge"> (Banco de Dados)</span>}
                            </span>
                            <div className="color-previews">
                              {/* Light Theme Preview */}
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
                              {/* Dark Theme Preview */}
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
                          </div>
                          {isSelected && (
                            <div className="checkmark">✓</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="panel-footer">
                    <button 
                      className="btn btn-global save-btn"
                      onClick={handleApplyColorScheme}
                    >
                      Aplicar Visualização
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