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

// Replace test data with your own
// const features = Array.from({ length: 8 }, (_, i) => {
//   return {
//     id: i,
//     title: 'Lorem ipsum dolor sit amet',
//     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
//   };
// });

const features = [
  {
    id: 1,
    title: 'Interactive Data Analysis',
    text: 'Perform advanced statistical analysis using an intuitive interface directly in your browser',
  },
  {
    id: 2,
    title: 'Data Visualization',
    text: 'Visualize your data with a wide range of customizable charts and graphs. Gain insights quickly through dynamic visual representations.',
  },
  {
    id: 3,
    title: 'Statistical Tools',
    text: 'Access a comprehensive suite of statistical tools including hypothesis testing, ANOVA, correlation analysis, and more. Empower yourself with the tools needed to tackle any statistical challenge.',
  },
  {
    id: 4,
    title: 'Data Import and Export',
    text: 'Import data from CSV. Export results and visualizations to share with others or integrate into presentations and reports.',
  },
];

const GridListWithHeading = (): JSX.Element => {
  return (
    <Container maxWidth='unset'>
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
        {features.map((feature) => (
          <HStack key={feature.id} align='top'>
            <Box color='green.400' px={2}>
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

export { GridListWithHeading };
