"use client";
import { useEffect, useRef, useState } from "react";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { SendHorizonalIcon } from "lucide-react";
import lottie from "lottie-web";
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I'm FemiCa, your wellbeing assistant. How can I help you today?`,
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" }, // Temporary placeholder for assistant response
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
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
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
  return (
    <div className="p-10 flex h-screen w-full bg-black">
      <div className="flex flex-col ml-20 justify-center items-center">
        <h1 className="text-white font-extrabold text-2xl">
          Welcome to <span className="text-red-400">FemiCa.ai</span>{" "}

        </h1>
        <p className="text-white mt-4">Empowering Women, One Care at a Time</p>
        <iframe
          className="mt-8 "
          height={400}
          width={400}
          src="https://lottie.host/embed/2e0440be-e82f-425f-9654-e4b5feab9744/ixZ6tZNzYq.json"
        ></iframe>
      </div>

      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className=" flex flex-col w-[500px] h-[700px] border border-gray-700 rounded-lg p-4 space-y-4 bg-gray-800 shadow-md">
          <div className=" flex flex-col space-y-2 flex-grow overflow-auto max-h-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex p-2 ${
                  message.role === "assistant" ? "justify-start mr-3" : "justify-end ml-3"
                }`}
              >
                <div
                  className={`${
                    message.role === "assistant" ? "bg-red-400" : "bg-blue-500"
                  } text-white rounded-lg p-3`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Message"
              className="w-full p-2 border border-gray-600 rounded text-white bg-gray-900"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white rounded px-5 py-2"
              onClick={sendMessage}
            >
              <SendHorizonalIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
