import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage, USER_ID } from '../api';

const AddIngredient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('육류');
  const [currentSubCategory, setCurrentSubCategory] = useState('돼지');
  const navigate = useNavigate();

   const itemDb = {
    '육류': {
      '돼지': [
        { name: '삼겹살', icon: '🥓', unit: 'g', cat: '육류' },
        { name: '목살', icon: '🥩', unit: 'g', cat: '육류' },
        { name: '앞다리살', icon: '🍖', unit: 'g', cat: '육류' },
        { name: '뒷다리살', icon: '🍖', unit: 'g', cat: '육류' },
        { name: '항정살', icon: '🥩', unit: 'g', cat: '육류' },
        { name: '등갈비', icon: '🍖', unit: 'g', cat: '육류' },
        { name: '대패 삼겹살', icon: '🥓', unit: 'g', cat: '육류' },
        { name: '돈가스용 등심', icon: '🥩', unit: 'g', cat: '육류' }
      ],
      '소': [
        { name: '등심', icon: '🐮', unit: 'g', cat: '육류' },
        { name: '안심', icon: '🥩', unit: 'g', cat: '육류' },
        { name: '차돌박이', icon: '🥓', unit: 'g', cat: '육류' },
        { name: '부채살', icon: '🥩', unit: 'g', cat: '육류' },
        { name: '갈비', icon: '🍖', unit: 'g', cat: '육류' },
        { name: '국거리용 소고기', icon: '🥩', unit: 'g', cat: '육류' },
        { name: '육회용 소고기', icon: '🥩', unit: 'g', cat: '육류' }
      ],
      '닭': [
        { name: '닭가슴살', icon: '🐔', unit: 'g', cat: '육류' },
        { name: '닭다리살', icon: '🍗', unit: 'g', cat: '육류' },
        { name: '닭날개', icon: '🐔', unit: 'g', cat: '육류' },
        { name: '닭안심', icon: '🥩', unit: 'g', cat: '육류' },
        { name: '닭볶음탕용', icon: '🥘', unit: 'g', cat: '육류' },
        { name: '닭발', icon: '🐔', unit: 'g', cat: '육류' }
      ],
      '양/오리': [
        { name: '양갈비', icon: '🍖', unit: 'g', cat: '육류' },
        { name: '양꼬치용', icon: '🍢', unit: 'g', cat: '육류' },
        { name: '오리고기', icon: '🪿', unit: 'g', cat: '육류' },
        { name: '오리훈제', icon: '🥓', unit: 'g', cat: '육류' }
      ],
      '기타육류': [
        { name: '비엔나 소시지', icon: '🌭', unit: 'g', cat: '육류' },
        { name: '후랭크 소시지', icon: '🌭', unit: 'g', cat: '육류' },
        { name: '스팸/통조림햄', icon: '🥫', unit: '개', cat: '육류' },
        { name: '베이컨', icon: '🥓', unit: 'g', cat: '육류' },
        { name: '다짐육', icon: '🥩', unit: 'g', cat: '육류' }
      ]
    },
    '채소': [
      { name: '대파', icon: '🌱', unit: '단', cat: '채소' },
      { name: '양파', icon: '🧅', unit: '개', cat: '채소' },
      { name: '감자', icon: '🥔', unit: '개', cat: '채소' },
      { name: '마늘', icon: '🧄', unit: '쪽', cat: '채소' },
      { name: '당근', icon: '🥕', unit: '개', cat: '채소' },
      { name: '무', icon: '🫜', unit: '개', cat: '채소' },
      { name: '배추', icon: '🥬', unit: '포기', cat: '채소' },
      { name: '양배추', icon: '🥬', unit: '통', cat: '채소' },
      { name: '상추', icon: '🥬', unit: '봉', cat: '채소' },
      { name: '깻잎', icon: '🌿', unit: '묶음', cat: '채소' },
      { name: '청양고추', icon: '🌶️', unit: '개', cat: '채소' },
      { name: '애호박', icon: '🥒', unit: '개', cat: '채소' },
      { name: '오이', icon: '🥒', unit: '개', cat: '채소' },
      { name: '팽이버섯', icon: '🍄', unit: '봉', cat: '채소' },
      { name: '표고버섯', icon: '🍄', unit: '개', cat: '채소' },
      { name: '느타리버섯', icon: '🍄', unit: '팩', cat: '채소' },
      { name: '콩나물', icon: '🎋', unit: '봉', cat: '채소' },
      { name: '숙주나물', icon: '🎋', unit: '봉', cat: '채소' },
      { name: '부추', icon: '🌿', unit: '단', cat: '채소' },
      { name: '파프리카', icon: '🫑', unit: '개', cat: '채소' }
    ],
    '해산물': [
      { name: '고등어', icon: '🐟', unit: '마리', cat: '해산물' },
      { name: '갈치', icon: '🐟', unit: '토막', cat: '해산물' },
      { name: '연어', icon: '🍣', unit: 'g', cat: '해산물' },
      { name: '새우', icon: '🦐', unit: '마리', cat: '해산물' },
      { name: '오징어', icon: '🦑', unit: '마리', cat: '해산물' },
      { name: '꽃게', icon: '🦀', unit: '마리', cat: '해산물' },
      { name: '바지락', icon: '🐚', unit: 'g', cat: '해산물' },
      { name: '홍합', icon: '🐚', unit: 'g', cat: '해산물' },
      { name: '전복', icon: '🐚', unit: '개', cat: '해산물' },
      { name: '멸치(육수용)', icon: '🐟', unit: '봉', cat: '해산물' },
      { name: '진미채', icon: '🦑', unit: 'g', cat: '해산물' },
      { name: '어묵', icon: '🍢', unit: '봉', cat: '해산물' }
    ],
    '조미료': [
      { name: '소금', icon: '🧂', unit: '개', cat: '조미료' },
      { name: '설탕', icon: '🍯', unit: '개', cat: '조미료' },
      { name: '간장', icon: '🍶', unit: '개', cat: '조미료' },
      { name: '된장', icon: '🤎', unit: '개', cat: '조미료' },
      { name: '고추장', icon: '🌶️', unit: '개', cat: '조미료' },
      { name: '고춧가루', icon: '🌶️', unit: '개', cat: '조미료' },
      { name: '참기름', icon: '🍶', unit: '개', cat: '조미료' },
      { name: '식용유', icon: '🧴', unit: '개', cat: '조미료' },
      { name: '올리브유', icon: '🫗', unit: '개', cat: '조미료' },
      { name: '굴소스', icon: '🍶', unit: '개', cat: '조미료' },
      { name: '식초', icon: '🧪', unit: '개', cat: '조미료' },
      { name: '올리고당', icon: '🍯', unit: '개', cat: '조미료' },
      { name: '마요네즈', icon: '🧴', unit: '개', cat: '조미료' },
      { name: '케첩', icon: '🥫', unit: '개', cat: '조미료' },
      { name: '맛술', icon: '🍶', unit: '개', cat: '조미료' }
    ],
    '기타': [
      { name: '두부', icon: '⬜', unit: '모', cat: '기타' },
      { name: '달걀', icon: '🥚', unit: '개', cat: '기타' },
      { name: '우유', icon: '🥛', unit: 'ml', cat: '기타' },
      { name: '버터', icon: '🧈', unit: '개', cat: '기타' },
      { name: '치즈', icon: '🧀', unit: '장', cat: '기타' },
      { name: '만두', icon: '🥟', unit: '봉', cat: '기타' },
      { name: '라면사리', icon: '🍜', unit: '개', cat: '기타' },
      { name: '참치캔', icon: '🥫', unit: '개', cat: '기타' },
      { name: '빵', icon: '🍞', unit: '개', cat: '기타' }
    ]
  };

  const itemsToDisplay = currentCategory === '육류' 
    ? itemDb['육류'][currentSubCategory] 
    : itemDb[currentCategory];

  const filteredItems = itemsToDisplay.filter(item => item.name.includes(searchTerm));

  const toggleSelect = (item) => {
    if (tempSelected.find(i => i.name === item.name)) {
      setTempSelected(tempSelected.filter(i => i.name !== item.name));
    } else {
      // 우유는 150ml, 육류는 100g, 조미료는 1(표기용) 기본 설정
      let initialQty = item.unit === 'g' ? 100 : 1;
      if (item.name === '우유') initialQty = 150;
      setTempSelected([...tempSelected, { ...item, qty: initialQty }]);
    }
  };

  const updateQty = (name, amount) => {
    setTempSelected(tempSelected.map(item => 
      item.name === name ? { ...item, qty: Math.max(0, item.qty + amount) } : item
    ));
  };

  const handleInputChange = (name, value) => {
    const numValue = parseFloat(value) || 0;
    setTempSelected(tempSelected.map(item => 
      item.name === name ? { ...item, qty: numValue } : item
    ));
  };

  const saveAll = async () => {
    const formattedDate = new Date().toISOString().split('T')[0];
    try {
      await Promise.all(tempSelected.map(item => 
        api.post(`/api/ingredients/${USER_ID}`, {
          name: item.name, quantity: item.qty, unit: item.unit, category: item.cat, expiryDate: formattedDate
        })
      ));
      alert("냉장고 저장 완료!");
      navigate('/inventory');
    } catch (error) {
      alert(getErrorMessage(error, '저장 실패'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroBadge}>MARKET LIST</div>
        <h2 style={styles.title}>냉장고에 채워둘 재료를 골라볼까요?</h2>
        <p style={styles.subtitle}>카테고리를 고르고 필요한 재료를 선택한 뒤, 수량만 가볍게 조정해서 저장해보세요.</p>
      </div>

      <input style={styles.searchBar} placeholder="재료 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      
      <div style={styles.tabContainer}>
        {Object.keys(itemDb).map(cat => (
          <button key={cat} onClick={() => setCurrentCategory(cat)} style={{...styles.tab, background: currentCategory === cat ? 'linear-gradient(135deg, #355d35 0%, #27492c 100%)' : '#fffdf8', color: currentCategory === cat ? '#fff' : '#3c432e', borderColor: currentCategory === cat ? '#355d35' : '#ead8b8'}}>{cat}</button>
        ))}
      </div>

      {currentCategory === '육류' && (
        <div style={styles.subTabContainer}>
          {Object.keys(itemDb['육류']).map(sub => (
            <button key={sub} onClick={() => setCurrentSubCategory(sub)} style={{...styles.subTab, color: currentSubCategory === sub ? '#355d35' : '#877b62', borderBottom: currentSubCategory === sub ? '2px solid #355d35' : 'none'}}>{sub}</button>
          ))}
        </div>
      )}

      <div style={styles.grid}>
        {filteredItems.map(item => (
          <div key={item.name} onClick={() => toggleSelect(item)} style={{...styles.card, borderColor: tempSelected.find(i => i.name === item.name) ? '#da8350' : '#ebdfcf', background: tempSelected.find(i => i.name === item.name) ? 'linear-gradient(180deg, #fff4eb 0%, #ffffff 100%)' : 'linear-gradient(180deg, #fffdf8 0%, #ffffff 100%)'}}>
            <div style={styles.icon}>{item.icon}</div>
            <div style={styles.name}>{item.name}</div>
          </div>
        ))}
      </div>

      {tempSelected.length > 0 && (
        <div style={styles.bottomBar}>
          <div style={styles.bottomBarLabel}>Selected Ingredients</div>
          <div style={styles.selectedList}>
            {tempSelected.map(item => (
              <div key={item.name} style={styles.selectedRow}>
                <span style={styles.rowName}>{item.name}</span>
                {/* 조미료 카테고리는 수량 조절 UI 숨김 */}
                {item.cat !== '조미료' && (
                  <div style={styles.qtyControl}>
                    <button onClick={() => updateQty(item.name, item.unit === 'g' ? -50 : -1)} style={styles.qtyBtn}>-</button>
                    <div style={styles.inputWrapper}>
                      <input type="number" value={item.qty} onChange={(e) => handleInputChange(item.name, e.target.value)} style={styles.qtyInput} />
                      <span style={styles.unitText}>{item.unit}</span>
                    </div>
                    <button onClick={() => updateQty(item.name, item.unit === 'g' ? 50 : 1)} style={styles.qtyBtn}>+</button>
                  </div>
                )}
                {item.cat === '조미료' && <span style={styles.seasoningText}>보유 중</span>}
              </div>
            ))}
          </div>
          <button onClick={saveAll} style={styles.submitBtn}>냉장고에 일괄 저장</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '980px', margin: '0 auto', paddingBottom: '230px', color: '#000' },
  hero: { marginBottom: '24px', padding: '38px 26px', borderRadius: '34px', background: 'linear-gradient(135deg, #fff6e6 0%, #eff8dc 100%)', border: '1px solid #e7d8b6', boxShadow: '0 20px 40px rgba(104, 122, 56, 0.12)' },
  heroBadge: { display: 'inline-flex', padding: '8px 14px', borderRadius: '999px', backgroundColor: '#ffe18d', color: '#6a5103', fontWeight: '900', letterSpacing: '0.08em', marginBottom: '14px' },
  title: { textAlign: 'center', marginBottom: '12px', color: '#25331c', fontWeight: '900', fontSize: '2.35rem' },
  subtitle: { textAlign: 'center', color: '#657159', lineHeight: '1.7', maxWidth: '680px', margin: '0 auto' },
  searchBar: { width: '100%', padding: '15px 18px', borderRadius: '18px', border: '1px solid #e5d8c5', marginBottom: '22px', boxSizing: 'border-box', color: '#2d341f', backgroundColor: '#fffdf8', boxShadow: '0 10px 18px rgba(123, 106, 81, 0.06)' },
  tabContainer: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' },
  tab: { padding: '10px 16px', border: '1px solid', borderRadius: '999px', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem' },
  subTabContainer: { display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '24px', borderBottom: '1px solid #eee0c8', flexWrap: 'wrap' },
  subTab: { padding: '7px 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' },
  card: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 10px', borderRadius: '22px', border: '2px solid', cursor: 'pointer', boxShadow: '0 12px 24px rgba(92, 86, 67, 0.08)' },
  icon: { fontSize: '2.2rem', marginBottom: '8px' },
  name: { fontSize: '0.85rem', fontWeight: '800', color: '#28311f', textAlign: 'center', lineHeight: '1.4' },
  bottomBar: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '980px', background: 'linear-gradient(180deg, #fffdf8 0%, #fff5e8 100%)', padding: '22px', borderRadius: '28px 28px 0 0', boxShadow: '0 -14px 30px rgba(94, 89, 73, 0.12)', border: '1px solid #eddcc0' },
  bottomBarLabel: { fontSize: '0.76rem', color: '#b1772c', fontWeight: '900', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' },
  selectedList: { maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' },
  selectedRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '12px' },
  rowName: { fontSize: '0.96rem', fontWeight: '800', color: '#29331f' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: { width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #dfd1ba', cursor: 'pointer', color: '#2d341f', background: '#fffdf8' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#fff9f0', padding: '4px 10px', borderRadius: '10px', border: '1px solid #e9ddcc' },
  qtyInput: { width: '56px', border: 'none', background: 'none', textAlign: 'right', fontSize: '0.92rem', fontWeight: '800', color: '#24311e', outline: 'none' },
  unitText: { fontSize: '0.8rem', color: '#505945', fontWeight: '800' },
  seasoningText: { fontSize: '0.85rem', color: '#355d35', fontWeight: '900' },
  submitBtn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #355d35 0%, #27492c 100%)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', marginTop: '14px', boxShadow: '0 14px 24px rgba(53, 93, 53, 0.2)' }
};

export default AddIngredient;
