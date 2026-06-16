import { useState } from "react";
import { GarmentSelector } from "./components/GarmentSelector";
import { TryOnCamera } from "./components/TryOnCamera";
import { GarmentOption } from "./data/catalog";

export default function App() {
  const [selectedGarment, setSelectedGarment] = useState<GarmentOption | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-start p-6 gap-6">
      <h1 className="text-white text-2xl font-bold mt-4">Vastra Alankara AI</h1>
      <p className="text-white/60 text-sm">Virtual clothing try-on powered by Vertex AI</p>

      {/* Selected garment badge */}
      {selectedGarment ? (
        <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
          <img
            src={selectedGarment.imageUrl}
            alt={selectedGarment.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-white text-sm">{selectedGarment.name}</span>
          <button
            onClick={() => setShowSelector(true)}
            className="text-amber-400 text-xs underline"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSelector(true)}
          className="px-6 py-2 rounded-full bg-amber-400 text-white text-sm font-medium"
        >
          Select Garment
        </button>
      )}

      {/* Camera + try-on */}
      <TryOnCamera selectedGarment={selectedGarment} />

      {/* Garment selector modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <GarmentSelector
            selected={selectedGarment}
            onSelect={setSelectedGarment}
            onClose={() => setShowSelector(false)}
            onGenerate={() => setShowSelector(false)}
            isGenerating={false}
          />
        </div>
      )}
    </div>
  );
}
