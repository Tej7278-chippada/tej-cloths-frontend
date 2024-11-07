// src/components/ProductDetail.js
import React from 'react';
import { Dialog, DialogContent, Typography, CardMedia } from '@mui/material';

function ProductDetail({ product, onClose }) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <CardMedia>
          {/* <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {product.images && product.images.map((image, index) => (
              <img src={image} alt={`Product ${index}`} key={index} style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }} />
            ))}
          </div> */}
          <div style={{ display: 'flex', overflowX: 'scroll' }}>
                    {product.media && product.media.map((base64Image, index) => (
                      <img
                        src={`data:image/jpeg;base64,${base64Image}`}
                        alt={`Product ${index}`}
                        key={index}
                        style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
        </CardMedia>
        <Typography variant="h4">{product.title}</Typography>
        <Typography>Price: ₹{product.price}</Typography>
        <Typography>Stock Status: {product.stockStatus}</Typography>
        <Typography>Gender: {product.gender}</Typography>
        <Typography>Delivery Days: {product.deliveryDays}</Typography>
        <Typography>Description: {product.description}</Typography>
        <div style={{ display: 'flex', overflowX: 'auto', marginTop: '1rem' }}>
          {/* {product.media.map((file, index) => (
            <img key={index} src={file} alt={`media-${index}`} style={{ width: '100px', marginRight: '5px' }} />
          ))} */}
          {/* <img src="../assets/teja-pic-1.jpg" alt='tej' style={{ width: '100px', marginRight: '5px', objectFit: 'cover' }} /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetail;
