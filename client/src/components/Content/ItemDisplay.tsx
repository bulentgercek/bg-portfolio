import { Link } from "react-router-dom";
import { Item } from "../../api/interfaces";
import landing_banner_back from "../../assets/landing_banner_back.png";

type ItemProps = {
  item: Item | null;
};

const ItemDisplay: React.FC<ItemProps> = ({ item }) => {
  return (
    <>
      {(item && (
        <div id="container" className="trans-d200 flex h-[500px] w-full flex-col rounded-2xl bg-indigo-50">
          <div id="image" className="flex h-[200px] items-center justify-center overflow-hidden rounded-t-2xl ">
            <img
              className="max-w-[420px]"
              src={`${item.featuredImageAsset?.url}`}
              alt="img"
              crossOrigin="anonymous"
            ></img>
          </div>
          <div id="info" className="flex flex-1 flex-col p-7 pt-6 text-indigo-900">
            <div id="title" className="font-bold ">
              {item.name}
            </div>
            <div id="description_n_button" className="flex h-full flex-col justify-between">
              <div id="description">{item.description}</div>
              <Link to={`/category/${item.categories && item.categories[0].id}/item/${item.id}`} key={item.id}>
                <button
                  className={`trans-d500 flex h-[40px] items-center rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold text-indigo-50 hover:px-6`}
                >
                  {`Go to Work`}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )) ?? (
        <div
          id="container"
          className="trans-d200 flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-blue-50/25"
        >
          <img src={landing_banner_back} className="max-w-[368px]"></img>
        </div>
      )}
    </>
  );
};

export default ItemDisplay;
