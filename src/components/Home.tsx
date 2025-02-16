import React from "react";
import { motion } from "framer-motion";
import img1 from "../assets/main-app-preview.png";
import { Linkedin, Github } from "lucide-react";
import img2 from "../assets/landingpage_features_image_1.png";
import { useNavigate } from "react-router-dom";
import pratyushImg from "../assets/1726505628182.jpeg";

const teamMembers = [
  {
    name: "Pratyush",
    role: "Project Manager / Full Stack Developer",
    image: "../assets/1726505628182.jpeg",
    linkedin: "https://www.linkedin.com/in/pratyush-kumar-05a071282/",
    github: "https://github.com/PratyushSinha15",
  },
  {
    name: "Nitin",
    role: "Lead Developer / Full Stack Developer",
    image: "/images/vinicius.jpg",
    linkedin: "https://www.linkedin.com/in/nitin-patel-49360a257/",
    github: "https://github.com/Nitinkumar432",
  },
  {
    name: "Omil",
    role: "Full Stack Developer",
    image: "/images/cocoy.jpg",
    linkedin: "https://www.linkedin.com/in/omil-goel-0733042b3/",
    github: "https://github.com/",
  },
  {
    name: "Nikhar ",
    role: "Full Stack Developer",
    image: "/images/terumasa.jpg",
    linkedin: "https://www.linkedin.com/in/nikhar-raj/",
    github: "https://github.com/rajnikhar",
  },
];

const features = [
  {
    title: "Motion tracking",
    description:
      "AI analysis checks your form in real-time, ensuring correct posture for a safe and effective workout",
    icon: (
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
  {
    title: "Personalized workout plan",
    description:
      "AI analysis helps you create personalized workout plans based on your fitness level and goals",
    icon: (
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Progress tracking",
    description:
      "Progress dashboard keeps you motivated, making it easier to stay on track and maintain a regular workout routine, even when exercising alone!",
    icon: (
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white">
      

      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Get fit and healthy from the{" "}
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  comfort of home
                </span>{" "}
                without gym or trainers.
              </h1>
              <p className="text-lg md:text-xl text-gray-400">
              Fit AI Trainer is an AI-powered fitness web platform for people who
                want to exercise in their own homes or on the go, at their own
                pace.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <motion.img
                src={img1}
                alt="BodyBuddy App Interface"
                loading="lazy"
                className="rounded-2xl"
                animate={{
                  y: [0, -10, 0], // Only the PNG floats
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 3,
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="w-full bg-gradient-to-r from-pink-500/20 to-blue-500/20">
        {/* Features Section */}
        <section id="features" className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center mb-16 text-white"
            >
              All you need to start your fitness journey
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 mb-6 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img src={img2} alt="Hero Image" className="w-full h-auto" />

              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-2xl" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Fit AI Trainer offers an{" "}
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  effective fitness experience
                </span>{" "}
                without the worry of time and location constraints
              </h2>
              <p className="text-xl text-gray-600">
                Transform your fitness journey with our AI-powered platform that adapts to your schedule and space. Get
                professional guidance and real-time feedback, all from the comfort of your chosen location.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors"
                onClick={() => navigate('/auth')}
              >
                Start Your Journey
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Team Section */}
        <section id="team" className="py-12 text-center bg-black">
          <h2 className="text-3xl font-semibold text-white mb-8">Meet the Team</h2>
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 rounded-lg shadow-lg p-4 flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
                <div className="flex mt-3 space-x-3">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="text-blue-400 w-5 h-5 hover:scale-110 transition" />
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <Github className="text-gray-300 w-5 h-5 hover:scale-110 transition" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="py-8 bg-black text-center text-white">
        <p>&copy; 2025 Fit AI Trainer. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
