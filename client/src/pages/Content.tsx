import React from "react";

type ContentProps = {
  value: string;
};

const Content: React.FC<ContentProps> = ({ value }) => {
  return <h1>Contents</h1>;
};

export default Content;
