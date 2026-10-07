
import { base64PDFexample } from '../../contexts/static'

const base64PDFdownload = () => {

    const binaryData = atob(base64PDFexample)
    const arrayBuffer = new ArrayBuffer(binaryData.length)
    const uint8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i)
    }

    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url;
    a.download = 'base64pdfExample.pdf'

    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    
}

export default base64PDFdownload