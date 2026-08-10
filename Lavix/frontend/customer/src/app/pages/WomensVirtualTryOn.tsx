import { VirtualTryOnPage } from "./VirtualTryOnPage";

// For the main display we can reuse an image from the women's products
import imgRectangle1 from "figma:asset/a7bd8f94aa8209f92fa4986a16a8b5cbecee02b3.png";

// And some thumbnails 
import imgFrame239 from "figma:asset/4a169adeb8089fb4ceb1691abba749f508f56c96.png";
import imgFrame241 from "figma:asset/359ea820bfd288642dfa8ec66039dada68138896.png";
import imgFrame242 from "figma:asset/5713353aa89cf9eda996f5a9ed81cbce5be131be.png";
import imgFrame243 from "figma:asset/c6280db822ea0590e92f65dc259910327cb43882.png";
import imgFrame244 from "figma:asset/41f33f6391b8bd06e3b6fffecc93d57549d8447c.png";


export function WomensVirtualTryOn() {
  return (
    <VirtualTryOnPage
      category="Womens Collection"
      categoryLink="/womens"
      productName="Relaxed Fit Long Overcoat with Insert Pockets"
      image={imgRectangle1}
      relatedProducts={[
        { id: 1, name: "Collection Alpha", image: imgFrame239 },
        { id: 2, name: "Collection Beta", image: imgFrame241 },
        { id: 3, name: "Collection Gamma", image: imgFrame242 },
        { id: 4, name: "Collection Delta", image: imgFrame243 },
        { id: 5, name: "Collection Delta", image: imgFrame244 },
      ]}
    />
  );
}
