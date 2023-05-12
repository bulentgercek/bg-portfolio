import { Asset, Content } from "../../api/interfaces";

/**
 *
 * @returns
 */
type TextBlockProps = {
  content: Content;
};

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  const assets: Asset[] = content?.assets ?? [];

  return (
    <div>
      {assets.map((asset) => (
        <p>{asset.text}</p>
      ))}
    </div>
  );
};

export default TextBlock;
