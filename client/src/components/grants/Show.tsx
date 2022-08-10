import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { grantsPath, editPath } from "../../routes";
import fetchGrantData from "../../actions/grantsMetadata";
import Button, { ButtonVariants } from "../base/Button";
import Pencil from "../icons/Pencil";
import colors from "../../styles/colors";
import LinkIcon from "../icons/LinkIcon";
import Arrow from "../icons/Arrow";
import { getProjectImage, ImgTypes } from "../../utils/components";
import { Metadata } from "../../types";
// import Calendar from "../icons/Calendar";
import { useClients } from "../../hooks/useDataClient";

function Project() {
  const [loading, setLoading] = useState(true);
  // const [updatedAt, setUpdated] = useState("");
  const [grantData, setGrantData] = useState<Metadata>();
  const [logoImg, setLogoImg] = useState<string>(
    getProjectImage(true, ImgTypes.logoImg)
  );
  const [bannerImg, setBannerImg] = useState<string>(
    getProjectImage(true, ImgTypes.bannerImg)
  );

  // FIXME: params.id doesn't change if the location hash is changed manually.
  const params = useParams();

  const { grantHubClient } = useClients();

  const getGrantData = async () => {
    if (!grantHubClient) {
      console.log("DASA grantHubClient is ", grantHubClient);
      return;
    }
    const data = await fetchGrantData(grantHubClient, Number(params.id));
    if (data) {
      setLogoImg(getProjectImage(false, ImgTypes.logoImg, data));
      setBannerImg(getProjectImage(false, ImgTypes.bannerImg, data));
      setLoading(false);
      setGrantData(data);
    }
    console.log("DASA DATA", data);
  };

  useEffect(() => {
    getGrantData();
  }, []);

  useEffect(() => {
    getGrantData();
  }, [params.id]);

  useEffect(() => {
    console.log("grantData", grantData);
  }, [grantData]);

  /*
  useEffect(() => {
    async function fetchTimeStamp(projects: ProjectEvent[], projectId: string) {
      if (global) {
        const currentProject = projects.find(
          (project) => project.id === Number(projectId)
        );
        if (currentProject) {
          const blockData = await global.web3Provider?.getBlock(
            currentProject.block
          );

          const formattedDate = new Date(
            (blockData?.timestamp ?? 0) * 1000
          ).toLocaleString();

          setUpdated(formattedDate);
        }
      }
    }

    if (props.currentProject !== undefined && props.id !== undefined) {
      fetchTimeStamp(props.projects, props.id);
    } else {
      // If user reloads Show projects will not exist
      dispatch(loadProjects(address!, signer, chain?.id!));
    }
  }, [grantData]);
*/
  if (loading) {
    return <>Loading grant data from IPFS... </>;
  }

  return (
    <div>
      {grantData && (
        <>
          <div className="flex justify-between items-center mb-6">
            <Link to={grantsPath()}>
              <h3 className="flex">
                <div className="pt-2 mr-2">
                  <Arrow color={colors["primary-text"]} />{" "}
                </div>
                Project Details
              </h3>
            </Link>
            {grantData.id && (
              <Link
                to={editPath(grantData.id)}
                className="sm:w-auto mx-w-full ml-0"
              >
                <Button
                  variant={ButtonVariants.outline}
                  styles={["sm:w-auto mx-w-full ml-0"]}
                >
                  <i className="icon mt-1">
                    <Pencil color={colors["secondary-text"]} />
                  </i>
                  &nbsp; Edit
                </Button>
              </Link>
            )}
          </div>
          <div className="w-full md:w-2/3 mb-40">
            <img
              className="w-full mb-4"
              src={bannerImg}
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
                    src={logoImg}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "./icons/lightning.svg";
                    }}
                    alt="project logo"
                  />
                </div>
              </div>
            </div>
            <h4 className="mb-4 mt-14">{grantData.title}</h4>
            <div className="flex justify-start border-b pb-6 mb-6">
              <a
                target="_blank"
                href={grantData.website}
                className="flex items-center text-sm mr-6"
                rel="noreferrer"
              >
                <LinkIcon color={colors["secondary-text"]} />{" "}
                <p className="ml-1">{grantData.website}</p>
                {/* TODO add created at updated timestamp */}
              </a>
              <p className="flex text-sm">
                {/* TODO add updated at timestamp 
                <Calendar color={colors["secondary-text"]} /> {updatedAt}
                */}
              </p>
            </div>

            <p className="text-xs text-primary-text mb-1">Description</p>
            <p className="mb-12">{grantData.description}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Project;
