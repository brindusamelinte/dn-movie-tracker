import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { generateConfig } from '../utils';
import { WATCHLIST, WATCHLIST_URL, EMAIL } from '../connectors/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { buildIsFavoriteApiUrl, buildAddFavoriteApiUrl } from '../connectors/api';


export default function WatchlistButton({ movie }) {
  // this will help invalidate a query
  const queryClient = useQueryClient();

  // this query is expecting that WATCHLIST_URL api will return a true/false for current user/movieId combo
  const watchlist = useQuery(['watchlist', movie.movieId], () =>
    fetch(buildIsFavoriteApiUrl(movie.movieId)).then(r => r.json()),
  );
 
  // to update watchlist, use a PATCH call to set new value, that's a toggle on current value. Check https://react-query.tanstack.com/guides/mutations for how mutations works
  const update = useMutation(() => {
    const isListed = watchlist.data;

    if(isListed) {
      return fetch(buildIsFavoriteApiUrl(movie.movieId), generateConfig('DELETE'))
        .then(res => {
          if(res.status >= 300) {
            throw new Error(`Fetch failed with status ${res.status}`);
          }
          return res.text();
        })
        .then(data => {
          queryClient.invalidateQueries(['watchlist', movie.movieId]);
          return data;
        })
    } else {
      const body = {
        movieId: movie.movieId,
        email: EMAIL
      }

      return fetch(buildAddFavoriteApiUrl(), generateConfig('POST', body))
        .then(res => {
          if(res.status >= 300) {
            throw new Error(`Fetch failed with status ${res.status}`);
          }
          return res.text();
        })
        .then(data => {
          queryClient.invalidateQueries(['watchlist', movie.movieId]);
          return data;
        })
    }
  });

  const isListed = watchlist.data;
  const label = isListed ? 'Remove from watchlist' : 'Add to watchlist';
  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={<StarIcon />}
        colorScheme="teal"
        variant={isListed ? 'solid' : 'outline'}
        isLoading={watchlist.isLoading || update.isLoading}
        onClick={update.mutate}
      />
    </Tooltip>
  );
}
