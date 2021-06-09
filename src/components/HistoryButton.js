import React from 'react';
import { IconButton, Tooltip,  } from '@chakra-ui/react';
import { CheckIcon, AddIcon } from '@chakra-ui/icons';
import { generateConfig } from '../utils';
import { WATCHLIST, WATCHLIST_URL, EMAIL } from '../connectors/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { buildIsHistoryApiUrl, buildAddHistoryApiUrl } from '../connectors/api';


export default function HistoryButton({ movie }) {
  const queryClient = useQueryClient();

  const history= useQuery(['history', movie.movieId], () =>
    fetch(buildIsHistoryApiUrl(movie.movieId)).then(r => r.json()),
  );
 
  const update = useMutation(() => {
    const isHistoryActive = history.data;

    if(isHistoryActive) {
      return fetch(buildIsHistoryApiUrl(movie.movieId), generateConfig('DELETE'))
        .then(res => {
          if(res.status >= 300) {
            throw new Error(`Fetch failed with status ${res.status}`);
          }
          return res.text();
        })
        .then(data => {
          queryClient.invalidateQueries(['history', movie.movieId]);
          return data;
        })
    } else {
      const body = {
        movieId: movie.movieId,
        email: EMAIL,
        date: Date()
      }

      return fetch(buildAddHistoryApiUrl(), generateConfig('POST', body))
        .then(res => {
          if(res.status >= 300) {
            throw new Error(`Fetch failed with status ${res.status}`);
          }
          return res.text();
        })
        .then(data => {
          queryClient.invalidateQueries(['history', movie.movieId]);
          return data;
        })
    }
  });

  const isHistoryActive = history.data;
  const label = isHistoryActive ? 'Remove from history' : 'Mark as watched';
  console.log('Label', label)
  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={isHistoryActive ? <CheckIcon /> : <AddIcon />}
        colorScheme="teal"
        variant={isHistoryActive ? 'solid' : 'outline'}
        isLoading={history.isHistoryActive || update.isHistoryActive}
        onClick={update.mutate}
      />
    </Tooltip>
  );
}
