import * as fs from 'node:fs';
import * as path from 'node:path';

async function copyEnvFile(targetDir: string): Promise<void> {
  // Ensure targetDir is trimmed
  targetDir = targetDir.trim();

  const examplePath: string = path.join(targetDir, ".env.example");
  const envPath: string = path.join(targetDir, ".env");

  console.log("Attempting to copy from:", examplePath);
  console.log("To:", envPath);

  try {
    // Check if .env already exists
    if (fs.existsSync(envPath)) {
      console.log(
        `.env file already exists in ${targetDir}, no action taken.`
      );
      return;
    }

    // Check if .env.example exists
    if (!fs.existsSync(examplePath)) {
      console.error(`.env.example file does not exist in ${targetDir}`);
      return;
    }

    // Copy .env.example to .env
    fs.copyFileSync(examplePath, envPath);
    console.log(`.env.example has been copied to ${envPath}`);
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

// Get the directory path from the command line argument and trim whitespace
const directoryPath: string | undefined = process.argv[2]?.trim();

if (directoryPath) {
  await copyEnvFile(directoryPath);
} else {
  console.error("Please provide a directory path as an argument.");
}