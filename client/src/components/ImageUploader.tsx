import React, { useState } from 'react';
import axios from 'axios';
import { useFileContext } from '../contexts/FileContext'; // Adjust import path
import { Loader2 } from "lucide-react";
import { BASE_URL } from '../services/apis';

const UploadImage: React.FC = () => {
    const { setFilePath } = useFileContext();
    const [loading, setLoading] = useState(false);


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Automatically upload the image
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post(`${BASE_URL}/api/v1/images/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.filePath) {
                    setFilePath(response.data.filePath);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        setLoading(false);
    };

    return (
        <div className='flex justify-center items-center flex-col gap-10'>
            <h1 className='text-blue-600 uppercase font-[Poppins] text-3xl tracking-wide font-[600] text-center'>
                Image Processing Web Server
                <br />
                <span className='text-xl'>
                    with
                    Real-Time Preview
                </span>
            </h1>
            <div>
                <div className="flex items-center justify-between w-full">
                    <label className={"flex flex-col items-center justify-center w-full min-h-full border-2 border-blue-600 border-dashed rounded-lg cursor-pointer"} >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 md:px-20">
                            <svg className="w-8 h-8 mb-4 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-[13px]"><span className="font-[500]">Click to Upload Image</span> or drag and drop</p>
                        </div>
                        <input accept="image/*" multiple={false} type="file" className="hidden"
                            onChange={handleFileChange} />
                    </label>
                </div>

                {
                    loading &&
                    <div className="fixed h-screen w-screen top-0 left-0 flex justify-center items-center 
                bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 z-[10000]">
                        <button disabled={loading} className={`bg-blue-600 font-[Poppins]  px-2.5 py-1.5 uppercase flex gap-1 justify-center items-center text-white rounded-lg text-sm font-[500] tracking-wider`}>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default UploadImage;
