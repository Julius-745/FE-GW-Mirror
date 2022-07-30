import React from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const defaultMaskOptions = {
  prefix: "Rp. ",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ".",
  allowDecimal: true,
  decimalSymbol: ",",
  decimalLimit: 2, // how many digits allowed after the decimal
  allowNegative: false,
  allowLeadingZeroes: false,
};

const style = {
  width: "100%",
  minWidth: "0px",
  outline: "2px solid transparent",
  outlineOffset: "2px",
  position: "relative",
  appearance: "none",
  transitionProperty: "var(--chakra-transition-property-common)",
  transitionDuration: "var(--chakra-transition-duration-normal)",
  fontSize: "var(--chakra-fontSizes-md)",
  paddingInlineStart: "var(--chakra-space-4)",
  paddingInlineEnd: "var(--chakra-space-4)",
  height: "var(--chakra-sizes-10)",
  borderRadius: "var(--chakra-radii-md)",
  border: "1px solid",
  borderColor: "inherit",
  background: "inherit",
};

export const CurrencyInput = ({ maskOptions, ...inputProps }: any) => {
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    ...maskOptions,
  });

  return (
    <MaskedInput
      placeholder="Rp. 000"
      mask={currencyMask}
      style={style}
      {...inputProps}
    />
  );
};
