import { useCallback, useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();

  const getData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [url]);

  useEffect(() => {
    getData();
  }, [getData]);

  return { data, loading };
};
