import React from 'react';
import {
  Text,
  Image,
  CircularProgress,
  Center,
  Container,
  Box,
  SimpleGrid,
  Badge,
  Tooltip,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { WATCHLIST_URL } from '../connectors/api';
import { useQuery } from 'react-query';
import { buildFavoritesApiUrl } from '../connectors/api';


export default function Watchlist() {
  const history = useHistory();

  const { 
    data: movies, 
    error, 
    isIdle, 
    isLoading, 
    isError 
  } = useQuery('favorites', () => fetch(buildFavoritesApiUrl()).then(r => r.json()));

  //console.log(movies);

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
        <Text>Error fetching watchlist: {JSON.stringify(error)}</Text>
      </Container>
    );
  }

  const convertTime = n => {
    const h = Math.floor(n / 60);
    const m = n % 60;
    return `${h}h ${m}min`;
  }

  return (
    <Container p={3} maxW="80em">
      <HStack mb={3} justify="space-between">
          <IconButton
            aria-label="Back"
            icon={<ChevronLeftIcon />}
            variant="outline"
            fontSize={36}
            colorScheme="teal"
            onClick={history.goBack}
          />
        </HStack>
      <SimpleGrid minChildWidth={150} spacing={30}>
        {movies.map(movie => (
          <Box p={2}>
            <Box as={Link} to={`/movies/${movie.movieId}`} key={movie.id} pos="relative" noOfLines={2}>
              <Badge p={2} variant="solid" borderWidth="1px" borderRadius="md" colorScheme="teal" pos="absolute" top={2} left={2}>
                {convertTime(movie.runtime)}
              </Badge>
              <Tooltip label={movie.title}>
                <Image
                  src={buildImageUrl(movie.posterPath, 'w45')}
                  alt="Poster"
                  w="20vw"
                  borderWidth="1px" 
                  borderRadius="lg"
                  fallbackSrc={imageFallback}
                />
              </Tooltip>
            </Box>
            <Box py={4} fontWeight="semibold">
              <Text as="span">{movie.title} </Text>
              <Text as="span" color="GrayText">({movie.year})</Text>
            </Box>
            <Box>
              <Text as="cite" py={2} fontSize="md" >{movie.tagline}</Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
