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
import { ChevronLeftIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { buildFavoritesApiUrl } from '../connectors/api';
import { useQuery } from 'react-query';
import { buildIsFavoriteApiUrl } from '../connectors/api';
import { generateConfig } from '../utils';


export default function Watchlist(props) {
  const history = useHistory();

  const [selected, setSelected] = React.useState([]);

  // const [deleteFavorite, setDeleteFavorite] = React.useState("false");

  const selectMovies = (movies) => {
    if(props.recommended === "true") {
      const unwatchedMovies = movies.filter(movie => {
        return props.watchedMovies.indexOf(movie.movieId) === -1; 
      });  

      const movieCopy = [...unwatchedMovies];

      const randomMovies = [];

      for(let i=0; i<3; i++) {
        const randomIndex = Math.floor(Math.random() * movieCopy.length);
        if(movieCopy.length === 0) {
          break;
        } else {
          randomMovies.push(movieCopy[randomIndex]);
          movieCopy.splice(randomIndex, 1);
        }
      }
      setSelected(randomMovies);
    } else {
      setSelected([...movies]);
    }
  }

  const deleteMovie = (movie, id) => {
    const movies = [...selected];
    const moviesNotDeleted = movies.filter(movie => movie.movieId !== id);
    setSelected(moviesNotDeleted);
    const responseDel = fetch(buildIsFavoriteApiUrl(movie.movieId), generateConfig('DELETE'));
  }
 
  const { 
    data: movies, 
    error, 
    isIdle, 
    isLoading, 
    isError 
  } = useQuery(
    'favorites', 
    () => fetch(buildFavoritesApiUrl())
      .then(r => r.json()),
    {
      onSuccess: selectMovies
    }
  );

  // console.log(movies);

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

  // React.useEffect(() => {
  //   if(props.recommended === "true") {
  //     const movieCopy = [...movies];
  //     const randomMovies = [];
  //     for(let i=0; i<3; i++) {
  //       const randomIndex = Math.floor(Math.random() * movieCopy.length);
  //       if(movieCopy.length === 0) {
  //         break;
  //       } else {
  //         randomMovies.push(movieCopy[randomIndex]);
  //         movieCopy.splice(randomIndex, 1);
  //       }
  //     }
  //     setSelected(randomMovies);
  //   } else {
      // movies.forEach(movie => selected.push(movie));
      // console.log("here");
      // setSelected([...movies]);
    // }
  // }, [movies]);
  

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
      <SimpleGrid minChildWidth={200} spacing={30}>
        {selected.map(movie => (
          <Box p={2}>
            <Box as={Link} to={`/movies/${movie.movieId}`} key={movie.id} pos="relative" noOfLines={2}>
              <Badge p={1} variant="solid" borderWidth="1px" borderRadius="md" colorScheme="teal" pos="absolute" top={2} left={2}>
                {convertTime(movie.runtime)}
              </Badge>
              <Tooltip label={movie.title}>
                <Image
                  src={buildImageUrl(movie.posterPath, 'w92')}
                  alt="Poster"
                  borderWidth="1px" 
                  borderRadius="lg"
                  fallbackSrc={imageFallback}
                />
              </Tooltip>
            </Box>
            <Box pb={10}>
              <Box position="relative">
                <IconButton onClick={() => deleteMovie(movie, movie.movieId)} aria-label="Delete Favorite" colorScheme="teal" icon={<DeleteIcon />} pos="absolute" top={2} right={2} />
              </Box>
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
