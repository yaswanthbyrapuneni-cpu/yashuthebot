import { Check, X } from "lucide-react";
import { GARMENT_CATALOG, GarmentOption } from "../data/catalog";

interface GarmentSelectorProps {
  selected: GarmentOption | null;
  onSelect: (garment: GarmentOption | null) => void;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function GarmentSelector({
  selected,
  onSelect,
  onClose,
  onGenerate,
  isGenerating,
}: GarmentSelectorProps) {
  return (
    <div className="flex flex-col bg-black/90 rounded-2xl w-full max-w-lg mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h3 className="text-white text-xl font-semibold">Choose a Garment</h3>
          <p className="text-white/60 text-xs mt-0.5">Select to virtually try it on</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Garment Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4 max-h-96">
        <div className="grid grid-cols-3 gap-3">
          {GARMENT_CATALOG.map((garment) => {
            const isSelected = selected?.id === garment.id;
            return (
              <button
                key={garment.id}
                onClick={() => onSelect(isSelected ? null : garment)}
                className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${
                  isSelected
                    ? "border-amber-400 scale-[0.97]"
                    : "border-transparent hover:border-white/30"
                }`}
              >
                <img
                  src={garment.imageUrl}
                  alt={garment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='133'%3E%3Crect width='100' height='133' fill='%23444'/%3E%3Ctext x='50' y='70' font-size='11' fill='%23888' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-[10px] font-medium leading-tight">{garment.name}</p>
                  <p className="text-white/60 text-[9px]">{garment.color}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-full border border-white/20 text-white/70 text-sm hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onGenerate}
          disabled={!selected || isGenerating}
          className="flex-[2] py-3 rounded-full bg-amber-400 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors"
        >
          {isGenerating ? "Generating..." : "Try On"}
        </button>
      </div>
    </div>
  );
}
