import { Schema, model } from "mongoose";

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
});

const User = model("User", schema);
export default User;
