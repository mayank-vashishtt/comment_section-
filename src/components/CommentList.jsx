import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Comment from './Comment';
import { addComment } from '../store/commentSlice';
import { persistor } from '../store/store';

const CommentList = () => {
  const comments = useSelector((state) => state.comments.comments);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleAddComment = () => {
    if (!name || !text) return;
    dispatch(addComment({
      id: Date.now(),
      name,
      text,
      date: new Date().toISOString(),
      replies: [],
    }));
    setName('');
    setText('');
  };

  const sortComments = (commentsArray) => {
    return commentsArray.map(comment => ({
      ...comment,
      replies: sortComments(comment.replies || [])
    })).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const sortedComments = sortComments(comments);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleClearStorage = () => {
    persistor.purge(); // Clears the persisted state
    window.location.reload(); // Optionally reload the page to reflect changes
  };

  return (
    <div className="comment-list">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAddComment}>Post</button>
      
      <button onClick={toggleSortOrder}>
        Sort By: Date and Time {sortOrder === 'asc' ? '↑' : '↓'}
      </button>

      <button onClick={handleClearStorage}>Clear All Comments</button>
      
      {sortedComments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
