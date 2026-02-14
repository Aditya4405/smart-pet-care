import React from 'react';
import { FileText, Download } from 'lucide-react';

const HealthRecords = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {[1, 2].map((item) => (
          <div key={item} className="p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Vaccination Report - Bella</h4>
                <p className="text-sm text-gray-500">Uploaded on Oct 12, 2025 • Dr. John Doe</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecords;