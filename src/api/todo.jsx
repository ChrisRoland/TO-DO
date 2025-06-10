import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export const fetchTodos = async () => {
  const { data } = await api.get('/todos');
  return data;
};

export const fetchTodo = async (id) => {
  const { data } = await api.get(`/todos/${id}`);
  return data;
};