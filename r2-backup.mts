import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Load environment variables.
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;

// Define how many backups to retain
const MAX_BACKUPS_TO_RETAIN = 8;

// In ES Module scope, we must construct the __dirname equivalent.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The path to the backup file, relative to the project root.
const BACKUP_FILE_PATH = join(__dirname, 'seed-data.tar.gz');
const BACKUP_FILE_PREFIX = 'seed-data-backup-';

// Check if all necessary environment variables are set.
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Error: Missing one or more Cloudflare R2 environment variables.');
  console.error('Please ensure CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, and CLOUDFLARE_R2_BUCKET_NAME are set.');
  process.exit(1);
}

// Configure the S3 client to connect to Cloudflare R2.
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to a Cloudflare R2 bucket.
 * The filename will include a timestamp to prevent overwriting previous backups.
 */
async function uploadBackup() {
  try {
    // Read the backup file content.
    const fileContent = readFileSync(BACKUP_FILE_PATH);

    // Create a timestamp for the object key (e.g., 'backup-2023-10-27T10-30-00.tar.gz').
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const objectKey = `${BACKUP_FILE_PREFIX}${timestamp}.tar.gz`;

    // Define the S3 upload parameters.
    const params = {
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
      Body: fileContent,
      ContentType: 'application/gzip',
    };

    // Execute the upload command.
    await r2.send(new PutObjectCommand(params));
    console.log(`✅ Successfully uploaded new backup to R2: s3://${R2_BUCKET_NAME}/${objectKey}`);

    // Call the cleanup function after a successful upload.
    await cleanupBackups();
  } catch (error) {
    console.error('❌ Failed to upload backup to Cloudflare R2:', error);
    process.exit(1);
  }
}

/**
 * Lists all backups, sorts them by date, and deletes older ones to retain only the latest.
 */
async function cleanupBackups() {
  try {
    const listParams = {
      Bucket: R2_BUCKET_NAME,
      Prefix: BACKUP_FILE_PREFIX,
    };

    const data = await r2.send(new ListObjectsV2Command(listParams));

    if (!data.Contents || data.Contents.length <= MAX_BACKUPS_TO_RETAIN) {
      console.log('No cleanup needed. Fewer than or equal to 5 backups found.');
      return;
    }

    // Sort backups by LastModified date in descending order (newest first).
    const sortedBackups = data.Contents.sort((a, b) => b.LastModified!.getTime() - a.LastModified!.getTime());

    // Get the objects to delete (all files after the first 5).
    const backupsToDelete = sortedBackups.slice(MAX_BACKUPS_TO_RETAIN);

    if (backupsToDelete.length > 0) {
      const deleteParams = {
        Bucket: R2_BUCKET_NAME,
        Delete: {
          Objects: backupsToDelete.map(obj => ({ Key: obj.Key })),
        },
      };

      await r2.send(new DeleteObjectsCommand(deleteParams));
      console.log(`🗑️ Successfully deleted ${backupsToDelete.length} old backups.`);
    } else {
      console.log('No old backups to delete.');
    }
  } catch (error) {
    console.error('❌ Failed to clean up old backups:', error);
    // Do not exit the process, as the backup upload was successful.
  }
}

// Run the upload and cleanup process.
uploadBackup();
