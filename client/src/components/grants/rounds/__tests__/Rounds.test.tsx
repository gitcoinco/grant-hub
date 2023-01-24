// import React from "react";
import "@testing-library/jest-dom";
import { act, cleanup, screen } from "@testing-library/react";
// import setupStore from "../../../../store";
import { renderWrapped } from "../../../../utils/test_utils";
import Rounds from "../Rounds";

describe("<Rounds />", () => {
  afterEach(() => {
    cleanup();
  });

  describe("When the data is loading", () => {
    test("should show loading", async () => {
      await act(async () => {
        renderWrapped(<Rounds />);
      });

      expect(
        screen.getByText("Loading your information, please stand by...")
      ).toBeInTheDocument();
    });
  });

  describe("when the data is loaded", () => {
    // let store: any;
    // beforeEach(() => {
    //   store = setupStore();
    // });
    // test("should show the active rounds", async () => {
    //   await act(async () => {
    //     renderWrapped(<Rounds />, store);
    //   });
    //   expect(screen.getByText("Active Rounds")).toBeInTheDocument();
    // });
    // test("should show the current applications", async () => {
    //   await act(async () => {
    //     renderWrapped(<Rounds />, store);
    //   });
    //   expect(screen.getByText("Current Applications")).toBeInTheDocument();
    // });
    // test("should show the past rounds", async () => {
    //   await act(async () => {
    //     renderWrapped(<Rounds />, store);
    //   });
    //   expect(screen.getByText("Past Rounds")).toBeInTheDocument();
    // });
  });
});
