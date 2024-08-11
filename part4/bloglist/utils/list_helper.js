const _ = require("lodash");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let mostLiked = blogs[0];
  blogs.forEach((blog) => {
    if (blog.likes > mostLiked.likes) {
      mostLiked = blog;
    }
  });

  return mostLiked;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // without Lodash

  // const authors = {};
  // blogs.forEach((blog) => {
  //   // If the author is already in the object, increment the blog count
  //   if (authors[blog.author]) {
  //     authors[blog.author] += 1;
  //   } else {
  //     authors[blog.author] = 1;
  //   }
  // });
  // // authors { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }

  // let mostBlogs = { author: null, blogs: 0 };
  // // iterate over built object to find the author with the most blogs
  // Object.keys(authors).forEach((author) => {
  //   if (authors[author] > mostBlogs.blogs) {
  //     mostBlogs = { author, blogs: authors[author] };
  //   }
  // });

  // return mostBlogs;

  // with Lodash

  // Iteratee as a property returns the value of that field for a specific object.
  // _.countBy() counts how many times each returned iteratee value appears in
  // the passed object array
  const authors = _.countBy(blogs, "author");
  // authors { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }

  // _.toPairs() transforms passed object array into an array of enumerable
  // key-value pairs (since an object is not enumerable by itself)
  const authorArray = _.toPairs(authors);
  // authorArray [ [ 'Michael Chan', 1 ], [ 'Edsger W. Dijkstra', 2 ], [ 'Robert C. Martin', 3 ] ]

  // _.maxBy() find the maximum value in the array according to the iteratee function
  // (applied to each element). Iteratee _.last returns the last element of the array
  const mostBlogs = _.maxBy(authorArray, _.last);
  // mostBlogs [ 'Robert C. Martin', 3 ]

  return { author: mostBlogs[0], blogs: mostBlogs[1] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // without Lodash

  // const authors = {};
  // blogs.forEach((blog) => {
  //   // If the author is already in the object, increment the likes
  //   if (authors[blog.author]) {
  //     authors[blog.author] += blog.likes;
  //   } else {
  //     authors[blog.author] = blog.likes;
  //   }
  // });
  // // authors { 'Michael Chan': 7, 'Edsger W. Dijkstra': 17, 'Robert C. Martin': 12 }

  // let mostLikes = { author: null, likes: 0 };
  // // iterate over built object to find the author with the most likes
  // Object.keys(authors).forEach((author) => {
  //   if (authors[author] > mostLikes.likes) {
  //     mostLikes = { author, likes: authors[author] };
  //   }
  // });

  // return mostLikes;

  // with Lodash

  // _.groupBy() groups the passed object array by the iteratee value.
  const blogsByAuthor = _.groupBy(blogs, "author");
  // blogsByAuthor {
  //   [ 'Michael Chan', [ [Object] ] ],
  //   [ 'Edsger W. Dijkstra', [ [Object], [Object] ] ],
  //   [ 'Robert C. Martin', [ [Object], [Object], [Object] ] ]
  // }

  // _.map() creates an array of values by running each element in the collection
  // through the iteratee function.
  // NB: For the Lodash map function, the iteratee function takes the params
  // in this order: (value, index|key, collection)
  const authorLikes = _.map(blogsByAuthor, (authorBlogs, author) => {
    return { author, likes: _.sumBy(authorBlogs, "likes") };
  });
  // authorLikes [
  //   { author: 'Michael Chan', likes: 7 },
  //   { author: 'Edsger W. Dijkstra', likes: 17 },
  //   { author: 'Robert C. Martin', likes: 12 }
  // ]

  return _.maxBy(authorLikes, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
