import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Overview from './pages/Overview';
import StaffBoard from './pages/StaffBoard';
import SitesBuildings from './pages/SitesBuildings';
import IncentivesTaxes from './pages/IncentivesTaxes';
import Infrastructure from './pages/Infrastructure';
import WorkforceTraining from './pages/WorkforceTraining';
import Demographics from './pages/Demographics';
import WageRates from './pages/WageRates';
import CommutingPatterns from './pages/CommutingPatterns';
import TargetIndustries from './pages/TargetIndustries';
import MajorEmployers from './pages/MajorEmployers';
import TransModal from './pages/TransModal';
import Maps from './pages/Maps';
import LivingHere from './pages/LivingHere';
import Contacts from './pages/Contacts';
import Projects from './pages/Projects';

function App() {
  return (
    <Router>
      <div id="page" className="site">
        <Header />
        <main id="content" className="site-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/staff-board" element={<StaffBoard />} />
            <Route path="/sites-buildings" element={<SitesBuildings />} />
            <Route path="/incentives-taxes" element={<IncentivesTaxes />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/workforce-training" element={<WorkforceTraining />} />
            <Route path="/demographics" element={<Demographics />} />
            <Route path="/wage-rates" element={<WageRates />} />
            <Route path="/commuting-patterns" element={<CommutingPatterns />} />
            <Route path="/target-industries" element={<TargetIndustries />} />
            <Route path="/major-employers" element={<MajorEmployers />} />
            <Route path="/trans-modal" element={<TransModal />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/living-here" element={<LivingHere />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
