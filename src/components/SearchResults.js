import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Link, Progress, Text, Image, Box, SimpleGrid, Divider, Stack} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import { buildSearchMovieUrl, buildImageUrl } from '../connectors/tmdb';
import { buildSearchMovieApiUrl } from '../connectors/api';
import { getYear } from '../utils';

export default function Search() {
  const { terms } = useParams();
  const { data, error, isIdle, isLoading, isError } = useQuery(
    ['search', terms],
    () => fetch(buildSearchMovieApiUrl(terms)).then(r => r.json()),
    { enabled: !!terms },
  );

  if (isIdle) {
    return <Text>Type some terms and submit for a quick search</Text>;
  }
  if (isLoading) {
    return <Progress size="xs" isIndeterminate />;
  }
  if (isError) {
    return (
      <Text>
        Error fetching movies for {terms}: {JSON.stringify(error)}
      </Text>
    );
  }
  if (!data.results.length) {
    return <Text>No results</Text>;
  }
  return (

      <SimpleGrid columns={5} spacing="20px">
          {data.results.map(({ id, title, release_date, popularity, vote_average, poster_path, original_language }) => (
          <Box mb="2" borderWidth="1px" borderRadius="lg" borderColor="#38B2AC" display="flex">
            <Box p="2">
              <Link as={RouterLink} to={`/movies/${id}`}>
                <Image src={buildImageUrl(poster_path, "w154")} fallbackSrc="/noImage.png" alt={title} borderWidth="1px" borderRadius="lg" />
                <Box pt="4" fontWeight="semibold">
                  <Text as="span">{title} </Text>
                  <Text as="span" color="GrayText">({getYear(release_date)})</Text>
                </Box>
              </Link>
              <Box display="flex" pt="2" fontWeight="semibold">
                <Stack direction="row" h="40px" p="1">
                  <Text color="#718096">Popularity: {Math.round(popularity)}</Text>
                </Stack>
                <Stack direction="row" h="40px" p="1">
                  <Divider orientation="vertical" />
                  <Text color="#718096" fontSize="sm">{original_language.toUpperCase()}</Text>
                </Stack>
              </Box>
            </Box>
            <Box p="2">
              <Box p="1" display="flex" borderWidth="2px" borderRadius="40%" borderColor={vote_average >= 5 ? "#48BB78" : "#E53E3E"} bg="#2D3748">
                <Text color="#FFFFFF" align="center" fontWeights="bold">{vote_average}</Text>
                <Text color="#FFFFFF" fontSize="xs">/10</Text>
              </Box>
            </Box>
          </Box>
      ))}
      </SimpleGrid>


// {/* <Text p="1" color="#FFFFFF" align="center" fontSize="lg">{Math.round(popularity)} </Text> */}

    // <UnorderedList>
      // {data.results.map(({ id, title, release_date, popularity, vote_average, poster_path, original_language }) => (
      //   <ListItem key={id}>
      //     <Link as={RouterLink} to={`/movies/${id}`}>
      //         <Image src={buildImageUrl(poster_path, "w154")} alt={title} />
      //         <Text as="span">{title} </Text>
      //         <Text as="span" color="GrayText">
      //           ({getYear(release_date)})
      //         </Text>
      //     </Link>
      //     <Text color="GrayText">Popularity: {popularity} </Text>
      //     <Text color="GrayText">Vote average: {vote_average} </Text>
      //     <Text color="GrayText">Original language: {original_language} </Text>
      //   </ListItem>
      // ))}
    // </UnorderedList>
  );
}
