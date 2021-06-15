import { Container, Text, Flex, Box, Spacer } from '@chakra-ui/react';

export default function Home() {
  return (
    <Container m={4} p={4} maxWidth="container.xl" centerContent borderWidth="1px" borderColor="red">
      <Flex>
        <Box w="40%" h="10" bg="red.500"></Box>
        <Spacer />
        <Box w="40%" h="10" bg="red.500"></Box>
      </Flex>
    </Container>
  );
}
