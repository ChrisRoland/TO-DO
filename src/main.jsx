import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHead, UnheadProvider } from '@unhead/react/client'
import { ThemeProvider } from './theme-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import router from './router';
import './index.css'

const queryClient = new QueryClient();
const head = createHead()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UnheadProvider head={head}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
      </ThemeProvider>
    </UnheadProvider>
  </StrictMode>
)