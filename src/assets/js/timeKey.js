export default function () {
  const currDate = new Date();
  const year = currDate.getFullYear();
  let month = currDate.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date = currDate.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  return `${year}a${month}a${date}`;
}

export function timeKeyToDate(timeKey) {
  const temp = timeKey.split('a');
  const year = temp[0];
  let month = temp[1];
  if (month < 10) {
    month = month[1];
  }
  let date = temp[2];
  if (date < 10) {
    date = date[1];
  }
  return { year, month, date };
}
