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
      default: {
        roles: [],
        locations: [],
        workModes: [],
        commuteDistance: 'none',
        remoteCityOnly: false,
        salary: {
          minimum: '',
          preferred: '',
        },
        citizenshipStatus: '',
        requiresSponsorship: false,
        jobType: [],
      },
    },
    applicationsStatus: {
      type: String,
      enum: ['started', 'completed'],
      default: 'started',
      select: true,
    },
    experience: {
      type: mongoose.Schema.Types.Mixed,
      select: true,
      default: {
        yearsOfExperience: '',
        education: '',
        skills: [],
        isVeteran: false,
        hasDisability: false,
        ethnicity: '',
        dateOfBirth: '',
        gender: '',
      },
    },
    availability: {
      type: mongoose.Schema.Types.Mixed,
      select: true,
      default: {
        startDate: '',
        phoneNumber: '',
        linkedInUrl: '',
        additionalInfo: '',
        address: {
          street: '',
          street2: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    appliedRoles: [
      {
        jobTitle: {
          type: String,
          required: true,
        },
        companyName: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        salary: {
          type: String,
        },
        jobType: {
          type: String,
          enum: ['full-time', 'contract', 'part-time', 'internship'],
          required: true,
        },
        jobLink: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['draft', 'completed'],
          default: 'draft',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    termsAccepted: {
      type: Boolean,
      default: false,
    },
    termsAcceptedAt: {
      type: Date,
      select: true,
    },
    marketingSource: {
      type: String,
      enum: ['google', 'linkedin', 'facebook', 'instagram', 'tiktok', 'x', 'friend', 'other'],
      select: true,
    },
    localization: {
      type: String,
      select: true,
    },
    messages: [
      {
        from: {
          type: String,
          enum: ['admin', 'user'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
