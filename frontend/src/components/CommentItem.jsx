import React, { useContext } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'react-feather';
import AuthContext from '../context/AuthContext';

const CommentItem = ({ comment, onVote, onReply, replyActive, isLoggedIn, isReply = false, parentId = null }) => {
  const { user } = useContext(AuthContext);
  const userId = user ? user._id : null;
  
  const hasUpvoted = userId && comment.votes.upvotes.includes(userId);
  const hasDownvoted = userId && comment.votes.downvotes.includes(userId);

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : 'border-b border-gray-200 pb-4'}`}>
      <div className="flex items-start">
        <div className="mr-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
            {comment.userId.profileImage ? (
              <img 
                src={comment.userId.profileImage} 
                alt={comment.userId.name} 
                className="w-full h-full object-cover"
              />
            ) : (<div className="flex items-center justify-center w-full h-full text-white font-medium">
                {comment.userId.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-medium text-gray-800">{comment.userId.name}</span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 mb-2">{comment.content}</p>

          <div className="flex items-center text-sm">
            <button 
              onClick={() => isLoggedIn && onVote(comment._id, 'upvote', isReply, parentId)}
              className={`flex items-center mr-4 ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''} ${hasUpvoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
              disabled={!isLoggedIn}
            >
              <ThumbsUp size={14} className="mr-1" />
              <span>{comment.votes.upvotes.length}</span>
            </button>

            <button 
              onClick={() => isLoggedIn && onVote(comment._id, 'downvote', isReply, parentId)}
              className={`flex items-center mr-4 ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''} ${hasDownvoted ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
              disabled={!isLoggedIn}
            >
              <ThumbsDown size={14} className="mr-1" />
              <span>{comment.votes.downvotes.length}</span>
            </button>

            {!isReply && (
              <button 
                onClick={() => isLoggedIn && onReply(comment._id)}
                className={`flex items-center ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''} ${replyActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                disabled={!isLoggedIn}
              >
                <MessageCircle size={14} className="mr-1" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Display replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply._id} 
              comment={reply} 
              onVote={onVote}
              isReply={true}
              parentId={comment._id}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;