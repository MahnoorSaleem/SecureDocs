import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config/config';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isValidPassword: (password: string) => Promise<boolean>;
  }

// Create a user schema
const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  try {
    // Check if the password has been modified
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(config.salt);
    this.password = await bcrypt.hash(this.password, salt);

    next(); // Proceed to save
  } catch (error) {
    next(error as CallbackError); // Pass any errors to the next middleware
  }
});

userSchema.methods.isValidPassword = async function (password: any) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;