// ---------- Constants ----------

const API_KEY = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE"
data=[
  {
    symbol: 'AAL',
    name: 'American Airlines Group Inc.',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Select',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAXJ',
    name: 'iShares MSCI All Country Asia ex Japan ETF',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAWW',
    name: 'Atlas Air Worldwide Holdings, Inc.',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Select',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAVM',
    name: 'Alpha Architect Global Factor Equity ETF',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AARD',
    name: 'Aardvark Therapeutics, Inc. Common Stock',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Select',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAPU',
    name: 'Direxion Daily AAPL Bull 1.5X Shares',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Select',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAPG',
    name: 'Ascentage Pharma Group International',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAPD',
    name: 'Direxion Daily AAPL Bear 1X Shares',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ'
  },
  {
    symbol: 'AAPB',
    name: 'GraniteShares ETF Trust - GraniteShares 2x Long Tilray Daily ETF',
    currency: 'USD',
    stockExchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ'
  }
]

const el = {
    mainPage: document.getElementById("mainPage"),
    listView : document.getElementById("stocksList"),
    searchButton : document.getElementById("searchButton"),
    searchBar : document.getElementById("searchBar")
}

const elC = {
    mainPage: document.getElementById("mainCompanyPage")
}

// ---------- Model ----------

async function getData({ query, limit = 10, exchange = "NASDAQ" }) {
    const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=${limit}&exchange=${encodeURIComponent(exchange)}&apikey=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    return res.json();
}
async function getProfile(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${encodeURIComponent(symbol)}?apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}


// ---------- View ----------
const view = {
  displayList(listElement, items) {
    listElement.innerHTML = "";
    const frag = document.createDocumentFragment();
    items.forEach((stock) => {
      const li = document.createElement("li");
      li.classList.add("stock");
      const a = document.createElement("a");
      a.href = `company.html?symbol=${encodeURIComponent(stock.symbol)}`;
      a.textContent = `${stock.name} (${stock.symbol})`;
      a.target = "_self";

      li.appendChild(a);
      frag.appendChild(li);
    });

    listElement.appendChild(frag);
  },

  displayCompany(mainPage, stock){
    let urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('action');
    mainPage.innerHTML = "";

    const frag = document.createDocumentFragment();
    const image = document.createElement("img");
    const companyHeader = document.createElement("h1");
    const stockPrice = document.createElement("h3");
    const stockChange = document.createElement("h3");
    const stockParagrah = document.createElement("p");
    
    companyHeader.innerText = stock.companyName;
    image.src = stock.image;
    stockPrice.innerText = `Stock price: ${stock.price}`;
    stockChange.innerText = `(${stock.changes}%)`;
    stockParagrah.innerText = stock.description;

    frag.appendChild(companyHeader);
    frag.appendChild(image);
    frag.appendChild(stockPrice);
    frag.appendChild(stockChange);
    frag.appendChild(stockParagrah);

    mainPage.appendChild(frag);
  }
};

// ---------- Controller ----------
function controller() {
  if (el.searchButton && el.listView) {
    el.searchButton.addEventListener("click", onSearch);
  }

  if (elC.mainPage) {
    initCompanyPage();
  }
}
// ---------- Helping Functions ----------

async function onSearch() {
    const q = el.searchBar.value.trim() || "";

    el.searchButton.disabled = true;    
    el.searchButton.textContent = 'Loading...';

    try {
        const items = await getData({ query: q, limit: 10, exchange: "NASDAQ" });
        view.displayList(el.listView, items);

    }
    catch (e) {
        console.error(e);
        el.listView.innerHTML = '<li class="error">Error loading data</li>';
    } 
    finally {
        el.searchButton.disabled = false;
        el.searchButton.textContent = 'Search';
    }
}

function initCompanyPage() {
    const params = new URLSearchParams(location.search);
    const symbol = params.get('symbol');
    if (!symbol) {
        elC.mainPage.textContent = 'Missing symbol';
        return;
    }
    onLinkStock(symbol);
}

async function onLinkStock(symbol) {
    try {
        console.log(symbol)
        const arr = await getProfile(symbol);
        const stockData = arr[0];
        console.log(stockData)
        view.displayCompany(elC.mainPage, stockData);
        
    } catch (e) {
        console.error(e);
        elC.mainPage.innerHTML = '<p class="error">Error loading company data</p>';
    }
}
controller();
