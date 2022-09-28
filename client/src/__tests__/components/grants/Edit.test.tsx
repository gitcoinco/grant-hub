import EditProject from "../../../components/grants/Edit";
import setupStore from "../../../store";
import { renderWrapped, buildProjectMetadata } from "../../../utils/test_utils";

// // import { fetchGrantData } from "../../../actions/grantsMetadata";
// // import { ProjectEvent } from "../../../types";

// // jest.mock("../../../actions/grantsMetadata");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "123",
  }),
}));

describe("<EditProject />", () => {
  describe("useEffect/fetchGrantData", () => {
    test("should be called the first time", async () => {
      const store = setupStore();
      const metadata = buildProjectMetadata({id: 123});
//       // (loadRound as jest.Mock).mockReturnValue({ type: "TEST" });
//       // (unloadRounds as jest.Mock).mockReturnValue({ type: "TEST" });
//       // (loadProjects as jest.Mock).mockReturnValue({ type: "TEST" });

      store.dispatch({
        type: "GRANT_METADATA_FETCHED",
        data: metadata
      });

      renderWrapped(<EditProject />, store);

//       // expect(fetchGrantData).toBeCalledTimes(1);
    });
  });
});
