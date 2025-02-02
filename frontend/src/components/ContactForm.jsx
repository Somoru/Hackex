import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch(
        "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api/contact", // Backend API URL
        //"http://localhost:5000/api/contact", // Local API URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(result.error || "❌ Failed to send message.");
      }
    } catch (error) {
      setStatus("❌ Error sending message.");
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-extrabold text-cyan-400 mb-6">Contact Us</h2>
      <p className="text-gray-400 mb-8">
        Have questions or need support? Get in touch with us, and we'll get back to you as soon as possible.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div>
          <label className="block text-sm font-bold text-gray-400">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-bold text-gray-400">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-sm font-bold text-gray-400">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter your message"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg shadow-lg transition"
        >
          Submit
        </button>

        {/* Status Message */}
        {status && <p className="text-center text-white mt-4">{status}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
