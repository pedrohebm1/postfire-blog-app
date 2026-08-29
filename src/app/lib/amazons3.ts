import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: process.env.NODE_ENV === "development" ? true : undefined, 
});

export async function fileUploadS3(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
) {
  const uniqueFileName = `${Date.now()}-${fileName}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  
  const params = {
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: fileType,
  };
  
  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    const encodedFileName = encodeURIComponent(uniqueFileName); 
    let accessUrl = "";

    if (process.env.NODE_ENV === "development") {
      accessUrl = `${process.env.NEXT_PUBLIC_AWS_S3_CLOUD_ENDPOINT}/${bucketName}/${encodedFileName}`;
    } else {
      const region = process.env.AWS_S3_REGION || "us-east-1";
      accessUrl = `https://${bucketName}.s3.${region}://{encodedFileName}`; 
    }

    return accessUrl;

  } catch (error) {
    throw new Error("File upload failed: " + error);
  }
}

export async function deleteFileS3(key: string) {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("File deletion failed");
  }
}