import sharp from "sharp";

interface Props {
    buffer: Buffer;
    width: number;
    height: number;
    fit: keyof sharp.FitEnum;
    quality: number;
}

export async function ProcessImageFromBuffer(data: Props): Promise<Buffer> {
    const { buffer, width, height, fit, quality } = data;

    const optimizedBuffer = await sharp(buffer)
        .resize(width, height, { fit: fit })
        .jpeg({ quality: quality?quality:80 })
        .toBuffer();

    return optimizedBuffer;
}