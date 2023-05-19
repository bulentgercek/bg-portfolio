import { Asset, Content } from "../../api/interfaces";

/**
 * Text Block FC
 * @returns JSX.ELement
 */
type TextBlockProps = {
  content: Content;
};

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  const assets: Asset[] = content?.assets ?? [];

  return (
    <div>
      {assets.map((asset) => (
        <div dangerouslySetInnerHTML={{ __html: asset.text ?? "" }} />
      ))}
    </div>
  );
};

export default TextBlock;
