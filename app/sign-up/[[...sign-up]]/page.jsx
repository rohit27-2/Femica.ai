import { SignUp } from '@clerk/nextjs'
import { BackgroundGradientAnimation } from '@/components/ui/gradient-bg'
import Link from 'next/link'

export default function Page() {
  return (
    <section className="bg-black text-white min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation />
      </div>
      <div className="relative z-10 flex flex-col justify-around md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="max-w-md text-center">
            <Link href="/" className="inline-block mb-2 md:mb-2">
              <span className="sr-only">Home</span>
              <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
                FemiCa.ai 
              </h1>
            </Link>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">
              Sign in to access your personalized AI-powered wellbeing assistant, designed to empower women through care and support.
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <SignUp />
          </div>
        </div>
      </div>

    </section>
  );
}
