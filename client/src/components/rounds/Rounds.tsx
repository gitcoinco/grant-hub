import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
import { RootState } from "../../reducers";
import { FormInputs, Metadata, Project } from "../../types";
import ProjectDetailsHeader from "../ProjectDetailsHeader";

export default function Rounds({
  project,
  bannerImg,
  logoImg,
}: {
  project?: Metadata | FormInputs | Project;
  bannerImg: string | Blob;
  logoImg: string | Blob;
}) {
  const params = useParams();
  const { chain } = useNetwork();
  const props = useSelector((state: RootState) => {
    const chainId = chain?.id;
    const applications = state.projects.applications[params.id!] || [];

    return {
      chainId,
      applications,
    };
  });

  console.log("props", props);

  return (
    <div className="w-full mb-40">
      <ProjectDetailsHeader
        title={project?.title}
        bannerImg={bannerImg}
        logoImg={logoImg}
      />
      {/* add new tab layout here */}
    </div>
  );
}
