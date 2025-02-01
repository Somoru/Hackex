import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import qr from "../assets/insta_qr.png";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FaInstagram } from "react-icons/fa";
import Countdown from "react-countdown";
import "../styles/HeroSection.css";
const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [showModal, setShowModal] = useState(false); // ✅ State to handle modal visibility

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
       {/* 🚀 HERO SECTION WITH FIXES 🚀 */}
      <section className="relative flex flex-col justify-center items-center min-h-screen text-center overflow-hidden">
        {/* Neon Background */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-black to-purple-900 opacity-40 animate-neonWave"></div>
          <div className="absolute inset-0 bg-noise opacity-20"></div>
        </div>

        {/* Logo */}
        <motion.img
          src={logo}
          alt="HackEx Logo"
          className="relative h-48 mb-6 drop-shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Title - Reduced Font Weight & Dimmed */}
        <motion.h1
          className="relative text-6xl md:text-7xl font-semibold text-cyan-300 drop-shadow-lg opacity-90"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          HackEx.in
        </motion.h1>

        {/* Typewriter Effect */}
        <div className="relative mt-6 p-4 bg-gray-800 rounded-lg shadow-lg text-green-400 text-xl md:text-2xl max-w-lg">
          <Typewriter
            options={{
              strings: ["Redefine How Coders Win"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        {/* CTA Button */}
        <motion.div
          className="relative mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <Button
            label="Get Started"
            className="px-10 py-4 text-lg bg-cyan-500 hover:bg-cyan-600 shadow-lg rounded-xl animate-pulse transition duration-500 transform hover:scale-105"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
          />
        </motion.div>
      </section>

      {/* 🚀 EARLY BIRD OFFER - MATCHED TO THE THEME 🚀 */}
      <section className="relative py-20 px-6 text-center bg-gradient-to-b from-gray-900 to-black">
        <motion.div
          className="relative text-white max-w-5xl mx-auto p-12 rounded-3xl shadow-lg border-2 border-cyan-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* 🔥 HEADLINE - STYLIZED BUT NOT OVERDONE */}
          <motion.h2
  className="text-5xl font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
>
  <span className="text-white">🎉</span> EARLY BIRD OFFER! <span className="text-white">🎉</span>
</motion.h2>

          {/* ⚡ Countdown Timer with Animation */}
          <p className="text-2xl font-semibold text-red-400 mt-4">
            ⏳ Offer Ends In:
            <span className="text-white font-bold text-3xl ml-2">
              <Countdown date={Date.now() + 8 * 24 * 60 * 60 * 1000} />
            </span>
          </p>

          {/* PRICING - Animated Old vs New Price */}
          <motion.div
            className="flex justify-center items-center gap-6 text-7xl font-extrabold tracking-wide mt-6"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <span className="text-gray-500 line-through text-4xl drop-shadow-md">₹50</span>
            <span className="text-cyan-400 text-8xl drop-shadow-md">₹35</span>
          </motion.div>

          {/* 🚀 BENEFITS LIST */}
          <div className="mt-6 text-xl md:text-2xl text-gray-300 font-semibold leading-relaxed">
            <p className="mb-2">🔥 Lowest Entry Price Ever!</p>
            <p className="mb-2">🏆 Unlock Exclusive Coding Challenges</p>
            <p>⚡ Join the Biggest Competitive Coding Revolution</p>
          </div>

          {/* CTA BUTTON - HIGH CONTRAST & HOVER EFFECT */}
          <motion.div
            className="mt-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              label="🔥 CLAIM YOUR SPOT NOW!"
              className="bg-cyan-500 hover:bg-cyan-600 text-black text-lg py-4 px-8 rounded-xl font-bold uppercase transition shadow-xl"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            />
          </motion.div>

          {/* LIMITED TIME WARNING */}
          <motion.p
            className="mt-6 text-lg text-red-400 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            🚀 Limited Time Offer – Don't Miss Out! 🚀
          </motion.p>
        </motion.div>
      </section>


{/* 🚀 REFINED REWARDS SYSTEM WITH BETTER TEXT COLORS 🚀 */}
<section className="py-24 bg-gray-900 text-white text-center px-6">
  <motion.h2 
    className="text-5xl font-extrabold mb-16 text-cyan-400 tracking-wide uppercase"
    initial={{ opacity: 0, y: -20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ duration: 1 }}
  >
    🏆 HackEx Champion Rewards 🏆
  </motion.h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
    {[
      {
        title: "1st Place",
        reward: "10x",
        icon: "🏆",
        glow: "gold",
        size: "text-7xl",
        bg: "bg-gradient-to-b from-yellow-300 to-yellow-600",
        textColor: "text-gray-800", // Dark gray text for gold
      },
      {
        title: "2nd Place",
        reward: "5x",
        icon: "🥈",
        glow: "silver",
        size: "text-6xl",
        bg: "bg-gradient-to-b from-gray-500 to-gray-800",
        textColor: "text-white", // White text for silver
      },
      {
        title: "3rd Place",
        reward: "3x",
        icon: "🥉",
        glow: "bronze",
        size: "text-6xl",
        bg: "bg-gradient-to-b from-orange-400 to-orange-600",
        textColor: "text-cream-200", // Cream/White text for bronze
      }
    ].map((reward, index) => (
      <motion.div
        key={index}
        className={`relative ${reward.bg} p-10 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105`}
        whileHover={{ scale: 1.15 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        {/* Glowing Borders */}
        <div className={`absolute inset-0 rounded-xl border-4 border-transparent transition-all duration-500 hover:border-${reward.glow}-400`}></div>

        {/* Trophy/Medal Icon */}
        <motion.div
          className={`text-${reward.glow}-400 ${reward.size} drop-shadow-xl mb-4`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          {reward.icon}
        </motion.div>

        {/* Title - Adjusted Text Color */}
        <h3 className={`text-4xl font-bold ${reward.textColor} mb-2`}>
          {reward.title}
        </h3>

        {/* Prize Multiplier - Adjusted Text Color */}
        <motion.p
          className={`text-6xl font-extrabold tracking-wide ${reward.textColor}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 1.3 }}
        >
          {reward.reward}
        </motion.p>
      </motion.div>
    ))}
  </div>
</section>

      {/* 🚀 MEET OUR TEAM - ALL CARDS IN ONE ROW 🚀 */}
<section className="py-24 bg-gradient-to-b from-black to-gray-900 text-white text-center px-6">
  <motion.h2
    className="text-5xl font-extrabold mb-16 text-cyan-400 uppercase tracking-wide"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
  >
    Meet Our Team
  </motion.h2>

  {/* Team Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
    {[
      { name: "N Pranav", role: "Logistics Head", icon: "📦", color: "bg-yellow-500" },
      { name: "Alekhya Nelabhotla", role: "Marketing Head", icon: "📣", color: "bg-pink-500" },
      { name: "Rangisetti Lakshmi Pavan", role: "Technical Head", icon: "💻", color: "bg-blue-500" },
      { name: "Peddi Praharshitha", role: "Content Head", icon: "✍️", color: "bg-green-500" },
      { name: "Vedulla Bharath", role: "Finance Head", icon: "💰", color: "bg-purple-500" },
    ].map((member, index) => (
      <motion.div
        key={index}
        className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Icon Placeholder */}
        <div
          className={`w-12 h-12 mx-auto mt-4 flex items-center justify-center rounded-full text-xl text-white shadow-lg ${member.color}`}
        >
          {member.icon}
        </div>

        {/* Member Details */}
        <div className="p-4 text-center">
          <h3 className="text-xl font-bold text-cyan-300">{member.name}</h3>
          <p className="text-gray-400 mt-1 text-sm">{member.role}</p>
        </div>

        {/* Hover Overlay with Additional Details */}
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-gray-300 mb-2">{member.role}</p>
          <p className="text-gray-400 italic text-xs">
            "Driving innovation and growth."
          </p>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* 🚀 FAQ SECTION - MODERNIZED 🚀 */}
<section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white text-center px-6">
  <motion.h2
    className="text-5xl font-extrabold mb-16 text-cyan-400 uppercase tracking-wide"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
  >
    Frequently Asked Questions
  </motion.h2>

  {/* Accordion Container */}
  <div className="max-w-4xl mx-auto space-y-6">
    {[
      {
        question: "How does HackEx work?",
        answer:
          "HackEx is a coding competition platform where you compete in challenges, improve your skills, and earn rewards for performance.",
      },
      {
        question: "What is the entry fee?",
        answer:
          "HackEx requires a ₹50 entry fee per week. However, the first week has an early bird offer where you can join for just ₹35!",
      },
      {
        question: "How are rewards distributed?",
        answer:
          "Top 3 competitors earn 10x, 5x, and 3x their improvement value, while the remaining top 10 get free access to next week's event.",
      },
    ].map((faq, index) => (
      <motion.div
        key={index}
        className="bg-gray-800 p-6 rounded-lg shadow-lg text-left hover:bg-gray-700 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Question Row */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() =>
            setOpenIndex((prev) => (prev === index ? null : index))
          }
        >
          {/* Question Text */}
          <h3 className="text-2xl font-bold text-cyan-300">
            ❓ {faq.question}
          </h3>

          {/* Expand/Collapse Icon */}
          <motion.span
            className="text-cyan-400 text-3xl"
            animate={{
              rotate: openIndex === index ? 180 : 0,
            }}
          >
            ⬇️
          </motion.span>
        </div>

        {/* Answer (Only visible if openIndex matches) */}
        {openIndex === index && (
          <motion.div
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {faq.answer}
          </motion.div>
        )}
      </motion.div>
    ))}
  </div>
</section>

      {/* 🚀 REFINED CONTACT US & FOOTER 🚀 */}
<section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
    
    {/* Contact Us Form */}
    <div>
      <h2 className="text-4xl font-extrabold text-cyan-400 mb-6">Contact Us</h2>
      <p className="text-gray-400 mb-8">
        Have questions or need support? Get in touch with us, and we'll get back to you as soon as possible.
      </p>
      <form className="space-y-6">
        
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-400">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-full mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-400">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-400">
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            placeholder="Enter your message"
            className="w-full mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg shadow-lg transition"
        >
          Submit
        </button>
      </form>
    </div>

    {/* Footer Content - Quick Links & Instagram QR */}
    <div className="flex flex-col justify-between">
      
      {/* Quick Links & Instagram QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Quick Links */}
        <div>
          <h2 className="text-3xl font-extrabold text-cyan-400 mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="/terms-and-conditions" className="text-gray-400 hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refund-policy" className="text-gray-400 hover:text-white transition">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Instagram QR Section - Enlarged QR */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-extrabold text-cyan-400 mb-4">Follow Us</h2>
          <div className="relative group">
            
            {/* Clickable & Scannable QR Code */}
            <a
              href="https://instagram.com/hackex.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={qr} // Replace with actual QR code path
                alt="Instagram QR Code"
                className="w-40 h-40 rounded-lg shadow-lg transition transform group-hover:scale-110"
              />
            </a>

            {/* Hover Effect - Show Instagram Handle */}
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
              <p className="text-cyan-400 text-xl font-bold">@hackex.in</p>
            </div>
          </div>
        </div>

      </div>

      {/* Branding & Copyright */}
      <div className="mt-12 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} HackEx. All rights reserved.
      </div>
      
    </div>
  </div>
</section>


    </div>
  );
};

export default Home;
