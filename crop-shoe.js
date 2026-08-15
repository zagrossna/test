const sharp = require("sharp");
const path = require("path");

const SRC = "C:\\Users\\dell\\Desktop\\5469760204762192050_121.jpg";
const OUT_DIR = "C:\\Users\\dell\\Desktop\\shoe-shop\\public\\images";

async function main() {
  const crop = { left: 335, top: 155, width: 430, height: 400 };

  const cropped = sharp(SRC).extract(crop);
  const { width, height } = await cropped.metadata();
  const w = crop.width;
  const h = crop.height;

  // Radial-gradient alpha mask (opaque center, fading to transparent edges)
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  const innerStop = 0.55; // fully opaque until 55% of radius
  const svgMask = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="${innerStop * 100}%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
    </svg>
  `;
  const maskBuffer = Buffer.from(svgMask);

  await sharp(SRC)
    .extract(crop)
    .ensureAlpha()
    .composite([{ input: maskBuffer, blend: "dest-in" }])
    .png()
    .toFile(path.join(OUT_DIR, "featured-shoe.png"));

  console.log("done", { crop, w, h });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
