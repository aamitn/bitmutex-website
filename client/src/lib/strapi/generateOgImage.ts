import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import fetch from 'node-fetch';

export async function generateCombinedOgImage(logoUrl: string, slug: string, BASE_URL_NEXT: string): Promise<string> {
  // Define the output directory and filename.
  const publicDir = path.join(process.cwd(), 'public', 'generated-og-images');
  const outputFilename = `${slug}.png`;
  const outputPath = path.join(publicDir, outputFilename);

  // Ensure the output directory exists.
  await fs.mkdir(publicDir, { recursive: true });

  // If the file already exists, return its URL without regenerating.
  try {
    await fs.access(outputPath);
    console.log(`Image already exists at ${outputPath}. Returning cached URL.`);
    return `${BASE_URL_NEXT}/generated-og-images/${outputFilename}`;
  } catch (err) {
    // File doesn't exist, proceed to generate.
    console.log("No cached image found, generating a new one.");
  }

  // Fetch the logo image.
  const logoResponse = await fetch(logoUrl);
  if (!logoResponse.ok) {
    throw new Error('Failed to fetch logo image.');
  }
  const logoBuffer = await logoResponse.buffer();

  // Resize the logo image to ensure it fits within the canvas (e.g., max width/height 300px)
  const resizedLogoBuffer = await sharp(logoBuffer)
    .resize({ width: 300, height: 300, fit: 'inside' })
    .toBuffer();

  // Load the vector overlay from your public assets.
  const vectorPath = path.join(process.cwd(), 'public', 'assets', 'overlay.svg');
  const vectorBuffer = await fs.readFile(vectorPath);

  // Optionally, resize the vector overlay as well.
  const resizedVectorBuffer = await sharp(vectorBuffer)
    .resize({ width: 300, height: 300, fit: 'inside' })
    .toBuffer();

  // Create a blank canvas of the desired size (e.g., 1200x630 pixels)
  const canvasOptions = {
    create: {
      width: 1200,
      height: 630,
      channels: 3 as const, // literal 3 channels
      background: { r: 255, g: 255, b: 255 },
    },
  };

  // Composite the images onto the canvas.
  const compositeImageBuffer = await sharp(canvasOptions)
    .composite([
      {
        input: resizedLogoBuffer,
        top: 165, // vertically center (630 - 300) / 2 = 165
        left: 50, // position from left
      },
      {
        input: resizedVectorBuffer,
        top: 165,
        left: 1200 - 300 - 50, // position from right (canvas width - image width - margin)
      },
    ])
    .png()
    .toBuffer();

  // Write the generated image to the public folder.
  await fs.writeFile(outputPath, compositeImageBuffer);

  console.log(`Generated image saved to ${outputPath}`);

  // Return the public URL of the generated image.
  return `${BASE_URL_NEXT}/generated-og-images/${outputFilename}`;
}
