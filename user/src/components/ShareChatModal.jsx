import { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";

const SHARE_OPTIONS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500 hover:bg-green-600",
    getUrl: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    color: "bg-blue-500 hover:bg-blue-600",
    getUrl: (text) =>
      `mailto:?subject=${encodeURIComponent("Tourex Travel Chat")}&body=${encodeURIComponent(text)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: Send,
    color: "bg-sky-500 hover:bg-sky-600",
    getUrl: (text) =>
      `https://t.me/share/url?text=${encodeURIComponent(text)}`,
  },
];

export default function ShareChatModal({ isOpen, onClose, shareText }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!isOpen || !shareText) return;

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    };

    setCopied(false);
    copyToClipboard();
  }, [isOpen, shareText]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShareOption = (option) => {
    window.open(option.getUrl(shareText), "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Tourex Travel Chat",
        text: shareText,
      });
      onClose();
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Native share failed:", err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Share chat</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div
            className={`flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg text-sm ${
              copied
                ? "bg-green-50 text-green-700"
                : "bg-gray-50 text-gray-600"
            }`}
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-600 shrink-0" />
                <span>Messages copied to clipboard</span>
              </>
            ) : (
              <span>Copying messages...</span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Share your conversation via:
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {SHARE_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleShareOption(option)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${option.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy again"}
            </button>

            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                <Share2 size={16} />
                More apps...
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Only chat messages are shared — not the full interface
          </p>
        </div>
      </div>
    </div>
  );
}
