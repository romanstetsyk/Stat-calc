import type { FlexProps } from '@chakra-ui/react';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type Props = FlexProps & {
  href?: string;
  children: React.ReactNode;
};

const DesktopNavLink = forwardRef<HTMLElement, Props>(
  ({ href, children, ...flexProps }, ref): JSX.Element => {
    const linkColor = useColorModeValue('brand.text.subtle', 'gray.200');
    const linkHoverColor = useColorModeValue('brand.text.primary', 'white');

    return (
      <Flex
        ref={ref}
        alignItems='center'
        height='100%'
        as={RouterLink}
        p={2}
        to={href ?? '#'}
        fontSize='sm'
        fontWeight={500}
        color={linkColor}
        _hover={{
          textDecoration: 'none',
          color: linkHoverColor,
        }}
        whiteSpace='nowrap'
        {...flexProps}
      >
        {children}
      </Flex>
    );
  },
);

DesktopNavLink.displayName = 'DesktopNavLink';

export { DesktopNavLink };
