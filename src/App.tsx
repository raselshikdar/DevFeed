import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Modal, StyleSheet, Share } from 'react-native';
import ThemeProvider from './components/ThemeProvider';
import { useTheme } from './hooks/useTheme';
import PostCard from './components/PostCard';
import CommentSection from './components/CommentSection';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Article, Comment } from './types';

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Understanding React Native's New Architecture",
    description: "Deep dive into the new architecture of React Native and what it means for developers",
    content: `React Native's new architecture brings significant improvements in performance and developer experience. 

The key improvements include:
• Improved JavaScript Interface
• Better Native Module System
• Enhanced Layout Engine
• Simplified Bridge

These changes result in faster startup times, smoother animations, and better overall app performance.

The new architecture also introduces several new concepts that developers need to understand:
1. The new C++ core
2. Fabric Rendering System
3. TurboModules
4. CodeGen

Let's explore each of these in detail...`,
    author: "Sarah Chen",
    authorImage: "https://api.a0.dev/assets/image?text=professional%20software%20developer%20profile%20picture%20woman%20tech&seed=123",
    readTime: "8 min read",
    reactions: 245,
    comments: 42,
    tags: ["react-native", "mobile", "javascript"],
    timestamp: "2h ago"
  }
];

const AppContent: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const [isSaved, setIsSaved] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});

  const theme = {
    background: isDark ? '#1a1a1a' : '#f8fafc',
    text: isDark ? '#ffffff' : '#1e293b',
    card: isDark ? '#2d2d2d' : '#ffffff',
    border: isDark ? '#404040' : '#e2e8f0',
    primary: '#0284c7',
    secondary: isDark ? '#525252' : '#64748b'
  };

  const handleLike = (articleId: number) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === articleId
          ? { ...article, reactions: isLiked[articleId] ? article.reactions - 1 : article.reactions + 1 }
          : article
      )
    );
    setIsLiked((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const handleSave = (articleId: number) => {
    setIsSaved((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const handleShare = async (article: Article) => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title}`,
        title: article.title
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddComment = (articleId: number, text: string, parentCommentId: number | null = null) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      text,
      author: "Current User",
      authorImage: "https://api.a0.dev/assets/image?text=profile%20picture%20tech%20person&seed=999",
      timestamp: new Date().toLocaleTimeString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    if (parentCommentId) {
      setComments((prev) => {
        const articleComments = prev[articleId] || [];
        return {
          ...prev,
          [articleId]: articleComments.map((comment) =>
            comment.id === parentCommentId ? { ...comment, replies: [...comment.replies, newComment] } : comment
          )
        };
      });
    } else {
      setComments((prev) => ({
        ...prev,
        [articleId]: [newComment, ...(prev[articleId] || [])]
      }));
    }
  };

  const handleLikeComment = (
    articleId: number,
    commentId: number,
    isReply: boolean = false,
    parentCommentId: number | null = null
  ) => {
    setComments((prev) => {
      const articleComments = prev[articleId] || [];
      if (isReply && parentCommentId) {
        return {
          ...prev,
          [articleId]: articleComments.map((comment) =>
            comment.id === parentCommentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === commentId
                      ? { ...reply, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !reply.isLiked }
                      : reply
                  )
                }
              : comment
          )
        };
      }
      return {
        ...prev,
        [articleId]: articleComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
            : comment
        )
      };
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.primary }]}>DevFeed</Text>
          <Text style={[styles.headerSubtitle, { color: theme.secondary }]}>Where developers share knowledge</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={toggleTheme} style={styles.themeToggle}>
            <MaterialCommunityIcons name={isDark ? 'weather-sunny' : 'weather-night'} size={24} color={theme.primary} />
          </Pressable>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
        {Array.from(new Set(ARTICLES.flatMap((article) => article.tags))).map((tag) => (
          <Pressable
            key={tag}
            onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}
            style={[styles.tag, { backgroundColor: tag === selectedTag ? theme.primary : theme.card }]}
          >
            <Text style={[styles.tagText, { color: tag === selectedTag ? '#ffffff' : theme.secondary }]}>#{tag}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {articles
        .filter((article) => !selectedTag || article.tags.includes(selectedTag))
        .map((article) => (
          <PostCard
            key={article.id}
            article={article}
            isLiked={!!isLiked[article.id]}
            isSaved={!!isSaved[article.id]}
            onLike={handleLike}
            onSave={handleSave}
            onShare={handleShare}
            onPress={() => setSelectedPost(article)}
            theme={theme}
          />
        ))}
      <Modal animationType="slide" visible={selectedPost !== null} onRequestClose={() => setSelectedPost(null)}>
        {selectedPost && (
          <ScrollView style={[styles.postDetailContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.postDetailHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <Pressable onPress={() => setSelectedPost(null)} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
                <Text style={[styles.backButtonText, { color: theme.primary }]}>Back to Feed</Text>
              </Pressable>
            </View>
            <View style={[styles.postContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.postDetailTitle, { color: theme.text }]}>{selectedPost.title}</Text>
              <Text style={[styles.postDetailDescription, { color: theme.secondary }]}>{selectedPost.description}</Text>
              <Text style={[styles.fullPostContent, { color: theme.text }]}>{selectedPost.content}</Text>
              <CommentSection
                articleId={selectedPost.id}
                comments={comments[selectedPost.id] || []}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                theme={theme}
              />
            </View>
          </ScrollView>
        )}
      </Modal>
    </ScrollView>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2
  },
  themeToggle: {
    padding: 8
  },
  tagsContainer: {
    padding: 16
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8
  },
  tagText: {
    fontSize: 14
  },
  postDetailContainer: {
    flex: 1
  },
  postDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8
  },
  postContent: {
    padding: 20
  },
  postDetailTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12
  },
  postDetailDescription: {
    fontSize: 18,
    marginBottom: 20
  },
  fullPostContent: {
    fontSize: 16,
    marginBottom: 32
  }
});

export default App;
