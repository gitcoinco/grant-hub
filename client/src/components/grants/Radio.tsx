import { InputProps } from "../../types";

type RadioInputProps = InputProps & {
  choices?: string[];
  required: boolean;
};

export default function Radio({
  label,
  name,
  value,
  info,
  choices = [],
  changeHandler,
  required,
  disabled,
  isValid,
}: RadioInputProps) {
  const borderColor = isValid ? "border-gray-300" : "border-gitcoin-pink-500";
  return (
    <div>
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>
      {required && (
        <span className="absolute text-purple-700 ml-4 md:right-1/2 sm:right-0 lg:right-1/2">
          *Required
        </span>
      )}
      <legend>{info}</legend>
      <fieldset className="mt-4" id={name} disabled={disabled}>
        <div className="space-y-2">
          {choices.map((choice) => {
            const choiceId = choice.toLowerCase().replaceAll(" ", "_");
            return (
              <div key={choiceId} className="flex justify-start w-1/2">
                <input
                  value={choice}
                  name={name}
                  checked={choice === value}
                  onChange={changeHandler}
                  type="radio"
                  className={`focus:ring-indigo-500 text-indigo-600 ${borderColor} w-4 flex-none`}
                />
                <label htmlFor={choiceId} className="ml-3 mb-0">
                  {choice}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
