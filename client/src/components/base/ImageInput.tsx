import { useRef, useState } from "react";
import toast from "react-hot-toast/headless";
import PinataClient from "../../services/pinata";
import colors from "../../styles/colors";
import CloudUpload from "../icons/CloudUpload";

type Dimensions = {
  width: number;
  height: number;
};

const validateDimensions = (
  image: HTMLImageElement,
  dimensions: Dimensions
) => {
  const { naturalHeight, naturalWidth } = image;

  return (
    naturalHeight === dimensions.height && naturalWidth === dimensions.width
  );
};

export default function ImageInput({
  label,
  dimensions,
  existingImg,
  circle,
  info,
  imgHandler,
}: {
  label: string;
  dimensions: {
    width: number;
    height: number;
  };
  existingImg?: string;
  circle?: Boolean;
  info?: string;
  imgHandler: (file: Blob) => void;
}) {
  const toastError = (msg: string): void => {
    toast.error(
      <p className="font-semibold text-quaternary-text mr-2 mt-1">{msg}</p>,
      {
        duration: 5000,
      }
    );
  };

  const fileInput = useRef<HTMLInputElement>(null);
  const [tempImg, setTempImg] = useState<string | undefined>();

  const handleDragEnter = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getFiles = (e: any) => {
    if (e.dataTransfer) {
      return e.dataTransfer.files;
    }
    return e.currentTarget?.files;
  };

  const saveImage = (
    e: React.DragEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = getFiles(e);
    if (files) {
      if (files.length === 0) {
        return;
      }
      const file = files[0];
      // ensure image is < 2mb
      if (file.size > 2000000) {
        toastError("Image must be less than 2mb");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img: HTMLImageElement = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (!validateDimensions(img, dimensions)) {
            toastError(
              `Image must be ${dimensions.width}px x ${dimensions.height}px`
            );
            setTempImg(undefined);
          } else {
            imgHandler(file);
            setTempImg(URL.createObjectURL(file));
          }
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const blobExistingImg = async (imgUrl: string) => {
    const img = await fetch(imgUrl);
    const blob = await img.blob();
    imgHandler(blob);
  };

  const currentImg = () => {
    if (tempImg) return tempImg;
    if (!existingImg) return "";

    const pinataClient = new PinataClient();
    const imgUrl = pinataClient.fileURL(existingImg);

    blobExistingImg(imgUrl);
    return imgUrl;
  };

  const onButtonClick = () => {
    if (typeof fileInput.current?.click === "function") {
      fileInput.current.click();
    }
  };

  return (
    <div className="mt-6 w-full">
      <label className="text-sm" htmlFor={label}>
        {label}
      </label>
      <legend>{info}</legend>
      <div className="flex">
        <input
          ref={fileInput}
          onChange={(e) => saveImage(e)}
          className="hidden"
          type="file"
          name="file"
          accept=".png,.jpg"
        />
        {fileInput && (
          <button
            className="w-2/3 border border-dashed rounded flex flex-col py-6 items-center mr-2"
            type="button"
            onClick={onButtonClick}
            onDrop={(e) => saveImage(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDragEnter={(e) => handleDragEnter(e)}
            onDragLeave={(e) => handleDragLeave(e)}
          >
            <CloudUpload color={colors["secondary-text"]} />
            <p>Click to Upload or drag and drop</p>
            <p>
              PNG or JPG (Required:{" "}
              {`${dimensions.width}px x ${dimensions.height}px`})
            </p>
          </button>
        )}
        <div className="w-1/3">
          {currentImg().length > 0 && (
            <img
              className={`max-h-28 ${circle && "rounded-full"}`}
              src={currentImg()}
              alt="Project Logo Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}
