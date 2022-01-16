import React from 'react';
import {
  Text,
  Image,
  CircularProgress,
  Center,
  Container,
  Box,
  HStack,
  Heading,
  IconButton,
  Link,
  Tooltip
} from '@chakra-ui/react';
import { ChevronLeftIcon, AddIcon, CheckIcon, ExternalLinkIcon, LinkIcon } from '@chakra-ui/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { buildImageUrl, imageFallback, buildMovieUrl, buildMovieCreditsUrl } from '../connectors/tmdb';
import { getYear } from '../utils';
import { buildMovieApiUrl } from '../connectors/api';
import WatchlistButton from '../components/WatchlistButton';
import HistoryButton from '../components/HistoryButton';  
import Cast from "../components/Cast";


export default function Movie() {
  const { movieId } = useParams();
  const history = useHistory();
  // const [isHistoryActive, setHistoryActive] = React.useState(false); // temp state, for UI only, should be removed when implemented properly

  const {
    data: movie,
    error,
    isIdle,
    isLoading,
    isError,
  } = useQuery(['movie', movieId], () => fetch(buildMovieApiUrl(movieId)).then(r => r.json()));

  //console.log(movie);

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

  const convertTime = n => {
    const h = Math.floor(n / 60);
    const m = n % 60;
    return `${h}h ${m}min`;
  }

  return (
    <>
      <Container p={3} maxW="100vw">
        <HStack mb={3} justify="space-between">
          <IconButton
            aria-label="Back"
            icon={<ChevronLeftIcon />}
            variant="outline"
            fontSize={36}
            colorScheme="teal"
            onClick={history.goBack}
          />
          <HStack>
            <WatchlistButton movie={movie} />
            <HistoryButton movie={movie} />
          </HStack>
        </HStack>
        <Box p={6} color="white" background="teal" display="flex" justifyContent="center" flexDir="row" flexWrap="wrap">
          <HStack maxW="70vw" spacing={4} align="flex-start" position="relative" >
            <Box>
              <Image
                src={buildImageUrl(movie.posterPath, 'w300')}
                alt="Poster"
                w="35vw"
                maxW={300}
                fallbackSrc={imageFallback}
                borderWidth="1px" 
                borderRadius="lg"
              />
            </Box>
            <Box pl={3} w="100%">
              <HStack py={2} justify="flex-start">
                <Heading as="h2">
                  <Link href={`https://www.imdb.com/title/${movie.imdbId}/`} isExternal>
                    {movie.title}<ExternalLinkIcon mx="2px" boxSize={6} />
                  </Link>
                </Heading>
                <Text as="span" color="white">
                  ({movie.year} - {movie.originalLanguage.toUpperCase()})
                </Text>
              </HStack>
              <HStack pb={4}>
                <Text px={1} borderWidth="1px" borderRadius="md" borderColor="white">{convertTime(movie.runtime)} </Text>
                {movie.genres.map(genre => (
                  <Text as="em">&bull; {genre} </Text>
                ))}
              </HStack>
              <HStack>
                <Text as="cite" py={2} color="#CBD5E0" fontSize="md" >{movie.tagline}</Text>
              </HStack>
              <HStack p ={4} display="flex" flexDir="column" justifyContent="center">
                <Heading as="h3" size="lg" pb={4}>Overview</Heading>
                <Text fontSize="xl">{movie.overview}</Text>
              </HStack>
            </Box>  
            <Box pl={3} borderLeftWidth="1px" pos="absolute" top="100px" right="-170px">
              <Box my={4}>
                <Link href={movie.homepage} isExternal>
                  <Tooltip label="Visit Homepage" placement="right-end" fontSize="sm">
                    <LinkIcon boxSize={4} />
                  </Tooltip>
                </Link>
              </Box>
              <Box my={4}>
                <Text as="b">Status</Text>
                <Text>{movie.status}</Text>
              </Box>
              <Box my={4}>
                <Text as="b">Budget</Text>
                <Text>${movie.budget.toLocaleString('en-US')}</Text>
              </Box>
              <Box my={4}>
                <Text as="b">Revenue</Text>
                <Text>${movie.revenue.toLocaleString('en-US')}</Text>
              </Box>
            </Box>
          </HStack>
        </Box>
      </Container>
      <Cast />
    </>
  );
}
