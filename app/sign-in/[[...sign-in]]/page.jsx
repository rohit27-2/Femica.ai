import { SignIn } from '@clerk/nextjs'
import { BackgroundGradientAnimation } from '@/components/ui/gradient-bg'
import Link from 'next/link'

export default function Page() {
  return (
    <section className="bg-black text-white min-h-screen overflow-hidden">
      <BackgroundGradientAnimation>
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
            <div className="max-w-md text-center lg:text-left">
              <Link href="/" className="inline-block mb-8">
                <span className="sr-only">Home</span>
                <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl mb-4">
                  FemiCa.ai 
                </h1>

              </Link>



              <p className="leading-relaxed text-gray-300">
                Sign in to access your personalized AI-powered wellbeing assistant, designed to empower women through care and support.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-md">
              <SignIn />
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  );
}
