import { useState, useEffect } from 'react';
import { api, getErrorMessage, USER_ID } from '../api';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [fridge, setFridge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [servings, setServings] = useState(1);

  // 핵심 재료 비교 리스트 (기존 로직 유지)
  const coreCategories = ['육류', '해산물'];
  const coreNames = ['달걀', '계란', '우유'];
  const getRecipeTitle = (recipe) => recipe.recipeName ?? recipe.menuName ?? '이름 없는 레시피';

  useEffect(() => {
    fetchSavedData();
  }, []);

  const fetchSavedData = async () => {
    setLoading(true);
    try {
      // 1. 냉장고 재고 로드 (현재 시점의 재고와 비교하기 위함)
      const fridgeRes = await api.get(`/api/ingredients/${USER_ID}`);
      setFridge(fridgeRes.data);

      // 2. 저장된 레시피 로드
      const savedRes = await api.get(`/api/recipes/saved/${USER_ID}`);
      setSavedRecipes(savedRes.data);
    } catch (e) {
      console.error("저장된 레시피 로드 실패:", e);
      alert(getErrorMessage(e, '저장된 레시피를 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const deleteSavedRecipe = async (recipeId) => {
    if (!window.confirm("이 레시피를 보관함에서 삭제할까요?")) return;
    try {
      await api.delete(`/api/recipes/saved/${recipeId}`);
      setSavedRecipes((current) => current.filter((recipe) => recipe.id !== recipeId));
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("레시피 삭제 실패:", error);
      alert(getErrorMessage(error, '삭제 실패'));
    }
  };

  const getFridgeStock = (name) => {
    const item = fridge.find(f => f.name.includes(name) || name.includes(f.name));
    return item ? item.quantity : 0;
  };

  return (
    <div style={styles.page}>
      <div className="page-heading">
        <div className="page-heading-copy">
          <h2 style={styles.mainTitle}>나만의 레시피 보관함 📖</h2>
          <p>저장해둔 메뉴를 다시 열어보고 필요한 재료를 바로 확인해보세요.</p>
        </div>
      </div>
      
      {loading ? (
        <div style={styles.loadingBox}>보관된 비법서를 가져오고 있습니다... ❄️</div>
      ) : savedRecipes.length === 0 ? (
        <div style={styles.emptyBox}>아직 저장된 레시피가 없어요. 마음에 드는 레시피를 저장해 보세요!</div>
      ) : (
        <div style={styles.recipeGrid}>
          {savedRecipes.map((recipe) => (
            <div key={recipe.id} style={styles.recipeCard} className="interactive-card" onClick={() => {setSelectedRecipe(recipe); setServings(1);}}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{getRecipeTitle(recipe)}</h3>
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
          <div style={styles.modalContent} className="recipe-detail-modal" onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedRecipe(null)}>✕</button>
            <div className="detail-hero">
              <p className="detail-kicker">Saved Recipe</p>
              <h2 style={styles.detailTitle}>{getRecipeTitle(selectedRecipe)}</h2>
              <div className="detail-summary">
                <span className="detail-chip">현재 재고와 함께 비교</span>
                <span className="detail-chip">다시 만들기 쉬운 보관 레시피</span>
              </div>
            </div>

            <div style={styles.servingRow}>
              <span style={styles.blackText}>인분 조절</span>
              <div style={styles.servingControl}>
                <button onClick={() => setServings(Math.max(1, servings - 1))} style={styles.qtyBtn}>-</button>
                <span style={styles.servingText}>{servings}인분</span>
                <button onClick={() => setServings(servings + 1)} style={styles.qtyBtn}>+</button>
              </div>
            </div>

            <div style={styles.section} className="section-card">
              <h4 style={styles.sectionTitle}>필요 재료 (현재 재고 / 필요량)</h4>
              {selectedRecipe.ingredients.map(ing => {
                const isCore = coreCategories.includes(ing.category) || coreNames.some(cn => ing.name.includes(cn));
                const stock = getFridgeStock(ing.name);
                const required = Math.round(ing.quantityPerServing * servings * 100) / 100;
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

            <div style={styles.section} className="section-card">
              <h4 style={styles.sectionTitle}>조리 단계</h4>
              {selectedRecipe.steps && selectedRecipe.steps.map((step, idx) => (
                <p key={idx} style={styles.stepText}>{idx + 1}. {step}</p>
              ))}
            </div>

            <div style={styles.actionArea} className="modal-actions">
              <a href={selectedRecipe.youtubeUrl} target="_blank" rel="noreferrer" style={styles.ytButton} className="action-button danger">
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
  recipeCard: { backgroundColor: '#fff', padding: '26px', borderRadius: '28px', border: '1px solid #f1e8db', cursor: 'pointer', position: 'relative', boxShadow: '0 12px 24px rgba(15,23,42,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  cardTitle: { fontSize: '1.3rem', fontWeight: '900', color: '#000', margin: 0 },
  deleteMiniBtn: { background: '#fff8ee', border: '1px solid #f3dfba', width: '34px', height: '34px', borderRadius: '999px', fontSize: '1.1rem', color: '#b7791f', cursor: 'pointer' },
  cardDesc: { fontSize: '0.9rem', color: '#444', marginBottom: '15px', lineHeight: '1.55', minHeight: '42px' },
  ytTag: { fontSize: '0.8rem', color: '#ff0000', fontWeight: 'bold' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', width: '95%', maxWidth: '600px', padding: '38px', borderRadius: '35px', maxHeight: '85vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: '25px', right: '30px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' },
  detailTitle: { fontSize: '1.95rem', fontWeight: '900', color: '#000', marginBottom: '8px', textAlign: 'center' },
  
  servingRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', justifyContent: 'center', flexWrap: 'wrap' },
  servingControl: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fffaf1', padding: '8px 18px', borderRadius: '20px', border: '1px solid #eadfc8' },
  servingText: { fontSize: '1.2rem', fontWeight: 'bold' },
  qtyBtn: { width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e4d4b7', background: '#fff', cursor: 'pointer' },
  
  section: { marginBottom: '20px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '900', color: '#000', marginBottom: '15px', borderLeft: '6px solid #f0aa46', paddingLeft: '12px' },
  ingRow: { display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: '1px solid #f3eee6' },
  blackText: { fontWeight: '700' },
  qtyText: { fontWeight: '800', textAlign: 'right' },
  stepText: { marginBottom: '12px', lineHeight: '1.7', fontSize: '1.02rem' },
  actionArea: { marginTop: '22px' },
  ytButton: { textDecoration: 'none' }
};

export default SavedRecipes;
