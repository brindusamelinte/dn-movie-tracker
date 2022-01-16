import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Input, IconButton, Container } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import SearchResults from '../components/SearchResults';

export default function Search() {
  const { terms } = useParams();
  const history = useHistory();
  const searchRef = React.useRef(null);

  const handleSearch = event => {
    event.preventDefault();
    const value = searchRef.current.value;
    console.log(value);
    if (value !== terms) {
      history.push(`/search/${value}`);
    }
  };

  return (
    <>
      <Container p={3}>
        <Box as="form" onSubmit={handleSearch} w="100%" d="flex" mb={3}>
          <Input placeholder="Search for a movie..." defaultValue={terms} ref={searchRef} mr={3} borderWidth="2px" borderRadius="xl" />
          <IconButton aria-label="Search for a movie" icon={<Search2Icon />} type="submit" width="70px" bgGradient="linear(to-r,green.200, yellow.500)" />
        </Box>
      </Container>
      <Container p={3} maxW="container.xl">
        <SearchResults />
      </Container>
    </>
  );
}
