import "@testing-library/jest-dom";
import { act, cleanup, screen } from "@testing-library/react";
import { web3ChainIDLoaded } from "../../../../actions/web3";
import setupStore from "../../../../store";
import {
  addressFrom,
  buildProjectApplication,
  buildRound,
  renderWrapped,
} from "../../../../utils/test_utils";
import Rounds from "../Rounds";

// the params are needed to create the unique project id, etc..
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    chainId: "5",
    id: "2",
    registryAddress: addressFrom(123),
  }),
}));

describe("<Rounds />", () => {
  afterEach(() => {
    cleanup();
  });

  describe("When the data is loading", () => {
    test("should show loading", async () => {
      await act(async () => {
        renderWrapped(<Rounds />, setupStore());
      });

      expect(
        screen.getByText("Loading your information, please stand by...")
      ).toBeInTheDocument();
    });
  });

  describe("when the data is loaded", () => {
    const store = setupStore();
    store.dispatch(web3ChainIDLoaded(5));

    test.only("should show the active rounds", async () => {
      const round1 = buildRound({
        address: addressFrom(1),
        applicationsEndTime: 1663751954,
        // you need to set the correct application and round times which fits into your if statements
      });
      const round2 = buildRound({
        address: addressFrom(2),
      });
      store.dispatch({
        type: "ROUNDS_ROUND_LOADED",
        address: addressFrom(1),
        round: round1,
      });
      store.dispatch({
        type: "ROUNDS_ROUND_LOADED",
        address: addressFrom(2),
        round: round2,
      });
      const applications = [];
      applications.push(
        buildProjectApplication({ roundID: addressFrom(1), status: "APPROVED" })
        // set the status directly here, saves some pain
      );
      applications.push(
        buildProjectApplication({ roundID: addressFrom(2), status: "REJECTED" })
      );
      store.dispatch({
        type: "PROJECT_APPLICATIONS_LOADED",
        applications,
        projectID: "2",
      });

      await act(async () => {
        renderWrapped(<Rounds />, store);
      });
      expect(screen.getByText("Active Rounds")).toBeInTheDocument();
    });

    test("should show the current applications", async () => {
      await act(async () => {
        renderWrapped(<Rounds />, store);
      });
      expect(screen.getByText("Current Applications")).toBeInTheDocument();
    });
    test("should show the past rounds", async () => {
      await act(async () => {
        renderWrapped(<Rounds />, store);
      });
      expect(screen.getByText("Past Rounds")).toBeInTheDocument();
    });
  });
});
