import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👋 안녕하세요, 지인님!</h1>
      <p style={styles.subtitle}>오늘도 스마트하게 냉장고를 비워볼까요?</p>
      
      <div style={styles.grid}>
        <Link to="/inventory" style={styles.card}>
          <span style={styles.icon}>🛒</span>
          <div style={styles.cardText}>냉장고 열기</div>
        </Link>
        <Link to="/recipe" style={styles.card}>
          <span style={styles.icon}>🍳</span>
          <div style={styles.cardText}>뭐 해먹지?</div>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    textAlign: 'center', 
    padding: '80px 20px',
    backgroundColor: 'transparent'
  },
  title: { 
    fontSize: '3rem', 
    marginBottom: '20px',
    color: '#000000',
    fontWeight: '800'
  },
  subtitle: { 
    fontSize: '1.4rem', 
    color: '#000000',
    marginBottom: '60px'
  },
  grid: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '30px', 
    marginTop: '20px' 
  },
  card: { 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px', 
    backgroundColor: '#ffffff', 
    borderRadius: '25px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
    textDecoration: 'none', 
    width: '220px',
    border: '1px solid #eeeeee'
  },
  cardText: {
    color: '#000000',
    fontWeight: 'bold', 
    fontSize: '1.2rem',
    marginTop: '15px'
  },
  icon: {
    fontSize: '3rem'
  }
};

export default Home;