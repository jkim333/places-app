import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import Loading from '../../shared/components/Loading';
import ErrorModal from '../../shared/components/ErrorModal';

function UserPlaces() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPlaces, setTotalPlaces] = useState(null);
  const [isLoadMore, setIsLoadMore] = useState(false);

  let unmounted = useRef(false);

  const source = useMemo(() => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  }, []);

  let { userId } = useParams();

  const fetchPlaces = useCallback(
    async (page) => {
      try {
        const response = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_BACKEND_URL}/api/places/user/${userId}/?page=${page}`,
          cancelToken: source.token,
        });
        if (!unmounted.current) {
          setPlaces((prevPlaces) => [...prevPlaces, ...response.data.results]);
          setTotalPlaces(response.data.count);
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            if (!unmounted.current) {
              setError('This user does not exist.');
            }
          } else {
            if (!unmounted.current) {
              setError('Something went wrong. Please try again another time.');
            }
          }
          if (!unmounted.current) {
            setIsLoading(false);
          }
        } else {
          if (!unmounted.current) {
            setIsLoading(false);
            setError(
              'Sorry, something went wrong! Please try this page again.'
            );
          }
        }
      }
    },
    [userId, source.token, unmounted]
  );

  const handleLoadMore = (e) => {
    setIsLoadMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchPlaces(page).then(() => {
      setIsLoadMore(false);
    });
  }, [fetchPlaces, page]);

  useEffect(() => {
    return function cleanup() {
      unmounted.current = true;
      source.cancel('Operation canceled by the user.');
    };
  }, [source]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} setError={setError} />
      <PlaceList
        places={places}
        setError={setError}
        setIsLoading={setIsLoading}
        fetchPlaces={fetchPlaces}
        setPlaces={setPlaces}
      />
      <div className='my-5 d-flex justify-content-center'>
        {places.length < totalPlaces && (
          <Button
            variant='primary'
            style={{ maxWidth: '800px', width: '100%' }}
            onClick={handleLoadMore}
          >
            {isLoadMore ? (
              <div>
                Loading <Spinner animation='grow' size='sm' />
              </div>
            ) : (
              'Load More Results'
            )}
          </Button>
        )}
      </div>
    </React.Fragment>
  );
}

export default UserPlaces;
