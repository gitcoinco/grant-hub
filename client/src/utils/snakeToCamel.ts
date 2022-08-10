export const snakeCaseToCamelCase = (input: string) =>
  input
    .split("_")
    .reduce(
      (res, word, i) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word
              .substr(1)
              .toLowerCase()}`,
      ""
    );

export const keysToCamel: any = (o: any) => {
  if (o === Object(o) && !Array.isArray(o) && typeof o !== "function") {
    const n: any = {};
    Object.keys(o).forEach((k) => {
      n[snakeCaseToCamelCase(k)] = keysToCamel(o[k]);
    });
    return n;
  }
  if (Array.isArray(o)) {
    return o.map((i) => keysToCamel(i));
  }
  return o;
};
