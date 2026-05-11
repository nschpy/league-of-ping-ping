import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/router'
import './index.css'

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster theme="dark" />
  </StrictMode>,
)
