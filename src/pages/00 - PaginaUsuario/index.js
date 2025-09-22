import { useContext, useEffect, useState, useRef } from 'react'
import '../../styles/global.scss'
import './user.scss'
import { AuthContext } from '../../contexts/auth'

const Usuario = () => {
  const { userImg, setUserImg, logout, loadUser, updateUser } = useContext(AuthContext)
  const [imageSrc, setImageSrc] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const fileInputRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  let user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    console.log('userImg: ', userImg)
    if (user.IMAGEMBASE64) {
      setImageSrc(user.IMAGEMBASE64) // Fixed: changed user.IMAGE to user.IMAGEMBASE64
      setImageLoading(false)
    } else {
      const storedImg = user.IMAGEMBASE64
      if (storedImg) {
        setImageSrc(storedImg)
      }
      setImageLoading(false)
    }
  }, [userImg])

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file)
        previewImage(file)
        setShowConfirmButton(true)
      }
    }
  }

  // Function to preview image without uploading
  const previewImage = (file) => {
    setImageLoading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setImageSrc(base64String)
      setImageLoading(false)
    }
    reader.onerror = () => {
      console.error('Error previewing image')
      setImageLoading(false)
    }
    reader.readAsDataURL(file)
  }

  // Function to update image (runs when "Trocar Foto" button is clicked)
  const updateImage = async () => {
    if (!selectedFile) return

    setImageLoading(true)
    try {
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64String = reader.result
        
        // Update user object with new image
        const updatedUser = {
          ...user,
          IMAGEMBASE64: base64String
        }
        
        // Update context and storage
        setUserImg(base64String)
        updateUserImageInStorage(base64String)
        
        // Update user in database
        await updateUser(updatedUser)
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        user = updatedUser
        
        setImageSrc(base64String)
        setImageLoading(false)
        setShowConfirmButton(false)
        setSelectedFile(null)
        
        alert('Foto atualizada com sucesso!')
      }
      
      reader.onerror = () => {
        console.error('Error converting image to base64')
        setImageLoading(false)
        alert('Erro ao converter a imagem. Tente novamente.')
      }
      
      reader.readAsDataURL(selectedFile)
      
    } catch (error) {
      console.error('Error updating image:', error)
      setImageLoading(false)
      alert('Erro ao atualizar a foto. Tente novamente.')
    }
  }

  // Function to cancel image change
  const cancelImageChange = () => {
    // Reset to original image
    const originalImage = user.IMAGEMBASE64
    setImageSrc(originalImage)
    setSelectedFile(null)
    setShowConfirmButton(false)
    
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

  // Function to update image in storage (if it exists elsewhere)
  const updateUserImageInStorage = (base64String) => {
    // Update any other storage if needed
    localStorage.setItem('userImg', base64String)
  }

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
                    src={imageSrc} 
                    alt="User profile"
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      console.error('Failed to load image')
                      setImageLoading(false)
                      const storedImg = localStorage.getItem('userImg')
                      if (storedImg) {
                        setImageSrc(storedImg)
                      }
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
            
            <div className='user-button-container'>
              <button className='btn btn-global user-btn'>Informações do Usuário</button>
              <button className='btn btn-danger btn-global user-btn user-btn-sair' onClick={()=>{logout()}}>Sair</button>
            </div>              
          </div>
        </div>
      </div>
    </div>
  )
}

export default Usuario