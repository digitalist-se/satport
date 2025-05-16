import { DateTime } from "luxon";

export const formatDate = (value: string, locale = "en") => {
  const dt = DateTime.fromISO(value);
  if (!dt.isValid) {
    console.error("Invalid date");
    return null;
  }

  return dt.toLocaleString(DateTime.DATE_MED, {
    locale,
  });
};
