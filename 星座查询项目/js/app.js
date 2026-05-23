document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initQueryTab();
  initCompatibilityTab();
  initHoroscopeTab();
});

// ========== Tab 切换 ==========
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

// ========== 星座查询 ==========
function initQueryTab() {
  const dateInput = document.getElementById('birthDate');

  document.getElementById('queryBtn').addEventListener('click', () => {
    const dateVal = dateInput.value.trim();
    if (!dateVal) {
      showToast('请输入你的生日日期');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
      showToast('日期格式错误，请输入如 1990-05-20');
      return;
    }
    const parts = dateVal.split('-');
    const year = parseInt(parts[0]), month = parseInt(parts[1]), day = parseInt(parts[2]);
    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
      showToast('日期不存在，请检查后重新输入');
      return;
    }
    const currentYear = new Date().getFullYear();
    if (year < 1990 || year > currentYear) {
      showToast('年份需在 1990 ~ ' + currentYear + ' 之间');
      return;
    }
    const zodiac = queryZodiac(month, day);
    showQueryResult(zodiac);
    showZodiacDetail(zodiac);
  });

  // 支持回车查询
  dateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('queryBtn').click();
  });
}

function queryZodiac(month, day) {
  for (const z of zodiacData) {
    if (z.startMonth === 12 && z.endMonth === 1) {
      // 摩羯座跨年：12/22 - 1/19
      if ((month === 12 && day >= z.startDay) || (month === 1 && day <= z.endDay)) {
        return z;
      }
    } else {
      if (
        (month === z.startMonth && day >= z.startDay) ||
        (month === z.endMonth && day <= z.endDay)
      ) {
        return z;
      }
    }
  }
  return null;
}

function showQueryResult(zodiac) {
  const resultDiv = document.getElementById('queryResult');
  resultDiv.innerHTML = `
    <div class="result-card fade-in">
      <div class="zodiac-symbol-large">${zodiac.symbol}</div>
      <h2>${zodiac.name}</h2>
      <p class="zodiac-name-en">${zodiac.nameEn}</p>
      <p class="zodiac-date">${zodiac.dateRange}</p>
      <div class="element-badge">${zodiac.elementIcon} ${zodiac.element}象星座</div>
    </div>
  `;
  resultDiv.style.display = 'block';
}

function showZodiacDetail(zodiac) {
  const detailDiv = document.getElementById('zodiacDetail');
  detailDiv.innerHTML = `
    <div class="detail-card fade-in">
      <h3>详细资料</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">守护星</span>
          <span class="detail-value">${zodiac.ruler}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">星座属性</span>
          <span class="detail-value">${zodiac.quality}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">幸运颜色</span>
          <span class="detail-value">${zodiac.luckyColor}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">幸运数字</span>
          <span class="detail-value">${zodiac.luckyNumber}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">守护宝石</span>
          <span class="detail-value">${zodiac.luckyGem}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">性格特质</span>
          <span class="detail-value">${zodiac.traits.join('、')}</span>
        </div>
      </div>
      <div class="detail-desc">
        <p>${zodiac.description}</p>
      </div>
    </div>
  `;
  detailDiv.style.display = 'block';
}

// ========== 星座配对 ==========
function initCompatibilityTab() {
  const select1 = document.getElementById('zodiacSelect1');
  const select2 = document.getElementById('zodiacSelect2');

  zodiacData.forEach(z => {
    const opt1 = document.createElement('option');
    opt1.value = z.id;
    opt1.textContent = z.symbol + ' ' + z.name;
    select1.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = z.id;
    opt2.textContent = z.symbol + ' ' + z.name;
    select2.appendChild(opt2);
  });

  // 默认选不同
  select2.value = '1';

  document.getElementById('matchBtn').addEventListener('click', () => {
    const z1 = zodiacData[parseInt(select1.value)];
    const z2 = zodiacData[parseInt(select2.value)];
    showCompatibilityResult(z1, z2);
  });
}

function showCompatibilityResult(z1, z2) {
  const score = compatibilityData[z1.id][z2.id];
  const category = getCompatibilityCategory(score);
  const descs = compatibilityDesc[category];
  const desc = descs[Math.floor(Math.random() * descs.length)];

  let levelText, levelColor;
  if (score >= 85) { levelText = '天作之合'; levelColor = '#ffd700'; }
  else if (score >= 70) { levelText = '非常般配'; levelColor = '#4caf50'; }
  else if (score >= 55) { levelText = '需要磨合'; levelColor = '#ff9800'; }
  else { levelText = '挑战较大'; levelColor = '#f44336'; }

  const resultDiv = document.getElementById('matchResult');
  resultDiv.innerHTML = `
    <div class="match-card fade-in">
      <div class="match-pair">
        <div class="match-zodiac">
          <span class="match-symbol">${z1.symbol}</span>
          <span>${z1.name}</span>
        </div>
        <div class="match-heart">❤️</div>
        <div class="match-zodiac">
          <span class="match-symbol">${z2.symbol}</span>
          <span>${z2.name}</span>
        </div>
      </div>
      <div class="match-score" style="color: ${levelColor}">
        <span class="score-number">${score}</span>
        <span class="score-total">/ 100</span>
      </div>
      <div class="match-level" style="background: ${levelColor}20; color: ${levelColor}">
        ${levelText}
      </div>
      <p class="match-desc">${desc}</p>
      <p class="match-tip">💡 ${getCompatibilityTip(z1, z2)}</p>
    </div>
  `;
  resultDiv.style.display = 'block';
}

function getCompatibilityTip(z1, z2) {
  const tips = [
    `多了解${z2.name}的${z2.element}象特质，有助于增进你们之间的理解。`,
    `${z1.name}可以多向${z2.name}学习对方的优点，互补才是最佳相处之道。`,
    `建议${z1.name}和${z2.name}多进行深入沟通，坦诚是感情最好的催化剂。`,
    `试着一起做一些两个人都感兴趣的事情吧，共同的爱好能让关系更紧密。`
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

// ========== 每日运势 ==========
function initHoroscopeTab() {
  const select = document.getElementById('horoscopeSelect');
  zodiacData.forEach(z => {
    const opt = document.createElement('option');
    opt.value = z.id;
    opt.textContent = z.symbol + ' ' + z.name;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    const zodiac = zodiacData[parseInt(select.value)];
    showHoroscope(zodiac);
  });

  // 首次加载：显示今日运势（默认白羊座）
  showHoroscope(zodiacData[0]);
}

function showHoroscope(zodiac) {
  const today = new Date();
  const dateStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const seed = dateStr + zodiac.name;

  const categories = ['综合运势', '爱情运势', '事业运势', '健康运势', '财运运势'];
  const resultDiv = document.getElementById('horoscopeResult');

  let html = `<div class="horoscope-card fade-in">
    <div class="horoscope-header">
      <span class="horoscope-symbol">${zodiac.symbol}</span>
      <div>
        <h3>${zodiac.name} 今日运势</h3>
        <p class="horoscope-date">${dateStr}</p>
      </div>
    </div>
    <div class="horoscope-grid">`;

  categories.forEach(cat => {
    const level = seededRandom(seed + cat, 1, 5);
    const text = getSeededHoroscope(cat, level, seed);
    html += `
      <div class="horoscope-item">
        <div class="horoscope-cat">${cat}</div>
        <div class="stars">${renderStars(level)}</div>
        <p class="horoscope-text">${text}</p>
      </div>`;
  });

  html += '</div></div>';
  resultDiv.innerHTML = html;
  resultDiv.style.display = 'block';
}

function seededRandom(seed, min, max) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const rand = Math.abs(Math.sin(hash) * 10000) % 1;
  return Math.floor(rand * (max - min + 1)) + min;
}

function getSeededHoroscope(category, level, seed) {
  const templates = horoscopeTemplates[category][level];
  const idx = seededRandom(seed + category, 0, templates.length - 1);
  return templates[idx];
}

function renderStars(count) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    html += i < count ? '<span class="star filled">★</span>' : '<span class="star empty">☆</span>';
  }
  return html;
}

// ========== Toast 提示 ==========
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
