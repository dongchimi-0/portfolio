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

// ---------------- 프로젝트 모달 ----------------
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('projectModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalLinks = document.getElementById('modalLinks');
const modalClose = projectModal.querySelector('.close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentImages = [];
let currentIndex = 0;

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    const img = card.getAttribute('data-img');
    const extra = card.getAttribute('data-extra')?.split(',') || [];
    const tags = card.getAttribute('data-tags')?.split(',') || [];
    const links = JSON.parse(card.getAttribute('data-links'));

    // 이미지 배열 (메인 + 추가)
    currentImages = [img, ...extra.filter(x => x.trim() !== '')];
    currentIndex = 0;

    modalImg.src = currentImages[currentIndex];
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    // 태그
    modalTags.innerHTML = '';
    tags.forEach(t => {
      const span = document.createElement('span');
      span.textContent = t.trim();
      modalTags.appendChild(span);
    });

    // 링크 버튼
    modalLinks.innerHTML = '';
    links.forEach(link => {
      const a = document.createElement('a');
      a.textContent = link.text;
      a.href = link.url;
      a.target = "_blank";
      // 클래스 자동 지정
      if (link.text.includes('Demo')) a.classList.add('demo');
      else if (link.text.includes('GitHub')) a.classList.add('github');
      else if (link.text.includes('Notion')) a.classList.add('notion');
      else a.classList.add('pdf');
      modalLinks.appendChild(a);
    });

    projectModal.classList.add('show');
  });
});

// 슬라이드 이동
prevBtn.addEventListener('click', () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

nextBtn.addEventListener('click', () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

modalClose.addEventListener('click', () => projectModal.classList.remove('show'));
projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) projectModal.classList.remove('show');
});

// ===== 스크롤 진행 바 =====
const scrollBar = document.querySelector('.scroll-bar');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollBar.style.width = scrollPercent + '%';
});

// ===== 스크롤 등장 애니메이션 =====
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // 한 번만 실행되게
    }
  });
}, { threshold: 0.2 }); // 20% 이상 보일 때 트리거

fadeEls.forEach(el => observer.observe(el));

// ===== Hero Typing + 이미지 전환 + Exit =====
const typingText = document.getElementById("typing-text");
const heroImg = document.getElementById("heroImg");
const hero = document.getElementById("hero");

const lines = ["안녕하세요,", "웹 개발자 윤동주입니다."];
let line = 0, idx = 0;

function typeEffect() {
  if (line < lines.length) {
    if (idx < lines[line].length) {
      typingText.innerHTML += lines[line][idx];
      idx++;
      setTimeout(typeEffect, 120);
    } else {
      typingText.innerHTML += "<br>";
      line++;
      idx = 0;

      // 두 번째 줄 시작 전 이미지 전환 (👋)
      if (line === 1) {
        heroImg.src = "assets/hi.png";
      }

      setTimeout(typeEffect, 400);
    }
  } else {
    // Hero 퇴장 애니메이션
    setTimeout(() => {
      hero.classList.add("hero-exit");
      setTimeout(() => hero.remove(), 1500);
    }, 1000);
  }
}

typeEffect();

