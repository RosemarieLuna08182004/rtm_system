export const GetDateTime = () => {
  const dateToday = new Date();
  dateToday.setUTCHours(dateToday.getUTCHours());
  return dateToday;
};
