import { Link } from "react-router-dom";

const ItemDisplay: React.FC = () => {
  return (
    <div
      id="container"
      className="trans-d200 flex h-[500px] w-full flex-col rounded-2xl bg-indigo-50 outline-dashed outline-2 outline-offset-2 outline-indigo-500/0 hover:outline-indigo-500/100"
    >
      <div id="image" className="flex h-[200px] items-center justify-center overflow-hidden rounded-t-2xl ">
        <img
          className="max-w-[420px]"
          src={`http://localhost:3000/uploads/1683287625747-anadolu_insurance_1.png`}
          alt="img"
          crossOrigin="anonymous"
        ></img>
      </div>
      <div id="info" className="flex flex-1 flex-col p-7 pt-6 text-indigo-900">
        <div id="title" className="font-bold ">
          Anadolu Insurance | Fire Campaign Posters with 3D Images
        </div>
        <div id="description_n_button" className="flex h-full flex-col justify-between">
          <div id="description">Poster illustrations prepared for Anadolu Insurance.</div>
          <Link to={``} key={""}>
            <button
              className={`trans-d500 flex h-[40px] items-center rounded-2xl bg-blue-600 px-5 py-3 text-base font-bold text-indigo-50 hover:px-6`}
            >
              {`Go to Work`}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemDisplay;
