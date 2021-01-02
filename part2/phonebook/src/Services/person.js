import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);

  //   const nonExisting = { //testing
  //     id: 10000,
  //     content: "This note is not saved to server",
  //     date: "2019-05-30T17:30:31.098Z",
  //     important: true,
  //   };
  //   return request.then((response) => response.data.concat(nonExisting));
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteContact = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const personService = {
  getAll,
  create,
  update,
  deleteContact,
};

export default personService;
