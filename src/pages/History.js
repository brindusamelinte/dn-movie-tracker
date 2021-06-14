import React from 'react';
import { 
  Text,
  Image,
  CircularProgress,
  Center,
  Container,
  Box,
  Tooltip,
  VStack,
  StackDivider,
  HStack,
  IconButton,
  Editable, 
  EditableInput, 
  EditablePreview,
  Flex,
  useEditableControls,
  ButtonGroup,
  Heading
} from '@chakra-ui/react';
import { ChevronLeftIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { buildHistoryApiUrl } from '../connectors/api';
import { useQuery } from 'react-query';


export default function History() {
  const history = useHistory();

  const [startDate, setStartDate] = React.useState(new Date());

  const { 
    data: movies, 
    error, 
    isIdle, 
    isLoading, 
    isError 
  } = useQuery('histories', () => fetch(buildHistoryApiUrl()).then(r => r.json()));

  console.log(movies);

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

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="xs">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
        <IconButton mx={2} size="xs" icon={<EditIcon />} {...getEditButtonProps()} />
    )
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
      <VStack divider={<StackDivider borderColor="gray.300" />} spacing={4} align="stretch">
        {movies.map(movie => (
          <Box display="flex" flexDir="row">
            <Tooltip label={`"${movie.tagline }"`}>
              <Image
                src={buildImageUrl(movie.posterPath, 'w154')}
                alt="Poster"
                borderWidth="1px" 
                borderRadius="lg"
                fallbackSrc={imageFallback}
              />
            </Tooltip>
            <Box p={4}>
              <Text fontSize="lg" fontWeight="extrabold">{movie.title} </Text>
              <Text color="GrayText">({movie.year})- {movie.status}</Text>
              <Flex flexDir="column" alignItems="flex-end">
                <Text>Watched:</Text>
                <Editable textAlign="center" defaultValue={movie.watchAt} fontSize="md" isPreviewFocusable={false}>
                  <EditablePreview />
                  <EditableInput />
                  <EditableControls />
                </Editable>
              </Flex>
              <Text size="lg"fontWeight="bold" pb={2}>Overview</Text>
              <Text fontSize="md">{movie.overview}</Text>
            </Box>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
