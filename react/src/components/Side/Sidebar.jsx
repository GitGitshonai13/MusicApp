import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ImageWithText = ({ imageSrc, imageAlt, text, toURL, isActive }) => {
  return (
    <div>
      <Link
        to={toURL}
        className={`flex items-center ml-6 m-4 pr-12 p-2  rounded-l-xl rounded-r-3xl  hover:bg-amber-100 cursor-pointer text-[22px]  ${isActive ? 'bg-amber-200 text-black' : 'text-gray-600'}`}
      >
        <img src={imageSrc} alt={imageAlt} className="w-7 h-7 mr-4" />
        <p>{text}</p>
      </Link>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-[16%] h-screen bg-amber-50 flex flex-col border-2 border-gray fixed z-10">
      <div className="flex items-center p-4">
        <img src="/public/images/Designer.jpeg" className="w-12 h-12 mr-1" />
        <div className="text-3xl font-mono text-gray-700 mt-3">Ciasum</div>
      </div>
      <nav className="flex">
        <ul>
          <li>
            <ImageWithText
              toURL="/"
              imageSrc="/images/home.png"
              imageAlt="Home"
              text="ホーム"
              isActive={location.pathname === '/'}
            />
          </li>
          <li>
            <ImageWithText
              toURL="/news"
              imageSrc="/images/news.png"
              imageAlt="News"
              text="ニュース"
              isActive={location.pathname === '/news'}
            />
          </li>
          <li>
            <ImageWithText
              toURL="/ranking"
              imageSrc="/images/ranking.png"
              imageAlt="Ranking"
              text="ランキング"
              isActive={location.pathname === '/ranking'}
            />
          </li>
          {/* <li>
            <ImageWithText
              toURL="/recommend"
              imageSrc="/images/recommend.png"
              imageAlt="Recommend"
              text="レコメンド"
              isActive={location.pathname === '/recommend'}
            />
          </li> */}
          <li>
            <ImageWithText
              toURL="/library"
              imageSrc="/images/library.png"
              imageAlt="Library"
              text="ライブラリ"
              isActive={location.pathname === '/library'}
            />
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;
