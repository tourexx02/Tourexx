// import React, { useRef, useEffect } from "react";
import { MessageCircle, Plus, Smile, Paperclip, Send, X } from "lucide-react";
import ai from "../assets/AI.svg";
import chat from "../assets/Chat.png";

const ChatSection = () => {
  return (
    <section className="py-20 px-5 bg-[#F4EFEB]">
      <div className="max-w-[1200px] mx-auto flex gap-12 items-center lg:flex-row flex-col animate-fade-in-up">
        {/* Left Section */}
        <div className="flex-1 lg:pr-8 lg:text-left text-center animate-slide-in-left">
          <h2 className="font-['Open_Sans',sans-serif] text-[3.5rem] lg:text-[3.5rem] md:text-[2.5rem] sm:text-[1.8rem] font-bold text-[#4F7F96] mb-5 leading-[1.2] animate-slide-in-left-delayed">
            Start chatting
            <br />
            with us.
          </h2>
          <p className="font-['Playfair_Display',serif] text-xl lg:text-xl md:text-lg sm:text-base leading-[1.6] text-[#383737] mb-8 animate-slide-in-left-delayed-2">
            Ask us for suggestions for any destination or ask us for an entire
            itinerary. Be as specific as you can about the types of experiences
            that you like.
          </p>
          <a href="/chat">
            <button className="font-['Inter',sans-serif] text-base font-semibold bg-[#2F4157] text-white border-none rounded-md px-7 py-[14px] cursor-pointer flex items-center gap-2 lg:mx-0 mx-auto transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-slide-in-left-delayed-3">
              <img src={ai} alt="ai icon" size={19} />
              Generate itinerary
            </button>
          </a>
        </div>

        {/* Right Section */}
        <div className="flex-1 w-full animate-slide-in-right">
          <div className="flex-1 flex justify-center items-center">
            <img
              src={chat}
              alt="chat"
              className="max-w-full h-auto rounded-xl block"
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateX(50px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fadeInHeight {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-slide-in-left-delayed {
          animation: slideInLeft 0.5s ease-out 0.2s both;
        }

        .animate-slide-in-left-delayed-2 {
          animation: slideInLeft 0.5s ease-out 0.4s both;
        }

        .animate-slide-in-left-delayed-3 {
          animation: slideInLeft 0.5s ease-out 0.6s both;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out 0.2s both;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }

        .animate-message-slide-in {
          animation: messageSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-fade-in-height {
          animation: fadeInHeight 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out both;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .animate-slide-in-left,
          .animate-slide-in-right {
            animation: fadeInUp 0.5s ease-out;
          }
        }
      `}</style>
    </section>
  );
};

export default ChatSection;
