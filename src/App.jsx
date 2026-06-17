import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RandomFood from './pages/RandomFood';
import BudgetMeal from './pages/BudgetMeal';
import CookAtHome from './pages/CookAtHome';
import BuyOutside from './pages/BuyOutside';
import Restaurants from './pages/Restaurants';
import GroupVoting from './pages/GroupVoting';
import MapView from './pages/MapView';
import MoodSuggest from './pages/MoodSuggest';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/random-picker" element={<RandomFood />} />
        <Route path="/budget-meal" element={<BudgetMeal />} />
        <Route path="/cook-at-home" element={<CookAtHome />} />
        <Route path="/buy-outside" element={<BuyOutside />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/group-voting" element={<GroupVoting />} />
        <Route path="/mood" element={<MoodSuggest />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
