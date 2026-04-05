// Source - https://stackoverflow.com/a
// Posted by John Rutherford, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-17, License - CC BY-SA 4.0

/** Returns a regex match array if `email` looks valid, otherwise `null` (email is lowercased first). */
export const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
