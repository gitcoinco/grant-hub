import colors from "../../styles/colors";
import { Metadata, FormInputs } from "../../types";
import Calendar from "../icons/Calendar";
import LinkIcon from "../icons/LinkIcon";

export default function Details({
  project,
  updatedAt,
  bannerImg,
  logoImg,
  preview,
}: {
  project?: FormInputs | Metadata;
  updatedAt: string;
  bannerImg: string | Blob;
  logoImg: string | Blob;
  preview?: boolean;
}) {
  return (
    <div className={`w-full ${!preview ?? "md:w-2/3"} mb-40`}>
      <img
        className="w-full mb-4"
        src={
          bannerImg instanceof Blob ? URL.createObjectURL(bannerImg) : bannerImg
        }
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "./assets/card-img.png";
        }}
        alt="project banner"
      />
      <div className="relative">
        <div className="flex w-full justify-start absolute -top-14 left-8">
          <div className="rounded-full h-20 w-20 bg-quaternary-text border border-tertiary-text flex justify-center items-center">
            <img
              className="rounded-full"
              src={
                logoImg instanceof Blob ? URL.createObjectURL(logoImg) : logoImg
              }
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "./icons/lightning.svg";
              }}
              alt="project logo"
            />
          </div>
        </div>
      </div>
      <h4 className="mb-4 mt-14">{project?.title}</h4>
      <div className="flex justify-start border-b pb-6 mb-6">
        <a
          target="_blank"
          href={project?.website}
          className="flex items-center text-sm mr-6"
          rel="noreferrer"
        >
          <LinkIcon color={colors["secondary-text"]} />{" "}
          <p className="ml-1">{project?.website}</p>
          {/* TODO add created at updated timestamp */}
        </a>
        <p className="flex text-sm">
          <Calendar color={colors["secondary-text"]} /> {updatedAt}
        </p>
      </div>

      <p className="text-xs text-primary-text mb-1">Description</p>
      <p className="mb-12">{project?.description}</p>
    </div>
  );
}
