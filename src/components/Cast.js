import React from 'react';
import {
  Text,
  Image,
  CircularProgress,
  Center,
  Container,
  Box,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { buildImageUrl, imageFallback, buildMovieCreditsUrl } from '../connectors/tmdb';

import Credits from '../components/Credits';

export default function Cast() {
  const { movieId } = useParams();
  
  const {
    data: credits,
    error,
    isIdle,
    isLoading,
    isError,
  } = useQuery(['credits', movieId], () => fetch(buildMovieCreditsUrl(movieId)).then(r => r.json()));

  //console.log(credits);

  if (isIdle || isLoading) {
    return (
      <Center minH="50vh">
        <CircularProgress isIndeterminate />
      </Center>
    );
  }
  if (isError) {
    return (
      <Container p={3}>
        <Text>
          Error fetching movie with ID {movieId}: {JSON.stringify(error)}
        </Text>
      </Container>
    );
  } 

  return (
    <Container p={3} maxW="70vw">
      <Heading as="h3" size="lg" py={4}>Top Billed Cast</Heading>
      <SimpleGrid columns={6} spacing="50px">
        {credits.cast.slice(0, 6).map(cast => (
          <Box m={3} boxShadow="dark-lg" borderWidth="2px" borderRadius="lg" borderColor="#EDF2F7" w="10.2vw">
            <Box pb={2}>
              <Image borderWidth="1px" borderRadius="lg" src={buildImageUrl(cast.profile_path)} alt={cast.name} w="10vw" maxW={300} fallbackSrc={imageFallback} />
            </Box>
            <Box p={2}>
              <Text as="b">{cast.name}</Text>
              <Text fontSize="sm">{cast.character}</Text>
            </Box> 
          </Box>
        ))}
      </SimpleGrid>
      <Credits />
    </Container>
  );
}
