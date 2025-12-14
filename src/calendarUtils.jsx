export function getMonthDays(year, month) {
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}
