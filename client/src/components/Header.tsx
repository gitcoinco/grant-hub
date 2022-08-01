import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDisconnect } from "wagmi";
import { web3AccountDisconnected } from "../actions/web3";
import { RootState } from "../reducers";
import { grantsPath, newGrantPath } from "../routes";
import colors from "../styles/colors";
import { shortAddress } from "../utils/wallet";
import Button, { ButtonVariants } from "./base/Button";
import WalletDisplay from "./base/WalletDisplay";
import { Blockchain, ChainLogos } from "./icons/Blockchain";
import Hamburger from "./icons/Hamburger";
import Plus from "./icons/Plus";

export default function Header() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const disconnect = useDisconnect();
  const dispatch = useDispatch();
  const props = useSelector(
    (state: RootState) => ({
      web3Initialized: state.web3.initialized,
      web3Error: state.web3.error,
      chainID: state.web3.chainID,
      account: state.web3.account,
    }),
    shallowEqual
  );

  const connectHandler = () => {
    // e.preventDefault();
    // dispatch(initializeWeb3());
    console.log("Account clicked");
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-2 mb-3 text-primary-text w-full border-0 sm:border-b container mx-auto h-1/8">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link to={grantsPath()}>
            <div className="flex items-center">
              <img
                className="py-4"
                alt="Gitcoin Logo"
                src="./assets/gitcoin-logo.svg"
              />
              <h3 className="ml-6 mt-1">Grant Hub</h3>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="lg:hidden"
          >
            <div className="border-solid border rounded border-primary-text p-2">
              <Hamburger color={colors["primary-text"]} />
            </div>
          </button>
        </div>
        <div
          className={`lg:flex flex-grow items-center${
            navbarOpen ? " flex" : " hidden"
          }`}
          id="example-navbar-danger"
        >
          <div>l
            <WalletDisplay />
          </div>
          {/* <div className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <Link to={newGrantPath()}>
              <Button variant={ButtonVariants.primary}>
                <i className="icon">
                  <Plus color={colors["quaternary-text"]} />
                </i>
                New Project
              </Button>
            </Link>
            <div className="cursor-pointer" onClick={() => connectHandler()}>
              <i className="icon">
                <Blockchain chain={ChainLogos.ETH} />
              </i>
              {props.account ? shortAddress(props.account) : "Connect Wallet"}
            </div>
            <br />
            <button onClick={() => {
              //disconnect;
              dispatch({ type: "WEB3_ACCOUNT_DISCONNECTED"});
            }}>Log Out</button>
          </div> */}
        </div>
      </div>
    </header>
  );
}
