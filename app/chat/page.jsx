"use client";
import { useEffect, useRef, useState } from "react";
import { SendHorizonalIcon, Menu, ImageIcon, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import Image from "next/image";
import { cn } from "@/lib/utils";

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
        if (e.key === 'Enter' && !e.shiftKey && (message.trim() !== '' || selectedImage)) {
            e.preventDefault();
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
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-gray-800/95 backdrop-blur-md px-4 py-3 border-b border-gray-700">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-white text-xl font-bold">
                        FemiCa<span className="text-red-400">.ai</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                        <Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
                        <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/98 flex flex-col items-center justify-center space-y-8">
                    <button
                        className="absolute top-4 right-4 text-white p-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <Link href="/about" className="text-white text-xl" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link href="/services" className="text-white text-xl" onClick={() => setIsMenuOpen(false)}>Services</Link>
                    <Link href="/contact" className="text-white text-xl" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <div className="mt-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 flex flex-col md:flex-row pt-16">
                {/* Left section with animation */}
                <div className="w-full md:w-1/3 p-4 hidden md:flex flex-col justify-center items-center">
                    <iframe
                        className="w-full max-w-md aspect-square"
                        src="https://lottie.host/embed/2e0440be-e82f-425f-9654-e4b5feab9744/ixZ6tZNzYq.json"
                    />
                </div>

                {/* Chat section */}
                <div className="flex-1 p-4 flex flex-col h-[calc(100vh-4rem)]">
                    <div className="flex-1 flex flex-col bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                        {/* Messages container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex",
                                        message.role === "assistant" ? "justify-start" : "justify-end"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] sm:max-w-[70%] rounded-lg p-3 break-words",
                                            message.role === "assistant" 
                                                ? "bg-red-400 text-white" 
                                                : "bg-blue-500 text-white"
                                        )}
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
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "400ms" }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input section */}
                        <div className="p-4 border-t border-gray-700">
                            {imagePreview && (
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-32 rounded-lg"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 transition-colors"
                                    >
                                        <X size={14} className="text-white" />
                                    </button>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
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
                                    className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon size={20} />
                                </button>
                                <button
                                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    onClick={sendMessage}
                                >
                                    <SendHorizonalIcon size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}