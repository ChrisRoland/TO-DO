// MY ORIGINAL IMPLEMENTATION

// import axios from 'axios';

// const api = axios.create({
//   baseURL: "https://api.oluwasetemi.dev",
// });

// export const fetchTodos = async () => {
//   try {
//     try {
//       const { data } = await api.get('/tasks?limit=100');
//       return data.data || [];
//     } catch (limitError) {
//       console.warn("Getting large limit failed, trying pagination approach:", limitError);
      
//       let allTodos = [];
//       let page = 1;
//       let hasMore = true;
      
//       while (hasMore && page <= 40) {
//         try {
//           const { data } = await api.get(`/tasks?page=${page}`);
//           const todos = data.data || [];
          
//           if (todos.length === 0) {
//             hasMore = false;
//           } else {
//             allTodos = [...allTodos, ...todos];
//             page++;
//             // If we got less than expected, maybe we're at the last page
//             hasMore = todos.length >= 10; // i.e if page size is 10
//           }
//         } catch (pageError) {
//           console.error(`Error fetching page ${page}:`, pageError);
//           hasMore = false;
//         }
//       }
      
//       return allTodos;
//     }
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     // Final fallback: if everything esle cast just gimme the first page abeg
//     try {
//       const { data } = await api.get('/tasks');
//       return data.data || [];
//     } catch (fallbackError) {
//       console.error("All fetch attempts failed:", fallbackError);
//       throw error;
//     }
//   }
// };

// export const fetchTodo = async (id) => {
//   try {
//     const { data } = await api.get(`/tasks/${id}`);
//     return data; 
//   } catch (error) {
//     console.error("Error fetching todo:", error);
//     throw error;
//   }
// };

// export const addTodo = async (todoData) => {
//   try {
//     const { data } = await api.post('/tasks', todoData);
//     return data; 
//   } catch (error) {
//     console.error("Error adding todo:", error);
//     throw error;
//   }
// };

// export const updateTodo = async (id, todoData) => {
//   try {
//     // try PATCH first, I can't figure why I'm getting an error
//     let response;
//     try {
//       response = await api.patch(`/tasks/${id}`, todoData);
//     } catch (patchError) {
//       // Omo If PATCH fails, try PUT
//       if (patchError.response?.status === 404 || patchError.response?.status === 405) {
//         console.warn("PATCH failed, trying PUT:", patchError);
//         response = await api.put(`/tasks/${id}`, todoData);
//       } else {
//         throw patchError;
//       }
//     }
//     return response.data;
//   } catch (error) {
//     console.error("Error updating todo:", error);
//     throw error;
//   }
// };

// export const deleteTodo = async (id) => {
//   try {
//     const { data } = await api.delete(`/tasks/${id}`);
//     return data;
//   } catch (error) {
//     console.error("Error deleting todo:", error);
//     throw error;
//   }
// };

//------------------------

// THIS IS MY FIRST TIME USING THESE TOOLS BUT I ENJOYED LEARNING HOW IT WORKED!
// I SUCESSFULLY IMPLENTED DATA PERSISTANCE, BUT I ALSO WANTED TO MAKE USER'S ABLE TO CRUD TODOS EVEN WHILE OFFLINE, SO I EMPLOYED AI!

import axios from 'axios'
import localforage from 'localforage'
import Dexie from 'dexie'
import { Todo, CreateTodoData, UpdateTodoData } from '../types/todo'

const api = axios.create({
  baseURL: 'https://api.oluwasetemi.dev',
})

// localforage setup
const cache = localforage.createInstance({
  name: 'todo-app-cache',
  storeName: 'todos',
})

// Dexie (IndexedDB) setup
class TodoDatabase extends Dexie {
  todos!: Dexie.Table<Todo, string>
  queue!: Dexie.Table<QueueOperation, number>

  constructor() {
    super('TodoAppDB')
    this.version(1).stores({
      todos: 'id,name,description,priority,status,archived', // index on these fields
      queue: '++id, type, payload' // pending operations
    })
  }
}

const db = new TodoDatabase()

interface QueueOperation {
  id?: number
  type: 'ADD' | 'UPDATE' | 'DELETE'
  payload: any
}

const QueueOpType = {
  ADD: 'ADD' as const,
  UPDATE: 'UPDATE' as const,
  DELETE: 'DELETE' as const
}

// Check if network is reachable?
const isOnline = (): boolean => typeof navigator !== 'undefined' && navigator.onLine

// Process queued operations when back online
const processQueue = async (): Promise<void> => {
  if (!isOnline()) return
  const ops = await db.queue.toArray()
  for (const op of ops) {
    try {
      if (op.type === QueueOpType.ADD) {
        const { data } = await api.post('/tasks', op.payload)
        // Update caches
        const currentTodos = (await cache.getItem('todos') as Todo[]) || []
        await cache.setItem('todos', [...currentTodos, data])
        await db.todos.add(data)
      } else if (op.type === QueueOpType.UPDATE) {
        const { id, ...rest } = op.payload
        const { data } = await api.patch(`/tasks/${id}`, rest)
        const list = (await cache.getItem('todos') as Todo[]) || []
        const updatedList = list.map(t => t.id === id ? data : t)
        await cache.setItem('todos', updatedList)
        await db.todos.put(data)
      } else if (op.type === QueueOpType.DELETE) {
        const { id } = op.payload
        await api.delete(`/tasks/${id}`)
        const list = (await cache.getItem('todos') as Todo[]) || []
        const filtered = list.filter(t => t.id !== id)
        await cache.setItem('todos', filtered)
        await db.todos.delete(id)
      }
      await db.queue.delete(op.id!)
    } catch (e) {
      console.error('Failed to sync op', op, e)
      // leave in queue for next attempt
    }
  }
}

// Monitor connectivity to trigger queue processing
if (typeof window !== 'undefined') {
  window.addEventListener('online', processQueue)
}

// Fetch full list
export const fetchTodos = async (): Promise<Todo[]> => {
  if (isOnline()) {
    try {
      const { data } = await api.get('/tasks?limit=100')
      const todos = data.data || []
      await cache.setItem('todos', todos)
      await db.todos.clear()
      await db.todos.bulkAdd(todos)
      return todos
    } catch (networkErr) {
      console.warn('Network fetch failed, falling back to cache:', networkErr)
    }
  }
  const cached = await cache.getItem('todos') as Todo[] | null
  if (cached && Array.isArray(cached)) return cached
  return await db.todos.toArray()
}

// Fetch one by ID
export const fetchTodo = async (id: string): Promise<Todo | null> => {
  if (isOnline()) {
    try {
      const { data } = await api.get(`/tasks/${id}`)
      await db.todos.put(data)
      return data
    } catch (networkErr) {
      console.warn(`Fetch todo ${id} failed, falling back to cache:`, networkErr)
    }
  }
  const local = await db.todos.get(id)
  if (local) return local
  const list = await cache.getItem('todos') as Todo[] | null
  return Array.isArray(list) ? list.find(t => t.id === id) || null : null
}

// Create
export const addTodo = async (todoData: CreateTodoData): Promise<Todo> => {
  if (isOnline()) {
    const { data } = await api.post('/tasks', todoData)
    const current = (await cache.getItem('todos') as Todo[]) || []
    const updated = [...current, data]
    await cache.setItem('todos', updated)
    await db.todos.add(data)
    return data
  }
  // Offline: queue the op and update local stores
  const temp: Todo = { 
    ...todoData, 
    id: Date.now().toString(),
    description: todoData.description || null,
    start: null,
    end: null,
    duration: null,
    priority: todoData.priority || 'LOW',
    status: todoData.status || 'TODO',
    archived: false,
    parentId: null,
    children: null,
    owner: null,
    tags: null,
    completedAt: null,
    createdAt: null,
    updatedAt: null
  }
  await db.queue.add({ type: QueueOpType.ADD, payload: temp })
  const currentTodos = (await cache.getItem('todos') as Todo[]) || []
  await cache.setItem('todos', [...currentTodos, temp])
  await db.todos.add(temp)
  alert("Your todo has been saved and will be added to the list when you are back online!")
  return temp
}

// Update
export const updateTodo = async (id: string, todoData: UpdateTodoData): Promise<Todo> => {
  if (isOnline()) {
    let response
    try { 
      response = await api.patch(`/tasks/${id}`, todoData) 
    } catch { 
      response = await api.put(`/tasks/${id}`, todoData) 
    }
    const updated = response.data
    const list = (await cache.getItem('todos') as Todo[]) || []
    const replaced = list.map(t => t.id === id ? updated : t)
    await cache.setItem('todos', replaced)
    await db.todos.put(updated)
    return updated
  }
  // Offline: queue and update local
  const temp = { id, ...todoData }
  await db.queue.add({ type: QueueOpType.UPDATE, payload: temp })
  const list = (await cache.getItem('todos') as Todo[]) || []
  const replaced = list.map(t => t.id === id ? { ...t, ...todoData } : t)
  await cache.setItem('todos', replaced)
  const updatedTodo = replaced.find(t => t.id === id)!
  await db.todos.put(updatedTodo)
  return updatedTodo
}

// Delete
export const deleteTodo = async (id: string): Promise<{ success: boolean }> => {
  if (isOnline()) {
    await api.delete(`/tasks/${id}`)
    const list = (await cache.getItem('todos') as Todo[]) || []
    const filtered = list.filter(t => t.id !== id)
    await cache.setItem('todos', filtered)
    await db.todos.delete(id)
    return { success: true }
  }
  // Offline: queue and update local
  await db.queue.add({ type: QueueOpType.DELETE, payload: { id } })
  const list = (await cache.getItem('todos') as Todo[]) || []
  const filtered = list.filter(t => t.id !== id)
  await cache.setItem('todos', filtered)
  await db.todos.delete(id)
  return { success: true }
}

//-----------------------

//APIs I USED AT THE START

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