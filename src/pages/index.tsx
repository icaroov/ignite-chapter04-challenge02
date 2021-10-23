import { useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { useInfiniteQuery } from 'react-query';

import { ImagesQueryResponse } from './api/images';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // DONE => AXIOS REQUEST WITH PARAM
    async ({ pageParam = null }) => {
      const response = await api.get('/api/images', {
        params: {
          after: pageParam?.after,
        },
      });

      return response.data;
    },
    // DONE => GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: (lastPage: ImagesQueryResponse) =>
        lastPage?.after ? lastPage : null,
    }
  );

  function message(): string {
    if (isFetchingNextPage) return 'Carregando...';

    if (hasNextPage) return 'Carregar mais';

    return 'Nada para carregar';
  }

  const formattedData = useMemo(() => {
    // DONE => FORMAT AND FLAT DATA ARRAY
    const result = data?.pages?.flatMap(page => page.data);
    return result;
  }, [data]);

  // DONE => RENDER LOADING SCREEN
  if (isLoading) return <Loading />;

  // DONE => RENDER ERROR SCREEN
  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* DONE => RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button
            isLoading={isFetchingNextPage}
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
          >
            {message()}
          </Button>
        )}
      </Box>
    </>
  );
}
