// src/components/Admin.js
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Card, CardContent, CardActions, Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Toolbar, CardMedia, Alert, 
    Tooltip} from '@mui/material';
import { addProduct, deleteProduct, fetchProducts, updateProduct } from '../api/api';
// import ProductCard from "../components/ProductCard";
import { Grid } from "@mui/material";
import LazyImage from './LazyImage';

// const LazyImage = React.memo(({ base64Image, alt }) => (
//   <img
//     src={`data:image/jpeg;base64,${base64Image}`}
//     alt={alt}
//     loading="lazy" // enables lazy loading for better performance
//     style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }}
//   />
// ));

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
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [mediaError, setMediaError] = useState('');
  const [loading, setLoading] = useState(false); // to show loading state
  const [submitError, setSubmitError] = useState(''); // Error for failed product submission

  const fetchProductsData = useCallback(async () => {
    setLoading(true);
    const response = await fetchProducts();
    setProducts(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // fetchProducts().then((response) => setProducts(response.data));
    fetchProductsData();
  }, [fetchProductsData]);

  // const handleFileChange = (e) => {
  //   setFormData({ ...formData, images: e.target.files });
  // };


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

    // data.append('title', formData.title);
    // data.append('price', formData.price);
    // data.append('stockStatus', formData.stockStatus);
    // data.append('stockCount', formData.stockCount);
    // data.append('gender', formData.gender);
    // data.append('deliveryDays', formData.deliveryDays);
    // data.append('description', formData.description);
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key !== 'media') data.append(key, formData[key]);
    });

    // Add only new media files to FormData
    newMedia.forEach((file) => data.append('media', file));

    // Pass existing media IDs to keep them in the database
    if (existingMedia.length > 0) {
      data.append('existingMedia', JSON.stringify(existingMedia.filter(media => !media.remove).map(media => media._id)));
    }
    // Append each selected file to the "media" field in FormData
    // if (formData.images) {
    //   Array.from(formData.images).forEach((file) => {
    //     data.append('media', file);
    //   });
    // }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
      } else {
        await addProduct(data);
      }
      await fetchProductsData(); // Refresh products list
      handleCloseDialog();       // Close dialog
    } catch (error) {
      console.error("Error submitting product:", error);
      setSubmitError("Failed to submit product. Please check your inputs.");
    }

    

    
    
    // Append IDs of media to be deleted if editing
    // if (editingProduct) {
    //   console.log("Updating product:", editingProduct._id); // Log product ID
    //   data.append('deleteMedia', JSON.stringify(existingMedia.filter(media => media.remove).map(media => media._id)));
    //   await updateProduct(editingProduct._id, data);
    //   setEditingProduct(null);
    // } else {
    //   await addProduct(data);
    // }
    // if (editingProduct) {
    //   await updateProduct(editingProduct._id, data)
    //     .catch((error) => {
    //       console.error("Error updating product:", error);
    //       setSubmitError("Product can't be updated. Please check the product details and try again.");
    //     });
    //   setEditingProduct(null);
    // } else {
    //   await addProduct(data)
    //     .catch((error) => {
    //       console.error("Error adding product:", error);
    //       setSubmitError("Product can't be added. Please check the product details and try again.");
    //     });
    // }

    // if (!submitError) {
    //   handleCloseDialog();
    //   fetchProductsData();
    // }

    // handleCloseDialog();
    // await refreshProducts(); // Refresh products list after submission
    // resetFormData(); // Reset form fields

    // fetchProducts().then((response) => setProducts(response.data));
    // setFormData({ title: '', price: '', stockStatus: '', stockCount: '', gender: '', deliveryDays: '', description: '', media: null });

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
      media: null, // Reset images to avoid re-uploading
    });
    setExistingMedia(product.media.map((media) => ({ ...media, remove: false })));
    setOpenDialog(true);
  };

  const handleDeleteMedia = (mediaId) => {
    setExistingMedia(existingMedia.map(media => media._id === mediaId ? { ...media, remove: true } : media));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const oversizedFiles = selectedFiles.filter(file => file.size > 2 * 1024 * 1024);
    const totalMediaCount = selectedFiles.length + existingMedia.filter((media) => !media.remove).length;
  
    // Check for both conditions
    if (oversizedFiles.length > 0 && totalMediaCount > 5) {
      setMediaError("Photo size must be less than 2MB && Maximum 5 photos allowed.");
    } else if (oversizedFiles.length > 0) {
      setMediaError("Photo size must be less than 2MB.");
    } else if (totalMediaCount > 5) {
      setMediaError("Maximum 5 photos allowed.");
    } else {
      setMediaError("");
      setNewMedia(selectedFiles);
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id)
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      });
    fetchProducts().then((response) => setProducts(response.data));
  };

  const handleOpenDialog = () => {
    // Reset form data to empty
    setFormData({
        title: '',
        price: '',
        stockStatus: '',
        stockCount: '',
        gender: '',
        deliveryDays: '',
        description: '',
        media: null,
    });
    setEditingProduct(null); // Ensure it's not in editing mode
    setExistingMedia([]); // Clear any existing media
    setNewMedia([]); // Clear new media files
    setOpenDialog(true);
};

  const handleCloseDialog = () => {
    setEditingProduct(null);
    setExistingMedia([]);
    setNewMedia([]);
    setOpenDialog(false);
    setMediaError('');
    setSubmitError(''); // Clear submission error when dialog is closed
    setFormData({ title: '', price: '', stockStatus: '', stockCount: '', gender: '', deliveryDays: '', description: '', media: null });
  };

  // const refreshProducts = async () => {
  //   // Fetch updated product list
  //   const response = await fetchProducts();
  //   setProducts(response.data);
  // };

  // const resetFormData = () => {
  //   setFormData({
  //     title: '',
  //     price: '',
  //     stockStatus: '',
  //     stockCount: '',
  //     gender: '',
  //     deliveryDays: '',
  //     description: '',
  //     images: null,
  //   });
  // };
  

  return (
    <div >
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
          {/* Existing media with delete option */}
          {existingMedia.length > 0 && (
              <div>
                <Typography variant="subtitle1">Existing Images</Typography>
                <div style={{ display: 'flex', overflowX: 'scroll' }}>
                  {existingMedia.map((media) => (
                    !media.remove && (
                      <div key={media._id} style={{ position: 'relative', margin: '5px' }}>
                        <img src={`data:image/jpeg;base64,${media.data}`} alt="Product Media" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <Button size="small" color="secondary" onClick={() => handleDeleteMedia(media._id)}>Remove</Button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
        <div>
          <Typography variant="subtitle1">Add Product Photos</Typography>    
            <input type="file" multiple onChange={handleFileChange} /> 
            {/* onChange={(e) => setFormData({ ...formData, images: e.target.files })} */}
            <Typography variant="body2">Note : Maximum 5 Photos & Each Photo size should less than 2 MB</Typography>    
            {mediaError && <Alert severity="error">{mediaError}</Alert>}
        </div>
        </DialogContent>
        {submitError && <Alert severity="error" style={{ margin: '1rem' }}>{submitError}</Alert>} 
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </Button>
        </DialogActions>
        </form>
        
      </Dialog>




      {/* Product cards */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Blurred Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("../assets/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        zIndex: -1
      }}></div>
      <div style={{ marginTop: '2rem', padding: '1rem', position: 'relative', zIndex: 1 }}>
      {loading && <div>Loading products...</div>}
      <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          {/* <ProductCard product={product} /> */}
          <Card style={{ margin: '1rem 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', background: 'rgba(255, 255, 255, 0.9)' }}>
            {/* CardMedia for Images with Scroll */}
            <CardMedia style={{ borderRadius: '8px', overflow: 'hidden', height: '280px', backgroundColor: '#f5f5f5' }}>
              <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ccc transparent' }}>
                {product.media && product.media.slice(0, 5).map((base64Image, index) => (
                  <LazyImage key={index} base64Image={base64Image} alt={`Product ${index}`} style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '5px', margin: '0.2rem' }}/>
                ))}
              </div>
              {product.media && product.media.length > 5 && (
                <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  Media exceeds its maximum count
                </Typography>
              )}
            </CardMedia>
            <CardContent style={{ padding: '1rem' }}>
              <Tooltip title={product.title} placement="top" arrow>
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                </Typography>
              </Tooltip>
              {/* <Typography variant="h5" component="div" style={{display: 'inline-block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {product.title}
              </Typography> */}
              <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block',float: 'right', fontWeight: '500' }}>
                Price: ₹{product.price}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{  marginBottom: '0.5rem' }}>
                Gender: {product.gender}
              </Typography>
              
              <Typography variant="body2" color={product.stockStatus === 'In Stock' ? 'green' : 'red'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                Stock Status: {product.stockStatus}
              </Typography>
              
              {product.stockStatus === 'In Stock' && (
                <Typography variant="body2" color="textSecondary" style={{ display: 'inline-block',float: 'right',marginBottom: '0.5rem' }}>
                  Stock Count: {product.stockCount}
                </Typography>
              )}

              <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                Delivery Days: {product.deliveryDays}
              </Typography>
              
              {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                Description: {product.description}
              </Typography> */}
              <Tooltip title={product.description} placement="bottom" arrow>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',overflow: 'hidden', textOverflow: 'ellipsis',
                    maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                    lineHeight: '1.5rem'  // Adjust to control exact line spacing.
                  }}>
                  Description: {product.description}
                </Typography>
              </Tooltip>
              {/* <div>
                {product.images && product.images.map((image, index) => (
                  <img src={image} alt={`Product ${index}`} key={index} style={{ width: '100%', marginTop: '10px' }} />
                ))}
              </div> */}
            </CardContent>
            <CardActions style={{ justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
              <Button color="primary" onClick={() => handleEdit(product)}>Edit</Button> {/* variant="contained" */}
              <Button color="secondary" onClick={() => handleDelete(product._id)}>Delete</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      </Grid></div>
        
      </div>
    </div>
  );
}

export default Admin;
