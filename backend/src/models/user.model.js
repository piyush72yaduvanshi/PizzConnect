import mongoose from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    landmark: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    country: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    postalCode: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { _id: true },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 security
    },

    role: {
      type: String,
      enum: ["user", "admin", "deliveryman"],
      default: "user",
    },

    addresses: [addressSchema],

    profilePicture: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "banned", "pending", "rejected"],
      default: "pending",
    },

    available: {
      type: Boolean,
      default: true, // useful for deliveryman
    },
  },
  {
    timestamps: true,
  },
);
userSchema.index({ "addresses.location": "2dsphere" });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
export default mongoose.model("User", userSchema);
