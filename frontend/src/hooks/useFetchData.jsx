import { useState } from 'react';

const useFetchData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(undefined);

  async function fetchData(path, options = {}) {
    try {
      setLoading(true);
      setError(null);
      const fetchResult = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${path}`,
        options,
      );
      const response = await fetchResult.json();
      if (fetchResult.ok) {
        setData({ ...response, status: fetchResult.status });
        return { success: true, data: response, status: fetchResult.status };
      } else {
        const err = response.message || 'Request failed';
        setError(err);
        return { success: false, error: err, status: fetchResult.status };
      }
    } catch (error) {
      const message = 'Network error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  return { fetchData, data, error, loading };
};

export default useFetchData;
