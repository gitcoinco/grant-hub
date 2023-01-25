import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { RoundDisplayType } from "../../../types";

export type LinkProps = {
  displayType?: RoundDisplayType;
  link: string;
  text: string;
  disabled?: boolean;
};

// todo: disable button link if the application was not approved
export default function LinkManager({ linkProps }: { linkProps: LinkProps }) {
  return (
    <div className="bg-gitcoin-violet-100 text-gitcoin-violet-400 p-2 rounded-md max-w-fit">
      <a
        className="flex flex-row"
        href={linkProps.link}
        rel="noreferrer"
        target="_blank"
      >
        {linkProps.displayType === RoundDisplayType.Active ? (
          <ArrowTopRightOnSquareIcon
            className="flex mx-2 mt-1"
            width={11}
            height={11}
          />
        ) : null}
        <span className="flex text-[12px] mr-1">{linkProps.text}</span>
      </a>
    </div>
  );
}

// todo: add tests for this component
