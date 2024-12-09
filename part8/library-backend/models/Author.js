import { Schema, model } from "mongoose";

import uniqueValidator from "mongoose-unique-validator";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

schema.plugin(uniqueValidator);

const Author = model("Author", schema);
export default Author;
