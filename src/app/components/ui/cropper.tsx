import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

interface Props {
  imageFile: File | null;
  imageFileUrl: string | null;
  aspect: number | null;
  cropShape: "rect" | "round"
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageFile,
  imageFileUrl,
  aspect,
  onCropComplete,
  cropShape,
  onCancel,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function getCroppedImage() {
    if (!imageFileUrl || !croppedAreaPixels || !imageFile || !cropShape) return;

    const image = await createImage(imageFileUrl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob((blob) => {
      if (blob && imageFile) {
        const croppedFile = new File([blob], `cropped_${imageFile.name}`, {
          type: imageFile.type,
        });
        onCropComplete(croppedFile);
      }
    }, imageFile.type);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-80 z-[9999] p-4">
      <div className="relative p-6 flex flex-col gap-5 items-center bg-gray-100 rounded-md w-full max-w-lg">
        {imageFileUrl && aspect && (
          <>
            <div className="relative w-full max-w-[90vw] h-[40vh] bg-white rounded-lg shadow-lg overflow-hidden">
              <Cropper
                image={imageFileUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropCompleteHandler}
                onZoomChange={setZoom}
                cropShape={cropShape}
              />
            </div>

            <div className="w-full flex flex-row items-center px-4">
              <div className="w-12 flex justify-center items-center">
                <img
                  width={15}
                  height={15}
                  src="/static/images/image.png"
                  alt="Zoom Out Icon"
                />
              </div>
              <input
                type="range"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="1"
                max="3"
                step="0.1"
                onChange={(e) => setZoom(Number(e.target.value))}
                value={zoom}
              />
              <div className="w-12 flex justify-center items-center">
                <img
                  width={30}
                  height={30}
                  src="/static/images/image.png"
                  alt="Zoom In Icon"
                />
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <input
              type="button"
              value="Done"
                onClick={getCroppedImage}
                className="bg-white text-black px-4 py-2 rounded-md shadow-lg hover:bg-gray-200 transition"
              />
              <input
              type="button"
              value="Cancel"
                onClick={onCancel}
                className="bg-white text-black px-4 py-2 rounded-md shadow-lg hover:bg-gray-200 transition"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}
