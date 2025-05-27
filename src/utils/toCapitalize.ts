export const toCapitalize = (text: string | undefined) =>
    text ? text.replace(/\b\w/g, (char) => char.toUpperCase()) : "";
  
export const toUpperCase = (text: string | undefined) =>
    text ? text.toUpperCase() : "";

  