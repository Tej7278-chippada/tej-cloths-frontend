import React from 'react';

const LazyImage = React.memo(({ base64Image, alt }) => (
  <img
    src={`data:image/jpeg;base64,${base64Image}`}
    alt={alt}
    loading="lazy" // Lazy loading enabled
    style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }}
  />
));

export default LazyImage;
