import "./bootstrap"
import "../css/app.css"

import { createInertiaApp } from "@inertiajs/react"
import { createRoot } from "react-dom/client"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import ErrorBoundary from "@/Components/ErrorBoundary"

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "Laravel"

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob("./Pages/**/*.jsx")),
  setup({ el, App, props }) {
    const root = createRoot(el)

    root.render(
      <ErrorBoundary>
        <App {...props} />
      </ErrorBoundary>,
    )
  },
  progress: {
    color: "#4B5563",
  },
})
