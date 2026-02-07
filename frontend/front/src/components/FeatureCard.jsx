import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div
      className="
        group relative p-8 h-full
        bg-white dark:bg-gray-900 
        rounded-2xl
        border border-gray-100 dark:border-gray-800
        shadow-sm hover:shadow-xl dark:shadow-none
        transition-all duration-300 ease-out
        hover:-translate-y-1
        overflow-hidden
      "
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-cyan-50 dark:bg-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-12 h-12 rounded-xl bg-cyan-50 dark:bg-gray-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      <p className="relative text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;