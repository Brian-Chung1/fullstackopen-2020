import blogService from '../services/blogs';

/* eslint-disable */

const blogReducer = (state = [], action) => {
  // console.log(`Blog Reducer State: ${{ state }}`);
  // console.log(`Blog Reducer Action: ${{ action }}`);

  switch (action.type) {
    case 'NEW_BLOG': {
      return [...state, action.data];
    }
    case 'INIT': {
      return action.data;
    }

    case 'LIKE': {
      const id = action.data;
      return state.map((blog) =>
        blog.id !== id ? blog : { ...blog, likes: blog.likes + 1 }
      );
    }

    case 'DELETE': {
      return state.filter((blog) => blog.id !== action.id);
    }

    case 'COMMENT': {
      const commentedBlog = action.data;
      const id = commentedBlog.id;
      return state.map((blog) => (blog.id != id ? blog : commentedBlog));
    }

    default: {
      return state;
    }
  }
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    });
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch({
      type: 'DELETE',
      id: id,
    });
  };
};

export const updateLikes = (id, blog) => {
  return async (dispatch) => {
    await blogService.updateBlogLikes(id, blog);
    dispatch({
      type: 'LIKE',
      data: id,
    });
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT',
      data: blogs,
    });
  };
};

export const addBlogComment = (blog, comment) => {
  return async (dispatch) => {
    const addedComment = await blogService.commentBlog(blog, comment);
    const newBlog = { ...blog, comments: blog.comments.concat(addedComment) };
    dispatch({
      type: 'COMMENT',
      data: newBlog,
    });
  };
};

export default blogReducer;
