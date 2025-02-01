import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FaInstagram } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
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
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-center relative overflow-hidden p-6">
        <motion.img
          src="../assets/logo.png"
          alt="HackEx Logo"
          className="h-48 mb-6 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold text-cyan-400 drop-shadow-2xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          HackEx.in...
        </motion.h1>
        <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg text-green-400 text-xl md:text-2xl w-auto max-w-lg">
          <Typewriter
            options={{
              strings: ["Redefine How Coders Win"],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <Button
            label="Get Started"
            className="px-10 py-4 text-lg bg-cyan-500 hover:bg-cyan-600 shadow-lg rounded-xl"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
          />
        </motion.div>
      </section>

      {/* Early Bird Offer */}
      <section className="py-20 bg-green-900 text-white text-center px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8 text-yellow-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          🎉 Early Bird Offer! 🎉
        </motion.h2>
        <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-6">
          Register now and get access to HackEx for only{" "}
          <span className="text-yellow-300 font-bold text-3xl">₹35</span>{" "}
          <span className="text-gray-400 line-through text-xl">₹50</span>! This
          limited-time offer is valid only for the <strong>first week</strong>.
        </p>
        <Button
          label="Claim Offer Now"
          className="bg-yellow-400 hover:bg-yellow-500 text-black text-lg py-4 px-8 rounded-lg font-semibold transition shadow-lg"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
        />
      </section>

      {/* Rewards System Section */}
      <section className="py-24 bg-gray-900 text-white text-center px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-16 text-cyan-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          HackEx Rewards System
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "1st Place",
              reward: "10x",
              description: "Earn <strong>10x</strong> your improvement value!",
              icon: "🥇",
            },
            {
              title: "2nd Place",
              reward: "5x",
              description: "Earn <strong>5x</strong> your improvement value!",
              icon: "🥈",
            },
            {
              title: "3rd Place",
              reward: "3x",
              description: "Earn <strong>3x</strong> your improvement value!",
              icon: "🥉",
            },
          ].map((reward, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-8 rounded-lg shadow-xl hover:scale-105 transition-transform"
            >
              <h3 className="text-3xl font-semibold text-yellow-300 mb-4">
                {reward.icon} {reward.title}
              </h3>
              <p className="text-4xl font-bold text-cyan-400">
                {reward.reward}
              </p>
              <p
                className="text-gray-300 mt-2"
                dangerouslySetInnerHTML={{ __html: reward.description }}
              ></p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Meet Our Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white text-center px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-16 text-cyan-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-8xl mx-auto">
          {[
            { name: "Neeli Pranav", role: "Logistics Head" },
            { name: "Alekhya Nelabhotla", role: "Marketing Head" },
            { name: "Rangisetti Lakshmi Pavan", role: "Technical Head" },
            { name: "Peddi Praharshitha", role: "Content Head" },
            { name: "Vedulla Bharath", role: "Finance Head" },
          ].map((member, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-xl hover:scale-105 transition-transform flex flex-col items-center"
            >
              <h3 className="text-2xl font-semibold text-cyan-300">
                {member.name}
              </h3>
              <p className="text-gray-300 mt-2">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black text-white text-center px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-16 text-cyan-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              question: "How does HackEx work?",
              answer:
                "HackEx is a coding competition platform where you compete in challenges, improve your skills, and earn rewards for performance.",
            },
            {
              question: "What is the entry fee?",
              answer: (
                <>
                  HackEx requires a ₹50 entry fee per week. However, the first
                  week has an <strong>early bird offer</strong> where you can
                  join for just ₹35!
                </>
              ),
            },

            {
              question: "How are rewards distributed?",
              answer:
                "Top 3 competitors earn 10x, 5x, and 3x their improvement value, while the remaining top 10 get free access to next week's event.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-left"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-semibold text-cyan-300 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Contact Us Section */}
      <section className="py-24 bg-gray-900 text-white text-center px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-16 text-cyan-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Contact Us
        </motion.h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Have questions or need support? Reach out to us at{" "}
          <span className="text-cyan-300">team@hackex.in</span>
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="https://www.instagram.com/hackex.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-400 text-4xl flex items-center gap-2"
          >
            <FaInstagram /> <span className="text-lg">@hackex.in</span>
          </a>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Footer Links */}
        <div className="flex space-x-6 text-sm md:text-base">
          <Link to="/terms-and-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/refund-policy" className="hover:underline">
            Refund Policy
          </Link>
        </div>

        {/* Copyright Text */}
        <p className="text-sm mt-4 md:mt-0 text-gray-400">
          © {new Date().getFullYear()} HackEx.in. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  );
};

export default Home;
