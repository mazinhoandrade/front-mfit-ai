import { GetWorkoutPlan200WorkoutDaysItem } from "../_lib/api/fetch-generated";

const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function getOrderDay(workoutDays: GetWorkoutPlan200WorkoutDaysItem[]) {
  const sortedDays = [...workoutDays].sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekDay) - WEEKDAY_ORDER.indexOf(b.weekDay),
  );

  return sortedDays;
}
