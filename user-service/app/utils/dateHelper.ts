import dayjs from "dayjs";

// Function to calculate the time difference between two dates
export const TimeDifference = (
  fromDate: string,
  toDate: string,
  type: "d" | "h" | "m"
) => {
  const startDate = dayjs(fromDate); // Convert fromDate to a dayjs object
  const endDate = dayjs(toDate); // Convert toDate to a dayjs object

  // Calculate the difference based on the specified type (days, hours, or minutes)
  return startDate.diff(endDate, type, true); // Return the difference
};
