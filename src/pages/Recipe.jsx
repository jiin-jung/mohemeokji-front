import { useState, useEffect } from 'react';
import axios from 'axios';

const Recipe = () => {
  const [recipes, setRecipes] = useState([]); // AI 추천 레시피 리스트
  const [fridge, setFridge] = useState([]);   // 실시간 냉장고 재고
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  const [servings, setServings] = useState(1); 
  const userId = 2; // 지인님의 고정 ID

  // 지인님의 요청: 비교 대상 핵심 품목
  const coreCategories = ['육류', '해산물'];
  const coreNames = ['달걀', '계란', '우유'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 1. 초기 데이터 로드 (냉장고 재고 + AI 레시피 추천)
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const fridgeRes = await axios.get(`http://localhost:8080/api/ingredients/${userId}`);
      setFridge(fridgeRes.data);

      const recipeRes = await axios.get(`http://localhost:8080/api/recipes/recommend/${userId}`);
      setRecipes(recipeRes.data);
    } catch (e) {
      console.error("데이터 로드 실패:", e);
      alert("레시피를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 2. 레시피 보관함에 저장 (백엔드 연동)
  const handleSave = async (recipe) => {
    try {
      await axios.post(`http://localhost:8080/api/recipes/save/${userId}`, recipe);
      alert("레시피가 보관함에 저장되었습니다! 📖");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("이미 저장된 레시피거나 저장 중 오류가 발생했습니다.");
    }
  };

  // 3. 냉장고에서 특정 재료의 잔량 찾기
  const getFridgeStock = (name) => {
    const item = fridge.find(f => f.name.includes(name) || name.includes(f.name));
    return item ? item.quantity : 0;
  };

  // 4. 요리 완료 처리 (재고 차감)
  const handleCook = async () => {
    if (!window.confirm(`${servings}인분 요리를 완료하셨나요? 냉장고 재고가 차감됩니다.`)) return;
    
    try {
      await axios.post(`http://localhost:8080/api/recipes/cook/${userId}?servings=${servings}`, selectedRecipe);
      alert("맛있게 드세요! 재고가 성공적으로 차감되었습니다.");
      setSelectedRecipe(null);
      fetchInitialData(); 
    } catch (e) {
      alert("재고 차감 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>뭐 해먹지? 👨‍🍳</h2>
        <button onClick={fetchInitialData} style={styles.refreshBtn} disabled={loading}>
          {loading ? '메뉴 분석 중...' : '다른 메뉴 추천받기 🔄'}
        </button>
      </div>
      
      {loading ? (
        <div style={styles.loadingBox}>
          <p>제미나이가 냉장고를 확인하고 있어요...</p>
          <p style={{fontSize: '0.9rem', fontWeight: 'normal'}}>인기 유튜브 영상도 함께 찾는 중입니다 ❄️</p>
        </div>
      ) : (
        <div style={styles.recipeGrid}>
          {recipes.map((recipe, idx) => (
            <div key={idx} style={styles.recipeCard} onClick={() => {setSelectedRecipe(recipe); setServings(1);}}>
              <h3 style={styles.cardTitle}>{recipe.recipeName}</h3>
              <p style={styles.cardDesc}>{recipe.description}</p>
              <div style={styles.maxBadge}>최대 {recipe.maxServings}인분 가능</div>
              <div style={styles.ytTag}>📺 조회수 높은 레시피 포함</div>
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
              <span style={styles.blackText}>인분 설정: </span>
              <div style={styles.servingControl}>
                <button onClick={() => setServings(Math.max(1, servings - 1))} style={styles.qtyBtn}>-</button>
                <span style={styles.servingText}>{servings}인분</span>
                <button onClick={() => setServings(Math.min(selectedRecipe.maxServings, servings + 1))} style={styles.qtyBtn}>+</button>
              </div>
              <span style={styles.maxInfo}>(최대 {selectedRecipe.maxServings}인분)</span>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>재료 체크 (내 냉장고 / 필요량)</h4>
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
              <h4 style={styles.sectionTitle}>조리 가이드</h4>
              {selectedRecipe.steps && selectedRecipe.steps.map((step, idx) => (
                <p key={idx} style={styles.stepText}>{idx + 1}. {step}</p>
              ))}
            </div>

            <div style={styles.actionArea}>
              <button onClick={() => handleSave(selectedRecipe)} style={styles.saveButton}>
                레시피 보관함에 저장 💾
              </button>
              <a href={selectedRecipe.youtubeUrl} target="_blank" rel="noreferrer" style={styles.ytButton}>
                📺 유튜브 영상 보며 요리하기
              </a>
              <button onClick={handleCook} style={styles.cookButton}>
                🍳 요리 완료 (재고 차감)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: '#000' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  mainTitle: { fontWeight: '900', fontSize: '2.2rem', color: '#000' },
  refreshBtn: { padding: '12px 24px', border: '1.5px solid #000', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  loadingBox: { textAlign: 'center', padding: '120px', fontSize: '1.3rem', color: '#000', fontWeight: 'bold', lineHeight: '1.6' },
  recipeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
  recipeCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '25px', border: '2.5px solid #f0f0f0', boxShadow: '0 10px 20px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s' },
  cardTitle: { fontSize: '1.4rem', fontWeight: '900', color: '#000', marginBottom: '12px' },
  cardDesc: { fontSize: '0.95rem', color: '#444', marginBottom: '20px', height: '40px', overflow: 'hidden' },
  maxBadge: { display: 'inline-block', padding: '6px 14px', backgroundColor: '#f1f3f5', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold', color: '#000', marginBottom: '12px' },
  ytTag: { fontSize: '0.8rem', color: '#ff0000', fontWeight: 'bold' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', width: '95%', maxWidth: '600px', padding: '45px', borderRadius: '35px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: '25px', right: '30px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#000' },
  detailTitle: { fontSize: '2rem', fontWeight: '900', color: '#000', marginBottom: '35px', textAlign: 'center' },
  
  servingRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px', justifyContent: 'center' },
  servingControl: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f8f9fa', padding: '8px 20px', borderRadius: '25px', border: '1px solid #eee' },
  servingText: { fontSize: '1.3rem', fontWeight: 'bold', color: '#000', minWidth: '60px', textAlign: 'center' },
  qtyBtn: { width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '1.2rem', color: '#000' },
  maxInfo: { fontSize: '0.85rem', color: '#666', fontWeight: 'bold' },
  
  section: { marginBottom: '35px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '900', color: '#000', marginBottom: '15px', borderLeft: '6px solid #000', paddingLeft: '12px' },
  ingRow: { display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f8f9fa' },
  blackText: { color: '#000', fontWeight: '700' },
  qtyText: { color: '#000', fontWeight: '800' },
  stepText: { color: '#000', marginBottom: '15px', lineHeight: '1.7', fontSize: '1.1rem' },
  
  actionArea: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' },
  saveButton: { padding: '16px', backgroundColor: '#fff', border: '2px solid #2c3e50', color: '#2c3e50', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem' },
  ytButton: { display: 'block', textAlign: 'center', padding: '16px', backgroundColor: '#fff', border: '2px solid #ff0000', color: '#ff0000', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' },
  cookButton: { padding: '16px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem' }
};

export default Recipe;