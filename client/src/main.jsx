import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/context/ThemeContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  </React.StrictMode>
)
