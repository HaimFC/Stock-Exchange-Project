const API_KEY = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE";
const MAX = 3;

const grid = document.getElementById('compare-grid');
const note = document.getElementById('compare-note');
const pill = document.getElementById('symbols-pill');

function getSymbols() {
  const params = new URLSearchParams(location.search);
  const raw = (params.get('symbols') || '').trim();
  if (!raw) return [];
  return raw.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
}

function limitSymbols(symbols) {
  if (symbols.length <= MAX) return symbols;
  note.textContent = `You selected ${symbols.length} symbols. Showing the first ${MAX}.`;
  return symbols.slice(0, MAX);
}

async function fetchProfiles(symbols) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${symbols.join(',')}?apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return await res.json();
}

function fmtMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return 'N/A';
  const num = Number(n);
  if (num >= 1e12) return (num/1e12).toFixed(2) + 'T';
  if (num >= 1e9)  return (num/1e9).toFixed(2) + 'B';
  if (num >= 1e6)  return (num/1e6).toFixed(2) + 'M';
  if (num >= 1e3)  return (num/1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

function chip(val) {
  if (val === undefined || val === null || val === '') return '';
  const str = typeof val === 'number' ? `${val.toFixed(2)}%` : String(val);
  const cls = str.startsWith('-') ? 'down' : 'up';
  return `<span class="chip ${cls}">${str}</span>`;
}

function card(profile) {
  const {
    companyName, symbol, price, changesPercentage, image, website,
    mktCap, industry, sector, ceo, beta, volAvg, range, ipoDate
  } = profile || {};

  const sym = symbol || '';

  return `
    <div class="compare-card card">
      <div class="compare-header">
        <img class="logo" src="${image || ''}" alt="${sym} logo" onerror="this.style.display='none'"/>
        <div class="titles">
          <div class="name">${companyName || sym || 'Company'}</div>
          <div class="sym">(${sym})</div>
        </div>
      </div>

      <div class="kpis">
        <div class="row"><span>Price</span><strong>$${price != null ? Number(price).toFixed(2) : 'N/A'}</strong>${chip(changesPercentage)}</div>
        <div class="row"><span>Market Cap</span><strong>${fmtMoney(mktCap)}</strong></div>
        <div class="row"><span>Sector</span><strong>${sector || '—'}</strong></div>
        <div class="row"><span>Industry</span><strong>${industry || '—'}</strong></div>
        <div class="row"><span>CEO</span><strong>${ceo || '—'}</strong></div>
        <div class="row"><span>Beta</span><strong>${beta != null ? Number(beta).toFixed(2) : '—'}</strong></div>
        <div class="row"><span>Avg Vol</span><strong>${volAvg != null ? fmtMoney(volAvg) : '—'}</strong></div>
        <div class="row"><span>52W Range</span><strong>${range || '—'}</strong></div>
        <div class="row"><span>IPO</span><strong>${ipoDate || '—'}</strong></div>
      </div>

      <div class="btn-row">
        <a class="ghost-btn" href="company.html?symbol=${encodeURIComponent(sym)}">View</a>
        ${website ? `<a class="ghost-btn" href="${website}" target="_blank" rel="noopener">Website</a>` : ''}
      </div>
    </div>
  `;
}

async function main() {
  const raw = getSymbols();
  if (!raw.length) {
    note.textContent = 'No symbols to compare.';
    return;
  }

  const symbols = limitSymbols(raw);
  pill.innerHTML = symbols.map(s => `<span class="pill">${s}</span>`).join('');

  try {
    const profiles = await fetchProfiles(symbols);
    grid.innerHTML = profiles.map(card).join('');
  } catch (e) {
    console.error(e);
    note.textContent = 'Failed to load comparison data.';
  }
}

main();
