import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editComment, deleteComment, addReply } from '../store/commentSlice';

const Comment = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = () => {
    if (isEditing) {
      dispatch(editComment({ id: comment.id, text: editText }));
    }
    setIsEditing(!isEditing);
  };

  const handleReply = () => {
    if (!replyName || !replyText) return;
    const reply = {
      id: Date.now(),
      name: replyName,
      text: replyText,
      date: new Date().toISOString(),
      replies: [],
    };
    dispatch(addReply({ parentId: comment.id, reply }));
    setReplyName('');
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="comment">
      <p><strong>{comment.name}</strong> <small>{comment.date}</small></p>
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        <p>{comment.text}</p>
      )}
      <div className="comment-actions">
        <button onClick={() => setShowReplyForm(!showReplyForm)}>
          Reply
        </button>
        <button onClick={handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button onClick={() => dispatch(deleteComment(comment.id))}>Delete</button>
      </div>

      {showReplyForm && (
        <div className="reply-form">
          <input
            type="text"
            placeholder="Name"
            value={replyName}
            onChange={(e) => setReplyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={handleReply}>Post Reply</button>
        </div>
      )}

      {comment.replies && comment.replies.map((reply) => (
        <div key={reply.id} className="reply">
          <Comment comment={reply} />
        </div>
      ))}
    </div>
  );
};

export default Comment;
