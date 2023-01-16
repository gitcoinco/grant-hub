import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
import { RootState } from "../../../reducers";

export default function Rounds() {
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
      {/* list the application details here for each round */}
      <span>Hello Rounds</span>
    </div>
  );
}
