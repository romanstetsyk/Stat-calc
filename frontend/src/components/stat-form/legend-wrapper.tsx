import type {
  ComponentWithAs,
  FormLabelProps,
  TextProps,
} from '@chakra-ui/react';

type Props = {
  legend: string;
  elem:
    | ComponentWithAs<'label', FormLabelProps> // FormLabel
    | ComponentWithAs<'p', TextProps>; // Text
};

const LegendWrapper = ({ legend, elem: Element }: Props): JSX.Element => {
  return (
    <Element as='legend' fontWeight={700} mb={2}>
      {legend}
    </Element>
  );
};

export { LegendWrapper };
