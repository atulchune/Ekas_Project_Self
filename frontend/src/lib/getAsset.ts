import rawAssets from "../../parsed-assets.json";

export function getAssetUrl(filename: string): string {
  if (!filename) return "";
  
  const asset = rawAssets.find((item: any) => item.Filename === filename || item["Object Key"] === filename);
  
  if (asset && asset["Public URL"]) {
    return asset["Public URL"];
  }
  
  // Fallback if the specific image is missing but we know it's a Triode link
  return `https://ekas-assets.triodesolutions.com/${filename}`;
}
