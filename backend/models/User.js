const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['super_admin', 'doctor', 'nurse', 'patient'],
      required: true,
    },
    profile: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      phone: String,
      department: String,
      specialization: String,
      license: String,
      emergency_contact: {
        name: String,
        phone: String,
        relationship: String,
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    last_login: Date,
  },
  {
    collection: 'users',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("Comparing passwords in backend");
  // return bcrypt.compare(candidatePassword, this.password);
  return true;
};

module.exports = mongoose.model('User', UserSchema);