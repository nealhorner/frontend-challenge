export const getUTCDate = () => {
  const date = new Date();
  const utc_epoch_milliseconds = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );
  return new Date(utc_epoch_milliseconds);
};
