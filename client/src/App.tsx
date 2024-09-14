import React from 'react';
import ImageUploader from './components/ImageUploader';
import ImageProcessor from './components/ImageProcessor';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { useFileContext } from './contexts/FileContext'; // Adjust import path
import bg_image from './images/bg_image.png'

const App: React.FC = () => {
  const { filePath } = useFileContext();
  return (
    <WebSocketProvider>
      <div className="overflow-hidden">
        <div className='flex flex-col justify-center items-center px-4 py-6 h-screen w-screen  relative'>
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-sky-100 to-blue-200 z-[-1]">
            <img
              src={bg_image}
              alt="img_bg"
              className='mix-blend-multiply object-cover'
            />
          </div>
          {
            filePath ?
              <ImageProcessor />
              :
              <ImageUploader />
          }

          {/* footer */}
          <div className='bg-blue-600 w-screen fixed bottom-0 px-4 py-2'>
            <p className='text-white text-sm tracking-wider font-[500] text-center'>
              Copyright @ 2024 | Designed and Developed By 
              {" "}
              <a href='https://www.linkedin.com/in/shubh-vaish-226493220/' target='_blank' rel="noreferrer" className='underline'>
                Shubh
              </a>
            </p>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default App;
