import { Button } from "@chakra-ui/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { RoundDisplayType } from "../../../types";

export type LinkProps = {
  displayType?: RoundDisplayType;
  link: string;
  text: string;
  enableStats?: boolean;
};

// todo: disable button link if the application was not approved
export default function LinkManager({ linkProps }: { linkProps: LinkProps }) {
  const disabled = linkProps.displayType === RoundDisplayType.Current;

  return (
    <>
      {linkProps.displayType === RoundDisplayType.Active ? (
        <Button
          disabled={disabled}
          className={`bg-gitcoin-violet-100 flex p-2 rounded-md max-w-fit ${
            disabled && "cursor-not-allowed"
          }`}
        >
          <a
            className="flex flex-row"
            href={linkProps.link}
            rel="noreferrer"
            target="_blank"
          >
            <ArrowTopRightOnSquareIcon
              className="flex mx-2 mt-[1px] text-gitcoin-violet-400"
              width={11}
              height={11}
            />
            <span
              className={`flex text-[12px] mr-1 text-violet-400 ${
                disabled && "cursor-not-allowed"
              }`}
            >
              {linkProps.text}
            </span>
          </a>
        </Button>
      ) : null}
      {linkProps.displayType === RoundDisplayType.Current ? (
        <Button
          disabled={disabled}
          className={`bg-gitcoin-violet-100 flex p-2 rounded-md max-w-fit ${
            disabled && "cursor-not-allowed"
          }`}
        >
          <a
            className="flex flex-row"
            href={linkProps.link}
            rel="noreferrer"
            target="_blank"
          >
            <span
              className={`flex text-[12px] mr-1 text-violet-400 ${
                disabled && "cursor-not-allowed"
              }`}
            >
              {linkProps.text}
            </span>
          </a>
        </Button>
      ) : null}
      {linkProps.displayType === RoundDisplayType.Past ? (
        <Button
          disabled={!linkProps.enableStats}
          className={`bg-gitcoin-violet-100 flex p-2 rounded-md max-w-fit ${
            !linkProps.enableStats && "cursor-not-allowed"
          }`}
        >
          <Link
            to={linkProps.link}
            className="flex flex-row text-[12px] text-violet-400"
          >
            <span
              className={`flex text-[12px] mr-1 text-violet-400 ${
                disabled && "cursor-not-allowed"
              }`}
            >
              {linkProps.text}
            </span>
          </Link>
        </Button>
      ) : null}
    </>
  );
}

// todo: add tests for this component
