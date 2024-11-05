// src/components/CommentPopup.js
import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button } from '@mui/material';
import { addComment } from '../api/api';

function CommentPopup({ open, onClose, product, onCommentAdded }) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(product._id, { text: newComment });
      setNewComment('');
      onCommentAdded(); // refresh comments after adding
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6">Comments</Typography>
        <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '1rem 0' }}>
          {product?.comments?.length ? (
            product.comments.map((comment, index) => (
              <Typography key={index} style={{ marginBottom: '0.5rem' }}>
                {comment.text}
              </Typography>
            ))
          ) : (
            <Typography>No comments available.</Typography>
          )}
        </div>
        
        <TextField
          label="Add a comment"
          fullWidth
          multiline
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default CommentPopup;
