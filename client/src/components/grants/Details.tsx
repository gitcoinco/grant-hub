import colors from "../../styles/colors";
import { Metadata, FormInputs, Project, ProjectCredential } from "../../types";
import Calendar from "../icons/Calendar";
import LinkIcon from "../icons/LinkIcon";
import Shield from "../icons/Shield";

function Verified() {
  return (
    <div className="flex rounded bg-green-text/25 px-2 py-0.5">
      <Shield dimension={16} color={colors["green-text"]} />{" "}
      <p className="pl-2 text-green-text text-xs font-bold">Verified</p>
    </div>
  );
}

const hasCredential = (credential?: ProjectCredential) =>
  credential && credential.input.length > 0;

export default function Details({
  project,
  updatedAt,
  bannerImg,
  logoImg,
  preview,
}: {
  project?: Metadata | FormInputs | Project;
  updatedAt: string;
  bannerImg: string | Blob;
  logoImg: string | Blob;
  preview?: boolean;
}) {
  console.log({ project });
  return (
    <div className={`w-full ${!preview && "md:w-2/3"} mb-40`}>
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
      <div className="grid grid-cols-2 gap-4 pb-6 mb-6">
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
        <div>
          <p className="flex text-sm">
            <Calendar color={colors["secondary-text"]} /> {updatedAt}
          </p>
        </div>
        {hasCredential(project?.credentials?.twitter) && (
          <div className="flex justify-start">
            <img
              className="h-3 mr-2 mt-1"
              src="./assets/twitter_logo.svg"
              alt="Twitter Logo"
            />
            {project?.credentials?.twitter?.input}
            {project?.credentials?.twitter?.credential && <Verified />}
          </div>
        )}
        {hasCredential(project?.credentials?.github) && (
          <div className="flex justify-start">
            <img
              className="h-3 mr-2 mt-1"
              src="./assets/github_logo.png"
              alt="Github Logo"
            />
            {project?.credentials?.github?.input}
            {project?.credentials?.github?.credential && <Verified />}
          </div>
        )}
      </div>

      <p className="text-xs text-primary-text mb-1">Description</p>
      <p className="mb-12">{project?.description}</p>
    </div>
  );
}
