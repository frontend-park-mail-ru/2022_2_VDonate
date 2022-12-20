// Convert Date to string with format dd mmmm в hh:mm (e.g. 12 мар в 05:00)
const dateFormate = (rawDate: string): string => {
  const date = new Date(rawDate);
  const monthNames = [
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];
  return `${date.getDate()} ${monthNames[date.getMonth()]} в ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default dateFormate;
