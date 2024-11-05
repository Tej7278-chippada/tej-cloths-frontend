// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Card, CardContent, CardActions, Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Toolbar, CardMedia } from '@mui/material';
import { addProduct, deleteProduct, fetchProducts, updateProduct } from '../api/api';
// import ProductCard from "../components/ProductCard";
import { Grid } from "@mui/material";

function Admin() {
    const [openDialog, setOpenDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stockStatus: '',
    stockCount: '',
    gender: '',
    deliveryDays: '',
    description: '',
    media: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then((response) => setProducts(response.data));
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Object.keys(formData).forEach((key) => {  // Append form data to FormData object
    //   if (key === 'images' && formData[key]) {
    //     Array.from(formData[key]).forEach((file) => data.append('images', file));
    //   } else {
    //     data.append(key, formData[key]);
    //   }
    // });

    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('stockStatus', formData.stockStatus);
    data.append('stockCount', formData.stockCount);
    data.append('gender', formData.gender);
    data.append('deliveryDays', formData.deliveryDays);
    data.append('description', formData.description);

    // Append each selected file to the "media" field in FormData
    if (formData.images) {
      Array.from(formData.images).forEach((file) => {
        data.append('media', file);
      });
    }

    
    

    if (editingProduct) {
      console.log("Updating product:", editingProduct._id); // Log product ID
      await updateProduct(editingProduct._id, data);
      setEditingProduct(null);
    } else {
      await addProduct(data);
    }
    handleCloseDialog();
    await refreshProducts(); // Refresh products list after submission
    resetFormData(); // Reset form fields

    fetchProducts().then((response) => setProducts(response.data));
    setFormData({ title: '', price: '', stockStatus: '', stockCount: '', gender: '', deliveryDays: '', description: '', images: null });

    // Append files
  // Array.from(formData.media).forEach((file) => {
  //   formData.append("media", file);
  // });
  
    // try {
    //   await axios.post("http://localhost:3002/add/products", formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    // } catch (error) {
    //   console.error("Error uploading files:", error);
    // }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      stockStatus: product.stockStatus,
      stockCount: product.stockCount,
      gender: product.gender,
      deliveryDays: product.deliveryDays,
      description: product.description,
      images: null, // Reset images to avoid re-uploading
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts().then((response) => setProducts(response.data));
  };

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    resetFormData();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const refreshProducts = async () => {
    // Fetch updated product list
    const response = await fetchProducts();
    setProducts(response.data);
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      price: '',
      stockStatus: '',
      stockCount: '',
      gender: '',
      deliveryDays: '',
      description: '',
      images: null,
    });
  };
  

  return (
    <div>
      {/* <h2>Admin Page</h2> */}
        <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
            Admin Page
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Add Product
            </Button>
        </Toolbar>


      <Dialog  open={openDialog} onClose={handleCloseDialog}>
      <form onSubmit={handleSubmit} style={{  flexDirection: 'column', gap: '1rem' }}>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
        
        <TextField label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        <TextField label="Price (INR)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        
        <FormControl fullWidth>
          <InputLabel>Stock Status</InputLabel>
          <Select value={formData.stockStatus} onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })} required>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Out-of-stock">Out-of-stock</MenuItem>
            <MenuItem value="Getting Ready">Getting Ready</MenuItem>
          </Select>
        </FormControl>

        {formData.stockStatus === 'In Stock' && (
          <TextField label="Stock Count" type="number" value={formData.stockCount} onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })} />
        )}

        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Kids">Kids</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Delivery Days" type="number" value={formData.deliveryDays} onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })} required />
        <TextField label="Description" multiline rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        <input type="file" multiple onChange={handleFileChange} />
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </Button>
        </DialogActions>
        </form>
      </Dialog>




      
      <div style={{ marginTop: '2rem' }}>
      <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={4} key={product._id}>
          {/* <ProductCard product={product} /> */}
          
          <Card key={product._id} style={{ margin: '1rem 0' }}>
          <CardMedia>
            <div style={{ display: 'flex', overflowX: 'scroll' }}>
            {product.images && product.images.map((image, index) => (
                <img src={image} alt={`Product ${index}`} key={index} style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }} />
              ))}
            </div>
          </CardMedia>
          <CardContent>
              <Typography variant="h5">{product.title}</Typography>
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
            </CardContent>
            <CardActions>
              <Button onClick={() => handleEdit(product)} color="primary">Edit</Button>
              <Button onClick={() => handleDelete(product._id)} color="secondary">Delete</Button>
            </CardActions>
            </Card>
           
        </Grid>
      ))}
    </Grid>
        
      </div>
    </div>
  );
}

export default Admin;
