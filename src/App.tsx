import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';


const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCompressImage = async () => {
    if (!selectedFile) return;

    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);

    img.onload = async () => {
      let maxWidthOrHeight = 1200;

      if (img.naturalWidth > img.naturalHeight) {
        maxWidthOrHeight = img.naturalWidth > 1200 ? 1200 : img.naturalWidth;
      } else {
        maxWidthOrHeight = img.naturalHeight > 1200 ? 1200 : img.naturalHeight;
      }

      const options = {
        maxSizeMB: 0.299,
        maxWidthOrHeight: maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: 1,
      };

      try {
        const compressedImage = await imageCompression(selectedFile, options);
        const downloadLink = URL.createObjectURL(compressedImage);
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = compressedImage.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    };
  };

  return (
    <>
      <div className="image-compressor flex flex-col justify-center items-center w-screen h-screen gap-10 ">
        <div className="flex gap-6 flex-col border rounded-lg border-slate-500 p-4 w-80 h-auto">
          {imagePreview && (
            <div className="w-full">
              <img src={imagePreview} alt="Selected file preview" className="w-full h-auto rounded-md" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <input className="text-center p-4 border border-grey-300 rounded-xl" type="file" onChange={handleFileChange} accept="image/*" />
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  px-2 rounded' onClick={handleCompressImage}>Compress Image</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
