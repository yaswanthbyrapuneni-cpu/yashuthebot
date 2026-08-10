import { useState } from "react";
import { submitFeedback } from "../services/api";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  gender: string;
  selectedGarment: string;
}

const EMOJIS = [
  { emoji: "😞", score: 1, label: "Bad" },
  { emoji: "😄", score: 3, label: "Good" },
  { emoji: "😍", score: 5, label: "Excellent" },
];

export default function FeedbackModal({
  isOpen,
  onClose,
  sessionId,
  gender,
  selectedGarment,
}: FeedbackModalProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleEmojiSelect = async (emoji: string, score: number) => {
    if (submitting || showThankYou) return;
    setSelectedEmoji(emoji);
    setSubmitting(true);

    try {
      await submitFeedback({
        session_id: sessionId,
        gender,
        selected_garment: selectedGarment,
        feedback_emoji: emoji,
        feedback_score: score,
        feedback_status: "submitted",
      });
      
      setShowThankYou(true);
      setTimeout(() => {
        setSubmitting(false);
        setShowThankYou(false);
        setSelectedEmoji(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Feedback submit failed", err);
      setSubmitting(false);
      onClose();
    }
  };

  const handleSkip = async () => {
    if (submitting || showThankYou) return;
    setSubmitting(true);

    try {
      await submitFeedback({
        session_id: sessionId,
        gender,
        selected_garment: selectedGarment,
        feedback_emoji: null,
        feedback_score: null,
        feedback_status: "skipped",
      });
    } catch (err) {
      console.error("Skip feedback submit failed", err);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-2xl text-center flex flex-col gap-6 items-center transform transition-all duration-300 scale-100">
        
        {showThankYou ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3 animate-scale-up">
            <span className="text-6xl animate-bounce">{selectedEmoji}</span>
            <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              {EMOJIS.find(e => e.emoji === selectedEmoji)?.label}!
            </h2>
            <p className="text-gray-400 font-bold text-sm">❤️ Thank You!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-indigo-600 font-extrabold text-xs tracking-widest uppercase">Feedback</span>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                ✨ How was your Virtual Try-On Experience?
              </h2>
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex justify-center items-center gap-6 w-full px-2">
                {EMOJIS.map(({ emoji, score, label }) => (
                  <button
                    key={score}
                    onClick={() => handleEmojiSelect(emoji, score)}
                    disabled={submitting}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-transparent hover:border-indigo-100 hover:scale-110 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer ${
                      selectedEmoji === emoji ? "scale-115 border-indigo-200 bg-indigo-50" : ""
                    }`}
                  >
                    <span className="text-5xl">{emoji}</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSkip}
              disabled={submitting}
              className="text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors tracking-wide cursor-pointer py-1 px-4 hover:bg-gray-50 rounded-full border-0 bg-transparent"
            >
              Skip
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
