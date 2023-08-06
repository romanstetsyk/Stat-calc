import { ComponentWithAs, FormLabelProps, TextProps } from "@chakra-ui/react";

type Props = {
  legend: string;
  elem:
    | ComponentWithAs<"label", FormLabelProps> // FormLabel
    | ComponentWithAs<"p", TextProps>; // Text
};

export const LegendWrapper = ({ legend, elem: Element }: Props) => {
  return (
    <Element as="legend" fontWeight={700} mb={2}>
      {legend}
    </Element>
  );
};
