import { useState, useEffect } from "react";
import api from "../api/config";
import { Asset, AssetType, Content } from "../api/types";
import Darkmode from "./Darkmode";

function BackupApp() {
  const [dbAssets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    api
      .get<Asset[]>("/assets")
      .then((response) => {
        setAssets(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const renderValue = (key: string, value: any) => {
    if (key === "type") {
      const assetType =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      return (
        <p key={key}>
          {key} : {AssetType[assetType as keyof typeof AssetType]}
        </p>
      );
    } else if (key === "contents") {
      return (
        <div key={key}>
          {value &&
            value.map((content: { name: string }) => (
              <p key={content.name}>
                {key} : {content.name}
              </p>
            ))}
        </div>
      );
    } else {
      return (
        <p key={key}>
          {key} : {value}
        </p>
      );
    }
  };

  return (
    <>
      <div
        id="Asset"
        className="relative flex-row text-indigo-900 dark:text-indigo-100"
      >
        {dbAssets.map((asset) => {
          const dbContent: Partial<Content>[] = dbAssets[0].contents!;
          const countNonNullProperties = Object.values(dbContent[0]).length;

          console.log(countNonNullProperties);
          return (
            <div key={asset.id}>
              {Object.entries(asset).map(([key, value]) =>
                renderValue(key, value),
              )}
            </div>
          );
        })}
      </div>
      <Darkmode />
    </>
  );
}

export default BackupApp;
