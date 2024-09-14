import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useFileContext } from '../contexts/FileContext'; // Adjust import path
import { BASE_URL } from '../services/apis';
import { Slider, ConfigProvider, Select } from 'antd';

const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const ImageProcessor: React.FC = () => {
    const { filePath } = useFileContext();
    const [processingResult, setProcessingResult] = useState<string | null>(null);
    const [processedFilePath, setProcessedFilePath] = useState<string | null>(null);

    // States for processing options
    const [brightness, setBrightness] = useState<number>(1.0);
    const [contrast, setContrast] = useState<number>(1.0);
    const [saturation, setSaturation] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);

    // State for image format
    const [format, setFormat] = useState<string>('jpeg');

    const fetchProcessedImage = async () => {
        if (!filePath) return;

        try {
            let reqBody: any = {
                filePath,
                brightness,
                contrast,
                saturation,
                rotation,
            }
            const response = await axios.post(`${BASE_URL}/api/v1/images/process`, reqBody);

            if (response.data.preview) {
                setProcessingResult(response.data.preview);
            }
            if (response.data.filePath) {
                setProcessedFilePath(response.data.filePath);
            }
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };
    // eslint-disable-next-line
    const debouncedFetchProcessedImage = useCallback(debounce(fetchProcessedImage, 2000), [filePath, brightness, contrast, saturation, rotation]);

    useEffect(() => {
        debouncedFetchProcessedImage();
    }, [filePath, brightness, contrast, saturation, rotation, debouncedFetchProcessedImage]);

    const handleDownload = () => {
        if (!processedFilePath) return;

        const url = `${BASE_URL}/api/v1/images/download?filePath=${encodeURIComponent(processedFilePath)}&format=${format}`;
        window.open(url, '_blank');
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Slider: {
                        /* here is your component tokens */
                        dotActiveBorderColor: '#2563eb',
                        handleActiveColor: '#2563eb',
                        handleActiveOutlineColor: 'none',
                        handleColor: '#2563eb',
                        trackBg: '#14b8a6',
                        trackHoverBg: '#2563eb',
                        handleSizeHover: 10,
                        handleLineWidth: 2,
                        railSize: 3
                    },
                },
                token: {
                    /* here is your global tokens */
                    colorPrimary: '#2563eb',
                    colorPrimaryBorder: '#2563eb',
                    colorPrimaryHover: '#2563eb',
                }
            }}
        >
            <div className='flex gap-3 md:gap-5 flex-col md:flex-row w-full lg:w-[60%]'>
                <div className='flex-1 border border-blue-400 rounded-xl flex flex-col gap-2 p-2'>
                    <h3 className='text-center text-blue-600 text-lg font-[600] uppercase tracking-wider'>EDIT Image</h3>

                    <div className='border-t  border-blue-400 flex flex-col gap-2 py-4'>
                        <div className="flex gap-3 pb-2 justify-center items-center">
                            <h2 className='text-sm font-[500] font-[Poppins] text-black'>
                                Brightness:
                                {" "}
                                <span className='text-blue-600 text-base'>
                                    {brightness}
                                </span>
                            </h2>
                            <div className='flex-1'>
                                <Slider range value={[brightness]} min={0} max={3}
                                    step={0.1}
                                    onChange={(values: any) => {
                                        setBrightness(parseFloat(values))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pb-2 justify-center items-center ">
                            <h2 className='text-sm font-[500] font-[Poppins] text-black'>
                                Contrast:
                                {" "}
                                <span className='text-blue-600 text-base'>
                                    {contrast}
                                </span>
                            </h2>
                            <div className='flex-1'>
                                <Slider range value={[contrast]} min={0} max={3}
                                    step={0.1}
                                    onChange={(values: any) => {
                                        setContrast(parseFloat(values))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pb-2 justify-center items-center ">
                            <h2 className='text-sm font-[500] font-[Poppins] text-black'>
                                Saturation:
                                {" "}
                                <span className='text-blue-600 text-base'>
                                    {saturation}
                                </span>
                            </h2>
                            <div className='flex-1'>
                                <Slider range value={[saturation]} min={0} max={3}
                                    step={0.1}
                                    onChange={(values: any) => {
                                        setSaturation(parseFloat(values))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pb-2 justify-center items-center ">
                            <h2 className='text-sm font-[500] font-[Poppins] text-black'>
                                Rotation (degrees):
                                {" "}
                                <span className='text-blue-600 text-base'>
                                    {rotation}
                                </span>
                            </h2>
                            <div className='flex-1'>
                                <Slider range value={[rotation]} min={0} max={360}
                                    step={10}
                                    onChange={(values: any) => {
                                        setRotation(parseFloat(values))
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between items-center mt-4'>
                        <div className='flex gap-1.5 justify-center items-center'>
                            <label className='text-sm font-[500] font-[Poppins] text-black'>
                                Download Format:
                            </label>

                            <Select
                                value={format}
                                onChange={(value) => setFormat(value)}
                                options={
                                    [
                                        {
                                            value: 'jpeg',
                                            label: <span className='text-[13px] font-[500] font-[Poppins] text-black'>JPEG</span>
                                        },
                                        {
                                            value: 'png',
                                            label: <span className='text-[13px] font-[500] font-[Poppins] text-black'>PNG</span>
                                        },
                                    ]
                                }
                            />
                        </div>

                        <button onClick={handleDownload} disabled={!processedFilePath}
                            className={`bg-blue-600 font-[Poppins]  px-2.5 py-1.5 uppercase flex gap-1 justify-center items-center text-white rounded-md text-sm font-[500] tracking-wider w-fit`}
                        >
                            Download Image
                        </button>
                    </div>
                </div>

                <div className='flex-1 flex justify-center items-center'>
                    {processingResult && <img src={`data:image/jpeg;base64,${processingResult}`} alt="Processed Preview" />}
                </div>

            </div>
        </ConfigProvider >
    );
};

export default ImageProcessor;
