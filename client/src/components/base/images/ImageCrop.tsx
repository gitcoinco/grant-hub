import React, { useState, useRef, useEffect } from "react";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import { debounce } from "ts-debounce";
import { Dimensions } from "../ImageInput";
import { BaseModal, ToggleModalProps } from "../BaseModal";
import buildCanvas from "./buildCanvas";

import "react-image-crop/dist/ReactCrop.css";
import Button, { ButtonVariants } from "../Button";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "px",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  ) as PixelCrop;
}

type ImageCropProps = ToggleModalProps & {
  imgSrc: string;
  dimensions: Dimensions;
  onCrop: (imgUrl: HTMLCanvasElement) => void;
};

export default function ImageCrop({
  isOpen,
  imgSrc,
  dimensions,
  onCrop,
  onClose,
}: ImageCropProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<PixelCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onImageLoad() {
    const { width, height } = dimensions;
    if (imgSrc) {
      setCrop(centerAspectCrop(width, height, width / height));
    }
  }

  useEffect(() => {
    const { width, height } = dimensions;
    setCrop(centerAspectCrop(width, height, width / height));
  }, [dimensions]);

  useEffect(() => {
    debounce(async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        buildCanvas(imgRef.current, completedCrop);
      }
    }, 100);
  }, [imgRef]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <>
        <div className="flex flex-col text-center m-3 ">
          <h4>Crop Image</h4>
          <p>
            Drag or adjust the box to crop your image to the right aspect ratio
          </p>
        </div>
        {Boolean(imgSrc) && (
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop) => {
              setCrop(pixelCrop);
            }}
            onComplete={(c) => {
              setCompletedCrop(c);
            }}
            aspect={dimensions.width / dimensions.height}
            maxHeight={dimensions.height}
            maxWidth={dimensions.width}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{ transform: `scale(1) rotate(0deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        <div className="flex w-full">
          <Button
            styles={["w-1/2 justify-center"]}
            variant={ButtonVariants.outline}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            styles={["w-1/2 justify-center"]}
            variant={ButtonVariants.primary}
            onClick={() => {
              if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current
              ) {
                const imgUrl = buildCanvas(imgRef.current, completedCrop);
                onCrop(imgUrl);
                onClose();
              }
            }}
          >
            Use Image
          </Button>
        </div>
      </>
    </BaseModal>
  );
}
