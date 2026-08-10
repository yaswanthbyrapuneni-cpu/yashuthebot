import { VirtualTryOnPage } from "./VirtualTryOnPage";

import imgRectangle1 from "figma:asset/b166d8bc81dff27c9c8db870513168dffb4f64e1.png";
import imgFrame239 from "figma:asset/f5f8d4dd9eb53400a4a8245abd2fb21d9ec4dc8c.png";
import imgFrame240 from "figma:asset/f16d1af7b5cd77890334b091c726382659e5209b.png";
import imgFrame241 from "figma:asset/1a6622e299395ae7455f1e1759e501d3cc1297f5.png";
import imgFrame242 from "figma:asset/215db321eea469dd99146a0082de4e2c7510ce0e.png";
import imgFrame243 from "figma:asset/6ccb579b211c978cb6f70cd90cf8384c7eca7a59.png";

export function MensVirtualTryOn() {
  return (
    <VirtualTryOnPage
      category="Mens Collection"
      categoryLink="/mens"
      productName="Relaxed Fit Long Overcoat with Insert Pockets"
      image={imgRectangle1}
      relatedProducts={[
        { id: 1, name: "Collection Alpha", image: imgFrame239 },
        { id: 2, name: "Collection Beta", image: imgFrame240 },
        { id: 3, name: "Collection Gamma", image: imgFrame241 },
        { id: 4, name: "Collection Delta", image: imgFrame242 },
        { id: 5, name: "Collection Delta", image: imgFrame243 },
      ]}
    />
  );
}
