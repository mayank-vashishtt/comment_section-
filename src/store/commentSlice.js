import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
};

const findCommentById = (comments, id) => {
  for (let comment of comments) {
    if (comment.id === id) {
      return comment;
    } else if (comment.replies && comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    editComment: (state, action) => {
      const { id, text } = action.payload;
      const comment = findCommentById(state.comments, id);
      if (comment) comment.text = text;
    },
    deleteComment: (state, action) => {
      const deleteCommentRecursive = (comments, id) => {
        return comments.filter(comment => {
          if (comment.id === id) return false;
          if (comment.replies) {
            comment.replies = deleteCommentRecursive(comment.replies, id);
          }
          return true;
        });
      };
      state.comments = deleteCommentRecursive(state.comments, action.payload);
    },
    addReply: (state, action) => {
      const { parentId, reply } = action.payload;
      const parentComment = findCommentById(state.comments, parentId);
      if (parentComment) {
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(reply);
      }
    },
  },
});

export const { addComment, editComment, deleteComment, addReply } = commentSlice.actions;

export default commentSlice.reducer;
