import { Request, Response } from 'express';
import Discussion from '../models/Forum';
import { io } from '../server';
import mongoose from 'mongoose';

// @desc    Create a new discussion
// @route   POST /api/forum
// @access  Private
export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const { title, content, courseId, tags, isAnnouncement } = req.body;

    // Only instructors can create announcements
    if (isAnnouncement && req.user.role === 'student') {
      return res.status(403).json({ message: 'Only instructors can create announcements' });
    }

    const discussion = await Discussion.create({
      title,
      content,
      user: req.user._id,
      course: courseId || undefined,
      tags: tags || [],
      isAnnouncement: isAnnouncement || false
    });

    // Populate user details for the response
    const populatedDiscussion = await Discussion.findById(discussion._id).populate('user', 'name avatar');

    // Emit socket event for real-time updates
    if (courseId) {
      io.to(courseId).emit('new-discussion', populatedDiscussion);
    }

    res.status(201).json(populatedDiscussion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all discussions (with optional course filter)
// @route   GET /api/forum
// @access  Private
export const getDiscussions = async (req: Request, res: Response) => {
  try {
    const pageSize = 15;
    const page = Number(req.query.page) || 1;
    
    // Build filter
    const filter: any = {};
    
    if (req.query.courseId) {
      filter.course = req.query.courseId;
    }
    
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    
    if (req.query.type === 'announcements') {
      filter.isAnnouncement = true;
    }
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Get total count
    const count = await Discussion.countDocuments(filter);
    
    // Get discussions with pagination
    const discussions = await Discussion.find(filter)
      .populate('user', 'name avatar role')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    
    res.json({
      discussions,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a discussion by ID
// @route   GET /api/forum/:id
// @access  Private
export const getDiscussionById = async (req: Request, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar role');
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Increment view count
    discussion.views += 1;
    await discussion.save();
    
    res.json(discussion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a discussion
// @route   POST /api/forum/:id/comments
// @access  Private
export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Add comment with proper MongoDB ObjectId
    discussion.comments.push({
      _id: new mongoose.Types.ObjectId(),
      user: req.user._id,
      content
    } as any);
    
    await discussion.save();
    
    // Populate the newly added comment with user details
    const updatedDiscussion = await Discussion.findById(req.params.id)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar role');
    
    // Get the new comment
    const newComment = updatedDiscussion!.comments[updatedDiscussion!.comments.length - 1];
    
    // Emit socket event for real-time updates
    io.to(req.params.id).emit('new-comment', {
      discussionId: discussion._id,
      comment: newComment
    });
    
    res.status(201).json(updatedDiscussion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or unlike a discussion
// @route   PUT /api/forum/:id/like
// @access  Private
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Convert string ID to ObjectId for comparison
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    // Check if user already liked the discussion using ObjectId comparison
    const alreadyLiked = discussion.likes.some(
      (id) => id.equals(userId)
    );
    
    if (alreadyLiked) {
      // Remove like
      discussion.likes = discussion.likes.filter(
        (id) => !id.equals(userId)
      );
    } else {
      // Add like with proper ObjectId
      discussion.likes.push(userId);
    }
    
    await discussion.save();
    
    res.json({ likes: discussion.likes.length, liked: !alreadyLiked });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a discussion (for owner or admin)
// @route   PUT /api/forum/:id
// @access  Private
export const updateDiscussion = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Check if user is the owner or admin
    if (discussion.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this discussion' });
    }
    
    // Update fields
    discussion.title = title || discussion.title;
    discussion.content = content || discussion.content;
    discussion.tags = tags || discussion.tags;
    
    await discussion.save();
    
    res.json(discussion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pin or unpin a discussion (instructor or admin only)
// @route   PUT /api/forum/:id/pin
// @access  Private/Instructor
export const togglePin = async (req: Request, res: Response) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Toggle pin status
    discussion.isPinned = !discussion.isPinned;
    
    await discussion.save();
    
    res.json({ isPinned: discussion.isPinned });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
