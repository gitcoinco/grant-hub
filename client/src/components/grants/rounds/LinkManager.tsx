import { Link } from "react-router-dom";

export enum LinkDisplayType {
  "External",
  "Internal",
}

export type LinkProps = {
  displayType: LinkDisplayType;
  link: string;
  text: string;
};

// todo: figure out what we need for the proper link display
export default function LinkManager({ linkProps }: { linkProps: LinkProps }) {
  return (
    <div>
      <Link to="/">{linkProps.text}</Link>
    </div>
  );
}

// todo: add tests for this component
