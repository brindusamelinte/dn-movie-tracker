import { Container, Text, Flex, Box, Spacer, Heading } from '@chakra-ui/react';
import Watchlist from './Watchlist';
import Search from './Search';
import History from './History';
import Recommendations from './Recommendations';

export default function Home() {
  return (
      <Flex>
        <Box p={8} w="500px" borderRightColor="teal" borderRightWidth="1px">
          <Heading as="h3" size="lg" color="teal">You might also like:</Heading>
          <Recommendations limitR={1} />
        </Box>
        <Spacer />  
        <Box p={8}>
          <Box mb={8}>
            <Heading as="h2" size="2xl" color="teal">Welcome and thanks for visiting!</Heading>
            <Text mt={2} fontSize="2xl" color="teal">Discover movies and explore now.</Text>
            <Search />
          </Box>
          <Box mb={8} pt={8} borderTopColor="teal" borderTopWidth="1px">
            <Heading as="h3" mb={8} size="lg" color="teal">Your favorite movies:</Heading>
            <Watchlist backButton="false" deleteButton="false" limitW={3} />
          </Box>
          <Box pt={8} borderTopColor="teal" borderTopWidth="1px">
            <Heading as="h3" mb={8} size="lg" color="teal">Watched movies:</Heading>
            <History limitH={3} searchRefreshButtons="false"/>
          </Box>
        </Box>
      </Flex>
  );
}
