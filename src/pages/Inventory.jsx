import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage, USER_ID } from '../api';

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await api.get(`/api/ingredients/${USER_ID}`);
        if (!isMounted) return;
        setIngredients(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const changeQty = async (id, newQty) => {
    if (newQty < 0) return;
    try {
      await api.patch(`/api/ingredients/${id}/quantity?quantity=${newQty}`);
      setIngredients((current) =>
        current.map((ing) => (ing.id === id ? { ...ing, quantity: newQty } : ing)),
      );
    } catch (error) {
      console.error('수정 실패', error);
      alert(getErrorMessage(error, '수정 실패'));
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("이 재료를 냉장고에서 뺄까요?")) return;
    try {
      await api.delete(`/api/ingredients/${id}`);
      setIngredients((current) => current.filter((ing) => ing.id !== id));
    } catch (error) {
      console.error('삭제 실패', error);
      alert(getErrorMessage(error, '삭제 실패'));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0].substring(2).replace(/-/g, '.');
  };

  const formatDday = (dday) => {
    if (dday === null || dday === undefined) return '';
    if (dday < 0) return '기한 지남';
    if (dday === 0) return 'D-Day';
    return `D-${dday}`;
  };

  const getZone = (cat) => {
    if (['육류', '해산물'].includes(cat)) return 'freezer';
    if (['채소'].includes(cat)) return 'drawer';
    if (['조미료'].includes(cat)) return 'door';
    return 'shelf';
  };

  const zoneMeta = {
    freezer: {
      title: '상단 냉동실',
      subtitle: '육류와 해산물을 차갑게 보관해요',
      accent: '#dbeeff',
    },
    shelf: {
      title: '메인 선반',
      subtitle: '유제품과 자주 쓰는 재료를 한눈에',
      accent: '#fff6df',
    },
    drawer: {
      title: '채소 서랍',
      subtitle: '싱싱함을 오래 유지하는 하단 공간',
      accent: '#e3f5d9',
    },
    door: {
      title: '도어 포켓',
      subtitle: '양념과 소스는 세워서 보관',
      accent: '#ffe7d9',
    },
  };

  const groupedIngredients = {
    freezer: ingredients.filter((ingredient) => getZone(ingredient.category) === 'freezer'),
    shelf: ingredients.filter((ingredient) => getZone(ingredient.category) === 'shelf'),
    drawer: ingredients.filter((ingredient) => getZone(ingredient.category) === 'drawer'),
    door: ingredients.filter((ingredient) => getZone(ingredient.category) === 'door'),
  };

  const urgentCount = ingredients.filter((ingredient) => ingredient.dday !== null && ingredient.dday <= 3).length;

  const renderItem = (ing) => {
    const isUrgent = ing.dday !== null && ing.dday <= 3;
    const expiryLabel = formatDday(ing.dday);
    
    return (
      <div
        key={ing.id}
        style={{
          ...styles.itemCard,
          border: isUrgent ? '1.5px solid #ff8b6e' : '1px solid rgba(67, 84, 62, 0.12)',
          boxShadow: isUrgent ? '0 12px 24px rgba(255,139,110,0.18)' : '0 8px 18px rgba(58, 67, 53, 0.08)',
          background: isUrgent ? 'linear-gradient(180deg, #fff7f3 0%, #ffffff 100%)' : 'linear-gradient(180deg, #fffefb 0%, #ffffff 100%)',
        }}
      >
        <button onClick={() => deleteItem(ing.id)} style={styles.deleteBtn} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = '#a0a0a0'}>×</button>
        {isUrgent && <div style={styles.urgentBadge}>{expiryLabel}</div>}
        <div style={styles.itemInfo}>
          <div style={{...styles.itemName, color: isUrgent ? '#c84f37' : '#263122'}}>{ing.name}</div>
          
          {ing.category !== '조미료' ? (
            <div style={styles.qtyContainer}>
              <button onClick={() => changeQty(ing.id, ing.quantity - (ing.unit === 'g' ? 50 : 1))} style={styles.stepBtn}>-</button>
              <span style={{...styles.itemQty, color: isUrgent ? '#c84f37' : '#1f2d1a'}}>{ing.quantity}{ing.unit}</span>
              <button onClick={() => changeQty(ing.id, ing.quantity + (ing.unit === 'g' ? 50 : 1))} style={styles.stepBtn}>+</button>
            </div>
          ) : (
            <div style={styles.presentTag}>보유 중</div>
          )}
  
          <div style={{...styles.itemDate, color: isUrgent ? '#c84f37' : '#6f7566'}}>
            {isUrgent && expiryLabel ? `마감 ${expiryLabel}` : formatDate(ing.createdAt) || '입고일 미등록'}
          </div>
        </div>
      </div>
    );
  };

  const renderZone = (zoneKey, extraStyle = {}, gridStyle = styles.zoneGrid) => {
    const zone = zoneMeta[zoneKey];
    const items = groupedIngredients[zoneKey];

    return (
      <section style={{ ...styles.zoneCard, ...extraStyle }}>
        <div style={styles.zoneHeader}>
          <div>
            <div style={styles.zoneKicker}>{zone.title}</div>
            <div style={styles.zoneSubtitle}>{zone.subtitle}</div>
          </div>
          <div style={{ ...styles.zoneCount, backgroundColor: zone.accent }}>{items.length}개</div>
        </div>
        {items.length > 0 ? (
          <div style={gridStyle}>{items.map(renderItem)}</div>
        ) : (
          <div style={styles.emptyZone}>아직 채워진 재료가 없어요</div>
        )}
      </section>
    );
  };

  return (
    <div style={styles.page}>
      <div className="page-heading">
        <div className="page-heading-copy">
          <h2 style={styles.title}>지인님의 냉장고 ❄️</h2>
          <p>레트로 냉장고를 열어 현재 보관 중인 재료를 공간별로 확인해보세요.</p>
        </div>
        <button onClick={() => navigate('/add')} style={styles.addBtn}>+ 재료 장보기</button>
      </div>

      <section style={styles.fridgeShowcase}>
        <div style={styles.fridgeShell}>
          <div style={styles.fridgeGloss} />
          <div style={styles.fridgeBrand}>MOHEMEOKJI</div>
          <div style={styles.handleTop} />
          <div style={styles.handleBottom} />
          <div style={styles.fridgeDivider} />
          <div style={styles.statusLights}>
            <span style={styles.statusDot} />
            <span style={styles.statusDot} />
            <span style={styles.statusDot} />
          </div>
          <div style={styles.shellCaption}>오늘의 보관 현황</div>
        </div>

        <div style={styles.summaryPanel}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>전체 재료</div>
            <div style={styles.summaryValue}>{ingredients.length}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>임박 재료</div>
            <div style={{ ...styles.summaryValue, color: urgentCount > 0 ? '#d55a3f' : '#2d3d24' }}>{urgentCount}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>양념 포켓</div>
            <div style={styles.summaryValue}>{groupedIngredients.door.length}</div>
          </div>
        </div>
      </section>

      <div style={styles.openFridge}>
        <div style={styles.innerShadow} />

        <div style={styles.mainCabinet}>
          {renderZone('freezer', styles.freezerZone)}
          {renderZone('shelf', styles.shelfZone)}
          {renderZone('drawer', styles.drawerZone)}
        </div>

        <aside style={styles.doorPanel}>
          {renderZone('door', styles.doorZone, styles.doorGrid)}
        </aside>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1120px', margin: '0 auto', padding: '20px', color: '#000' },
  title: { fontSize: '2rem', fontWeight: '900', color: '#1f2d1a', margin: 0 },
  addBtn: { padding: '13px 22px', backgroundColor: '#2f4427', color: '#fff', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: '800', boxShadow: '0 14px 26px rgba(47,68,39,0.18)' },
  fridgeShowcase: { display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: '22px', alignItems: 'stretch', marginBottom: '26px' },
  fridgeShell: {
    position: 'relative',
    minHeight: '380px',
    borderRadius: '42px',
    background: 'linear-gradient(160deg, #738120 0%, #8a9729 38%, #66721a 100%)',
    border: '1px solid rgba(37, 46, 15, 0.4)',
    boxShadow: 'inset -12px 0 20px rgba(255,255,255,0.18), inset 16px 0 24px rgba(0,0,0,0.14), 0 26px 44px rgba(58,66,27,0.24)',
    overflow: 'hidden',
  },
  fridgeGloss: { position: 'absolute', top: '18px', left: '28px', width: '55px', height: '340px', borderRadius: '999px', background: 'linear-gradient(180deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.08) 100%)', filter: 'blur(2px)' },
  fridgeBrand: { position: 'absolute', top: '34px', left: '26px', fontSize: '0.72rem', letterSpacing: '0.26em', color: 'rgba(255,255,255,0.72)', fontWeight: '800' },
  handleTop: { position: 'absolute', left: '46px', top: '115px', width: '86px', height: '18px', borderRadius: '999px', background: 'linear-gradient(180deg, #444 0%, #171717 100%)', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.22), 0 4px 10px rgba(0,0,0,0.25)' },
  handleBottom: { position: 'absolute', left: '46px', top: '210px', width: '86px', height: '18px', borderRadius: '999px', background: 'linear-gradient(180deg, #444 0%, #171717 100%)', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.22), 0 4px 10px rgba(0,0,0,0.25)' },
  fridgeDivider: { position: 'absolute', top: '175px', left: '0', right: '0', height: '8px', background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(41,43,28,0.6) 100%)' },
  statusLights: { position: 'absolute', top: '64px', left: '72px', display: 'flex', gap: '14px' },
  statusDot: { width: '16px', height: '6px', borderRadius: '999px', backgroundColor: 'rgba(30, 38, 15, 0.9)', boxShadow: '0 0 0 1px rgba(255,255,255,0.16)' },
  shellCaption: { position: 'absolute', left: '24px', bottom: '24px', padding: '10px 14px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.14)', color: '#eff7d8', fontWeight: '800', fontSize: '0.88rem', backdropFilter: 'blur(4px)' },
  summaryPanel: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', alignSelf: 'end' },
  summaryCard: { padding: '22px 20px', borderRadius: '26px', background: 'linear-gradient(180deg, #fffdf8 0%, #fff5e9 100%)', border: '1px solid #f2e1c3', boxShadow: '0 16px 34px rgba(145, 113, 41, 0.08)' },
  summaryLabel: { color: '#7a6a51', fontSize: '0.9rem', fontWeight: '700', marginBottom: '10px' },
  summaryValue: { color: '#2d3d24', fontSize: '2rem', fontWeight: '900' },
  openFridge: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2.3fr) minmax(240px, 0.9fr)',
    gap: '18px',
    padding: '24px',
    borderRadius: '38px',
    background: 'linear-gradient(180deg, #f7f8f4 0%, #ffffff 100%)',
    border: '12px solid #8e9992',
    boxShadow: 'inset 0 0 0 6px #dfe4dd, 0 30px 60px rgba(60,66,48,0.16)',
  },
  innerShadow: { position: 'absolute', inset: '12px', borderRadius: '28px', boxShadow: 'inset 18px 0 24px rgba(42, 54, 31, 0.06), inset -10px 0 20px rgba(0,0,0,0.04)', pointerEvents: 'none' },
  mainCabinet: { display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 },
  doorPanel: { display: 'flex', flexDirection: 'column' },
  zoneCard: { position: 'relative', zIndex: 1, borderRadius: '26px', padding: '16px', backgroundColor: '#fff', border: '1px solid #e9ece5', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' },
  freezerZone: { minHeight: '185px', background: 'linear-gradient(180deg, #f5fbff 0%, #ffffff 100%)', borderBottom: '6px solid #d7e9f6' },
  shelfZone: { minHeight: '220px', background: 'linear-gradient(180deg, #fffdf8 0%, #ffffff 100%)', borderBottom: '6px solid #ece4d5' },
  drawerZone: { minHeight: '185px', background: 'linear-gradient(180deg, #f5fbf1 0%, #ffffff 100%)', borderBottom: '6px solid #d6ead2' },
  doorZone: { minHeight: '100%', background: 'linear-gradient(180deg, #fff8f3 0%, #ffffff 100%)', borderLeft: '6px solid #f1ddd1' },
  zoneHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' },
  zoneKicker: { fontSize: '1rem', fontWeight: '900', color: '#24311e', marginBottom: '4px' },
  zoneSubtitle: { fontSize: '0.84rem', color: '#73806d', lineHeight: '1.5' },
  zoneCount: { padding: '8px 12px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '800', color: '#384332', whiteSpace: 'nowrap' },
  zoneGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' },
  doorGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '12px' },
  emptyZone: { minHeight: '88px', display: 'grid', placeItems: 'center', borderRadius: '18px', backgroundColor: 'rgba(246, 246, 242, 0.92)', border: '1px dashed #d9dfd3', color: '#879180', fontWeight: '700', textAlign: 'center', padding: '12px' },
  itemCard: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 10px 12px', borderRadius: '18px' },
  deleteBtn: { position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', borderRadius: '999px', background: '#fff4ef', border: '1px solid #ffd7cb', color: '#a0a0a0', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 },
  urgentBadge: { position: 'absolute', top: '-10px', left: '10px', padding: '4px 10px', borderRadius: '999px', backgroundColor: '#ffede7', border: '1px solid #ffc7b6', color: '#cb5f45', fontSize: '0.72rem', fontWeight: '900' },
  itemInfo: { textAlign: 'center', width: '100%' },
  itemName: { fontSize: '0.88rem', fontWeight: '900', marginBottom: '10px', lineHeight: '1.35' },
  qtyContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '7px' },
  itemQty: { fontSize: '0.84rem', fontWeight: '900', minWidth: '52px' },
  stepBtn: { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #d9ddcf', background: '#fff', cursor: 'pointer', fontSize: '0.88rem', color: '#2c3926', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  presentTag: { fontSize: '0.74rem', color: '#39532d', fontWeight: '900', backgroundColor: '#edf7e7', padding: '4px 10px', borderRadius: '999px', marginBottom: '10px', display: 'inline-block' },
  itemDate: { fontSize: '0.72rem', fontWeight: '700' }
};

export default Inventory;
