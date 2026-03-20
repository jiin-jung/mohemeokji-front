import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.heroPanel}>
        <div style={styles.badge}>오늘의 냉장고 플랜</div>
        <h1 style={styles.title}>오늘은 뭐 해먹지?</h1>
        <p style={styles.subtitle}>냉장고 재료로 바로 메뉴를 찾아보세요.</p>
      </div>

      <div style={styles.grid}>
        <Link to="/inventory" style={styles.card} className="interactive-card">
          <span style={styles.icon}>🛒</span>
          <div style={styles.cardEyebrow}>STEP 1</div>
          <div style={styles.cardText}>냉장고 열기</div>
          <p style={styles.cardDesc}>유통기한이 가까운 재료와 현재 보유 수량을 빠르게 확인해요.</p>
        </Link>
        <Link to="/recipe" style={styles.card} className="interactive-card">
          <span style={styles.icon}>🍳</span>
          <div style={styles.cardEyebrow}>STEP 2</div>
          <div style={styles.cardText}>뭐 해먹지?</div>
          <p style={styles.cardDesc}>냉장고에 있는 재료를 바탕으로 바로 만들 수 있는 레시피를 찾아봐요.</p>
        </Link>
        <Link to="/saved" style={styles.card} className="interactive-card">
          <span style={styles.icon}>📖</span>
          <div style={styles.cardEyebrow}>STEP 3</div>
          <div style={styles.cardText}>레시피 보관함</div>
          <p style={styles.cardDesc}>마음에 들었던 메뉴를 저장해두고 다음 식사 때 다시 꺼내보세요.</p>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    textAlign: 'center',
    padding: '28px 0 20px',
    backgroundColor: 'transparent'
  },
  heroPanel: {
    padding: '20px 18px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, rgba(255,248,232,0.98) 0%, rgba(241,248,233,0.92) 72%)',
    border: '1px solid #e8ddb9',
    boxShadow: '0 14px 26px rgba(109, 118, 58, 0.08)',
    marginBottom: '18px'
  },
  badge: {
    display: 'inline-flex',
    padding: '6px 10px',
    borderRadius: '999px',
    backgroundColor: '#fff3dd',
    color: '#8a5a17',
    fontWeight: '800',
    fontSize: '0.74rem',
    marginBottom: '10px'
  },
  title: { 
    fontSize: '1.68rem',
    margin: '0 auto 8px',
    color: '#26311c',
    fontWeight: '900',
    maxWidth: '520px',
    lineHeight: '1.22'
  },
  subtitle: { 
    fontSize: '0.88rem',
    color: '#5f6655',
    margin: '0 auto',
    maxWidth: '420px',
    lineHeight: '1.5'
  },
  grid: { 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginTop: '16px'
  },
  card: { 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    padding: '28px',
    background: 'linear-gradient(180deg, #fffdf8 0%, #ffffff 100%)',
    borderRadius: '28px',
    boxShadow: '0 12px 32px rgba(75,82,45,0.08)',
    textDecoration: 'none',
    border: '1px solid #eadfca'
  },
  cardEyebrow: {
    fontSize: '0.74rem',
    letterSpacing: '0.08em',
    color: '#c27700',
    fontWeight: '800',
    marginBottom: '10px'
  },
  cardText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: '1.25rem',
    marginTop: '6px'
  },
  cardDesc: {
    color: '#6a7360',
    margin: '12px 0 0',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  },
  icon: {
    fontSize: '2.8rem',
    marginBottom: '18px'
  }
};

export default Home;
