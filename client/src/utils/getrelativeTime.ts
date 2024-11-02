import { formatDistanceToNowStrict } from "date-fns";

export const getrelativeTime = (date: Date) => {
  const relativeTime = formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    roundingMethod: "floor",
  })
    .replace("minutes", "m")
    .replace("minute", "m")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("days", "d")
    .replace("day", "d")
    .replace("weeks", "w")
    .replace("week", "w")
    .replace("months", "mo")
    .replace("month", "mo")
    .replace("years", "y")
    .replace("year", "y");
  return relativeTime;
};
