"use client";
import { useEffect, useRef, useState } from "react";
import { SendHorizonalIcon, Menu, ImageIcon, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import lottie from "lottie-web";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
    // ... (keep all the existing state and functions)

    return (
        <>
            <style jsx global>{`
                /* Existing styles */
                
                /* Additional mobile optimization styles */
                @media (max-width: 640px) {
                    .message-bubble {
                        max-width: 85% !important;
                        font-size: 0.95rem;
                    }
                    
                    .input-container {
                        padding: 8px;
                    }
                    
                    .chat-container {
                        height: calc(100vh - 180px);
                    }
                }
            `}</style>

            <div className="flex flex-col h-screen bg-black">
                {/* Navbar - Simplified for mobile */}
                <nav className="navbar w-full z-10 px-3 py-2 flex justify-between items-center fixed top-0">
                    <Link href="/" className="text-white text-lg font-bold">
                        FemiCa<span className="text-red-400">.ai</span>
                    </Link>
                    <div className="hidden md:flex space-x-4">
                        <Link href="/about" className="text-white hover:text-red-400">About</Link>
                        <Link href="/services" className="text-white hover:text-red-400">Services</Link>
                        <Link href="/contact" className="text-white hover:text-red-400">Contact</Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserButton afterSignOutUrl="/" />
                        <button
                            className="md:hidden text-white p-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </nav>

                {/* Mobile menu - Improved animation */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-20 bg-gray-800 bg-opacity-95 flex flex-col items-center justify-center animate-fade-in">
                        <button
                            className="absolute top-4 right-4 text-white p-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        <div className="flex flex-col items-center space-y-6">
                            <Link href="/about" className="text-white text-xl hover:text-red-400 transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
                            <Link href="/services" className="text-white text-xl hover:text-red-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Services</Link>
                            <Link href="/contact" className="text-white text-xl hover:text-red-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                        </div>
                    </div>
                )}

                {/* Main content - Mobile optimized */}
                <div className="flex flex-col xl:flex-row flex-grow overflow-hidden pt-14">
                    {/* Animation container - Hidden on small screens */}
                    <div className="hidden sm:flex flex-col justify-center items-center xl:items-start w-full xl:w-1/3 p-2 xl:p-8">
                        <div className="mt-4 w-full max-w-md aspect-square">
                            <iframe
                                className="w-full h-full"
                                src="https://lottie.host/embed/2e0440be-e82f-425f-9654-e4b5feab9744/ixZ6tZNzYq.json"
                            ></iframe>
                        </div>
                    </div>

                    {/* Chat container - Full width on mobile */}
                    <div className="flex flex-col items-center justify-end w-full xl:w-2/3 p-2 sm:p-4 xl:p-8">
                        <div className="flex flex-col w-full h-full max-w-3xl border border-gray-700 rounded-lg p-2 sm:p-4 space-y-4 bg-gray-800 shadow-md">
                            {/* Messages container */}
                            <div className="flex flex-col space-y-2 flex-grow overflow-auto pr-2 chat-container">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex p-2 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                                    >
                                        <div
                                            className={`message-bubble ${
                                                message.role === "assistant" ? "bg-red-400" : "bg-blue-500"
                                            } text-white rounded-lg p-2 sm:p-3 max-w-[80%] break-words`}
                                        >
                                            {message.image && (
                                                <div className="mb-2">
                                                    <Image
                                                        height={200}
                                                        width={200}
                                                        alt="Uploaded content"
                                                        src={message.image}
                                                        className="max-w-full rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            {message.content}
                                            {message.role === "assistant" && message.content === "" && isLoading && (
                                                <div className="typing">
                                                    <span>.</span><span>.</span><span>.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Image preview - Optimized for mobile */}
                            {imagePreview && (
                                <div className="relative inline-block">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-h-24 sm:max-h-32 rounded-lg"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>
                            )}

                            {/* Input container - Mobile optimized */}
                            <div className="flex space-x-2 input-container">
                                <input
                                    type="text"
                                    placeholder="Message"
                                    className="w-full p-2 border border-gray-600 rounded text-white bg-gray-900 text-sm sm:text-base"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 text-white rounded px-3 py-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon size={18} />
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-2"
                                    onClick={sendMessage}
                                >
                                    <SendHorizonalIcon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}