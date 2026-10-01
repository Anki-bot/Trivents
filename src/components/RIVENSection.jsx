"use client";

import { useState } from "react";
import {
  Bot,
  Globe,
  Paperclip,
  Sparkles,
  ArrowUp,
  X,
} from "lucide-react";


export default function RIVENSection() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim();

    if (!trimmed || isThinking) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setValue("");
    setIsThinking(true);

    // Temporary frontend response.
    // Replace this later with your real RIVEN API call.
    setTimeout(() => {
      const RIVENMessage = {
        id: Date.now() + 1,
        role: "RIVEN",
        content:
          "RIVEN is ready. The RAG backend will be connected here later.",
      };

      setMessages((current) => [
        ...current,
        RIVENMessage,
      ]);

      setIsThinking(false);
    }, 900);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
  <section
    id="RIVEN"
    className="RIVEN-section"
  >
    {/* Ambient glow */}
    <div
      className="RIVEN-ambient"
      aria-hidden="true"
    />

    <div className="RIVEN-content">

      {/* Small label */}
      <div className="RIVEN-kicker">
        <Sparkles className="h-3.5 w-3.5" />
        <span>TRIVENTS INTELLIGENCE</span>
      </div>

      <p className="RIVEN-description">
        Your intelligent interface for
        everything happening across
        the Trivents universe.
      </p>

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="RIVEN-conversation">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "RIVEN-message-row user"
                  : "RIVEN-message-row"
              }
            >
              {message.role === "RIVEN" ? (
                <div className="RIVEN-response">
                  <div className="RIVEN-response-icon">
                    <Bot className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="RIVEN-response-label">
                      RIVEN
                    </div>

                    <p>{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="RIVEN-user-message">
                  {message.content}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="RIVEN-message-row">
              <div className="RIVEN-response">
                <div className="RIVEN-response-icon">
                  <Bot className="h-4 w-4" />
                </div>

                <div>
                  <div className="RIVEN-response-label">
                    RIVEN
                  </div>

                  <div className="RIVEN-thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attachment */}
      {attachment && (
        <div className="RIVEN-attachment-wrap">
          <div className="RIVEN-attachment">
            <Paperclip className="h-3.5 w-3.5" />

            <span>{attachment.name}</span>

            <button
              type="button"
              onClick={removeAttachment}
              aria-label="Remove attachment"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main input */}
      <div className="RIVEN-input-shell">
        <div className="RIVEN-input-label">
          <Sparkles className="h-3 w-3" />
          ASK RIVEN
        </div>

        <textarea
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask RIVEN anything..."
          rows={3}
          className="RIVEN-textarea"
          aria-label="Ask RIVEN"
        />

        <div className="RIVEN-controls">
          <div className="RIVEN-controls-left">

            <label
              className="RIVEN-icon-button"
              title="Attach file"
            >
              <input
                type="file"
                className="hidden"
                accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
              />

              <Paperclip className="h-4 w-4" />
            </label>

            <button
              type="button"
              onClick={() =>
                setShowSearch(
                  (current) => !current
                )
              }
              className={
                showSearch
                  ? "RIVEN-search active"
                  : "RIVEN-search"
              }
            >
              <Globe className="h-4 w-4" />

              <span>
                {showSearch
                  ? "Web Search"
                  : "Search Off"}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !value.trim() ||
              isThinking
            }
            className={
              value.trim() && !isThinking
                ? "RIVEN-send active"
                : "RIVEN-send"
            }
            aria-label="Send to RIVEN"
            title="Send"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="RIVEN-hint">
        ENTER TO SEND
        <span>•</span>
        SHIFT + ENTER FOR NEW LINE
      </div>

    </div>
  </section>
);
}