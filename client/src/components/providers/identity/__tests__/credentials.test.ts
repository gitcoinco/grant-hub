// ---- Mocked values and helpers
import axios from "axios";
import { DIDKitLib, VerifiableCredential } from "@gitcoinco/passport-sdk-types";
import {
  clearAxiosMocks,
  MOCK_CHALLENGE_CREDENTIAL,
  MOCK_VERIFY_RESPONSE_BODY,
} from "../__mocks__/axios";
import * as mockDIDKit from "../__mocks__/didkit";

// ---- Types
import {
  verifyCredential,
  fetchVerifiableCredential,
  GHOrgRequestPayload,
  fetchChallengeCredential,
} from "../credentials";

// ---- Set up DIDKit mock
const DIDKit: DIDKitLib = mockDIDKit as unknown as DIDKitLib;

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Fetch Credentials", () => {
  const IAM_URL = "iam.example";
  const payload: GHOrgRequestPayload = {
    address: "0x0",
    type: "Simple",
    version: "Test-Case-1",
    org: "gitcoinco",
  };

  const MOCK_SIGNATURE = "Signed Message";
  let MOCK_SIGNER: {
    signMessage: jest.Mock<any, any>;
  };

  const IAM_CHALLENGE_ENDPOINT = `${IAM_URL}/v${payload.version}/challenge`;
  const expectedChallengeRequestBody = {
    payload: { address: payload.address, type: payload.type },
  };

  beforeEach(() => {
    MOCK_SIGNER = {
      signMessage: jest
        .fn()
        .mockImplementation(() => Promise.resolve(MOCK_SIGNATURE)),
    };
    clearAxiosMocks();
  });

  it("can fetch a challenge credential", async () => {
    mockedAxios.post.mockImplementationOnce(async () => ({
      data: { credential: MOCK_CHALLENGE_CREDENTIAL },
    }));
    const { challenge: actualChallenge } = await fetchChallengeCredential(
      IAM_URL,
      payload
    );

    // check that called the axios.post fn
    expect(axios.post).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      IAM_CHALLENGE_ENDPOINT,
      expectedChallengeRequestBody
    );
    expect(actualChallenge).toEqual(MOCK_CHALLENGE_CREDENTIAL);
  });

  it("can fetch a verifiable credential", async () => {
    mockedAxios.post.mockImplementation(async (url) => {
      if (url.includes("challenge")) {
        return {
          data: { credential: MOCK_CHALLENGE_CREDENTIAL },
        };
      }

      if (url.includes("verify")) {
        return {
          data: MOCK_VERIFY_RESPONSE_BODY,
        };
      }

      return {
        status: 404,
      };
    });

    const { credential, record, signature, challenge } =
      await fetchVerifiableCredential(IAM_URL, payload, MOCK_SIGNER);

    // called to fetch the challenge and to verify
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      IAM_CHALLENGE_ENDPOINT,
      expectedChallengeRequestBody
    );

    expect(MOCK_SIGNER.signMessage).toHaveBeenCalled();

    // we expect to get back the mocked response
    expect(signature).toEqual(MOCK_SIGNATURE);
    expect(challenge).toEqual(MOCK_CHALLENGE_CREDENTIAL);
    expect(credential).toEqual(MOCK_VERIFY_RESPONSE_BODY.credential);
    expect(record).toEqual(MOCK_VERIFY_RESPONSE_BODY.record);
  });

  it("will fail if not provided a signer to sign the message", async () => {
    await expect(
      fetchVerifiableCredential(IAM_URL, payload, undefined)
    ).rejects.toThrow("Unable to sign message without a signer");

    expect(axios.post).not.toBeCalled();
  });

  it("will not attempt to sign if not provided a challenge in the challenge credential", async () => {
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        credential: {
          credentialSubject: {
            challenge: null,
          },
        },
      },
    });

    await expect(
      fetchVerifiableCredential(IAM_URL, payload, MOCK_SIGNER)
    ).rejects.toThrow("Unable to sign message");

    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      IAM_CHALLENGE_ENDPOINT,
      expectedChallengeRequestBody
    );
    // NOTE: the signMessage function was never called
    expect(MOCK_SIGNER.signMessage).not.toBeCalled();
  });
});

describe("Verify Credentials", () => {
  beforeEach(() => {
    mockDIDKit.clearDidkitMocks();
  });

  it("cannot verify a valid but expired credential", async () => {
    // create a date and move it into the past
    const expired = new Date();
    expired.setSeconds(expired.getSeconds() - 1);

    // if the expiration date is in the past then this VC has expired
    const credential = {
      expirationDate: expired.toISOString(),
    } as unknown as VerifiableCredential;

    // before the credential is verified against DIDKit - we check its expiration date...
    expect(await verifyCredential(DIDKit, credential)).toEqual(false);
    // expect to have not called verify on didkit
    expect(DIDKit.verifyCredential).not.toBeCalled();
  });

  it("returns false when DIDKit.verifyCredential returns with errors", async () => {
    const futureExpirationDate = new Date();
    futureExpirationDate.setFullYear(futureExpirationDate.getFullYear() + 1);
    const credentialToVerify = {
      expirationDate: futureExpirationDate.toISOString(),
      proof: {
        proofPurpose: "myProof",
      },
    } as VerifiableCredential;

    // DIDKit.verifyCredential can return with a non-empty errors array
    mockDIDKit.verifyCredential.mockResolvedValue(
      JSON.stringify({
        checks: ["proof"],
        warnings: [],
        errors: ["signature error"],
      })
    );

    expect(await verifyCredential(DIDKit, credentialToVerify)).toEqual(false);
    expect(DIDKit.verifyCredential).toHaveBeenCalled();
  });

  it("returns false when DIDKit.verifyCredential rejects with an exception", async () => {
    const futureExpirationDate = new Date();
    futureExpirationDate.setFullYear(futureExpirationDate.getFullYear() + 1);
    const credentialToVerify = {
      expirationDate: futureExpirationDate.toISOString(),
      proof: {
        proofPurpose: "myProof",
      },
    } as VerifiableCredential;

    mockDIDKit.verifyCredential.mockRejectedValue(
      new Error("something went wrong :(")
    );

    expect(await verifyCredential(DIDKit, credentialToVerify)).toEqual(false);
    expect(DIDKit.verifyCredential).toHaveBeenCalled();
  });
});
