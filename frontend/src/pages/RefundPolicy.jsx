import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { FaInstagram } from "react-icons/fa";

const RefundPolicy = () => {
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
          src={logo}
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
          HackEx.in
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
      <footer className="py-6 bg-gray-900 text-center text-gray-400">
        <p className="text-sm">
          © {new Date().getFullYear()} HackEx. All Rights Reserved.
        </p>
        <p className="text-sm mt-2">
          {/* ✅ Trigger Privacy Policy Modal */}
          <span
            className="text-cyan-400 hover:underline cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Privacy Policy
          </span>
        </p>
      </footer>

      {/* ✅ Privacy Policy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white max-w-4xl w-full p-8 rounded-lg shadow-lg relative">
            <h2 className="text-3xl font-bold text-cyan-400 text-center">
              Privacy Policy
            </h2>
            <div className="max-h-96 overflow-y-auto p-4 mt-4 space-y-4">
              <h3 className="text-xl font-semibold text-yellow-300">
                Introduction
              </h3>
              <p>
                {/* This Privacy Policy describes how HackEx and its affiliates collect, use, share, protect, or otherwise process your data through our website  */}
                <p>
                  Introduction This Privacy Policy describes how and its
                  affiliates (collectively " HackEx, we, our, us") collect, use,
                  share, protect or otherwise process your information/ personal
                  data through our website
                  <a href="https://www.hackex.in/" className="text-cyan-400">
                    {" "}
                    https://www.hackex.in/
                  </a>
                  .
                </p>
              </p>
              <h3 className="text-xl font-semibold text-yellow-300">Policy</h3>
              <p>
                Please note that you may be able to browse certain sections of
                the Platform without registering with us.We do not offer any
                product/service under this Platform outside India and your
                personal data will primarily be stored and processed in India.
                By visiting this Platform, providing your information or
                availing any product/service offered on the Platform, you
                expressly agree to be bound by the terms and conditions of this
                Privacy Policy, the Terms of Use and the applicable
                service/product terms and conditions, and agree to be governed
                by the laws of India including but not limited to the laws
                applicable to data protection and privacy. If you do not agree
                please do not use or access our Platform. Collection-We collect
                your personal data when you use our Platform, services or
                otherwise interact with us during the course of our
                relationship. And related information is provided from time to
                time. Some of the information that we may collect includes but
                is not limited to personal data / information provided to us
                during sign- up/registering or using our Platform such as name,
                date of birth, address, telephone/mobile number, email ID and/or
                any such information shared as proof of identity or address.
                Some of the sensitive personal data may be collected with your
                consent, such as your bank account or credit or debit card or
                other payment instrument information or biometric information
                such as your facial features or physiological information (in
                order to enable use of certain features when opted for,
                available on the Platform) etc all of the above being in
                accordance with applicable law(s) You always have the option to
                not provide information, by choosing not to use a particular
                service or feature on the Platform. We may track your behavior,
                preferences, and other information that you choose to provide on
                our Platform. This information is compiled and analysed on an
                aggregated basis. We will also collect your information related
                to your transactions on Platform and such third-party business
                partner platforms. When such a third-party business partner
                collects your personal data directly from you, you will be
                governed by their privacy policies. We shall not be responsible
                for the third-party business partner’s privacy practices or the
                content of their privacy policies, and we request you to read
                their privacy policies prior to disclosing any information. If
                you receive an email, a call from a person/association claiming
                to be seeking any personal data like debit/credit card PIN,
                net-banking or mobile banking password, we request you to never
                provide such information. If you have already revealed such
                information, report it immediately to an appropriate law
                enforcement agency. Usage- We use personal data to provide the
                services you request. To the extent we use your personal data to
                market to you, we will provide you with the ability to opt out
                of such uses. We use your personal data to assist sellers and
                business partners 1 in handling and fulfilling orders; enhancing
                customer experience; to resolve disputes; troubleshoot problems;
                inform you about online and offline offers, products, services,
                and updates; customise your experience; detect and protect us
                against error, fraud and other criminal activity; enforce our
                terms and conditions; conduct marketing research, analysis and
                surveys; and as otherwise described to you at the time of
                collection of information. You understand that your access to
                these products/services may be affected in the event permission
                is not provided to us.Sharing- We may share your personal data
                internally within our group entities, our other corporate
                entities, and affiliates to provide you access to the services
                and products offered by them. These entities and affiliates may
                market to you because of such sharing unless you explicitly
                opt-out. We may disclose personal data to third parties such as
                sellers, business partners, third party service providers
                including logistics partners, prepaid payment instrument
                issuers, third-party reward programs and other payment opted by
                you. This disclosure may be required for us to provide you
                access to our services and products offered to you, to comply
                with our legal obligations, to enforce our user agreement, to
                facilitate our marketing and advertising activities, to prevent,
                detect, mitigate, and investigate fraudulent or illegal
                activities related to our services. We may disclose personal and
                sensitive personal data to government agencies or other
                authorised law enforcement agencies if required to do so by law
                or in the good faith belief that such disclosure is reasonably
                necessary to respond to subpoenas, court orders, or other legal
                process. We may disclose personal data to law enforcement
                offices, third party rights owners, or others in the good faith
                belief that such disclosure is reasonably necessary to: enforce
                our Terms of Use or Privacy Policy; respond to claims that an
                advertisement, posting or other content violates the rights of a
                third party; or protect the rights, property or personal safety
                of our users or the general public. Security Precautions- To
                protect your personal data from unauthorized access or
                disclosure, loss or misuse we adopt reasonable security
                practices and procedures. Once your information is in our
                possession or whenever you access your account information, we
                adhere to our security guidelines to protect it against
                unauthorized access and offer the use of a secure server.
                However, the transmission of information is not completely
                secure for reasons beyond our control. By using the Platform,
                the users accept the security implications of data transmission
                over the internet and the World Wide Web which cannot always be
                guaranteed as completely secure, and therefore, there would
                always remain certain inherent risks regarding use of the
                Platform. Users are responsible for ensuring the protection of
                login and password records for their account. If you disclose to
                us any personal data relating to other people, you represent
                that you have the authority to do so and permit us to use the
                information in accordance with this Privacy Policy. You, while
                providing your personal data over the Platform or any partner
                platforms or establishments, consent to us (including our other
                corporate entities, affiliates, lending partners, technology
                partners, marketing channels, business partners and other third
                parties) to contact you through SMS, instant messaging apps,
                call and/or e-mail for the purposes specified in this Privacy
                Policy. You have an option to withdraw your consent that you
                have already provided by writing to the Grievance Officer at the
                contact information provided below. Please mention “Withdrawal
                of consent for processing personal data” in your subject line of
                your communication. We may verify such requests before acting on
                our request. However, please note that your withdrawal of
                consent will not be retrospective and will be in accordance with
                the Terms of Use, this Privacy Policy, and applicable laws. In
                the event you withdraw consent given to us under this Privacy
                Policy, we reserve the right to restrict or deny the provision
                of our services for which we consider such information to be
                necessary. Changes to this Privacy Policy- Please check our
                Privacy Policy periodically for changes. We may update this
                Privacy Policy to reflect changes to our information practices.
                We may alert / notify you about the significant changes to the
                Privacy Policy, in the manner as may be required under
                applicable laws.{" "}
              </p>
              {/* <h3 className="text-xl font-semibold text-yellow-300">Collection of Information</h3>
              <p>
                We collect personal data such as name, email, and address when you use our platform.
              </p>

              <h3 className="text-xl font-semibold text-yellow-300">Usage of Data</h3>
              <p>
                We use personal data for service fulfillment, fraud prevention, marketing, analytics, and more.
              </p>

              <h3 className="text-xl font-semibold text-yellow-300">Security Precautions</h3>
              <p>
                We implement security measures to protect your data, but data transmission over the internet is not always fully secure.
              </p> */}
              <h3 className="text-xl font-semibold text-yellow-300">
                Terms and Conditions
              </h3>
              <p>
                This document is an electronic record in terms of the
                Information Technology Act, 2000 and rules there under as
                applicable and the amended provisions pertaining to electronic
                records in various statutes as amended by the Information
                Technology Act, 2000. This electronic record is generated by a
                computer system and does not require any physical or digital
                signatures. This document is published in accordance with the
                provisions of Rule 3 (1) of the Information Technology
                (Intermediaries guidelines) Rules, 2011 that require publishing
                the rules and regulations, privacy policy and Terms of Use for
                access or usage of domain name https://www.hackex.in/ ,
                including the related mobile site and mobile application
                (hereinafter 3 referred to as “Platform”). The Platform is owned
                by HackEx, a company incorporated under the Companies Act, 1956
                with its registered office at (1-8-151/1, Road No-4, Ganeshpuri
                Colony, Dilshukhnagar, Hyderabad-500060) (hereinafter referred
                to as "Platform Owner", “we”, “us”, “our”). Your use of the
                Platform and services and tools are governed by the following
                terms and conditions ("Terms of Use") as applicable to the
                Platform including the applicable policies which are
                incorporated herein by way of reference. If You transact on the
                Platform, you shall be subject to the policies that are
                applicable to the Platform for such transaction. By mere use of
                the Platform, you shall be contracting with the Platform Owner
                and these terms and conditions including the policies constitute
                Your binding obligations, with Platform Owner. These Terms of
                Use relate to your use of our website, goods (as applicable) or
                services (as applicable) (collectively, “Services”). Any terms
                and conditions proposed by You which are in addition to or which
                conflict with these Terms of Use are expressly rejected by the
                Platform Owner and shall be of no force or effect. These Terms
                of Use can be modified at any time without assigning any reason.
                It is your responsibility to periodically review these Terms of
                Use to stay informed of updates. For the purpose of these Terms
                of Use, wherever the context requires "you", “your” or "user"
                shall mean any natural or legal person who has agreed to become
                a user/buyer on the Platform. ACCESSING, BROWSING OR OTHERWISE
                USING THE PLATFORM INDICATES YOUR AGREEMENT TO ALL THE TERMS AND
                CONDITIONS UNDER THESE TERMS OF USE, SO PLEASE READ THE TERMS OF
                USE CAREFULLY BEFORE THE PROCEEDING. The use of Platform and/or
                availing of our Services is subject to the following Terms of
                Use: To access and use the Services, you agree to provide true,
                accurate and complete information to us during and after
                registration, and you shall be responsible for all acts done
                through the use of your registered account on the Platform.
                Neither we nor any third parties provide any warranty or
                guarantee as to the accuracy, timeliness, performance,
                completeness or suitability of the information and materials
                offered on this website or through the Services, for any
                specific purpose. You acknowledge that such information and
                materials may contain inaccuracies or errors, and we expressly
                fully exclude liability for any such inaccuracies or errors
                permitted by law. Your use of our Services and the Platform is
                solely and entirely at your own risk and discretion for which we
                shall not be liable to you in any manner. You are required to
                independently assess and ensure that the Services meet your
                requirements. The contents of the Platform and the Services are
                proprietary to us and are licensed to us. You will not have any
                authority to claim any intellectual property rights, title, or
                interest in its contents. The contents include and are not
                limited to the design, layout, look and graphics. You
                acknowledge that unauthorized use of the Platform and/or the
                Services may lead to action against you as per these Terms of
                Use and/or applicable laws. You agree to pay us the charges
                associated with availing the Services. You agree not to use the
                Platform and/ or Services for any purpose that is unlawful,
                illegal or 4 forbidden by these Terms, or Indian or local laws
                that might apply to you. You agree and acknowledge that website
                and the Services may contain links to other third-party
                websites. On accessing these links, you will be governed by the
                terms of use, privacy policy and such other policies of such
                third-party websites. These links are provided for your
                convenience to provide further information. You understand that
                upon initiating a transaction for availing the Services you are
                entering into a legally binding and enforceable contract with
                the Platform Owner for the Services. You shall indemnify and
                hold harmless Platform Owner, its affiliates, group companies
                (as applicable) and their respective officers, directors,
                agents, and employees, from any claim or demand, or actions
                including reasonable attorneys’ fees, made by any third party or
                penalty imposed due to or arising out of Your breach of this
                Terms of Use, privacy Policy and other Policies, or Your
                violation of any law, rules or regulations or the rights
                (including infringement of intellectual property rights) of a
                third party. In no event will the Platform Owner be liable for
                any indirect, consequential, incidental, special or punitive
                damages, including without limitation damages for loss of
                profits or revenues, business interruption, loss of business
                opportunities, loss of data or loss of other economic interests,
                whether in contract, negligence, tort or otherwise, arising from
                the use of or inability to use the Services, however caused and
                whether arising in contract, tort, negligence, warranty or
                otherwise, exceed the amount paid by You for using the Services
                giving rise to the cause of action or Rupees One Hundred (Rs.
                100) whichever is less Notwithstanding anything contained in
                these Terms of Use, the parties shall not be liable for any
                failure to perform an obligation under these Terms if
                performance is prevented or delayed by a force majeure event.
                These Terms and any dispute or claim relating to it, or its
                enforceability, shall be governed by and construed in accordance
                with the laws of India. All disputes arising out of or in
                connection with these Terms shall be subject to the exclusive
                jurisdiction of the courts in (Enter City and State) All
                concerns or communications relating to these Terms must be
                communicated to us using the contact information provided on
                this website.{" "}
              </p>
              <h3 className="text-xl font-semibold text-yellow-300">
                Refund Policy
              </h3>
              <p>We do not provide refunds once payment is successful.</p>
            </div>

            {/* ✅ Close Modal Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundPolicy;
