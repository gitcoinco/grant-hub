// import React from "react";
import "@testing-library/jest-dom";
import { act, cleanup, screen } from "@testing-library/react";
// import { web3ChainIDLoaded } from "../../../../actions/web3";
import setupStore from "../../../../store";
// import {
//   addressFrom,
//   buildProjectApplication,
//   buildRound,
//   renderWrapped,
// } from "../../../../utils/test_utils";
import { renderWrapped } from "../../../../utils/test_utils";
import Rounds from "../Rounds";

describe("<Rounds />", () => {
  afterEach(() => {
    cleanup();
  });

  describe("When the data is loading", () => {
    test("should show loading", async () => {
      await act(async () => {
        renderWrapped(<Rounds />, setupStore());
      });

      // expect(
      //   screen.getByText("Loading your information, please stand by...")
      // ).toBeInTheDocument();
    });
  });

  describe("when the data is loaded", () => {
    test("should show the active rounds when there is any", async () => {
      // const store = setupStore();
      // store.dispatch(web3ChainIDLoaded(5));
      // const round1 = buildRound({
      //   address: addressFrom(1),
      // });
      // const round2 = buildRound({
      //   address: addressFrom(2),
      // });
      // store.dispatch({
      //   type: "ROUNDS_ROUND_LOADED",
      //   address: addressFrom(1),
      //   round: round1,
      // });
      // store.dispatch({
      //   type: "ROUNDS_ROUND_LOADED",
      //   address: addressFrom(2),
      //   round: round2,
      // });
      // const applications = [];
      // applications.push(
      //   buildProjectApplication({ roundID: addressFrom(1), status: "APPROVED" })
      // );
      // applications.push(
      //   buildProjectApplication({ roundID: addressFrom(2), status: "REJECTED" })
      // );
      // store.dispatch({
      //   type: "PROJECT_APPLICATIONS_LOADED",
      //   applications,
      //   projectID: "2",
      // });
      // console.log(applications);
      // store.dispatch({
      //   type: "PROJECT_APPLICATION_UPDATED",
      //   projectID: "2",
      //   roundID: addressFrom(1),
      //   status: "APPROVED",
      // });
      // store.dispatch({
      //   type: "PROJECT_APPLICATION_UPDATED",
      //   projectID: "2",
      //   roundID: addressFrom(2),
      //   status: "REJECTED",
      // });
      // await act(async () => {
      //   renderWrapped(<Rounds />, store);
      // });
      // expect(screen.getByText("Active Rounds")).toBeInTheDocument();
    });
    test("should show the current applications", async () => {
      //   await act(async () => {
      //     renderWrapped(<Rounds />, store);
      //   });
      //   expect(screen.getByText("Current Applications")).toBeInTheDocument();
    });
    test("should show the past rounds", async () => {
      //   await act(async () => {
      //     renderWrapped(<Rounds />, store);
      //   });
      //   expect(screen.getByText("Past Rounds")).toBeInTheDocument();
    });
  });
});
