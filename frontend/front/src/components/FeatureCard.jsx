import React from 'react'

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div
      className="
        rounded-2xl bg-white p-8
        border border-gray-200
        shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      {/* Icon (top-left aligned) */}
      <div className="mb-5 text-blue-600">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed text-base">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
