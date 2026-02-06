import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function fileUploadS3(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
) {
  const uniqueFileName = `${Date.now()}-${fileName}`;
  const encodedFileName = encodeURIComponent(uniqueFileName);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: fileType,
  };
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${encodedFileName}`;

  } catch (error) {
    throw new Error("File upload failed");
  }
}

export async function deleteFileS3(key: string) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    }

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  }
  catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("File deletion failed");
  }
}