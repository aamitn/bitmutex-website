import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

export async function GET() {
  try {
    // Adjust the path based on where you store your models
    const filePath = resolve(process.cwd(), "app/models", "BoomBox.glb"); 

    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "model/gltf-binary",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Model file not found" }, { status: 500 });
  }
}
