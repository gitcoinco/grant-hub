import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchGrantData from "../../actions/grantsMetadata";
import { useClients } from "../../hooks/useDataClient";
import { grantPath } from "../../routes";
import { Metadata } from "../../types";
import { getProjectImage, ImgTypes } from "../../utils/components";
import TextLoading from "../base/TextLoading";

function Card({ projectId }: { projectId: number }) {
  const [loading, setLoading] = useState(true);
  const [grantData, setGrantData] = useState<Metadata>();
  const [logoImg, setLogoImg] = useState<string>(
    getProjectImage(true, ImgTypes.logoImg)
  );
  const [bannerImg, setBannerImg] = useState<string>(
    getProjectImage(true, ImgTypes.bannerImg)
  );

  const { grantHubClient } = useClients();

  useEffect(() => {
    console.log("DASA grantHubClient 2", grantHubClient);
  }, [grantHubClient]);

  const getGrantData = async () => {
    console.log("DASA 10");
    if (!grantHubClient) {
      console.log("DASA 11");
      console.log("DASA grantHubClient is ", grantHubClient);
      return;
    }
    console.log("DASA 12", projectId);
    const data = await fetchGrantData(grantHubClient, projectId);

    if (data) {
      setGrantData(data);
      setLogoImg(getProjectImage(false, ImgTypes.logoImg, data));
      setBannerImg(getProjectImage(false, ImgTypes.bannerImg, data));
      setLoading(false);
    }
    console.log("DASA DATA", data);
  };

  useEffect(() => {
    getGrantData();
  }, [grantHubClient, projectId]);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg my-6">
      <Link to={grantPath(projectId)}>
        <img
          className="w-full h-32 object-cover"
          src={bannerImg}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "./assets/card-img.png";
          }}
          alt="project banner"
        />
        <div className="p-6 relative text-start">
          <div className="flex w-full justify-start absolute -top-6">
            <div className="rounded-full h-12 w-12 bg-quaternary-text border border-tertiary-text flex justify-center items-center">
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
          {loading || !grantData ? (
            <TextLoading />
          ) : (
            <div className="pt-4">
              <div className="font-semi-bold text-xl mb-2">
                {grantData.title}
              </div>
              <p className="text-gray-700 text-base h-20">
                {grantData.description}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default Card;
