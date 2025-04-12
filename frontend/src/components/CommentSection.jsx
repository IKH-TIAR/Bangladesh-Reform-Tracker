import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentSection = ({ reformId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [reformId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/comments/reform/${reformId}`
      );

      const topLevelComments = res.data.filter((comment) => !comment.parentId);
      const replies = res.data.filter((comment) => comment.parentId);

      const commentsWithReplies = topLevelComments.map((comment) => ({
        ...comment,
        replies: replies.filter((reply) => reply.parentId === comment._id),
      }));

      setComments(commentsWithReplies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };

  const handleAddComment = async (comment) => {
    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        reformId,
        content: comment,
        parentId: replyTo,
      });

      if (replyTo) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c._id === replyTo
              ? { ...c, replies: [...(c.replies || []), res.data] }
              : c
          )
        );
        setReplyTo(null);
      } else {
        setComments((prevComments) => [
          { ...res.data, replies: [] },
          ...prevComments,
        ]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleVote = async (commentId, voteType, isReply, parentId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/vote/${commentId}`,
        {
          voteType,
        }
      );

      if (isReply) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === parentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply._id === commentId
                      ? {
                          ...reply,
                          votes: {
                            upvotes: Array(res.data.upvotes)
                              .fill(0)
                              .map((_, i) => i.toString()),
                            downvotes: Array(res.data.downvotes)
                              .fill(0)
                              .map((_, i) => i.toString()),
                          },
                          voteCount: res.data.voteCount,
                        }
                      : reply
                  ),
                }
              : comment
          )
        );
      } else {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  votes: {
                    upvotes: Array(res.data.upvotes)
                      .fill(0)
                      .map((_, i) => i.toString()),
                    downvotes: Array(res.data.downvotes)
                      .fill(0)
                      .map((_, i) => i.toString()),
                  },
                  voteCount: res.data.voteCount,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <div className="mb-6">
          <CommentForm
            onSubmit={handleAddComment}
            isReply={replyTo !== null}
            onCancel={cancelReply}
          />
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-md text-center">
          <p className="text-gray-600">Please log in to add comments.</p>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onVote={handleVote}
              onReply={handleReply}
              replyActive={replyTo === comment._id}
              isLoggedIn={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
