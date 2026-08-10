import { useLocation } from "react-router-dom";
import { ProductDetailsPage } from "./ProductDetailsPage";

import imgFrame239 from "figma:asset/4a169adeb8089fb4ceb1691abba749f508f56c96.png";
import imgFrame240 from "figma:asset/78c29b614d0c90eb56f783eaba130f59b5ab1d82.png";
import imgFrame246 from "figma:asset/dfcff2ccc0b4a44db625bd0c9e8f56c2727a94b5.png";
import imgFrame248 from "figma:asset/7f467c8196958e772d654bfaa3e2e243c14832b8.png";
import imgFrame249 from "figma:asset/b1bd034cbe9d7dcf0b8a938ad60fe3dde4105594.png";
import imgFrame250 from "figma:asset/5e1caf47655cc0777f009d46b3c8cbd0c09156cf.png";
import imgFrame251 from "figma:asset/2713bd6235ff02af72e5d9c3a6f2aaa2f350fb71.png";

import imgFrame241 from "figma:asset/359ea820bfd288642dfa8ec66039dada68138896.png";
import imgFrame242 from "figma:asset/5713353aa89cf9eda996f5a9ed81cbce5be131be.png";
import imgFrame243 from "figma:asset/c6280db822ea0590e92f65dc259910327cb43882.png";
import imgFrame244 from "figma:asset/41f33f6391b8bd06e3b6fffecc93d57549d8447c.png";

export function MensProductDetails() {
  const location = useLocation();
  const stateItem = location.state?.item as { name?: string; image?: string } | undefined;

  const primaryImage = stateItem?.image || imgFrame239;
  const name = stateItem?.name || "Relaxed Fit Long Overcoat with Insert Pockets";

  return (
    <ProductDetailsPage
      category="Men Collection"
      categoryLink="/mens"
      productName={name}
      brand="GAP"
      price={3949}
      originalPrice={4999}
      discountPercentage={21}
      discountAmount={1050}
      images={[
        primaryImage,
        imgFrame240,
        imgFrame246,
        imgFrame248,
        imgFrame249,
      ]}
      colors={[
        { name: "Camel", hex: "#c29b7f", image: primaryImage },
        { name: "Charcoal", hex: "#36383e", image: imgFrame240 },
        { name: "Navy Blue", hex: "#1d2a44", image: imgFrame246 },
        { name: "Midnight Black", hex: "#111111", image: imgFrame248 },
        { name: "Olive Green", hex: "#3b4d2b", image: imgFrame249 },
      ]}
      sizes={[28, 30, 32, 34, 36]}
      relatedProducts={[
        { id: 1, name: "Collection Alpha", image: imgFrame239 },
        { id: 2, name: "Collection Beta", image: imgFrame241 },
        { id: 3, name: "Collection Gamma", image: imgFrame242 },
        { id: 4, name: "Collection Delta", image: imgFrame243 },
        { id: 5, name: "Collection Epsilon", image: imgFrame244 },
      ]}
    />
  );
}
