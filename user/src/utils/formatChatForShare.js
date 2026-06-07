const stripMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[-•*]\s+/gm, "• ")
    .trim();
};

const getSenderLabel = (sender) => {
  if (sender === "user") return "You";
  if (sender === "ai") return "Tourex AI";
  return "System";
};

export const formatChatMessagesForShare = (messages) => {
  const shareableMessages = messages.filter(
    (msg) => msg.sender === "user" || msg.sender === "ai"
  );

  if (shareableMessages.length === 0) return "";

  const header = "Tourex Travel Chat\n" + "─".repeat(24);
  const body = shareableMessages
    .map((msg) => {
      const label = getSenderLabel(msg.sender);
      const timestamp = msg.timestamp ? ` (${msg.timestamp})` : "";
      const text = stripMarkdown(msg.text);
      return `${label}${timestamp}:\n${text}`;
    })
    .join("\n\n");

  const footer = "\n\n─\nShared from Tourex — Plan your Pakistan travel";

  return `${header}\n\n${body}${footer}`;
};
