import { object, string } from "yup";
import {
  DynamicFormInputs,
  FormInputs,
  RoundApplicationQuestion,
} from "../../types";
// import { isValidAddress } from "../../utils/wallet";

export async function validateProjectForm(inputs: FormInputs) {
  const schema = object({
    title: string().required("Project Name is required"),
    description: string().required("Project Description is required"),
    website: string()
      .url("Project Website must be a valid url. e.g. https://gitcoin.co/")
      .required("Project Website is required"),
  });

  const validatedInputs = await schema.validate(inputs, { abortEarly: false });
  return validatedInputs;
}

// const isValid = (value: string) => isValidAddress(value);

export async function validateApplication(
  defaultInputs: RoundApplicationQuestion[],
  formInputs: DynamicFormInputs
) {
  const schema = defaultInputs.reduce((acc, input) => {
    const { id, required, type } = input;
    console.log("validation", id, required, type, formInputs[id]);
    if (id !== undefined) {
      return {
        ...acc,
        [id]: required
          ? string().required(`${input.question} is required`)
          : string(),
        // [id]:
        //   isValid(formInputs[id]) && required && type === "RECIPIENT"
        //     ? string()
        //         .matches(/^0x[a-fA-F0-9]{40}$/g, {
        //           excludeEmptyString: true,
        //           message: "Recipient Address must be a valid Ethereum address",
        //         })
        //         .required("Recipient Address is required")
        //     : string(),
        isSafe: string().required("Is this address a safe is required"),
      };
    }
    return acc;
  }, {});

  const validatedInputs = await object(schema).validate(formInputs, {
    abortEarly: false,
  });
  return validatedInputs;
}
