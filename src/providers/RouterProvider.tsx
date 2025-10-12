// src/providers/RouterProvider.tsx
import { RouterProvider } from 'react-router';
import { router } from 'src/config/routes';


export default function AppRouter() {
  return <RouterProvider router={router} />;
}