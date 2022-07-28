// --- Methods
import { useEffect, useState } from "react";
// import { debounce } from "ts-debounce";
import { shallowEqual, useSelector } from "react-redux";
import { global } from "../../global";
// --- Identity tools
import { ProviderID } from "./types";
import { fetchVerifiableCredential } from "./identity";
import { RootState } from "../../reducers";

// --- Components
// import { Card } from "../Card";

// --- Context
// import { CeramicContext } from "../../context/ceramicContext";
// import { UserContext } from "../../context/userContext";

// Each provider is recognised by its ID
const providerId: ProviderID = "Github";

function generateUID(length: number) {
  return window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
        .map((b) => String.fromCharCode(b))
        .join("")
    )
    .replace(/[+/]/g, "")
    .substring(0, length);
}

export default function Github() {
  const props = useSelector(
    (state: RootState) => ({
      account: state.web3.account,
    }),
    shallowEqual
  );
  const signer = global.web3Provider?.getSigner();
  // const { handleAddStamp, allProvidersState } = useContext(CeramicContext);
  const [isLoading, setLoading] = useState(false);
  const [GHID, setGHID] = useState("");
  console.log({ isLoading });

  // Open Github authUrl in centered window
  function openGithubOAuthUrl(url: string): void {
    const width = 600;
    const height = 800;
    // eslint-disable-next-line no-restricted-globals
    const left = screen.width / 2 - width / 2;
    // eslint-disable-next-line no-restricted-globals
    const top = screen.height / 2 - height / 2;

    // Pass data to the page via props
    window.open(
      url,
      "_blank",
      // eslint-disable-next-line max-len
      `toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  }

  // Fetch Github OAuth2 url from the IAM procedure
  async function handleFetchGithubOAuth(): Promise<void> {
    // Generate a new state string and store it in the compoenents state so that we can
    // verify it later
    const ghID = `github-${generateUID(10)}`;
    setGHID(ghID);

    // eslint-disable-next-line max-len
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PUBLIC_GITHUB_CALLBACK}&state=${ghID}`;
    openGithubOAuthUrl(githubUrl);
  }

  // Listener to watch for oauth redirect response on other windows (on the same host)
  function listenForRedirect(e: {
    target: string;
    data: { code: string; state: string };
  }) {
    // when receiving github oauth response from a spawned child run fetchVerifiableCredential
    if (e.target === "github") {
      // pull data from message
      const { code } = e.data;

      if (GHID !== e.data.state) {
        setLoading(false);
        return;
      }

      // fetch and store credential
      setLoading(true);
      fetchVerifiableCredential(
        process.env.REACT_APP_PASSPORT_IAM_URL || "",
        {
          type: providerId,
          version: "0.0.0",
          address: props.account || "",
          proofs: {
            code, // provided by github as query params in the redirect
          },
        },
        signer as { signMessage: (message: string) => Promise<string> }
      )
        .then(async (verified: { credential: any }): Promise<void> => {
          console.log({ verified });
          // await handleAddStamp({
          //   provider: providerId,
          //   credential: verified.credential,
          // });
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  // attach and destroy a BroadcastChannel to handle the message
  useEffect(() => {
    // open the channel
    const channel = new BroadcastChannel("github_oauth_channel");
    // event handler will listen for messages from the child (debounced to avoid multiple submissions)
    channel.onmessage = (event: MessageEvent) => {
      listenForRedirect(event.data);
    };

    return () => {
      channel.close();
    };
  });

  return (
    <button
      type="button"
      className="verify-btn"
      onClick={handleFetchGithubOAuth}
    >
      Connect account
    </button>
  );
}
