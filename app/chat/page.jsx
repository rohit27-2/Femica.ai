"use client";
import { useEffect, useRef, useState } from "react";
import { SendHorizonalIcon, Menu, ImageIcon, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
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
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && (message.trim() || selectedImage)) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    const messageToSend = [];
    if (selectedImage) {
      messageToSend.push({
        role: "user",
        content: [
          { type: "text", text: message || "What do you think about this image?" },
          { type: "image_url", image_url: selectedImage },
        ],
      });
    } else {
      messageToSend.push({
        role: "user",
        content: message,
      });
    }

    setMessage("");
    setIsLoading(true);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessages((prev) => [
      ...prev,
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

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = result;
        return updated;
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
 tify-b   <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-300 hover:text-white">
              About
            </Link>
            <Link href="/services" className="text-gray-300 hover:text-white">
              Services
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white">
              Contact
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row-reverse mt-14">
        {/* Chat Box */}
        <div className="flex flex-col flex-1 p-4 space-y-4">
          <div className="flex-1 space-y-4 overflow-auto max-h-[70vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex flex-col",
                  msg.role === "assistant" ? "items-start" : "items-end"
                )}
              >
                {msg.image && (
                  <Image
                    src={msg.image}
                    alt="User Upload"
                    width={250}
                    height={200}
                    className="rounded-lg border border-gray-700 mb-1"
                  />
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-sm",
                    msg.role === "assistant"
                      ? "bg-gray-800 text-white"
                      : "bg-blue-600 text-white"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center space-x-4">
            <textarea
              className="flex-1 bg-gray-800 text-white rounded-lg p-3 outline-none"
              placeholder="Type your message..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="p-3 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              disabled={isLoading}
              onClick={sendMessage}
            >
              <SendHorizonalIcon className="h-5 w-5" />
            </button>
            <label className="p-3 rounded-lg bg-gray-700 text-white cursor-pointer">
              <ImageIcon className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </label>
          </div>
          {imagePreview && (
            <div className="flex items-center space-x-3 mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-lg object-cover"
              />
              <button
                className="p-2 rounded-lg bg-red-600 text-white"
                onClick={removeImage}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {/* Menu for Mobile */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-0 right-0 w-64 bg-gray-800/95 h-full border-l border-gray-700 shadow-lg z-40">
            <button
              className="absolute top-3 right-3 p-2 text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mt-14 flex flex-col items-center space-y-6">
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white">
                Services
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-3">
        &copy; 2024 FemiCa.ai. All rights reserved.
      </footer>
    </div>
  );
}
