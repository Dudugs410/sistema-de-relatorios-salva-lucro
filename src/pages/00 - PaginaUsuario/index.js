import { useContext, useEffect, useState, useRef } from 'react'
import '../../styles/global.scss'
import './user.scss'
import { AuthContext } from '../../contexts/auth'

const Usuario = () => {
  const { userImg, setUserImg } = useContext(AuthContext)
  const [imageSrc, setImageSrc] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef(null)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  useEffect(() => {
    console.log('userImg: ', userImg)
    if (userImg) {
      setImageSrc(userImg)
      setImageLoading(false)
    } else {
      const storedImg = currentUser.userImg
      if (storedImg) {
        setImageSrc(storedImg)
      }
      setImageLoading(false)
    }
  }, [userImg])

  // Function to update user image in localStorage
  const updateUserImageInStorage = (base64String) => {
    try {
      // Update currentUser in localStorage
      const currentUserStr = localStorage.getItem('currentUser')
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        const updatedCurrentUser = {
          ...currentUser,
          userImg: base64String
        }
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
      }

      // Update localUsers array in localStorage
      const localUsersStr = localStorage.getItem('localUsers')
      if (localUsersStr) {
        const localUsers = JSON.parse(localUsersStr)
        const currentUserStr = localStorage.getItem('currentUser')
        
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr)
          const updatedLocalUsers = localUsers.map(user => 
            user.id === currentUser.id 
              ? { ...user, userImg: base64String }
              : user
          )
          localStorage.setItem('localUsers', JSON.stringify(updatedLocalUsers))
        }
      }

      localStorage.setItem('userImg', base64String)
    } catch (error) {
      console.error('Error updating localStorage:', error)
    }
  }

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      convertImageToBase64(file)
    }
  }

  // Function to convert image to base64
  const convertImageToBase64 = (file) => {
    setImageLoading(true)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      
      setUserImg(base64String)
      updateUserImageInStorage(base64String)
      setImageSrc(base64String)
      setImageLoading(false)
    }
    
    reader.onerror = () => {
      console.error('Error converting image to base64')
      setImageLoading(false)
      alert('Erro ao converter a imagem. Tente novamente.')
    }
    
    reader.readAsDataURL(file)
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
              <button className='btn btn-danger btn-global user-btn user-btn-sair'>Sair</button>
            </div>              
          </div>
        </div>
      </div>
    </div>
  )
}

export default Usuario