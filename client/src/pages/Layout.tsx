import React from "react";
import Darkmode from "../components/Darkmode";

interface HomeProps {
  value: string;
}

const Home: React.FC<HomeProps> = ({ value }) => {
  return (
    <div>
      <h1>{value}</h1>
      <Darkmode />
    </div>
  );
};

export default Home;
