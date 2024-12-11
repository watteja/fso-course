import { Schema, model } from "mongoose";

// you must install this library
import uniqueValidator from "mongoose-unique-validator";

const schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  published: {
    type: Number,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
});

schema.plugin(uniqueValidator);

const Book = model("Book", schema);
export default Book;
