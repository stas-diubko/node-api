import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    pass: {
      type: String,
      required: true,
      trim: true
    },
   
    imgChange: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    useNestedStrict: true
  }
);

export default mongoose.model("User", UserSchema);
