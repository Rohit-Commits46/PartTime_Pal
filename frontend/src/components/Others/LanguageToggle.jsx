import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage, isHindi } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
      title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
    >
      <span className="text-xs font-semibold">
        {isHindi ? 'EN' : 'हिं'}
      </span>
      <div className="flex items-center">
        <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-300 ${
          isHindi ? 'bg-orange-500' : 'bg-blue-500'
        }`}>
          <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 ${
            isHindi ? 'translate-x-4' : 'translate-x-0'
          }`}></div>
        </div>
      </div>
      <span className="text-xs">
        {isHindi ? 'हिं' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;
