function compareDates(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  return date1.getTime() - date2.getTime();
}

export default compareDates;

