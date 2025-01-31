import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-6">Privacy Policy</h1>

        <div className="overflow-y-auto max-h-[70vh] px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-yellow-300">Introduction</h2>
          <p>
            This Privacy Policy describes how HackEx and its affiliates (collectively “HackEx, we, our, us”) collect, use, share, protect, or otherwise process your 
            information through our website <a href="https://www.hackex.in/" className="text-cyan-400">https://www.hackex.in/</a>.
          </p>
          
          <p>
            By visiting this Platform, providing your information, or availing of any product/service, you agree to be bound by this Privacy Policy, Terms of Use, 
            and applicable service/product terms under the laws of India.
          </p>

          <h2 className="text-2xl font-semibold text-yellow-300">Collection of Information</h2>
          <p>
            We collect personal data when you use our Platform, such as name, DOB, address, phone number, email ID, and proof of identity. 
            Sensitive information (bank details, biometric data, etc.) may be collected with your consent.
          </p>

          <h2 className="text-2xl font-semibold text-yellow-300">Usage of Data</h2>
          <p>
            We use personal data for service fulfillment, fraud prevention, marketing, analytics, and more.
          </p>

          <h2 className="text-2xl font-semibold text-yellow-300">Sharing of Information</h2>
          <p>
            We may share personal data within our entities, business partners, third-party service providers, and legal authorities as required.
          </p>

          <h2 className="text-2xl font-semibold text-yellow-300">Security Precautions</h2>
          <p>
            We implement security measures to protect your data, but data transmission over the internet is not always fully secure.
            Users must ensure password security.
          </p>

          <h2 className="text-2xl font-semibold text-yellow-300">Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Users will be notified of significant changes.
          </p>

          <h2 className="text-2xl font-semibold text-cyan-400">Terms & Conditions</h2>
          <p>
            By using HackEx, you agree to our Terms of Use. The platform is governed by Indian law, and disputes are subject to exclusive jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold text-cyan-400">Refund Policy</h2>
          <p>
            We do not provide refunds once payment is successful.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={() => navigate("/")} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
