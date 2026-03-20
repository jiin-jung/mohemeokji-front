import { useState, useEffect } from 'react';
import axios from 'axios';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [fridge, setFridge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [servings, setServings] = useState(1);
  const userId = 2;

  // 핵심 재료 비교 리스트 (기존 로직 유지)
  const coreCategories = ['육류', '해산물'];
  const coreNames = ['달걀', '계란', '우유'];

  useEffect(() => {
    fetchSavedData();
  }, []);

  const fetchSavedData = async () => {
    setLoading(true);
    try {
      // 1. 냉장고 재고 로드 (현재 시점의 재고와 비교하기 위함)
      const fridgeRes = await axios.get(`http://localhost:8080/api/ingredients/${userId}`);
      setFridge(fridgeRes.data);

      // 2. 저장된 레시피 로드
      const savedRes = await axios.get(`http://localhost:8080/api/recipes/saved/${userId}`);
      setSavedRecipes(savedRes.data);
    } catch (e) {
      console.error("저장된 레시피 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteSavedRecipe = async (recipeId) => {
    if (!window.confirm("이 레시피를 보관함에서 삭제할까요?")) return;
    try {
      // 백엔드에 삭제 API가 있다면 호출 (예시)
      // await axios.delete(`/api/recipes/saved/${recipeId}`);
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipeId));
      alert("삭제되었습니다.");
    } catch (e) { alert("삭제 실패"); }
  };

  const getFridgeStock = (name) => {
    const item = fridge.find(f => f.name.includes(name) || name.includes(f.name));
    return item ? item.quantity : 0;
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.mainTitle}>나만의 레시피 보관함 📖</h2>
      
      {loading ? (
        <div style={styles.loadingBox}>보관된 비법서를 가져오고 있습니다... ❄️</div>
      ) : savedRecipes.length === 0 ? (
        <div style={styles.emptyBox}>아직 저장된 레시피가 없어요. 마음에 드는 레시피를 저장해 보세요!</div>
      ) : (
        <div style={styles.recipeGrid}>
          {savedRecipes.map((recipe) => (
            <div key={recipe.id} style={styles.recipeCard} onClick={() => {setSelectedRecipe(recipe); setServings(1);}}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{recipe.recipeName}</h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteSavedRecipe(recipe.id); }} 
                  style={styles.deleteMiniBtn}
                >✕</button>
              </div>
              <p style={styles.cardDesc}>{recipe.description}</p>
              <div style={styles.ytTag}>📺 영상 가이드 포함</div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div style={styles.modalOverlay} onClick={() => setSelectedRecipe(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedRecipe(null)}>✕</button>
            <h2 style={styles.detailTitle}>{selectedRecipe.recipeName}</h2>
            
            <div style={styles.servingRow}>
              <span style={styles.blackText}>인분 조절: </span>
              <div style={styles.servingControl}>
                <button onClick={() => setServings(Math.max(1, servings - 1))} style={styles.qtyBtn}>-</button>
                <span style={styles.servingText}>{servings}인분</span>
                <button onClick={() => setServings(servings + 1)} style={styles.qtyBtn}>+</button>
              </div>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>필요 재료 (현재 재고 / 필요량)</h4>
              {selectedRecipe.ingredients.map(ing => {
                const isCore = coreCategories.includes(ing.category) || coreNames.some(cn => ing.name.includes(cn));
                const stock = getFridgeStock(ing.name);
                const required = ing.quantityPerServing * servings;
                return (
                  <div key={ing.name} style={styles.ingRow}>
                    <span style={styles.blackText}>{ing.name}</span>
                    {isCore ? (
                      <span style={{...styles.qtyText, color: stock < required ? '#ff6b6b' : '#000'}}>
                        {stock}{ing.unit} / {required}{ing.unit}
                      </span>
                    ) : (
                      <span style={styles.qtyText}>{required}{ing.unit}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>조리 단계</h4>
              {selectedRecipe.steps && selectedRecipe.steps.map((step, idx) => (
                <p key={idx} style={styles.stepText}>{idx + 1}. {step}</p>
              ))}
            </div>

            <div style={styles.actionArea}>
              <a href={selectedRecipe.youtubeUrl} target="_blank" rel="noreferrer" style={styles.ytButton}>
                📺 유튜브 영상 다시보기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px', color: '#000' },
  mainTitle: { fontWeight: '900', fontSize: '2.2rem', color: '#000', textAlign: 'center', marginBottom: '40px' },
  loadingBox: { textAlign: 'center', padding: '100px', fontWeight: 'bold' },
  emptyBox: { textAlign: 'center', padding: '100px', color: '#666', fontSize: '1.1rem' },
  recipeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  recipeCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '25px', border: '2.5px solid #f0f0f0', cursor: 'pointer', position: 'relative' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '900', color: '#000', margin: 0 },
  deleteMiniBtn: { background: 'none', border: 'none', fontSize: '1.2rem', color: '#ccc', cursor: 'pointer' },
  cardDesc: { fontSize: '0.9rem', color: '#444', marginBottom: '15px', lineHeight: '1.4' },
  ytTag: { fontSize: '0.8rem', color: '#ff0000', fontWeight: 'bold' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', width: '95%', maxWidth: '550px', padding: '40px', borderRadius: '35px', maxHeight: '85vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: '25px', right: '30px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' },
  detailTitle: { fontSize: '1.8rem', fontWeight: '900', color: '#000', marginBottom: '30px', textAlign: 'center' },
  
  servingRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', justifyContent: 'center' },
  servingControl: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f8f9fa', padding: '5px 15px', borderRadius: '20px' },
  servingText: { fontSize: '1.2rem', fontWeight: 'bold' },
  qtyBtn: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' },
  
  section: { marginBottom: '30px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '900', color: '#000', marginBottom: '15px', borderLeft: '6px solid #000', paddingLeft: '12px' },
  ingRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f8f9fa' },
  blackText: { fontWeight: '700' },
  qtyText: { fontWeight: '800' },
  stepText: { marginBottom: '12px', lineHeight: '1.6', fontSize: '1.05rem' },
  ytButton: { display: 'block', textAlign: 'center', padding: '15px', border: '2px solid #ff0000', color: '#ff0000', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }
};

export default SavedRecipes;