const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  blogs.reduce((total, blog) => total + blog.likes, 0);
};

const notFunctionalFavoriteBlog = (blogs) => {
  let current = blogs[0];
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > current.likes) {
      current = blogs[i];
    }
  }
  return current;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  let res = blogs.reduce(
    (currFav, currBlog) =>
      currBlog.likes > currFav.likes ? currBlog : currFav,
    blogs[0]
  );

  return res;
};

const notFunctionalMostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const map = new Map();

  let res = {
    author: '',
    blogs: 0,
  };

  for (let i = 0; i < blogs.length; i++) {
    map.set(
      blogs[i].author,
      map.get(blogs[i].author) === undefined ? 1 : map.get(blogs[i].author) + 1
    );

    let val = map.get(blogs[i].author);
    if (val !== undefined && val > res.blogs) {
      res.author = blogs[i].author;
      res.blogs = val;
    }
  }

  return res;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  let res = {
    author: '',
    blogs: 0,
  };

  blogs.reduce((obj, blog) => {
    if (!obj[blog.author]) {
      obj[blog.author] = 0;
    }
    obj[blog.author]++;
    if (obj[blog.author] > res.blogs) {
      res.author = blog.author;
      res.blogs = obj[blog.author];
    }
    return obj;
  }, {});
  return res;
};

const notFunctionalMostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const map = new Map();

  let res = {
    author: '',
    likes: 0,
  };

  for (let i = 0; i < blogs.length; i++) {
    map.set(
      blogs[i].author,
      map.get(blogs[i].author) === undefined
        ? blogs[i].likes
        : map.get(blogs[i].author) + blogs[i].likes
    );

    let val = map.get(blogs[i].author);
    if (val !== undefined && val > res.likes) {
      res.author = blogs[i].author;
      res.likes = val;
    }
  }

  return res;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  let res = {
    author: '',
    likes: 0,
  };

  blogs.reduce((obj, blog) => {
    if (!obj[blog.author]) {
      obj[blog.author] = blog.likes;
    } else {
      obj[blog.author] += blog.likes;
    }
    if (obj[blog.author] > res.likes) {
      res.author = blog.author;
      res.likes = obj[blog.author];
    }
    return obj;
  }, {});
  return res;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
