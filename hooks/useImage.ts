import React from 'react';

const imageCache = new Map();

const useImage = (src: string): [HTMLImageElement | undefined, string] => {
  const [status, setStatus] = React.useState('loading');

  React.useEffect(() => {
    if (!src) return;
    const img = document.createElement('img');
    
    const onload = () => setStatus('loaded');
    const onerror = () => setStatus('failed');

    img.addEventListener('load', onload);
    img.addEventListener('error', onerror);
    img.crossOrigin = 'Anonymous';
    img.src = src;

    imageCache.set(src, img);

    return () => {
      img.removeEventListener('load', onload);
      img.removeEventListener('error', onerror);
    };
  }, [src]);

  return [imageCache.get(src), status];
};

export default useImage;
