import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGrantData } from "../../actions/grantsMetadata";
import { editPath, grantsPath } from "../../routes";
import colors from "../../styles/colors";
import { Metadata } from "../../types";
import { getProjectImage, ImgTypes } from "../../utils/components";
import Button, { ButtonVariants } from "../base/Button";
import Arrow from "../icons/Arrow";
import Pencil from "../icons/Pencil";
// import Calendar from "../icons/Calendar";
import { useClients } from "../../hooks/useDataClient";
import Details from "./Details";

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
      return;
    }
    const data = await fetchGrantData(grantHubClient, Number(params.id));
    if (data) {
      setLogoImg(getProjectImage(false, ImgTypes.logoImg, data));
      setBannerImg(getProjectImage(false, ImgTypes.bannerImg, data));
      setLoading(false);
      setGrantData(data);
    }
  };

  useEffect(() => {
    getGrantData();
  }, []);

  useEffect(() => {
    getGrantData();
  }, [params.id]);

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
          <Details
            project={grantData}
            updatedAt={Date.now().toString()} // updatedAt} TODO add updated at timestamp
            logoImg={logoImg}
            bannerImg={bannerImg}
          />
        </>
      )}
    </div>
  );
}

export default Project;
