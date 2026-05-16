import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider, useTheme } from '@/lib/theme'
import { router } from '@/router'
import './index.css'

function AppRoot() {
  const { theme } = useTheme()
  return (
    <>
      <RouterProvider router={router} />
      <Toaster theme={theme} />
    </>
  )
}

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  </StrictMode>,
)
