import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscussion extends Document {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  comments: IComment[];
  tags: string[];
  views: number;
  likes: mongoose.Types.ObjectId[];
  isAnnouncement: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required']
    }
  },
  {
    timestamps: true
  }
);

const discussionSchema = new Schema<IDiscussion>(
  {
    title: {
      type: String,
      required: [true, 'Discussion title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Discussion content is required']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    comments: [commentSchema],
    tags: [{
      type: String
    }],
    views: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isAnnouncement: {
      type: Boolean,
      default: false
    },
    isPinned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for common query patterns
discussionSchema.index({ course: 1, createdAt: -1 });
discussionSchema.index({ tags: 1 });
discussionSchema.index({ user: 1 });

export default mongoose.model<IDiscussion>('Discussion', discussionSchema);
