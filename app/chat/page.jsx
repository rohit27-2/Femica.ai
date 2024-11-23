"use client";
import { useEffect, useRef, useState } from "react";
import { SendHorizonalIcon, Menu, ImageIcon, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import lottie from "lottie-web";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hey, How can I help you today?`,
        },
    ]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const animationContainer = useRef(null);

    useEffect(() => {
        lottie.loadAnimation({
            container: animationContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "animation.json",
        });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setImagePreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && (message.trim() !== '' || selectedImage)) {
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (message.trim() === "" && !selectedImage) return;

        const messageToSend = [];
        
        if (selectedImage) {
            messageToSend.push({
                role: "user",
                content: [
                    { type: "text", text: message || "What do you think about this image?" },
                    { type: "image_url", image_url: selectedImage }
                ]
            });
        } else {
            messageToSend.push({
                role: "user",
                content: message
            });
        }

        setMessage("");
        setIsLoading(true);
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: message, image: imagePreview },
            { role: "assistant", content: "" },
        ]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([...messages, ...messageToSend]),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value);
            }

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].content = result;
                return updatedMessages;
            });
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style jsx global>{`
                /* Scrollbar styles */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: #4b5563;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }

                /* For Firefox */
                * {
                    scrollbar-width: thin;
                    scrollbar-color: #4b5563 #1f2937;
                }

                /* Typing animation */
                @keyframes blink {
                    0% { opacity: .2; }
                    20% { opacity: 1; }
                    100% { opacity: .2; }
                }
                .typing span {
                    animation-name: blink;
                    animation-duration: 1.4s;
                    animation-iteration-count: infinite;
                    animation-fill-mode: both;
                }
                .typing span:nth-child(2) {
                    animation-delay: .2s;
                }
                .typing span:nth-child(3) {
                    animation-delay: .4s;
                }

                /* Add styles for the navbar */
                .navbar {
                    background-color: rgba(17, 24, 39, 0.8);
                    backdrop-filter: blur(10px);
                }

                html, body {
                    height: 100%;
                    overflow: hidden;
                }
            `}</style>

            <div className="flex flex-col h-screen bg-black">
                {/* Navbar */}
                <nav className="navbar w-full z-10 px-4 py-2 flex justify-between items-center">
                    <Link href="/" className="text-white text-xl font-bold">
                        FemiCa<span className="text-red-400">.ai</span>
                    </Link>
                    <div className="hidden md:flex space-x-4">
                        <Link href="/about" className="text-white hover:text-red-400">About</Link>
                        <Link href="/services" className="text-white hover:text-red-400">Services</Link>
                        <Link href="/contact" className="text-white hover:text-red-400">Contact</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <UserButton afterSignOutUrl="/" />
                        <button
                            className="md:hidden text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu />
                        </button>
                    </div>
                </nav>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-20 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center">
                        <button
                            className="absolute top-4 right-4 text-white"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Close
                        </button>
                        <Link href="/about" className="text-white text-xl my-2" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link href="/services" className="text-white text-xl my-2" onClick={() => setIsMenuOpen(false)}>Services</Link>
                        <Link href="/contact" className="text-white text-xl my-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </div>
                )}

                {/* Main content */}
                <div className="flex flex-col xl:flex-row flex-grow overflow-hidden">
                    <div className="flex flex-col justify-center items-center xl:items-start w-full xl:w-1/3 p-4 xl:p-8">
                        <div className="mt-8 w-full max-w-md aspect-square">
                            <iframe
                                className="w-full h-full"
                                src="https://lottie.host/embed/2e0440be-e82f-425f-9654-e4b5feab9744/ixZ6tZNzYq.json"
                            ></iframe>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full xl:w-2/3 p-4 xl:p-8">
                        <div className="flex flex-col w-full h-full max-w-3xl border border-gray-700 rounded-lg p-4 space-y-4 bg-gray-800 shadow-md">
                            <div className="flex flex-col space-y-2 flex-grow overflow-auto pr-2">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex p-2 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                                    >
                                        <div
                                            className={`${message.role === "assistant" ? "bg-red-400" : "bg-blue-500"} 
                                                text-white rounded-lg p-3 max-w-[80%] break-words`}
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

                            {imagePreview && (
                                <div className="relative inline-block">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-h-32 rounded-lg"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Message"
                                    className="w-full p-2 border border-gray-600 rounded text-white bg-gray-900"
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
                                    className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon size={20} />
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                                    onClick={sendMessage}
                                >
                                    <SendHorizonalIcon size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}