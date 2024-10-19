import React from "react";
import { MacbookScroll } from "./macbook-scroll";
import Link from "next/link";

export function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacbookScroll
        title={
          <span>
            FemiCa.ai: Your AI-powered wellbeing assistant. <br /> Empowering women, one conversation at a time.
          </span>
        }
        badge={
          <Link href="https://yourwebsite.com">
            <Badge className="h-10 w-10 transform -rotate-12" />
          </Link>
        }
        src={`/your-demo-image.webp`}
        showGradient={false}
      />
    </div>
  );
}

// Your logo or badge component
const Badge = ({ className }) => {
  // Replace this with your own logo or badge SVG
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="12" fill="#FF4081" />
      <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" />
    </svg>
  );
};
