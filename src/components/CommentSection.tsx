import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, ScrollView } from 'react-native';
import { Comment } from '../types';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface CommentSectionProps {
  articleId: number;
  comments: Comment[];
  onAddComment: (articleId: number, text: string, parentCommentId?: number | null) => void;
  onLikeComment: (articleId: number, commentId: number, isReply?: boolean, parentCommentId?: number | null) => void;
  theme: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

const CommentSection: React.FC<CommentSectionProps> = ({
  articleId,
  comments,
  onAddComment,
  onLikeComment,
  theme
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState<{ [key: number]: boolean }>({});

  const handlePostComment = (parentCommentId?: number) => {
    const text = parentCommentId ? replyText : commentText;
    onAddComment(articleId, text, parentCommentId || null);
    if (parentCommentId) {
      setReplyText('');
      setShowReplyInput((prev) => ({ ...prev, [parentCommentId]: false }));
    } else {
      setCommentText('');
    }
  };

  return (
    <View style={[styles.commentsSection, { borderTopColor: theme.border }]}>
      <Text style={[styles.commentsHeader, { color: theme.text }]}>
        Comments ({comments.length})
      </Text>
      <View style={styles.addCommentSection}>
        <TextInput
          style={[
            styles.commentInput,
            { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }
          ]}
          placeholder="Add a comment..."
          placeholderTextColor={theme.secondary}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <Pressable style={[styles.postCommentButton, { backgroundColor: theme.primary }]} onPress={() => handlePostComment()}>
          <Text style={styles.postCommentButtonText}>Post</Text>
        </Pressable>
      </View>
      <ScrollView>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Image source={{ uri: comment.authorImage }} style={styles.commentAuthorImage} />
            <View style={styles.commentContent}>
              <Text style={[styles.commentAuthor, { color: theme.text }]}>{comment.author}</Text>
              <Text style={[styles.commentText, { color: theme.secondary }]}>{comment.text}</Text>
              <View style={styles.commentActions}>
                <Pressable style={styles.commentAction} onPress={() => onLikeComment(articleId, comment.id)}>
                  <MaterialCommunityIcons name={comment.isLiked ? 'heart' : 'heart-outline'} size={16} color={comment.isLiked ? '#ef4444' : theme.secondary} />
                  <Text style={[styles.commentActionText, { color: theme.secondary }]}>{comment.likes}</Text>
                </Pressable>
                <Pressable style={styles.commentAction} onPress={() => setShowReplyInput((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}>
                  <Feather name="message-circle" size={16} color={theme.secondary} />
                  <Text style={[styles.commentActionText, { color: theme.secondary }]}>Reply</Text>
                </Pressable>
                <Text style={[styles.commentTime, { color: theme.secondary }]}>{comment.timestamp}</Text>
              </View>
              {showReplyInput[comment.id] && (
                <View style={styles.replyInput}>
                  <TextInput
                    style={[
                      styles.commentInput,
                      { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }
                    ]}
                    placeholder="Write a reply..."
                    placeholderTextColor={theme.secondary}
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <Pressable style={[styles.postCommentButton, { backgroundColor: theme.primary }]} onPress={() => handlePostComment(comment.id)}>
                    <Text style={styles.postCommentButtonText}>Reply</Text>
                  </Pressable>
                </View>
              )}
              {comment.replies &&
                comment.replies.map((reply) => (
                  <View key={reply.id} style={styles.replyContainer}>
                    <Image source={{ uri: reply.authorImage }} style={styles.commentAuthorImage} />
                    <View style={styles.replyContent}>
                      <Text style={[styles.commentAuthor, { color: theme.text }]}>{reply.author}</Text>
                      <Text style={[styles.commentText, { color: theme.secondary }]}>{reply.text}</Text>
                      <View style={styles.commentActions}>
                        <Pressable style={styles.commentAction} onPress={() => onLikeComment(articleId, reply.id, true, comment.id)}>
                          <MaterialCommunityIcons name={reply.isLiked ? 'heart' : 'heart-outline'} size={16} color={reply.isLiked ? '#ef4444' : theme.secondary} />
                          <Text style={[styles.commentActionText, { color: theme.secondary }]}>{reply.likes}</Text>
                        </Pressable>
                        <Pressable style={styles.commentAction} onPress={() => setShowReplyInput((prev) => ({ ...prev, [reply.id]: !prev[reply.id] }))}>
                          <Feather name="message-circle" size={16} color={theme.secondary} />
                          <Text style={[styles.commentActionText, { color: theme.secondary }]}>Reply</Text>
                        </Pressable>
                        <Text style={[styles.commentTime, { color: theme.secondary }]}>{reply.timestamp}</Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  commentsSection: {
    marginTop: 24,
    borderTopWidth: 1,
    paddingTop: 24
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16
  },
  addCommentSection: {
    marginBottom: 24
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12
  },
  postCommentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end'
  },
  postCommentButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500'
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  commentAuthorImage: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  commentContent: {
    flex: 1
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  commentActionText: {
    fontSize: 12
  },
  commentTime: {
    fontSize: 12
  },
  replyContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginLeft: 24,
    paddingLeft: 24,
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0'
  },
  replyContent: {
    flex: 1
  },
  replyInput: {
    marginTop: 12,
    marginLeft: 24
  }
});

export default CommentSection;
