// 다크모드 토글 버튼
const darkModeBtn = document.getElementById('darkModeBtn');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');

  darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});


// 공유 버튼
const shareBtn = document.getElementById('shareBtn');

shareBtn.addEventListener('click', () => {
  const currentUrl = window.location.href;

  navigator.clipboard.writeText(currentUrl)
    .then(() => alert('링크 복사완료!'))
    .catch(() => alert('링크 복사 실패ㅠㅠ'));
});


// 검색 기능
const searchInput = document.getElementById('searchInput');
const overlay = document.getElementById('overlay');
const searchModal = document.getElementById('searchModal');
const searchResults = document.getElementById('searchResults');
const searchCount = document.getElementById('searchCount');

searchInput.addEventListener('focus', () => {
  overlay.style.display = 'block';
  searchModal.style.display = 'block';
  searchInput.classList.add('expanded');
});

searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    overlay.style.display = 'none';
    searchModal.style.display = 'none';
    searchInput.classList.remove('expanded');
    searchResults.innerHTML = '';
    searchCount.textContent = '';
    searchInput.value = '';
  }, 200);
});

overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
  searchModal.style.display = 'none';
  searchInput.classList.remove('expanded');
  searchResults.innerHTML = '';
  searchCount.textContent = '';
  searchInput.value = '';
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '';
    searchCount.textContent = '';
    return;
  }

  const items = [...document.querySelectorAll('p, h1, h2, h3, li, span, div')];

  const filteredRaw = items.filter(item =>
    item.textContent.toLowerCase().includes(query)
  );
  // 중복 텍스트를 가진 아이템 제외
  const seen = new Set();
  const filtered = [];

for (const item of filteredRaw) {
  let text = item.textContent.trim();
  text = text.replace(/\s+/g, ' '); // 연속된 모든 공백(탭, 줄바꿈 등)을 하나의 공백으로 변환
  text = text.replace(/~+|—+|-+/g, ''); // 필요하면 특수문자 제거

  if (!seen.has(text)) {
    seen.add(text);
    filtered.push(item);
  }
}

  if (filtered.length === 0) {
    searchResults.innerHTML = '<li>검색 결과가 없습니다.</li>';
    searchCount.textContent = '검색 결과 0개';
    return;
  }

function highlight(text, keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<strong>$1</strong>');
}

// 문장 중 검색어 주변만 잘라서 보여줌
function getExcerpt(text, keyword, radius = 20) {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) return text.substring(0, 50); // 검색어 없으면 앞부분

  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + keyword.length + radius);

  return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
}

  searchResults.innerHTML = filtered.map(item => {
    const fullText = item.textContent.trim().replace(/~+|—+|-+/g, ''); // 줄긋기(strike-through) 흔한 특수문자 제거
    const excerpt = getExcerpt(fullText, query);
    const highlighted = highlight(excerpt, query);

    return `
      <li class="search-item" style="border-bottom:1px solid #ccc; padding: 10px 0;">
        <span>${highlighted}</span>
      </li>
    `;
  }).join('');
  
  searchCount.textContent = `검색 결과 ${filtered.length}개`;

});
