// ---------------- DOM 요소 캐싱 ----------------
const body = document.body;
const shareBtn = document.getElementById('shareBtn');
const searchInput = document.getElementById('searchInput');
const overlay = document.getElementById('overlay');
const searchModal = document.getElementById('searchModal');
const searchResults = document.getElementById('searchResults');
const searchCount = document.getElementById('searchCount');
const darkModeToggle = document.getElementById('darkModeToggle');
const contentArea = document.querySelector("main") || body;

// ---------------- 검색 가능한 요소 캐싱 ----------------
const searchableItems = [...contentArea.querySelectorAll('p, h1, h2, h3, li, span, div')];

// ---------------- 헬퍼 함수 ----------------
function resetSearch() {
  overlay.style.display = 'none';
  searchModal.style.display = 'none';
  searchInput.classList.remove('expanded');
  searchResults.innerHTML = '';
  searchCount.textContent = '';
  searchInput.value = '';
}

function highlightText(text, keyword) {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const parts = [];
  let lastIndex = 0;
  let index;

  while ((index = lowerText.indexOf(lowerKeyword, lastIndex)) !== -1) {
    if (index > lastIndex) parts.push(document.createTextNode(text.substring(lastIndex, index)));
    const strong = document.createElement('strong');
    strong.textContent = text.substring(index, index + keyword.length);
    strong.classList.add('highlight');
    parts.push(strong);
    lastIndex = index + keyword.length;
  }
  if (lastIndex < text.length) parts.push(document.createTextNode(text.substring(lastIndex)));
  return parts;
}

function getFilteredItems(query) {
  const seen = new Set();
  const filtered = [];

  for (const item of searchableItems) {
    let text = item.textContent.trim().replace(/\s+/g, ' ').replace(/~+|—+|-+/g, '');
    if (text.toLowerCase().includes(query) && !seen.has(text)) {
      seen.add(text);
      filtered.push(item);
    }
  }
  return filtered;
}

function renderResults(filtered, query) {
  searchResults.innerHTML = '';
  const fragment = document.createDocumentFragment();
  filtered.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('search-item');
    li.style.borderBottom = '1px solid #ccc';
    li.style.padding = '10px 0';
    highlightText(item.textContent, query).forEach(node => li.appendChild(node));
    fragment.appendChild(li);
  });
  searchResults.appendChild(fragment);
  searchCount.textContent = `검색 결과 ${filtered.length}개`;
}

// ---------------- 다크모드 ----------------
darkModeToggle.addEventListener('change', () => {
  const isDark = darkModeToggle.checked;
  body.classList.toggle('dark-mode', isDark);
  body.classList.toggle('light-mode', !isDark);
});

// ---------------- 공유 버튼 ----------------
shareBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => alert('링크 복사 완료!'))
    .catch(() => alert('링크 복사 실패ㅠㅠ'));
});

// ---------------- 검색 이벤트 ----------------
searchInput.addEventListener('focus', () => {
  overlay.style.display = 'block';
  searchModal.style.display = 'block';
  searchInput.classList.add('expanded');
});

searchInput.addEventListener('blur', () => setTimeout(resetSearch, 200));

overlay.addEventListener('click', resetSearch);

// ESC 키 눌러서 검색 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") resetSearch();
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '<li>검색 결과가 없습니다.</li>';
    searchCount.textContent = '검색 결과 0개';
    return;
  }

  const filtered = getFilteredItems(query);

  if (filtered.length === 0) {
    searchResults.innerHTML = '<li>검색 결과가 없습니다.</li>';
    searchCount.textContent = '검색 결과 0개';
    return;
  }

  renderResults(filtered, query);
});
