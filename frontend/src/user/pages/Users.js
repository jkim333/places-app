import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import UsersList from '../components/UsersList';
import Loading from '../../shared/components/Loading';
import ErrorModal from '../../shared/components/ErrorModal';
import { Pagination } from 'react-bootstrap';

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);

  let unmounted = useRef(false);

  let history = useHistory();

  const source = useMemo(() => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  }, []);

  useEffect(() => {
    const setPageFromUrlSearchParams = () => {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('page');

      if (data) {
        setPage(Number(data));
      } else {
        setPage(1);
      }
    };
    setPageFromUrlSearchParams();
    window.addEventListener('popstate', setPageFromUrlSearchParams);
    return function cleanup() {
      window.removeEventListener('popstate', setPageFromUrlSearchParams);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!unmounted.current) {
        setIsLoading(true);
      }
      try {
        const response = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_BACKEND_URL}/api/users/?page=${page}`,
          cancelToken: source.token,
        });
        if (!unmounted.current) {
          setUsers(response.data.results);
          setTotalUsers(response.data.count);
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!unmounted.current) {
          setIsLoading(false);
          setError('Sorry, something went wrong! Please try this page again.');
        }
      }
    };
    if (page) fetchUsers();
  }, [page, source, source.token]);

  useEffect(() => {
    return function cleanup() {
      unmounted.current = true;
      source.cancel('Operation canceled by the user.');
    };
  }, [source]);

  const handleClickFirst = (e) => {
    setPage(1);
    history.push({ pathname: '/', search: '?page=1' });
  };

  const handleClickPrev = (e) => {
    setPage((prevPage) => {
      history.push({ pathname: '/', search: `?page=${prevPage - 1}` });
      return prevPage - 1;
    });
  };

  const handleClickNext = (e) => {
    setPage((prevPage) => {
      history.push({ pathname: '/', search: `?page=${prevPage + 1}` });
      return prevPage + 1;
    });
  };

  const handleClickLast = (e) => {
    setPage(totalPages);
    history.push({ pathname: '/', search: `?page=${totalPages}` });
  };

  let pages = [];
  const totalPages = Math.ceil(totalUsers / 6);
  if (page > 1) {
    pages.push(
      ...[
        <Pagination.First key='first' onClick={handleClickFirst} />,
        <Pagination.Prev key='prev' onClick={handleClickPrev} />,
      ]
    );
  }
  pages.push(
    <Pagination.Item active={true} key={page}>
      {page}
    </Pagination.Item>
  );
  if (page < totalPages) {
    pages.push(
      ...[
        <Pagination.Next key='next' onClick={handleClickNext} />,
        <Pagination.Last key='last' onClick={handleClickLast} />,
      ]
    );
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} setError={setError} />
      <UsersList users={users} />
      <Pagination className='my-5'>{pages}</Pagination>
    </React.Fragment>
  );
}

export default Users;
