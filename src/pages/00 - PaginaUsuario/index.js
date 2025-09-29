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
  const fileInputRef = useRef(null)
  
  const user = JSON.parse(localStorage.getItem('user')) || {}

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
        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setShowConfirmButton(true)
      }
    }
  }

  // Function to update image (runs when "Trocar Foto" button is clicked)
  const updateImage = async () => {
    if (!selectedFile) return

    setImageLoading(true)
    try {
      const base64String = await convertFileToBase64(selectedFile)
      
      // Update user object with new image
      const updatedUser = {
        ...user,
        IMAGEMBASE64: base64String
      }
      
      // Update global state using context - this will trigger re-renders everywhere
      setUserImg(base64String)
      
      // Update user in database
      await updateUser(updatedUser)
      
      // Clean up preview URL
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
    // Reset to original image
    setPreviewUrl(userImg || user?.IMAGEMBASE64 || '')
    setSelectedFile(null)
    setShowConfirmButton(false)
    
    // Clean up preview URL if it was a blob
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    
    // Reset file input
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
    const maxSize = 5 * 1024 * 1024 // 5MB

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
        <div className='page-content-global user-content'>
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
                    alt="User profile"
                    onError={(e) => {
                      console.error('Failed to load image')
                      // Set a default placeholder if image fails to load
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNEOEQ4RDgiLz4KPHBhdGggZD0iTTYwIDY2QzY2LjYyNzQgNjYgNzIgNjAuNjI3NCA3MiA1NEM3MiA0Ny4zNzI2IDY2LjYyNzQgNDIgNjAgNDJDNTMuMzcyNiA0MiA0OCA0Ny4zNzI2IDQ4IDU0QzQ4IDYwLjYyNzQgNTMuMzcyNiA2NiA2MCA2NloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTYwIDI1LjVDNTYuOTYyNCAyNS41IDU0LjU3MTQgMjcuODkxMSA1NC41NzE0IDMwLjkyODZDNTQuNTcxNCAzMy45NjYxIDU2Ljk2MjQgMzYuMzU3MSA2MCAzNi4zNTcxQzYzLjAzNzYgMzYuMzU3MSA2NS40Mjg2IDMzLjk2NjEgNjUuNDI4NiAzMC45Mjg2QzY1LjQyODYgMjcuODkxMSA2My4wMzc2IDI1LjUgNjAgMjUuNVoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+'
                    }}
                  />
                  {isHovered && (
                    <div className="image-overlay">
                      <span className="overlay-text">Trocar Foto</span>
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
            
            <div className='user-button-container'>
              <button className='btn btn-global user-btn' onClick={handleImageClick}>Trocar Imagem de Usuário</button>
              <button className='btn btn-global user-btn'>Informações do Usuário</button>
              <button className='btn btn-danger btn-global user-btn user-btn-sair' onClick={() => { logout() }}>Sair</button>
            </div>              
          </div>
        </div>
      </div>
    </div>
  )
}

export default Usuario