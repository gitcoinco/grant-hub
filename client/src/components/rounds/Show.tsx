import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
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
import { ErrorModal } from "../base/ErrorModal";
import TextLoading from "../base/TextLoading";

function Round() {
  const [loading, setLoading] = useState(true);
  const [roundData, setRoundData] = useState<any>();
  const [dataModal, setDataModal] = useState(false);
  const [roundToApply, setRoundToApply] = useLocalStorage("roundToApply", null);
  const { chain } = useNetwork();
  const params = useParams();
  const { roundId, chainId } = params;
  const { roundManagerClient } = useClients(Number(chainId));

  async function fetchRound() {
    if (!roundManagerClient) return;
    const roundInfo = await useFetchRoundByAddress(
      roundManagerClient,
      roundId!
    );

    if (!roundInfo) {
      console.error("Cannot load round", roundId);
      setDataModal(true);
      return;
    }

    const roundApplicationMetadata = await getRoundApplicationMetadata(
      roundInfo.round.applicationMetaPtr.pointer
    );

    if (!roundApplicationMetadata) {
      console.error("Cannot load round application metadata", roundId);
      return;
    }

    const roundMetadata = await getRoundMetadata(
      roundInfo.round.roundMetaPtr.pointer
    );

    if (!roundMetadata) {
      console.error("Cannot load round metadata", roundId);
      return;
    }
    roundInfo.round.applicationMetadata = roundApplicationMetadata;
    roundInfo.round.metadata = roundMetadata;

    setRoundData(roundInfo.round);
    setLoading(false);
  }

  useEffect(() => {
    fetchRound();
  }, [roundId, roundManagerClient]);

  useEffect(() => {
    if (roundId) {
      setRoundToApply(`${chainId}:${roundId}`);
    }
  }, [roundId]);

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
            <Link to={roundApplicationPath(chain?.id.toString(), roundId!)}>
              <Button
                styles={["w-full justify-center"]}
                variant={ButtonVariants.primary}
              >
                Apply to this round
              </Button>
            </Link>
          </div>
          <ErrorModal
            title="Data Load Error"
            isOpen={dataModal}
            onClose={() => {}}
            homeButtonText="Home"
            retryButtonText="Retry"
          />
        </div>
      )}
    </div>
  );
}

export default Round;
