import { useEffect, useRef, useState } from 'react';

export default function useLazyLoad(sources: string[]): [boolean, string[]] {
  const [loaded, setLoaded] = useState(false);
  const loadedSource = useRef<string[]>([]);

  useEffect(() => {
    sources.map((source, index) => {
      const imageLoader = new Image();
      imageLoader.src = source;
      imageLoader.onload = () => {
        loadedSource.current[index] = imageLoader.src;
        if (sources.length === loadedSource.current.length) {
          if (!loadedSource.current.some((el) => el === null)) {
            setLoaded(true);
          }
        }
      };
    });
  }, []);

  return [loaded, loadedSource.current];
}
