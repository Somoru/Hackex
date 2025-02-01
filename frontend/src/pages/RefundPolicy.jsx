import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-gray-900 text-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">Refund Policy</h1>
      <p className="text-gray-300 leading-relaxed">
        At HackEx, we strive to provide the best possible services to our users. Please read our refund policy carefully before making any payments on the platform.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">No Refund Policy</h2>
      <p className="text-gray-300">
        Once a payment has been made on the HackEx platform, it is considered final and non-refundable under any circumstances. 
        Users are advised to review all details carefully before completing a transaction.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Exceptions</h2>
      <p className="text-gray-300">
        Refunds will only be processed in cases where an incorrect amount has been deducted due to a system error or a failed transaction where the amount was debited but the service was not provided.
        Such cases must be reported to our support team within 7 days of the transaction. The refund would be processed within 7 working days.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Contacting Support</h2>
      <p className="text-gray-300">
        If you believe a refund should be processed under the outlined exception cases, you may contact our customer support team with valid proof of the failed transaction.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Policy Updates</h2>
      <p className="text-gray-300">
        HackEx reserves the right to modify or update this refund policy at any time. Users are responsible for reviewing this policy periodically.
      </p>
      
      <p className="text-gray-400 mt-6 text-sm text-center">Last updated: February 1, 2025</p>
    </div>
  );
};

export default RefundPolicy;
