import api from './api';
import { User } from './authService';

export interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: string | User;
  course?: string;
  replies: ForumReply[];
  likes: string[];
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  _id: string;
  content: string;
  author: string | User;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateData {
  title: string;
  content: string;
  courseId?: string;
  tags?: string[];
}

export interface ReplyCreateData {
  content: string;
}

export interface ForumSearchParams {
  keyword?: string;
  courseId?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

const forumService = {
  getAllPosts: async (params?: ForumSearchParams): Promise<{ posts: ForumPost[]; total: number }> => {
    const response = await api.get<{ posts: ForumPost[]; total: number }>('/forum/posts', { params });
    return response.data;
  },

  getPostById: async (id: string): Promise<ForumPost> => {
    const response = await api.get<ForumPost>(`/forum/posts/${id}`);
    return response.data;
  },

  createPost: async (postData: PostCreateData): Promise<ForumPost> => {
    const response = await api.post<ForumPost>('/forum/posts', postData);
    return response.data;
  },

  updatePost: async (id: string, postData: Partial<PostCreateData>): Promise<ForumPost> => {
    const response = await api.put<ForumPost>(`/forum/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/forum/posts/${id}`);
  },

  addReply: async (postId: string, replyData: ReplyCreateData): Promise<ForumReply> => {
    const response = await api.post<ForumReply>(`/forum/posts/${postId}/replies`, replyData);
    return response.data;
  },

  likePost: async (postId: string): Promise<{ likes: string[] }> => {
    const response = await api.post<{ likes: string[] }>(`/forum/posts/${postId}/like`);
    return response.data;
  },

  likeReply: async (postId: string, replyId: string): Promise<{ likes: string[] }> => {
    const response = await api.post<{ likes: string[] }>(`/forum/posts/${postId}/replies/${replyId}/like`);
    return response.data;
  }
};

export default forumService; 