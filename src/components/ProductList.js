// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
// import { fetchProducts, likeProduct } from '../api';
import ProductDetail from './ProductDetail';
import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import CommentPopup from './CommentPopup';
import { fetchProducts, likeProduct } from '../api/api';

import { Grid } from "@mui/material";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);

  useEffect(() => {
    fetchProducts().then((response) => setProducts(response.data));
  }, []);

  const handleLike = async (productId) => {
    await likeProduct(productId);
    fetchProducts().then((response) => setProducts(response.data)); // Refresh product list with updated likes
  };

  const openComments = (product) => {
    setSelectedProduct(product);
    setCommentPopupOpen(true);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <h2>Products Page</h2>
      {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map((product) => (
          <Card key={product._id} style={{ width: '250px', position: 'relative', cursor: 'pointer' }}
          onClick={() => openProductDetail(product)}>
            <CardMedia>
              <div style={{ display: 'flex', overflowX: 'scroll' }}>
                {product.media.map((file, index) => (
                  <img
                    key={index}
                    src={file}
                    alt={product.title}
                    style={{ width: '100%', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </CardMedia>
            <CardContent>
              <Typography variant="h6">{product.title}</Typography>
              <Typography>₹{product.price}</Typography>
              <Typography>Stock Status: {product.stockStatus}</Typography>
              <Typography>Delivery Days: {product.deliveryDays}</Typography>
              <Typography>Description: {product.description}</Typography>
              <IconButton onClick={() => handleLike(product._id)}>
                <ThumbUp /> {product.likes}
              </IconButton>
              <IconButton onClick={() => openComments(product)}>
                <Comment /> {product.comments.length}
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CommentPopup
        open={commentPopupOpen}
        onClose={() => setCommentPopupOpen(false)}
        product={selectedProduct}
        onCommentAdded={() => fetchProducts().then((response) => setProducts(response.data))}
      />




<div style={{ marginTop: '2rem' }}>
      <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={4} key={product._id}>
          {/* <ProductCard product={product} /> */}
          
          <Card key={product._id} style={{ margin: '1rem 0', cursor: 'pointer' }}  >
          <CardMedia>
              <div style={{ display: 'flex', overflowX: 'scroll' }}>
              {product.images && product.images.map((image, index) => (
                  <img src={image} alt={`Product ${index}`} key={index} style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }} />
                ))}
              </div>
            </CardMedia>
          <CardContent >
              <Typography variant="h5" onClick={() => openProductDetail(product)}>{product.title}</Typography>
              <p>Price: ₹{product.price}</p>
              <p>Stock Status: {product.stockStatus}</p>
              {product.stockStatus === 'In Stock' && <p>Stock Count: {product.stockCount}</p>}
              <p>Gender: {product.gender}</p>
              <p>Delivery Days: {product.deliveryDays}</p>
              <p>Description: {product.description}</p>
              <div>
                {product.images && product.images.map((image, index) => (
                  <img src={image} alt={`Product ${index}`} key={index} style={{ width: '100%', marginTop: '10px' }} />
                ))}
              </div>
              <IconButton onClick={() => handleLike(product._id)}>
                <ThumbUp /> {product.likes}
              </IconButton>
              <IconButton onClick={() => openComments(product)}>
                <Comment /> {product.comments.length}
              </IconButton>
            </CardContent>
            
            </Card>
           
        </Grid>
      ))}
    </Grid>
      </div>
    </div>
  );
}

export default ProductList;
