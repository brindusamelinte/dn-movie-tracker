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
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption
} from '@chakra-ui/react';
import { ChevronLeftIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { buildHistoryApiUrl } from '../connectors/api';
import { useQuery } from 'react-query';


export default function History(props) {
  const history = useHistory();

  const [order, setOrder] = React.useState('asc');  

  const { 
    data: movies, 
    error, 
    isIdle, 
    isLoading, 
    isError 
  } = useQuery('histories', () => fetch(buildHistoryApiUrl()).then(r => r.json()));

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

  const limitH = props.limitH ? props.limitH : movies.length;

  // console.log(order);
  return (
    <Container p={3} maxW="80em">
      {props.searchRefreshButtons !== "false" && (
      <HStack mb={3} justify="space-between">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeftIcon />}
          variant="outline"
          fontSize={36}
          colorScheme="teal"
          onClick={history.goBack}
        />
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} colorScheme="teal">
            Sort
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup onChange={sortOrder => setOrder(sortOrder)} defaultValue="asc" title="Order" type="radio">
              <MenuItemOption value="asc">Ascending</MenuItemOption>
              <MenuItemOption value="desc">Descending</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </HStack>
      )}
      <VStack divider={<StackDivider borderColor="gray.300" />} spacing={4} align="stretch">
        {movies.sort((x,y) => {
          const a = Date.parse(x.watchAt);
          const b = Date.parse(y.watchAt);
          if(order === 'asc') {
            if(a < b) return -1;
            else return 1;
          } else {
            if(a < b) return 1;
            else return -1;
          }
        }).slice(0, limitH).map(movie => (
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
                <Editable textAlign="center" defaultValue={movie.watchAt} key={movie.movieId} fontSize="md" isPreviewFocusable={false}>
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
