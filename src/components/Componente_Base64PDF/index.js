import React from 'react';
import { base64PDFexample } from '../../contexts/static';

const base64PDFdownload = () => {
    // Assume pdfBase64 is the base64 string representing the PDF

    // Decode base64 string
    const binaryData = atob(base64PDFexample);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create Blob
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    // Create URL
    const url = URL.createObjectURL(blob);

    // Create anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'base64pdfExample.pdf';

    // Trigger download
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default base64PDFdownload;