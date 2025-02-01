import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-gray-900 text-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">Privacy Policy</h1>
      <p className="text-gray-300 leading-relaxed">
        This Privacy Policy describes how HackEx and its affiliates ("HackEx, we, our, us") collect, use, share, 
        protect, or otherwise process your information/personal data through our website, 
        <a href="https://www.hackex.in/" className="text-blue-400 hover:underline">https://www.hackex.in/</a> ("Platform").
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Introduction</h2>
      <p className="text-gray-300">
        You may be able to browse certain sections of the Platform without registering. We do not offer any 
        product/service outside India, and your personal data will primarily be stored and processed in India. 
        By visiting this Platform, providing your information, or availing of any product/service, you agree to our Privacy Policy, Terms of Use, and Indian data protection laws.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Collection of Information</h2>
      <p className="text-gray-300">
        We collect personal data when you use our Platform, services, or interact with us. This includes but is not limited to:
      </p>
      <ul className="list-disc pl-6 text-gray-300">
        <li>Name, date of birth, address, contact details, and email ID.</li>
        <li>Financial details such as bank account, credit/debit card details.</li>
        <li>Biometric information such as facial features (for specific features).</li>
        <li>Behavioral, transactional, and analytical data related to your usage.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Usage of Information</h2>
      <p className="text-gray-300">
        Your data is used to:
      </p>
      <ul className="list-disc pl-6 text-gray-300">
        <li>Provide services and process transactions.</li>
        <li>Detect and prevent fraud, security threats, and unlawful activity.</li>
        <li>Improve our platform and personalize user experience.</li>
        <li>Send promotional communications (opt-out available).</li>
        <li>Comply with legal obligations.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Sharing of Information</h2>
      <p className="text-gray-300">
        We may share your data with:
      </p>
      <ul className="list-disc pl-6 text-gray-300">
        <li>Affiliated corporate entities and service providers.</li>
        <li>Third-party partners for transactions and logistics.</li>
        <li>Government agencies or legal authorities when required.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Security Precautions</h2>
      <p className="text-gray-300">
        We adopt industry-standard security measures to safeguard your data. However, users are responsible for maintaining their account security.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Your Rights</h2>
      <p className="text-gray-300">
        You have the right to access, modify, or withdraw your consent to data processing. Contact our Grievance Officer for requests.
      </p>
      
      <h2 className="text-2xl font-semibold text-blue-300 mt-6">Changes to Privacy Policy</h2>
      <p className="text-gray-300">
        We may update this policy periodically. Users are encouraged to review it regularly.
      </p>
      
      <p className="text-gray-400 mt-6 text-sm text-center">Last updated: February 1, 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
