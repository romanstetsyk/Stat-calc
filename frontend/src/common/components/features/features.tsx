import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { featuresList } from './features-list';

const Features = (): JSX.Element => {
  return (
    <Container maxWidth='unset' as='section' id='features'>
      <Stack
        spacing={4}
        maxW='4xl'
        textAlign='center'
        mx='auto'
        py={{ base: 10, md: 20 }}
      >
        <Heading fontSize='3xl'>Feature Highlights</Heading>
        <Text color='gray.600' fontSize='xl'>
          Our platform is continuously evolving to bring you enhanced
          functionality and exciting new tools
        </Text>
      </Stack>

      <SimpleGrid
        maxW='4xl'
        mx='auto'
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={10}
        pb={{ base: 10, md: 20 }}
      >
        {featuresList.map((feature) => (
          <HStack key={feature.id} align='top'>
            <Box color='brand.accent' px={2}>
              <Icon as={CheckIcon} />
            </Box>
            <VStack align='start'>
              <Text fontWeight={600}>{feature.title}</Text>
              <Text color='gray.600'>{feature.text}</Text>
            </VStack>
          </HStack>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export { Features };
