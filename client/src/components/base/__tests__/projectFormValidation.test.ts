import { ValidationError } from "yup";
import { validateProjectForm } from "../projectFormValidation";

const validInputs = {
  title: "Project Title",
  description: "Project Description",
  website: "https://gitcoin.co/",
  challenges: "Project Challenges",
  roadmap: "Project Roadmap",
};

describe("Form Validation", () => {
  it("returns original inputs if they are valid", async () => {
    const validation = await validateProjectForm(validInputs);

    expect(validation).toBe(validInputs);
  });

  it("returns error if title is empty string", async () => {
    validInputs.title = "";
    try {
      await validateProjectForm(validInputs);
    } catch (e) {
      const error = e as ValidationError;
      expect(error.message).toBe("title is a required field");
      expect(error.name).toBe("ValidationError");
    }
  });

  it("returns url error if url is not valid", async () => {
    validInputs.website = "gitcoin.co/";
    try {
      await validateProjectForm(validInputs);
    } catch (e) {
      const error = e as ValidationError;
      expect(error.message).toBe("website must be a valid URL");
      expect(error.name).toBe("ValidationError");
    }
  });
});
