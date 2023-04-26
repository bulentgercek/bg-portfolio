import { useState, useEffect } from "react";
import ReactSwitch from "react-switch";

function Darkmode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="absolute top-0 right-0 text-indigo-900 dark:text-indigo-100">
      <div className="container">
        <div className="flex flex-row p-2 gap-2 text-sm">
          <p>Dark Mode</p>
          <ReactSwitch
            onChange={toggleDarkMode}
            checked={isDarkMode}
            height={20}
            width={40}
            borderRadius={16}
          />
        </div>
      </div>
    </div>
  );
}

export default Darkmode;
