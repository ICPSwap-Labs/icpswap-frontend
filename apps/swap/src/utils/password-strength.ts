// has number
const hasNumber = (value: string) => {
  return new RegExp(/[0-9]/).test(value);
};

// has mix of small and capitals
const hasMixed = (value: string) => {
  return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};

// has special chars
const hasSpecial = (value: string) => {
  return new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
};

// password strength indicator
export const strengthIndicator = (value: string) => {
  let strengths = 0;
  if (value.length > 5) strengths++;
  if (value.length > 7) strengths++;
  if (hasNumber(value)) strengths++;
  if (hasSpecial(value)) strengths++;
  if (hasMixed(value)) strengths++;
  return strengths;
};
