import {
  Box,
  Button,
  Container,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RRDLink } from 'react-router-dom';

import { ArrowIcon } from './arrow-icon';

const Hero = (): JSX.Element => {
  return (
    <Container backgroundColor='gray.50' maxWidth='unset'>
      <Stack
        as='main'
        maxW='4xl'
        textAlign='center'
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
        mx='auto'
      >
        <Heading
          as='h1'
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight='110%'
        >
          Unlock the power of data <br />
          <Text as='span' color='green.400'>
            with NextStat
          </Text>
        </Heading>
        <Text color='gray.500'>
          Simplify statistical analysis, gain valuable insights, and make
          data-driven decisions effortlessly
        </Text>
        <Stack
          direction='column'
          spacing={3}
          align='center'
          alignSelf='center'
          position='relative'
        >
          <Button
            as={RRDLink}
            to='/app'
            colorScheme='green'
            bg='green.400'
            rounded='full'
            px={6}
            _hover={{
              bg: 'green.500',
            }}
          >
            Open App
          </Button>
          <Button
            variant='link'
            colorScheme='blue'
            size='sm'
            as='a'
            href='#features'
          >
            Learn more
          </Button>
          <Box>
            <Icon
              as={ArrowIcon}
              color={useColorModeValue('gray.800', 'gray.300')}
              w={71}
              position='absolute'
              right={-71}
              top='10px'
            />
            <Text
              fontSize='lg'
              fontFamily='cursive'
              position='absolute'
              right='-6rem'
              top='-15px'
              transform='rotate(10deg)'
            >
              It&apos;s free!
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export { Hero };
