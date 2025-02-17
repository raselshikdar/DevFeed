export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  authorImage: string;
  readTime: string;
  reactions: number;
  comments: number;
  tags: string[];
  timestamp: string;
}

export interface Comment {
  id: number;
  text: string;
  author: string;
  authorImage: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}
