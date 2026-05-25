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

const Usuario = () => {
  const { userImg, setUserImg, logout, updateUser } = useContext(AuthContext)
  const [imageLoading, setImageLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [activeRightPanel, setActiveRightPanel] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(localStorage.getItem('colorScheme') || 'SPECIAL')
  const [schemeColors, setSchemeColors] = useState({})
  
  const user = JSON.parse(localStorage.getItem('user')) || {}
  
  // Check if user is admin (adjust based on your user object structure)
  const isAdmin = user?.ADMIN === true || user?.role === 'admin' || user?.tipo === 'admin'

  // Available user icons
  const commonIcons = [
    { id: 'icon1', name: 'Azul', path: icon1 },
    { id: 'icon2', name: 'Branco', path: icon2 },
    { id: 'icon3', name: 'Preto', path: icon3 },
    { id: 'icon4', name: 'Rosa', path: icon4 },
    { id: 'icon5', name: 'Verde', path: icon5 },
  ]

  const adminIcons = [
    { id: 'icon6', name: 'MG Soluções', path: icon6 },
    { id: 'icon7', name: 'Sifra', path: icon7 },
    { id: 'icon8', name: 'SuperJur', path: icon8 },
    { id: 'icon9', name: 'Card Digital', path: icon9 },
  ]

  // Available color schemes with names in Brazilian Portuguese
  const colorSchemes = [
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
    { id: 'ALT-11', name: 'Hatsune Miku (Azul Turquesa)' },
    { id: 'ALT-12', name: 'Kasane Teto (Vermelho Cereja)' },
    { id: 'ALT-13', name: 'Miku 2007 Original' },
    { id: 'ALT-14', name: 'Megurine Luka (Rosa)' }
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

  // Set initial preview from global context or localStorage
  useEffect(() => {
    if (userImg) {
      setPreviewUrl(userImg)
    } else if (user?.IMAGEMBASE64) {
      setPreviewUrl(user.IMAGEMBASE64)
    }
  }, [userImg, user])

  // Function to handle icon selection
  const handleIconSelect = async (iconPath) => {
    setImageLoading(true)
    try {
      // Convert the imported icon to base64
      const response = await fetch(iconPath)
      const blob = await response.blob()
      const base64String = await convertBlobToBase64(blob)
      
      const updatedUser = {
        ...user,
        IMAGEMBASE64: base64String
      }
      
      setUserImg(base64String)
      await updateUser(updatedUser)
      
      setImageLoading(false)
      alert('Ícone atualizado com sucesso!')
    } catch (error) {
      console.error('Error updating icon:', error)
      setImageLoading(false)
      alert('Erro ao atualizar o ícone. Tente novamente.')
    }
  }

  // Helper function to convert blob to base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Function to trigger icon selection panel
  const handleImageClick = () => {
    setActiveRightPanel('icons')
  }

  // Apply color scheme to document
  const applyColorScheme = (schemeId) => {
    document.documentElement.setAttribute('data-context', schemeId)
    localStorage.setItem('colorScheme', schemeId)
    setSelectedScheme(schemeId)
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
              >
                {imageLoading ? (
                  <div className="image-placeholder">Carregando...</div>
                ) : (
                  <>
                    <img 
                      className={`image ${isHovered ? 'image-hover' : ''}`} 
                      src={previewUrl} 
                      alt="Perfil do usuário"
                      onError={(e) => {
                        console.error('Failed to load image')
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNEOEQ4RDgiLz4KPHBhdGggZD0iTTYwIDY2QzY2LjYyNzQgNjYgNzIgNjAuNjI3NCA3MiA1NEM3MiA0Ny4zNzI2IDY2LjYyNzQgNDIgNjAgNDJDNTMuMzcyNiA0MiA0OCA0Ny4zNzI2IDQ4IDU0QzQ4IDYwLjYyNzQgNTMuMzcyNiA2NiA2MCA2NloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTYwIDI1LjVDNTYuOTYyNCAyNS41IDU0LjU3MTQgMjcuODkxMSA1NC41NzE0IDMwLjkyODZDNTQuNTcxNCAzMy45NjYxIDU2Ljk2MjQgMzYuMzU3MSA2MCAzNi4zNTcxQzYzLjAzNzYgMzYuMzU3MSA2NS40Mjg2IDMzLjk2NjEgNjUuNDI4NiAzMC45Mjg2QzY1LjQyODYgMjcuODkxMSA2My4wMzc2IDI1LjUgNjAgMjUuNVoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+'
                      }}
                    />
                    {isHovered && (
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
              
              {/* Top buttons container - these go right under user info */}
              <div className='top-buttons-container'>
                <button className='btn btn-global user-btn' onClick={() => setActiveRightPanel('icons')}>Trocar Ícone</button>
                <button className='btn btn-global user-btn' onClick={() => setActiveRightPanel('preferences')}>Preferências</button>
              </div>
              
              {/* Sair button container - this goes to the bottom */}
              <div className='sair-button-container'>
                <button className='btn btn-danger btn-global user-btn user-btn-sair' onClick={() => { logout() }}>Sair</button>
              </div>              
            </div>
          </div>

          {/* Right/Content Section - Dynamic Panel */}
          <div className={`user-content-section ${activeRightPanel ? 'active' : ''}`}>
            {/* Icons Selection Panel */}
            {activeRightPanel === 'icons' && (
              <div className="preferences-panel icons-panel">
                <div className="panel-header">
                  <h3>Escolher Ícone de Usuário</h3>
                  <button className="close-btn" onClick={() => setActiveRightPanel(null)}>×</button>
                </div>
                
                <div className="panel-content icons-content">
                  {/* Admin Only Icons Section */}
                  {isAdmin && adminIcons.length > 0 && (
                    <>
                      <div className="icons-section">
                        <h4 className="section-title admin-title">Ícones Exclusivos para Admin</h4>
                        <div className="icons-grid">
                          {adminIcons.map((icon) => (
                            <div
                              key={icon.id}
                              className="icon-option"
                              onClick={() => handleIconSelect(icon.path)}
                            >
                              <div className="icon-image-wrapper">
                                <img src={icon.path} alt={icon.name} className="icon-image" />
                              </div>
                              <span className="icon-name">{icon.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="section-divider"></div>
                    </>
                  )}
                  
                  {/* Common Icons Section */}
                  <div className="icons-section">
                    <h4 className="section-title">Ícones</h4>
                    <div className="icons-grid">
                      {commonIcons.map((icon) => (
                        <div
                          key={icon.id}
                          className="icon-option"
                          onClick={() => handleIconSelect(icon.path)}
                        >
                          <div className="icon-image-wrapper">
                            <img src={icon.path} alt={icon.name} className="icon-image" />
                          </div>
                          <span className="icon-name">{icon.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    return (
                      <div 
                        key={scheme.id}
                        className={`color-scheme-option ${selectedScheme === scheme.id ? 'selected' : ''}`}
                        onClick={() => setSelectedScheme(scheme.id)}
                      >
                        <div className="scheme-info">
                          <span className="scheme-name">{scheme.name}</span>
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
                        {selectedScheme === scheme.id && (
                          <div className="checkmark">✓</div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <div className="panel-footer">
                  <button 
                    className="btn btn-global save-btn"
                    onClick={() => {
                      applyColorScheme(selectedScheme)
                      setActiveRightPanel(null)
                    }}
                  >
                    Salvar Seleção
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Usuario