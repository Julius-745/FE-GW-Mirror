export const formatMoney = (
  locales = "id-ID",
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    ...options,
  });
};

export const formatIDR = (val: number | string) => formatMoney().format(+val);
