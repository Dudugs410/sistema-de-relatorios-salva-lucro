import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import './ImageUpload.scss'; // Import the SCSS file

const ImageUpload = (onUpload) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      if (selectedFiles.length + acceptedFiles.length > 5) {
        alert('You can upload a maximum of 5 images.');
      } else {
        const newFiles = acceptedFiles.map(file => URL.createObjectURL(file));
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    }
    if (rejectedFiles.length > 0) {
      console.error('Invalid file type:', rejectedFiles);
      alert('Formato de arquivo inválido. Selecione apenas arquivos de imagem (jpg, jpeg, png, etc.)')
    }
  }, [selectedFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
    },
    maxFiles: 5,
  });

  const toggleWebcam = () => {
    if (selectedFiles.length >= 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }
    setIsWebcamOpen((prev) => !prev);
  };

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (selectedFiles.length >= 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedFiles(prevFiles => [...prevFiles, imageSrc]);
    setIsWebcamOpen(false);
  }, [selectedFiles]);

  const deleteImage = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>{'Solte até 5 imagens aqui, ou clique para selecionar os arquivos'}</p>
      </div>
      {selectedFiles.length > 0 && (
        <div className="uploaded-images">
          {selectedFiles.map((file, index) => (
            <div key={index} className="image-container">
              <img src={file} alt={`Selected ${index}`} />
              <button className='btn-global button-delete' onClick={() => deleteImage(index)}>X</button>
            </div>
          ))}
        </div>
      )}

      <button className='btn-global' style={{width: 'auto'}} onClick={toggleWebcam}>
        {isWebcamOpen ? 'Fechar Câmera' : 'Usar Câmera'}
      </button>

      {isWebcamOpen && (
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button className='btn-global' onClick={capture}>Tirar Foto</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
