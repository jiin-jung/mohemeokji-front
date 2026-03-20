import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import AddIngredient from './pages/AddIngredient';
import Recipe from './pages/Recipe';

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>🏠 홈</Link>
          <Link to="/inventory" style={styles.navLink}>🛒 내 냉장고</Link>
          <Link to="/add" style={styles.navLink}>➕ 재료 추가</Link>
          <Link to="/recipe" style={styles.navLink}>🍳 레시피 추천</Link>
          <Link to="/saved" style={styles.navLink}>📖 보관함</Link>
        </nav>

        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add" element={<AddIngredient />} />
            <Route path="/recipe" element={<Recipe />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: { 
    fontFamily: '"Pretendard", sans-serif', 
    backgroundColor: '#fffffd', 
    color: '#000000', 
    minHeight: '100vh' 
  },
  nav: { 
    display: 'flex', justifyContent: 'center', gap: '30px', 
    padding: '20px', backgroundColor: '#2c3e50', position: 'sticky', top: 0, zIndex: 100 
  },
  navLink: { color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' },
  content: { padding: '20px', color: '#000000' }
};

export default App;