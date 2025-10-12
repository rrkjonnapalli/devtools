// src/router.tsx
import { Suspense, lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import Layout from '@shared/Layout'; // Your layout component
import ToolsPage from '../pages/ToolsPage';
import Loading from '@shared/Loading/Loading';
import { tools, type Tool } from './tools';
import NotFound from '@/pages/NotFound';


const getRoute = (tool: Tool): RouteObject | null => {
  if (!tool.page) {
    return null;
  }
  const Page = lazy(() => import(`../pages/${tool.page}`));
  return {
    path: tool.id,
    element: (
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    ),
  }
}

export const router = createBrowserRouter([
  {
    // This path uses the layout for all its children
    path: '/',
    element: <Layout />, // Layout includes header, footer, and breadcrumbs
    children: [
      {
        index: true, // Renders at the path "/"
        element: <ToolsPage />,
      },
      // {
      //   path: 'json-formatter', // Full path: /json-formatter
      //   element: (
      //     <Suspense fallback={<Loading />}>
      //       <JsonFormatter />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: 'json-unescape', // Full path: /json-unescape
      //   element: (
      //     <Suspense fallback={<Loading />}>
      //       <JsonUnescape />
      //     </Suspense>
      //   ),
      // },
      {
        path: 'tools', // Full path: /tools
        children: [
          {
            index: true,
            path: '', // Full path: /tools
            element: <ToolsPage />,
          },
          ...tools.map(tool => getRoute(tool)).filter((route): route is RouteObject => route !== null),
        ]
      },
      {
        path: 'about', // Full path: /about
        Component: lazy(() => import('../pages/About')), // Lazy load AboutPage
      }
      // Add more tool routes here...
    ],
  },
  {
    path: '*', // Catch-all for undefined routes
    Component: NotFound
  },
]);