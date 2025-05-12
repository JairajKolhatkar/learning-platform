import React, { createContext, useContext, useState, ReactNode } from 'react';
import forumService, { 
  ForumPost, 
  ForumReply, 
  PostCreateData, 
  ReplyCreateData, 
  ForumSearchParams 
} from '../services/forumService';
import socketService, { ChatMessage } from '../services/socketService';
import { useAuth } from './AuthContext';

interface ForumContextType {
  posts: ForumPost[];
  currentPost: ForumPost | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  totalPosts: number;
  searchParams: ForumSearchParams;
  fetchPosts: (params?: ForumSearchParams) => Promise<void>;
  getPostById: (id: string) => Promise<ForumPost>;
  createPost: (postData: PostCreateData) => Promise<ForumPost>;
  addReply: (postId: string, replyData: ReplyCreateData) => Promise<ForumReply>;
  likePost: (postId: string) => Promise<void>;
  likeReply: (postId: string, replyId: string) => Promise<void>;
  setSearchParams: (params: ForumSearchParams) => void;
  setCurrentPost: (post: ForumPost | null) => void;
  joinDiscussion: (postId: string) => void;
  leaveDiscussion: (postId: string) => void;
  sendMessage: (postId: string, message: string) => void;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

interface ForumProviderProps {
  children: ReactNode;
}

export const ForumProvider: React.FC<ForumProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [currentPost, setCurrentPost] = useState<ForumPost | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<ForumSearchParams>({
    page: 1,
    limit: 10
  });

  // Set up socket message listener on component mount
  React.useEffect(() => {
    const unsubscribe = socketService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchPosts = async (params?: ForumSearchParams): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = params || searchParams;
      const response = await forumService.getAllPosts(queryParams);
      
      setPosts(response.posts);
      setTotalPosts(response.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch forum posts.';
      setError(errorMessage);
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPostById = async (id: string): Promise<ForumPost> => {
    setLoading(true);
    setError(null);
    
    try {
      const post = await forumService.getPostById(id);
      setCurrentPost(post);
      return post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch forum post.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: PostCreateData): Promise<ForumPost> => {
    setLoading(true);
    setError(null);
    
    try {
      const post = await forumService.createPost(postData);
      
      // Update posts list with new post
      setPosts(prev => [post, ...prev]);
      
      return post;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create forum post.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (postId: string, replyData: ReplyCreateData): Promise<ForumReply> => {
    setLoading(true);
    setError(null);
    
    try {
      const reply = await forumService.addReply(postId, replyData);
      
      // Update current post with new reply if it's loaded
      if (currentPost && currentPost._id === postId) {
        setCurrentPost({
          ...currentPost,
          replies: [...currentPost.replies, reply]
        });
      }
      
      return reply;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add reply.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const { likes } = await forumService.likePost(postId);
      
      // Update current post if it's loaded
      if (currentPost && currentPost._id === postId) {
        setCurrentPost({
          ...currentPost,
          likes
        });
      }
      
      // Update post in posts list
      setPosts(prev => 
        prev.map(post => 
          post._id === postId ? { ...post, likes } : post
        )
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to like post.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const likeReply = async (postId: string, replyId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const { likes } = await forumService.likeReply(postId, replyId);
      
      // Update current post if it's loaded
      if (currentPost && currentPost._id === postId) {
        setCurrentPost({
          ...currentPost,
          replies: currentPost.replies.map(reply => 
            reply._id === replyId ? { ...reply, likes } : reply
          )
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to like reply.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const joinDiscussion = (postId: string): void => {
    socketService.joinRoom(`forum:${postId}`);
    setMessages([]);
  };

  const leaveDiscussion = (postId: string): void => {
    socketService.leaveRoom(`forum:${postId}`);
  };

  const sendMessage = (postId: string, message: string): void => {
    if (!user) return;
    
    socketService.sendMessage(
      `forum:${postId}`, 
      message, 
      {
        _id: user._id,
        name: user.name,
        avatar: user.avatar
      }
    );
  };

  return (
    <ForumContext.Provider
      value={{
        posts,
        currentPost,
        messages,
        loading,
        error,
        totalPosts,
        searchParams,
        fetchPosts,
        getPostById,
        createPost,
        addReply,
        likePost,
        likeReply,
        setSearchParams,
        setCurrentPost,
        joinDiscussion,
        leaveDiscussion,
        sendMessage
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

// Custom hook to use forum context
export const useForum = (): ForumContextType => {
  const context = useContext(ForumContext);
  
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  
  return context;
}; 