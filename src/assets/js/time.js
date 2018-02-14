export default function (timestamp) {
  const date = new Date(timestamp);
  const upload = Math.floor(timestamp / 1000);
  const now = Math.floor(Date.now() / 1000);
  const gap = now - upload;
  if (gap < 60) {
    return '방금전';
  } else if (gap < 3600) {
    return `${Math.floor(gap / 60)}분전`;
  } else if (gap < 43200) {
    return `${Math.floor(gap / 3600)}시간전`;
  }
  return `${date.getMonth() + 1}월${date.getDate()}일`;
}

export function timestampToDate(timestamp) {
  const newDate = new Date(timestamp);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  return { year, month, date };
}
