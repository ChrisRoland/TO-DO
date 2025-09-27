# TO+DO

A comprehensive Todo application built with Vue.JS, Vue Router, Pinia, Tailwind CSS, and Supabase authentication featuring AI assistance and real-time capabilities. It allows users to manage tasks with features such as user authentication, pagination, search, filtering, priority levels, archiving, offline capability and full CRUD operations against a custom todo API.

---

![](./public/ss/Screenshot%202025-09-27%20at%2010.36.01.png)

---

## Features

### Authentication & User Management
* **User Authentication**: Email/password and Google OAuth sign-in
* **User Registration**: Account creation with name collection
* **Protected Routes**: Secure access to todo functionality
* **User Profile Display**: Name and email shown in sidebar
* **Session Management**: Persistent login state with auto-refresh
* **Landing Page**: App info page for new visitors

### Todo Management
* **Todo Listing** with client-side pagination (10 items per page)
* **Search & Filter**: search by title and filter by status (All, Completed, Incomplete)
* **Priority Levels**: Low, Medium, High
* **Important View**: lists only high-priority tasks
* **Archived View**: lists archived tasks
* **Todo Detail**: view details of a single task
* **Create, Update & Delete** todos via modal forms

### Advanced Features
#### AI Capabilities
* **AI Assistant**: Integrated ChatGPT-powered assistant for task organization and productivity advice
* **Smart Task Suggestions**: AI analyzes your todos and suggests optimizations
* **Task Analysis**: "Show me my high-priority tasks"
* **Productivity Coaching**: Get personalized advice on task management
* **Automatic CRUD**: Complete tasks through natural conversation
* **Smart Suggestions**: AI suggests tasks with clickable creation buttons

#### Real-Time Features
* **Real-Time Presence**: See who else is viewing the app in real-time
* **Join/Leave Notifications**: Get notified when others join or leave
* **Instant Updates**: Changes sync across all connected clients

### Technical Features
* **Theme Toggle**: light and dark mode support
* **Error Handling**: custom 404 page and Error Boundary
* **Cache API responses** using localStorage (localforage)
* **Offline capability** with IndexedDB (Dexie.js)
* **Responsive Design**: mobile-first, accessible UI
* **PWA Support**: Progressive Web App capabilities

---

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd todo-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`

---

## Available Scripts

* `npm run dev` - start development server
* `npm run build` - build production assets
* `npm run preview` - preview production build

---

## Technology Stack & Architecture

### Frontend
* **Vue 3** with Composition API and TypeScript
* **Pinia** for state management
* **Vue Router** with authentication guards
* **Tailwind CSS** + **shadcn/ui**: utility-first styling & UI components
* **lucide-react**: icon library
* **Vite**: build tooling for fast HMR

### Backend & Authentication
* **Supabase**: Backend-as-a-Service for authentication and data
* **Google OAuth**: Social login integration
* **Groq API** for AI assistance (free tier: 1,000 requests/day)
* **Custom API**: Todo CRUD operations with offline sync

### Data Management
* **IndexedDB (Dexie)**: Offline data storage
* **LocalForage**: Browser storage abstraction
* **Queue-based sync**: Offline operation management

The app follows a component-driven architecture with modular routes, shared UI components under `src/components`, page routes under `src/routes`, and context providers for global state management.

---

## API Documentation & Usage

The app integrates with a custom API for todos:

* **Base URL**: `https://api.oluwasetemi.dev`
* **Doc URL**: `https://api.oluwasetemi.dev/reference`

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/tasks`      | Fetch all tasks               |
| GET    | `/tasks/{id}` | Fetch a single task by its ID |
| POST   | `/tasks`      | Create a new task             |
| PUT    | `/tasks/{id}` | Update an existing task       |
| DELETE | `/tasks/{id}` | Delete a task                 |

All endpoints support JSON request and response bodies, matching the following schema:

```json
{
  "id": "string",
  "name": "string",
  "description": null,
  "start": null,
  "end": null,
  "duration": null,
  "priority": "LOW",
  "status": "TODO",
  "archived": true,
  "parentId": null,
  "children": "string",
  "owner": null,
  "tags": null,
  "completedAt": null,
  "createdAt": null,
  "updatedAt": null
}
```

The API helpers live in `src/api/todo.jsx`.

---

## Authentication Setup

### Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env` file
4. Configure authentication providers in Supabase dashboard:
   - Go to Authentication > Providers
   - Enable Email provider (enabled by default)
   - Enable Google provider and configure OAuth credentials

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs for your Supabase project
4. Add the credentials to your Supabase Google provider settings

---

## Demos

Here's the Live [URL](https://t0d0.pipeops.net/)

![](./public/ss/Screenshot%202025-09-27%20at%2010.36.50.png)

---

## Future Improvements

* Customizable task durations and deadlines
* Add drag-and-drop ordering for todos
* Team collaboration features (in progress)
* Advanced search and filtering options
* Email notifications for important tasks