import { useState } from 'react';

const useFetchData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData(path, options = {}) {
    setLoading(true);
    setError(null);
    try {
      const fetchResult = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${path}`,
        options,
      );
      const response = await fetchResult.json();
      console.log({ fetchResult, response });
      if (fetchResult.ok) {
        console.log(response);
        setData(response);
        return response;
      } else {
        setError(response.message);
        console.log(error)
        return null;
      }
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }
  return {fetchData, data, error, loading};
};

export default useFetchData;