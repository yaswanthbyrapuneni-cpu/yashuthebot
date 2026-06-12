import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Frown, Meh, Smile, XCircle } from "lucide-react";

interface EmotionValidationPopupProps {
  isOpen: boolean;
  productName: string;
  samples: any[];
  emotionPercentages: Record<string, number>;
  uniqueEmotionCount: number;
  onConfirm: (response: boolean | string) => void;
}

// Emotion icon mapping
const emotionIcons = {
  happy: Smile,
  neutral: Meh,
  sad: Frown,
};

// Emotion color mapping
const emotionColors = {
  happy: 'text-green-600',
  neutral: 'text-yellow-600',
  sad: 'text-blue-600',
};

export function EmotionValidationPopup({
  isOpen,
  productName,
  emotionPercentages,
  uniqueEmotionCount,
  onConfirm,
}: EmotionValidationPopupProps) {
  if (!isOpen) return null;

  // Determine which scenario to show
  const showEmotionSelection = uniqueEmotionCount >= 3;

  // Get dominant emotion for display
  const dominantEmotion = Object.entries(emotionPercentages).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-11/12 max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        {showEmotionSelection ? (
          // SCENARIO 2: 3 emotions detected - Ask user to select their actual emotion
          <>
            <div className="text-center mb-6">
              <h3 className="font-['Playfair_Display'] text-3xl text-[#7c563d] mb-2">
                How did you feel?
              </h3>
              <p className="font-['Montserrat'] text-gray-600 text-sm">
                We detected multiple emotions while you tried on {productName}
              </p>
            </div>

            {/* Emotion Percentages Display */}
            <div className="mb-8 space-y-3">
              {Object.entries(emotionPercentages)
                .sort(([, a], [, b]) => b - a)
                .map(([emotion, percentage]) => {
                  const Icon = emotionIcons[emotion as keyof typeof emotionIcons];
                  const colorClass = emotionColors[emotion as keyof typeof emotionColors];
                  
                  return (
                    <div key={emotion} className="flex items-center gap-3">
                      {Icon && <Icon className={`w-6 h-6 ${colorClass}`} />}
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-['Montserrat'] text-sm font-medium capitalize">
                            {emotion}
                          </span>
                          <span className="font-['Montserrat'] text-sm text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              emotion === 'happy' ? 'bg-green-500' :
                              emotion === 'neutral' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="text-center mb-6">
              <p className="font-['Montserrat'] text-gray-700 text-lg font-medium mb-4">
                Which emotion best describes how you felt?
              </p>
            </div>

            {/* Emotion Selection Buttons */}
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(emotionPercentages).map((emotion) => {
                const Icon = emotionIcons[emotion as keyof typeof emotionIcons];
                const colorClass = emotionColors[emotion as keyof typeof emotionColors];
                
                return (
                  <button
                    key={emotion}
                    onClick={() => onConfirm(emotion)}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-[#7c563d] hover:bg-[#fcf5f1] transition-all duration-200 group"
                  >
                    {Icon && (
                      <Icon className={`w-12 h-12 ${colorClass} group-hover:scale-110 transition-transform`} />
                    )}
                    <span className="font-['Montserrat'] text-lg font-medium capitalize">
                      {emotion}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // SCENARIO 1: 1-2 emotions detected - Ask Yes/No validation
          <>
            <div className="text-center mb-6">
              <h3 className="font-['Playfair_Display'] text-3xl text-[#7c563d] mb-2">
                Emotion Detected
              </h3>
              <p className="font-['Montserrat'] text-gray-600 text-sm">
                While trying on {productName}
              </p>
            </div>

            {/* Emotion Percentages Display */}
            <div className="mb-8 space-y-3">
              {Object.entries(emotionPercentages)
                .sort(([, a], [, b]) => b - a)
                .map(([emotion, percentage]) => {
                  const Icon = emotionIcons[emotion as keyof typeof emotionIcons];
                  const colorClass = emotionColors[emotion as keyof typeof emotionColors];
                  
                  return (
                    <div key={emotion} className="flex items-center gap-3">
                      {Icon && <Icon className={`w-6 h-6 ${colorClass}`} />}
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-['Montserrat'] text-sm font-medium capitalize">
                            {emotion}
                          </span>
                          <span className="font-['Montserrat'] text-sm text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              emotion === 'happy' ? 'bg-green-500' :
                              emotion === 'neutral' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Dominant Emotion Display */}
            <div className="text-center mb-6 p-6 bg-[#fcf5f1] rounded-2xl">
              <p className="font-['Montserrat'] text-gray-700 text-sm mb-2">
                Our AI detected you felt mostly
              </p>
              <div className="flex items-center justify-center gap-2">
                {(() => {
                  const Icon = emotionIcons[dominantEmotion as keyof typeof emotionIcons];
                  const colorClass = emotionColors[dominantEmotion as keyof typeof emotionColors];
                  return Icon ? <Icon className={`w-8 h-8 ${colorClass}`} /> : null;
                })()}
                <span className="font-['Playfair_Display'] text-3xl text-[#7c563d] capitalize">
                  {dominantEmotion}
                </span>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="font-['Montserrat'] text-gray-700 text-lg font-medium">
                Is this accurate?
              </p>
            </div>

            {/* Yes/No Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => onConfirm(true)}
                className="py-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-['Montserrat'] text-lg font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                <CheckCircle className="w-6 h-6" />
                Yes, Accurate
              </Button>
              <Button
                onClick={() => onConfirm(false)}
                className="py-6 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-['Montserrat'] text-lg font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                <XCircle className="w-6 h-6" />
                No, Not Accurate
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}