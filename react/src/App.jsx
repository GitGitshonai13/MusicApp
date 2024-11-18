import React from 'react';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Sidebar from './components/Side/Sidebar';
import Footer from './components/Footer/Footer';
import Main_home from './components/HOME/main_home';
import Main_news from './components/NEWS/main_news';
import Main_ranking from './components/RANKING/main_ranking';
import Main_library from './components/LIBRARY/main_library';
import ArtistPage from './components/ARTIST/ArtistPage'; 

function App() {
  return (
    <Router>

    <div className="flex min-h-screen min-w-screen ">

      <Sidebar />   
      <div className="main-content flex-1 ml-[16.67%]">

          <Routes>
            <Route path="/" element={<Main_home />} />
            <Route path="/news" element={<Main_news />} />
            <Route path="/ranking" element={<Main_ranking />} />
            <Route path="/library" element={<Main_library />} />
            <Route path="/artist/:artistName" element={<ArtistPage />} />
          </Routes>
          <div className="h-20"></div>

      </div> 
      <Footer />
    </div>

    </Router>
  );
}

export default App;
