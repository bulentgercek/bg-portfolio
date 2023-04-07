import { useState, useEffect } from "react";
import { Api } from "../api";
import { Asset, AssetType, Content } from "../api/interfaces";
import Darkmode from "./Darkmode";

function BackupApp() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const getAssets = async () => {
      const assets = await Api.getAssets();
      setAssets(assets);
    };
    getAssets();
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
        {assets.map((asset) => {
          const dbContent: Partial<Content>[] = assets[0].contents!;
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
