import React from 'react';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const LoadingSpinner = ({ message = "Yükleniyor", fullScreen = false, error = null }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'} w-full`}>
      {error ? (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Hata" 
          color="red" 
          className="w-full max-w-md mb-4"
        >
          {error}
        </Alert>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-sm font-medium">
            {message}
            <span className="inline-flex">
              <span className="animate-[bounce_1s_infinite_0ms]">.</span>
              <span className="animate-[bounce_1s_infinite_200ms]">.</span>
              <span className="animate-[bounce_1s_infinite_400ms]">.</span>
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default LoadingSpinner; 