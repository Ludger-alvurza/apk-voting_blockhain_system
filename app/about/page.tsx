"use client";

import { useState } from "react";
import {
  ArrowRight,
  Database,
  Shield,
  Cpu,
  Globe,
  Users,
  Lock,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Distributed Ledger",
      icon: <Database className="h-10 w-10 text-blue-500" />,
      description:
        "Our blockchain system uses distributed ledger technology to ensure that all transactions are transparent, immutable, and accessible to all authorized participants in the network.",
    },
    {
      title: "Smart Contracts",
      icon: <Cpu className="h-10 w-10 text-blue-500" />,
      description:
        "Automate your business processes with self-executing contracts. Smart contracts automatically enforce agreements when predefined conditions are met, eliminating intermediaries.",
    },
    {
      title: "Enhanced Security",
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      description:
        "With cryptographic security at its core, our blockchain system provides unmatched protection against fraud, tampering, and data breaches, ensuring your business data remains secure.",
    },
    {
      title: "Global Accessibility",
      icon: <Globe className="h-10 w-10 text-blue-500" />,
      description:
        "Access your blockchain network from anywhere in the world. Our system provides seamless global connectivity while maintaining rigorous security standards.",
    },
    {
      title: "Decentralized Network",
      icon: <Users className="h-10 w-10 text-blue-500" />,
      description:
        "Eliminate single points of failure with our decentralized architecture. The distributed nature of our blockchain ensures high availability and resilience.",
    },
    {
      title: "Privacy Controls",
      icon: <Lock className="h-10 w-10 text-blue-500" />,
      description:
        "Advanced privacy controls allow you to determine who can access specific data, striking the perfect balance between transparency and confidentiality.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      {" "}
      {/* Added pt-16 for header space */}
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-60"></div>
          <div className="h-full w-full bg-[url('/api/placeholder/1600/900')] bg-cover bg-center opacity-30"></div>
        </div>

        <div className="relative z-10 px-6 py-16 md:py-20 mx-auto max-w-7xl">
          {" "}
          {/* Reduced padding */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Revolutionizing Trust in Digital Systems
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Our blockchain system creates a new paradigm of trust, security,
              and efficiency for businesses and organizations of all sizes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div className="py-16 px-6 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Our Blockchain System
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Built for the modern enterprise, our blockchain solution combines
            cutting-edge technology with intuitive design to deliver a platform
            thats both powerful and accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              Our Vision
            </h3>
            <p className="text-gray-300 mb-6">
              We envision a world where trust is built into digital systems by
              design, not added as an afterthought. A world where businesses can
              transact with certainty, share data with confidence, and build
              relationships on the foundation of verifiable trust.
            </p>
            <p className="text-gray-300 mb-6">
              Our blockchain system makes this vision a reality by providing the
              infrastructure that enables transparent, secure, and efficient
              digital interactions between organizations, customers, and
              partners.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-blue-900 bg-opacity-40 px-6 py-4 rounded-lg">
                <p className="text-4xl font-bold text-blue-400">99.9%</p>
                <p className="text-gray-400">Uptime Reliability</p>
              </div>
              <div className="bg-blue-900 bg-opacity-40 px-6 py-4 rounded-lg">
                <p className="text-4xl font-bold text-blue-400">500+</p>
                <p className="text-gray-400">Enterprise Clients</p>
              </div>
              <div className="bg-blue-900 bg-opacity-40 px-6 py-4 rounded-lg">
                <p className="text-4xl font-bold text-blue-400">5B+</p>
                <p className="text-gray-400">Transactions Processed</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-lg overflow-hidden border-2 border-blue-500 shadow-2xl shadow-blue-500/20">
              <Image
                src="/images/about2.png"
                alt="Blockchain Technology"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-xl">
              <p className="text-lg font-semibold">Founded in 2025</p>
              <p>Leading the blockchain revolution</p>
            </div>
          </div>
        </div>
      </div>
      {/* Key Features Section */}
      <div className="py-14 px-6 bg-gray-800 bg-opacity-50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our blockchain system offers a comprehensive suite of features
              designed to meet the needs of modern enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="bg-gray-800 bg-opacity-70 p-8 rounded-xl border border-gray-700 h-full">
                {features[activeFeature].icon}
                <h3 className="text-2xl font-semibold mt-6 mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-300">
                  {features[activeFeature].description}
                </p>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      activeFeature === index
                        ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                        : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex flex-col items-center text-center">
                      {feature.icon}
                      <h4 className="mt-4 font-medium">{feature.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Technology Stack */}
      <div className="py-14 px-6 mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Technology Stack
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Powered by cutting-edge technologies to deliver unmatched
            performance, security, and scalability.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            "Consensus Algorithms",
            "Cryptographic Security",
            "Smart Contracts",
            "Distributed Storage",
            "P2P Networking",
            "API Integration",
            "Data Sharding",
            "Cross-Chain Communication",
          ].map((tech, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 text-center transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-900 bg-opacity-30 rounded-full">
                <div className="w-10 h-10 bg-blue-500 bg-opacity-60 rounded-full"></div>
              </div>
              <h3 className="font-medium">{tech}</h3>
            </div>
          ))}
        </div>
      </div>
      {/* Call to Action */}
      <div className="py-12 px-6 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Join the hundreds of forward-thinking organizations that have
            already embraced our blockchain solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium flex items-center">
              Request a Demo <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-gray-500">
            <p>© 2025 Blockchain System. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-3">
              <a href="#" className="hover:text-gray-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-300">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
