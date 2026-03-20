import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();
  const userId = 2;

  useEffect(() => { fetchIngredients(); }, []);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/ingredients/${userId}`);
      setIngredients(res.data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (e) { console.error(e); }
  };

  const changeQty = async (id, newQty) => {
    if (newQty < 0) return;
    try {
      await axios.patch(`http://localhost:8080/api/ingredients/${id}/quantity?quantity=${newQty}`);
      setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, quantity: newQty } : ing));
    } catch (e) { console.error("수정 실패"); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("이 재료를 냉장고에서 뺄까요?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/ingredients/${id}`);
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (e) { alert("삭제 실패"); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0].substring(2).replace(/-/g, '.');
  };

  const getZone = (cat) => {
    if (['육류', '해산물'].includes(cat)) return 'freezer';
    if (['채소'].includes(cat)) return 'drawer';
    if (['조미료'].includes(cat)) return 'door';
    return 'shelf';
  };

  const renderItem = (ing) => (
    <div key={ing.id} style={styles.itemCard}>
      <button onClick={() => deleteItem(ing.id)} style={styles.deleteBtn} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = '#ccc'}>×</button>
      <div style={styles.itemInfo}>
        <div style={styles.itemName}>{ing.name}</div>
        
        {/* 조미료가 아닐 때만 수량 조절 버튼 표시 */}
        {ing.category !== '조미료' ? (
          <div style={styles.qtyContainer}>
            <button onClick={() => changeQty(ing.id, ing.quantity - (ing.unit === 'g' ? 50 : 1))} style={styles.stepBtn}>-</button>
            <span style={styles.itemQty}>{ing.quantity}{ing.unit}</span>
            <button onClick={() => changeQty(ing.id, ing.quantity + (ing.unit === 'g' ? 50 : 1))} style={styles.stepBtn}>+</button>
          </div>
        ) : (
          <div style={styles.presentTag}>보유 중</div>
        )}

        <div style={styles.itemDate}>{formatDate(ing.createdAt)}</div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>지인님의 냉장고 ❄️</h2>
        <button onClick={() => navigate('/add')} style={styles.addBtn}>+ 재료 장보기</button>
      </div>

      <div style={styles.fridgeContainer}>
        <div style={styles.fridgeBody}>
          <div style={styles.shelfZone}><div style={styles.zoneLabel}>신선 선반 (유제품/기타)</div><div style={styles.grid}>{ingredients.filter(i => getZone(i.category) === 'shelf').map(renderItem)}</div></div>
          <div style={styles.drawerZone}><div style={styles.zoneLabel}>채소 신선실 🥗</div><div style={styles.grid}>{ingredients.filter(i => getZone(i.category) === 'drawer').map(renderItem)}</div></div>
          <div style={styles.freezerZone}><div style={styles.zoneLabel}>냉동실 (육류/해산물) ❄️</div><div style={styles.grid}>{ingredients.filter(i => getZone(i.category) === 'freezer').map(renderItem)}</div></div>
        </div>
        <div style={styles.fridgeDoor}><div style={styles.zoneLabel}>문 쪽 (양념/소스)</div><div style={styles.doorGrid}>{ingredients.filter(i => getZone(i.category) === 'door').map(renderItem)}</div></div>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '950px', margin: '0 auto', padding: '20px', color: '#000' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '1.8rem', fontWeight: 'bold', color: '#000' },
  addBtn: { padding: '10px 20px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  fridgeContainer: { display: 'flex', gap: '20px', backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '30px', border: '8px solid #d1d9e0' },
  fridgeBody: { flex: 2, display: 'flex', flexDirection: 'column', gap: '15px' },
  fridgeDoor: { flex: 0.8, backgroundColor: '#fff', borderRadius: '15px', padding: '15px', borderLeft: '4px solid #d1d9e0', minHeight: '600px' },
  shelfZone: { backgroundColor: '#fff', borderRadius: '10px', padding: '15px', minHeight: '150px', borderBottom: '4px solid #e2e8f0' },
  drawerZone: { backgroundColor: '#eefcf2', borderRadius: '10px', padding: '15px', minHeight: '150px', border: '2px solid #c6f6d5' },
  freezerZone: { backgroundColor: '#ebf8ff', borderRadius: '10px', padding: '15px', minHeight: '200px', border: '2px solid #bee3f8' },
  zoneLabel: { fontSize: '0.8rem', fontWeight: 'bold', color: '#718096', marginBottom: '10px', borderBottom: '1px solid #edf2f7' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '10px' },
  doorGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '10px' },
  itemCard: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 5px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #eee' },
  deleteBtn: { position: 'absolute', top: '2px', right: '5px', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1.2rem' },
  itemInfo: { textAlign: 'center', width: '100%' },
  itemName: { fontSize: '0.85rem', fontWeight: 'bold', color: '#000', marginBottom: '8px' },
  qtyContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '5px' },
  itemQty: { fontSize: '0.8rem', color: '#000', fontWeight: 'bold', minWidth: '45px' },
  stepBtn: { width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  presentTag: { fontSize: '0.75rem', color: '#000', fontWeight: 'bold', backgroundColor: '#eee', padding: '2px 8px', borderRadius: '10px', marginBottom: '10px', display: 'inline-block' },
  itemDate: { fontSize: '0.65rem', color: '#000', opacity: 0.7 }
};

export default Inventory;