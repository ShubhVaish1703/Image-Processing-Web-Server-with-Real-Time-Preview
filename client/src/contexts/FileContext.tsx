import React, { createContext, useContext, useState } from 'react';

interface FileContextType {
    filePath: string | null;
    setFilePath: React.Dispatch<React.SetStateAction<string | null>>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [filePath, setFilePath] = useState<string | null>(null);

    return (
        <FileContext.Provider value={{ filePath, setFilePath }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (context === undefined) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};
