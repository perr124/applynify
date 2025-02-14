// models/User.ts
import mongoose from 'mongoose';
import toJSON from './plugins/toJSON';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value: string) {
        return value.includes('cus_');
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value: string) {
        return value.includes('price_');
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    // Make sure these fields are not excluded
    onboardingComplete: {
      type: Boolean,
      default: false,
      select: true,
    },
    jobPreferences: {
      type: mongoose.Schema.Types.Mixed,
      select: true,
    },
    applicationsStatus: {
      type: String,
      enum: ['started', 'pending', 'completed'],
      default: 'started',
      select: true,
    },
    experience: {
      type: mongoose.Schema.Types.Mixed,
      select: true,
    },
    availability: {
      type: mongoose.Schema.Types.Mixed,
      select: true,
      default: {
        startDate: '',
        phoneNumber: '',
      },
    },
    password: {
      type: String,
      private: true,
      select: false, // This ensures password isn't returned by default
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    resume: {
      url: {
        type: String,
        select: true,
      },
      filename: {
        type: String,
        select: true,
      },
      uploadedAt: {
        type: Date,
        select: true,
      },
    },
    resumes: [
      {
        id: String,
        filename: String,
        url: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ['active', 'archived'],
          default: 'active',
        },
      },
    ],
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      jobAlerts: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Ensure the toJSON plugin isn't excluding these fields
userSchema.plugin(toJSON);

// Add a pre-save hook to verify the data
userSchema.pre('save', function (next) {
  console.log('Saving user with data:', this.toObject());
  next();
});

// Add password hashing middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
  }
  return next();
});

// Add virtual for full name
userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
