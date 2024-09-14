import React, { useState } from 'react';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(1);
  const [saturation, setSaturation] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Make API call here to send image and settings to the backend
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Image Processor</h1>
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />

        {preview && <img src={preview} alt="Preview" className="mb-4 max-w-sm" />}

        <div className="mb-4">
          <label className="block font-medium mb-2">Brightness</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Contrast</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={contrast}
            onChange={(e) => setContrast(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Saturation</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={saturation}
            onChange={(e) => setSaturation(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Rotation</label>
          <input
            type="number"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Process Image
        </button>
      </div>
    </div>
  );
};

export default App;
