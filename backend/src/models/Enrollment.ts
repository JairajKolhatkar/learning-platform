import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  isCompleted: boolean;
  paymentId?: string;
  paymentAmount: number;
  paymentMethod?: string;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    paymentId: {
      type: String
    },
    paymentAmount: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['free', 'stripe', 'razorpay']
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index to ensure a user can only enroll once in a course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
