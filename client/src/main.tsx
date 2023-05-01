import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const isProduction = import.meta.env.PROD;

const RootComponent = () => {
  if (isProduction) {
    return (
      <div className={`p-12 font-medium`}>
        <h1>🚧 Under Construction 🚧</h1>
        <p>
          Hello There! I'm currently working on developing my full-stack Node.js portfolio website. Please check back
          soon to see the updates!
        </p>
        <p>
          In the meantime, feel free to reach out to me on{" "}
          <a href="https://www.linkedin.com/in/bulentgercek/" target="_blank" rel="noopener noreferrer">
            LinkedIn.
          </a>
        </p>
        <p>Thank you for your visit!</p>
      </div>
    );
  } else {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<RootComponent />);
