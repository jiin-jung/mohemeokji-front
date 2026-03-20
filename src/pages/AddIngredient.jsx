import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddIngredient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('육류');
  const [currentSubCategory, setCurrentSubCategory] = useState('돼지');
  const navigate = useNavigate();
  const userId = 2;

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
        axios.post(`http://localhost:8080/api/ingredients/${userId}`, {
          name: item.name, quantity: item.qty, unit: item.unit, category: item.cat, expiryDate: formattedDate
        })
      ));
      alert("냉장고 저장 완료!");
      navigate('/inventory');
    } catch (e) { alert("저장 실패"); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>재료 추가하기</h2>
      <input style={styles.searchBar} placeholder="재료 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      
      <div style={styles.tabContainer}>
        {Object.keys(itemDb).map(cat => (
          <button key={cat} onClick={() => setCurrentCategory(cat)} style={{...styles.tab, backgroundColor: currentCategory === cat ? '#2c3e50' : '#eee', color: currentCategory === cat ? '#fff' : '#000'}}>{cat}</button>
        ))}
      </div>

      {currentCategory === '육류' && (
        <div style={styles.subTabContainer}>
          {Object.keys(itemDb['육류']).map(sub => (
            <button key={sub} onClick={() => setCurrentSubCategory(sub)} style={{...styles.subTab, color: currentSubCategory === sub ? '#2c3e50' : '#888', borderBottom: currentSubCategory === sub ? '2px solid #2c3e50' : 'none'}}>{sub}</button>
          ))}
        </div>
      )}

      <div style={styles.grid}>
        {filteredItems.map(item => (
          <div key={item.name} onClick={() => toggleSelect(item)} style={{...styles.card, borderColor: tempSelected.find(i => i.name === item.name) ? '#ff6b6b' : '#f0f0f0'}}>
            <div style={styles.icon}>{item.icon}</div>
            <div style={styles.name}>{item.name}</div>
          </div>
        ))}
      </div>

      {tempSelected.length > 0 && (
        <div style={styles.bottomBar}>
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
  container: { maxWidth: '500px', margin: '0 auto', paddingBottom: '200px', color: '#000' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#000', fontWeight: 'bold' },
  searchBar: { width: '100%', padding: '12px', borderRadius: '15px', border: '1px solid #ddd', marginBottom: '20px', boxSizing: 'border-box', color: '#000' },
  tabContainer: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '15px', flexWrap: 'wrap' },
  tab: { padding: '8px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  subTabContainer: { display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', borderBottom: '1px solid #eee' },
  subTab: { padding: '5px 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  card: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 5px', backgroundColor: '#fff', borderRadius: '15px', border: '2px solid', cursor: 'pointer' },
  icon: { fontSize: '2rem' },
  name: { fontSize: '0.75rem', fontWeight: 'bold', color: '#000', textAlign: 'center' },
  bottomBar: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '500px', backgroundColor: '#fff', padding: '20px', borderRadius: '20px 20px 0 0', boxShadow: '0 -5px 15px rgba(0,0,0,0.1)' },
  selectedRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  rowName: { fontSize: '0.9rem', fontWeight: 'bold', color: '#000' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: { width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer', color: '#000', background: '#fff' },
  inputWrapper: { display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#f9f9f9', padding: '2px 8px', borderRadius: '8px', border: '1px solid #eee' },
  qtyInput: { width: '50px', border: 'none', background: 'none', textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold', color: '#000', outline: 'none' },
  unitText: { fontSize: '0.8rem', color: '#000', fontWeight: 'bold' },
  seasoningText: { fontSize: '0.85rem', color: '#2c3e50', fontWeight: 'bold' },
  submitBtn: { width: '100%', padding: '15px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }
};

export default AddIngredient;