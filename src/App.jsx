import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import AddIngredient from './pages/AddIngredient';
import Recipe from './pages/Recipe';
import SavedRecipes from './pages/SavedRecipes';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-brand">
            <div className="app-brand-mark">MH</div>
            <div>
              <p className="app-brand-title">뭐해? 먹지!</p>
              <p className="app-brand-subtitle">냉장고를 열면 오늘 식사가 쉬워져요</p>
            </div>
          </div>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add" element={<AddIngredient />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/saved" element={<SavedRecipes />} />
          </Routes>
        </main>

        <nav className="app-bottom-nav" aria-label="주요 메뉴">
          <NavLink to="/" end className={({ isActive }) => `app-bottom-link${isActive ? ' is-active' : ''}`}>
            <span className="app-bottom-icon icon-home" aria-hidden="true" />
            <span className="app-bottom-text">홈</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `app-bottom-link${isActive ? ' is-active' : ''}`}>
            <span className="app-bottom-icon icon-fridge" aria-hidden="true" />
            <span className="app-bottom-text">냉장고</span>
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `app-bottom-link${isActive ? ' is-active' : ''}`}>
            <span className="app-bottom-icon icon-add" aria-hidden="true" />
            <span className="app-bottom-text">추가</span>
          </NavLink>
          <NavLink to="/recipe" className={({ isActive }) => `app-bottom-link${isActive ? ' is-active' : ''}`}>
            <span className="app-bottom-icon icon-search" aria-hidden="true" />
            <span className="app-bottom-text">뭐 해먹지?</span>
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => `app-bottom-link${isActive ? ' is-active' : ''}`}>
            <span className="app-bottom-icon icon-bookmark" aria-hidden="true" />
            <span className="app-bottom-text">보관함</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}

export default App;
