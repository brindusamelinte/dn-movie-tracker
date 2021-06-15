import React from 'react';
import { Container, IconButton, Box, Center, CircularProgress } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons'
import Watchlist from './Watchlist';
import { buildHistoryApiUrl } from '../connectors/api';
import { useQuery } from 'react-query';

export default function Recommendations() {
  const [refresh, setRefresh] = React.useState(0);

  const { 
    data: movies, 
    error, 
    isIdle, 
    isLoading, 
    isError 
  } = useQuery('histories', () => fetch(buildHistoryApiUrl()).then(r => r.json()));
 
  if (isIdle) {
    return null;
  }
  
  if (isLoading) {
    return (
      <Center minH="50vh">
        <CircularProgress isIndeterminate />
      </Center>
    );
  }

  if (isError) {
    return (
      <Container p={3}>
        <Text>Error fetching histories: {JSON.stringify(error)}</Text>
      </Container>
    );
  }


  return (  
    <Container p={3} maxW="50em">
      <Box w="70vw" display="flex" justifyContent="flex-end">
        <IconButton onClick={() => setRefresh(refresh + 1)} aria-label="Repeat" colorScheme="teal" icon={<RepeatIcon/>} />
      </Box>
      <Watchlist recommended="true" watchedMovies={movies.map(movie => movie.movieId)} key={refresh} />
    </Container>
  );
}
