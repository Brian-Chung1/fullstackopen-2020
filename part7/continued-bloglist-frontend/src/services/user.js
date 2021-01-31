import axios from 'axios';
const baseUrl = '/api/users';

const getAll = async () => {
  let response = await axios.get(baseUrl);
  return response.data;
};

export default { getAll };
