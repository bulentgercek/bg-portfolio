import React, { useEffect, useState } from "react";
import { Api } from "../api";
import { Category } from "../api/interfaces";

interface NavigationProps {
  value: string;
}

const Navigation: React.FC<NavigationProps> = ({ value }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAssets = async () => {
      const dbCategories = await Api.getCategories();
      setCategories(dbCategories);
      setLoading(false);
    };
    getAssets();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Navigation;
