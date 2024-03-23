import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks.js";

const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;


const userSchema = new Schema(
  {
    password: {
      type: String,
      match: passwordRegExp,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userAuthSchema = Joi.object({
  password: Joi.string().pattern(passwordRegExp).required().messages({
    "any.required": `"missing required password field"`,
  }),
  email: Joi.string().pattern(emailRegExp).required().messages({
    "any.required": `"missing required email field"`,
  }),
});

export const userUpdateSubscriptionsSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

export default User;
