import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Article } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PostCardProps {
  article: Article;
  isLiked: boolean;
  isSaved: boolean;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onShare: (article: Article) => void;
  onPress: () => void;
  theme: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({
  article,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onShare,
  onPress,
  theme
}) => {
  return (
    <Pressable style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.authorRow}>
        <Image source={{ uri: article.authorImage }} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: theme.text }]}>{article.author}</Text>
          <Text style={[styles.timestamp, { color: theme.secondary }]}>{article.timestamp}</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{article.title}</Text>
      <Text style={[styles.description, { color: theme.secondary }]}>{article.description}</Text>
      <View style={styles.articleMeta}>
        <Pressable style={styles.metaItem} onPress={() => onLike(article.id)}>
          <MaterialCommunityIcons name={isLiked ? 'heart' : 'heart-outline'} size={18} color={isLiked ? '#ef4444' : theme.secondary} />
          <Text style={[styles.metaText, { color: theme.secondary }]}>{article.reactions}</Text>
        </Pressable>
        <Pressable style={styles.metaItem} onPress={() => onSave(article.id)}>
          <MaterialCommunityIcons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? theme.primary : theme.secondary} />
        </Pressable>
        <Pressable style={styles.metaItem} onPress={() => onShare(article)}>
          <MaterialCommunityIcons name="share-outline" size={18} color={theme.secondary} />
        </Pressable>
        <Text style={[styles.readTime, { color: theme.secondary }]}>{article.readTime}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12
  },
  authorInfo: {
    flex: 1
  },
  authorName: {
    fontSize: 16,
    fontWeight: '500'
  },
  timestamp: {
    fontSize: 14
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14
  },
  readTime: {
    fontSize: 14
  }
});

export default PostCard;
