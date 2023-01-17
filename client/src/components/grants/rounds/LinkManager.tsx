import { Link } from "react-router-dom";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export enum LinkDisplayType {
  External,
  Internal,
}

export type LinkProps = {
  displayType: LinkDisplayType;
  link: string;
  text: string;
};

// todo: figure out what we need for the proper link display
export default function LinkManager({ linkProps }: { linkProps: LinkProps }) {
  return (
    <div className="bg-gitcoin-violet-100 text-gitcoin-violet-400 p-2 rounded-md">
      <Link className="flex flex-row justify-between" to="/">
        <ArrowTopRightOnSquareIcon
          className="flex mx-2 mt-1"
          width={11}
          height={11}
        />
        <span className="flex text-[12px] mr-1">{linkProps.text}</span>
      </Link>
    </div>
  );
}

// todo: add tests for this component
