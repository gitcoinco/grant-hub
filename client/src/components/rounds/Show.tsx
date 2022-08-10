import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getRoundApplicationMetadata,
  getRoundMetadata,
} from "../../actions/rounds";
import { useClients } from "../../hooks/useDataClient";
import useLocalStorage from "../../hooks/useLocalStorage";
import { roundApplicationPath } from "../../routes";
import { useFetchRoundByAddress } from "../../services/graphqlClient";
import { formatDate } from "../../utils/components";
import Button, { ButtonVariants } from "../base/Button";
import TextLoading from "../base/TextLoading";

function Round() {
  const [loading, setLoading] = useState(true);
  const [roundData, setRoundData] = useState<any>();

  const params = useParams();
  const [roundToApply, setRoundToApply] = useLocalStorage("roundToApply", null);
  // const [roundInfo] = useState<RoundResponse | null>(null);

  const { roundManagerClient } = useClients();

  async function fetchRound() {
    console.log("DASA 2");
    if (!roundManagerClient) return;
    console.log("DASA 3");
    const roundInfo = await useFetchRoundByAddress(
      roundManagerClient,
      params.id!
    );

    if (!roundInfo) {
      console.error("Cannot load round", params.id);
      return;
    }

    const roundApplicationMetadata = await getRoundApplicationMetadata(
      roundInfo.round.applicationMetaPtr.pointer
    );

    if (!roundApplicationMetadata) {
      console.error("Cannot load round application metadata", params.id);
      return;
    }

    const roundMetadata = await getRoundMetadata(
      roundInfo.round.roundMetaPtr.pointer
    );

    if (!roundMetadata) {
      console.error("Cannot load round metadata", params.id);
      return;
    }
    roundInfo.round.applicationMetadata = roundApplicationMetadata;
    roundInfo.round.metadata = roundMetadata;

    console.log("DASA 4", roundInfo);
    setRoundData(roundInfo.round);
    setLoading(false);
  }

  useEffect(() => {
    console.log("DASA 1");
    fetchRound();
  }, [params.id, roundManagerClient]);

  useEffect(() => {
    if (params.id) {
      setRoundToApply(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    console.log("roundToApply", roundToApply);
  }, [roundToApply]);

  return (
    <div className="h-full w-full absolute flex flex-col justify-center items-center">
      {loading ? (
        <TextLoading />
      ) : (
        <div className="w-full lg:w-1/3 sm:w-2/3">
          <h2 className="text-center">{roundData?.metadata.name}</h2>
          <h4 className="text-center">{roundData?.metadata.description}</h4>
          <div className="p-8 flex flex-col">
            <p className="mt-4 mb-12 w-full text-center">
              Date: {formatDate(roundData?.applicationsStartTime)} -{" "}
              {formatDate(roundData?.applicationsEndTime)}
            </p>
            <Link to={roundApplicationPath(params.id!)}>
              <Button
                styles={["w-full justify-center"]}
                variant={ButtonVariants.primary}
              >
                Apply to this round
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Round;
