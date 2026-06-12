import { Check, X } from "lucide-react";
import { SAREE_CATALOG, SareeOption } from "../data/sarees";

interface SareeSelectorProps {
  selected: SareeOption | null;
  onSelect: (saree: SareeOption | null) => void;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function SareeSelector({ selected, onSelect, onClose, onGenerate, isGenerating }: SareeSelectorProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/90 backdrop-blur-sm rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h3 className="font-['Playfair_Display'] text-white text-xl">Choose a Saree</h3>
          <p className="font-['Montserrat'] text-white/60 text-xs mt-0.5">
            See how your jewelry looks with a saree
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Saree Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          {SAREE_CATALOG.map((saree) => {
            const isSelected = selected?.id === saree.id;
            return (
              <button
                key={saree.id}
                onClick={() => onSelect(isSelected ? null : saree)}
                className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${
                  isSelected
                    ? "border-[#d4af37] scale-[0.97]"
                    : "border-transparent hover:border-white/30"
                }`}
              >
                <img
                  src={saree.imageUrl}
                  alt={saree.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='133' viewBox='0 0 100 133'%3E%3Crect width='100' height='133' fill='%23444'/%3E%3Ctext x='50' y='70' font-size='12' fill='%23888' text-anchor='middle'%3ESaree%3C/text%3E%3C/svg%3E";
                  }}
                />
                {/* Gradient label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="font-['Montserrat'] text-white text-[10px] font-medium leading-tight">
                    {saree.name}
                  </p>
                  <p className="font-['Montserrat'] text-white/60 text-[9px]">{saree.color}</p>
                </div>
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-white/10 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-full border border-white/20 font-['Montserrat'] text-white/70 text-sm hover:bg-white/10 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={onGenerate}
          disabled={!selected || isGenerating}
          className="flex-[2] py-3 rounded-full bg-[#d4af37] font-['Montserrat'] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c4a028] transition-colors"
        >
          {isGenerating ? "Generating..." : "Generate Look"}
        </button>
      </div>
    </div>
  );
}
