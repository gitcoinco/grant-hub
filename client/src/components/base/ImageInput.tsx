import { useRef, useState } from "react";
import colors from "../../styles/colors";
import { Metadata } from "../../types";
import { getProjectImage } from "../../utils/components";
import CloudUpload from "../icons/CloudUpload";
import Toast from "./Toast";

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
    naturalHeight !== dimensions.height && naturalWidth !== dimensions.width
  );
};

export default function ImageInput({
  label,
  dimensions,
  currentProject,
  imgHandler,
}: {
  label: string;
  dimensions: {
    width: number;
    height: number;
  };
  currentProject?: Metadata;
  imgHandler: (file: Blob) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [tempImg, setTempImg] = useState("");
  const [validation, setValidation] = useState({
    error: false,
    msg: "",
  });

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
    if (e.currentTarget) {
      return e.currentTarget?.files;
    }

    return e.dataTransfer.files;
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
      if (file > 2000000) {
        setValidation({
          error: true,
          msg: "Image must be less than 2mb",
        });
        return;
      }
      // remove validation message
      setValidation({
        error: false,
        msg: "",
      });

      const img: HTMLImageElement = document.createElement("img");
      img.src = URL.createObjectURL(file);

      setTempImg(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result;
        if (validateDimensions(img, dimensions)) {
          setValidation({
            error: true,
            msg: `Image must be ${dimensions.width}px X ${dimensions.height}px`,
          });
        }

        if (res) {
          imgHandler(file);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const currentImg = () => {
    if (tempImg) return tempImg;
    if (!currentProject) return "";
    return getProjectImage(false, currentProject);
  };

  const onButtonClick = () => {
    if (typeof fileInput.current?.click === "function") {
      fileInput.current.click();
    }
  };

  return (
    <>
      <div className="mt-6 w-11/12">
        <label htmlFor={label}>{label}</label>
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
              className="w-full border border-dashed rounded flex flex-col py-6 items-center mr-2"
              type="button"
              onClick={onButtonClick}
              onDrop={(e) => saveImage(e)}
              onDragOver={(e) => handleDragOver(e)}
              onDragEnter={(e) => handleDragEnter(e)}
              onDragLeave={(e) => handleDragLeave(e)}
            >
              <CloudUpload color={colors["secondary-text"]} />
              <p>Click to Upload or drag and drop</p>
              <p>PNG or JPG (Recommended: 1044x600px)</p>
            </button>
          )}
          <div className="w-1/4">
            {currentImg().length > 0 && (
              <img src={currentImg()} alt="Project Logo Preview" />
            )}
          </div>
        </div>
      </div>
      <Toast
        show={validation.error}
        onClose={() =>
          setValidation({
            error: false,
            msg: "",
          })
        }
      >
        <p className="font-semibold text-quaternary-text mr-2 mt-1">
          {validation.msg}
        </p>
      </Toast>
    </>
  );
}
