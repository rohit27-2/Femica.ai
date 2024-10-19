"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BackgroundGradientAnimation } from '@/components/ui/gradient-bg';
import { IconMouse } from '@tabler/icons-react';

function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check authentication status here
    // For now, we'll just set it to false
    setIsSignedIn(false);
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            FemiCa.ai
          </p>
        </div>
        <button 
          onClick={scrollDown}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-200 transition-colors z-50"
        >
          <span>Scroll down</span>
          <IconMouse size={20} />
        </button>
      </BackgroundGradientAnimation>

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-16">
          <section className="mb-12">
            <h2 className="text-4xl font-semibold mb-6">Welcome to FemiCa.ai</h2>
            <p className="mb-4 text-xl">
              FemiCa.ai is your personal wellbeing assistant, designed to empower women through personalized care and support.
            </p>
            <p className="mb-4 text-xl">
              Our AI-powered chatbot is here to listen, provide guidance, and offer resources tailored to your unique needs.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
            <ul className="list-disc list-inside text-xl space-y-4">
              <li>24/7 emotional support and guidance</li>
              <li>Personalized wellness recommendations</li>
              <li>Access to women&apos;s health resources</li>
              <li>Confidential and judgment-free conversations</li>
            </ul>
          </section>

          <div className="flex justify-center space-x-4">
            {isSignedIn ? (
              <Link href="/chat" className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors inline-block">
                Start Chatting
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="bg-red-400 text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-red-500 transition-colors inline-block">
                  Sign In
                </Link>
                <Link href="/sign-up" className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-xl hover:bg-green-600 transition-colors inline-block">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
