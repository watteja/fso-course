import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (changedBlog) => {
  changedBlog.user = changedBlog.user.id;
  const response = await axios.put(`${baseUrl}/${changedBlog.id}`, changedBlog);
  return response.data;
};

const addComment = async ({ id, comment }) => {
  console.log("id", id);
  console.log("comment", comment);
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment });
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { setToken, getAll, create, update, addComment, deleteBlog };
