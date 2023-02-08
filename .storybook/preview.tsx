import '../src/index.css';
import React from 'react'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProvider } from "../src/context/app.context"
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

export const decorators = [
  (Story) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <div>
            <Story />
          </div>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
]