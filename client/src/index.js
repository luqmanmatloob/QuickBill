import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>

    {/* Message for Mobile Devices */}
    <div className="flex h-screen w-full items-center justify-center md:hidden">
      <div className="max-w-[70vw] px-4 text-center">
        This app is currently limited to desktop devices.
        </div>
    </div>

    {/* App for Desktop Devices */}
    <div className="hidden md:block">
      <App />
    </div>
  </React.StrictMode>
)

reportWebVitals()
