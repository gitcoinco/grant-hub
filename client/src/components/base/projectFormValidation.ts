import { object, string } from "yup";

export interface FormSchema {
  title: string;
  description: string;
  website: string;
  challenges: string;
  roadmap: string;
}

export async function validateProjectForm(inputs: FormSchema) {
  const schema = object({
    title: string().required(),
    description: string().required(),
    website: string().url().required(),
    challenges: string().required(),
    roadmap: string().required(),
  });

  const validatedInputs = await schema.validate(inputs);
  return validatedInputs;
}
