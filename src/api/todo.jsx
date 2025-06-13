import axios from 'axios';

const api = axios.create({
  baseURL: "https://api.oluwasetemi.dev",
});

export const fetchTodos = async () => {
  try {
    try {
      const { data } = await api.get('/tasks?limit=100');
      return data.data || [];
    } catch (limitError) {
      console.warn("Getting large limit failed, trying pagination approach:", limitError);
      
      let allTodos = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page <= 40) {
        try {
          const { data } = await api.get(`/tasks?page=${page}`);
          const todos = data.data || [];
          
          if (todos.length === 0) {
            hasMore = false;
          } else {
            allTodos = [...allTodos, ...todos];
            page++;
            // If we got less than expected, maybe we're at the last page
            hasMore = todos.length >= 10; // i.e if page size is 10
          }
        } catch (pageError) {
          console.error(`Error fetching page ${page}:`, pageError);
          hasMore = false;
        }
      }
      
      return allTodos;
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    // Final fallback: if everything esle cast just gimme the first page abeg
    try {
      const { data } = await api.get('/tasks');
      return data.data || [];
    } catch (fallbackError) {
      console.error("All fetch attempts failed:", fallbackError);
      throw error;
    }
  }
};

export const fetchTodo = async (id) => {
  try {
    const { data } = await api.get(`/tasks/${id}`);
    return data; 
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw error;
  }
};

export const addTodo = async (todoData) => {
  try {
    const { data } = await api.post('/tasks', todoData);
    return data; 
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};

export const updateTodo = async (id, todoData) => {
  try {
    // try PATCH first, I can't figure why I'm getting an error
    let response;
    try {
      response = await api.patch(`/tasks/${id}`, todoData);
    } catch (patchError) {
      // Omo If PATCH fails, try PUT
      if (patchError.response?.status === 404 || patchError.response?.status === 405) {
        console.warn("PATCH failed, trying PUT:", patchError);
        response = await api.put(`/tasks/${id}`, todoData);
      } else {
        throw patchError;
      }
    }
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};


// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://jsonplaceholder.typicode.com',
// });

// export const fetchTodos = async () => {
//   const { data } = await api.get('/todos');
//   return data;
// };

// export const fetchTodo = async (id) => {
//   const { data } = await api.get(`/todos/${id}`);
//   return data;
// };


// import axios from 'axios';

// const api = axios.create({
//   baseURL: "https://dummyjson.com",
// });

// export const fetchTodos = async () => {
//   const { data } = await api.get('/todos');
//   return data.todos; // todos for this api
// };

// export const fetchTodo = async (id) => {
//   const { data } = await api.get(`/todos/${id}`);
//   return data;
// };