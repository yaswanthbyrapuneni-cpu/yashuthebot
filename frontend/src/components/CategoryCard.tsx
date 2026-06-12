interface CategoryCardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

export function CategoryCard({ image, title, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[26.133px] shrink-0 hover:scale-105 transition-transform cursor-pointer"
    >
      <div className="aspect-square relative shrink-0 w-full">
        <img alt={title} className="block max-w-none size-full object-contain" src={image} />
      </div>
      <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative w-full">
        <p className="font-['Playfair'] leading-normal relative shrink-0 text-[#7c563d] text-[40px] text-center w-full" style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}>
          {title}
        </p>
      </div>
    </button>
  );
}
