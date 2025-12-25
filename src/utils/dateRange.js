function parseDateRange(dateFrom, dateTo) {
  let from = null;
  let to = null;

  if (dateFrom) {
    const d = new Date(dateFrom);
    if (!isNaN(d.getTime())) {
      from = d;
    }
  }

  if (dateTo) {
    const d = new Date(dateTo);
    if (!isNaN(d.getTime())) {
      // date_to включительно, добавляем конец дня
      d.setHours(23, 59, 59, 999);
      to = d;
    }
  }

  return { from, to };
}

module.exports = { parseDateRange };
