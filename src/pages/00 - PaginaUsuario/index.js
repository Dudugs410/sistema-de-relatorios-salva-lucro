import { useContext, useEffect, useState, useRef } from 'react'
import '../../styles/global.scss'
import './user.scss'
import { AuthContext } from '../../contexts/auth'

const Usuario = () => {
  const { userImg, setUserImg, logout, updateUser } = useContext(AuthContext)
  const [imageLoading, setImageLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [activeRightPanel, setActiveRightPanel] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(localStorage.getItem('colorScheme') || 'SPECIAL')
  const [schemeColors, setSchemeColors] = useState({})
  const fileInputRef = useRef(null)
  
  const user = JSON.parse(localStorage.getItem('user')) || {}

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
    // Create a temporary div with the context and theme
    const tempDiv = document.createElement('div')
    tempDiv.setAttribute('data-context', schemeId)
    tempDiv.setAttribute('data-theme', theme)
    tempDiv.style.display = 'none'
    document.body.appendChild(tempDiv)
    
    // Get the computed styles
    const computedStyle = getComputedStyle(tempDiv)
    const primaryColor = computedStyle.getPropertyValue('--primary-color').trim()
    const secondaryColor = computedStyle.getPropertyValue('--secondary-color').trim()
    
    // Remove the temporary div
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

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setShowConfirmButton(true)
      }
    }
  }

  // Function to update image
  const updateImage = async () => {
    if (!selectedFile) return

    setImageLoading(true)
    try {
      const base64String = await convertFileToBase64(selectedFile)
      
      const updatedUser = {
        ...user,
        IMAGEMBASE64: base64String
      }
      
      setUserImg(base64String)
      await updateUser(updatedUser)
      
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      
      setImageLoading(false)
      setShowConfirmButton(false)
      setSelectedFile(null)
      
      alert('Foto atualizada com sucesso!')
    } catch (error) {
      console.error('Error updating image:', error)
      setImageLoading(false)
      alert('Erro ao atualizar a foto. Tente novamente.')
    }
  }

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Function to cancel image change
  const cancelImageChange = () => {
    setPreviewUrl(userImg || user?.IMAGEMBASE64 || '')
    setSelectedFile(null)
    setShowConfirmButton(false)
    
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Function to trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  // Function to validate file type and size
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecione uma imagem válida (JPEG, PNG, GIF, WebP)')
      return false
    }

    if (file.size > maxSize) {
      alert('A imagem deve ter no máximo 5MB')
      return false
    }

    return true
  }

  // Apply color scheme to document
  const applyColorScheme = (schemeId) => {
    document.documentElement.setAttribute('data-context', schemeId)
    localStorage.setItem('colorScheme', schemeId)
    setSelectedScheme(schemeId)
  }

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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
              
              {/* Confirmation buttons when image is selected */}
              {showConfirmButton && (
                <div className="confirmation-buttons">
                  <button 
                    className="btn btn-confirm btn-global user-btn"
                    onClick={updateImage}
                    disabled={imageLoading}
                  >
                    {imageLoading ? 'Salvando...' : 'Confirmar Foto'}
                  </button>
                  <button 
                    className="btn btn-cancel btn-global user-btn"
                    onClick={cancelImageChange}
                    disabled={imageLoading}
                  >
                    Cancelar
                  </button>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
              />
              
              <div className='user-info'>
                <b className='text-global' style={{'margin': '0'}}>{user?.NOME || 'Usuário'}</b>
                <b className='text-global' style={{'margin': '0'}}>{user?.EMAIL || ''}</b>
              </div>
              
              {/* Top buttons container - these go right under user info */}
              <div className='top-buttons-container'>
                <button className='btn btn-global user-btn' onClick={handleImageClick}>Trocar Imagem de Usuário</button>
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