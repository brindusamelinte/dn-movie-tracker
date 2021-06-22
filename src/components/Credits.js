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
  Button,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { buildImageUrl, imageFallback, buildMovieCreditsUrl } from '../connectors/tmdb';

export default function Cast() {
    const { movieId } = useParams();

    const { isOpen, onToggle } = useDisclosure();
    
    const {
      data: credits,
      error,
      isIdle,
      isLoading,
      isError,
    } = useQuery(['credits', movieId], () => fetch(buildMovieCreditsUrl(movieId)).then(r => r.json()));
  
  
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
    <Container my={10} maxW="100vw">
        <Button onClick={onToggle}>Full Cast & Crew</Button>
        <Collapse in={isOpen} animateOpacity>
            <Box p="40px" color="white" mx={10} my={4} bg="teal.500" rounded="md" shadow="md">
                <SimpleGrid columns={2} spacing="10px">
                    <Box>
                        <Heading as="h4" pb={4} size="md">{`Cast ${credits.cast.length}`}</Heading>
                        {credits.cast.map(cast => (
                            <Box p={2} display="flex" flexDir="row">
                            <Image borderWidth="1px" borderRadius="lg" src={buildImageUrl(cast.profile_path)} alt={cast.name} w="4vw" maxW={300} fallbackSrc={imageFallback} />
                            <Box p={6}>
                                <Text as="b">{cast.name}</Text>
                                <Text mt={2} fontSize="sm">{cast.character}</Text>
                            </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box>
                        <Heading as="h4" pb={4} size="md">{`Crew ${credits.crew.length}`}</Heading>
                        {credits.crew.map(crew => (
                            <Box p={2} display="flex" flexDir="row">
                            <Image borderWidth="1px" borderRadius="lg" src={buildImageUrl(crew.profile_path)} alt={crew.name} w="4vw" maxW={300} fallbackSrc={imageFallback} />
                            <Box p={6}>
                                <Text as="b">{crew.name}</Text>
                                <Text mt={2} fontSize="sm">{crew.department}</Text>
                            </Box>
                            </Box>
                        ))}
                    </Box>
                </SimpleGrid>
            </Box>
        </Collapse>
      </Container>
    );
}
