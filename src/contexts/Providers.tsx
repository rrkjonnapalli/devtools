
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { type ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';


interface ProviderProps {
  children: ReactNode;
}

export function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider>
      <HeroUIProvider>
        <ToastProvider placement='top-right' />
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  )
}