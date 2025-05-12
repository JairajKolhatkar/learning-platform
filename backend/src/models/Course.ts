import mongoose, { Document, Schema } from 'mongoose';

interface ILesson extends Document {
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'text';
  content: string;
  duration: number;
  order: number;
}

interface ISection extends Document {
  title: string;
  lessons: ILesson[];
  order: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  thumbnailUrl: string;
  price: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  enrolledCount: number;
  sections: ISection[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'text'],
    required: [true, 'Lesson type is required']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  duration: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
});

const sectionSchema = new Schema<ISection>({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    default: 0
  }
});

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required']
    },
    thumbnailUrl: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag'
    },
    price: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    tags: [{
      type: String
    }],
    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    enrolledCount: {
      type: Number,
      default: 0
    },
    sections: [sectionSchema],
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICourse>('Course', courseSchema);
