import React from 'react';

const Payments = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 text-center text-gray-500">
           No payment history found.
        </div>
      </div>
    </div>
  );
};

export default Payments;