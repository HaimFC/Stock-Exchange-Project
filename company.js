const API_KEY = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE";

const el = {
  main: document.getElementById("mainCompanyPage"),
  loading: document.getElementById("loading"),
};

function getSymbolFromQuery() {
  const params = new URLSearchParams(location.search);
  return params.get("symbol");
}

async function fetchCompanyProfile(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error fetching company profile");
  const data = await res.json();
  return data[0]; // response is an array
}

async function fetchHistoricalPrices(symbol) {
  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error fetching historical prices");
  const data = await res.json();
  return data.historical;
}

function createCompanyDOM(profile) {
  const container = document.createElement("div");
  container.classList.add("company-profile");

  const img = document.createElement("img");
  img.src = profile.image;
  img.alt = "Company Logo";
  img.width = 100;

  const name = document.createElement("h1");
  name.textContent = profile.companyName;

  const desc = document.createElement("p");
  desc.textContent = profile.description;

  const link = document.createElement("a");
  link.href = profile.website;
  link.textContent = "Visit Website";
  link.target = "_blank";

  const stock = document.createElement("h2");
  stock.textContent = `Stock Price: $${profile.price}`;

  const change = document.createElement("span");
  if (typeof profile.changesPercentage === "string") {
    change.textContent = ` (${profile.changesPercentage})`;
    change.style.color = profile.changesPercentage.includes("+")
      ? "lightgreen"
      : "red";
  } else {
    change.textContent = " (No change data)";
    change.style.color = "gray";
  }

  const chart = document.createElement("canvas");
  chart.id = "chart";

  container.append(img, name, desc, link, stock, change, chart);
  return container;
}

function renderChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  const labels = data.map((point) => point.date).reverse();
  const prices = data.map((point) => point.close).reverse();

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Stock Price",
          data: prices,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true },
      },
    },
  });
}

async function initCompanyPage() {
  const symbol = getSymbolFromQuery();
  if (!symbol) {
    el.main.innerHTML = "<p>Missing symbol in URL.</p>";
    return;
  }

  try {
    const profile = await fetchCompanyProfile(symbol);
    const historical = await fetchHistoricalPrices(symbol);

    el.loading.remove(); // hide loading indicator

    const dom = createCompanyDOM(profile);
    el.main.appendChild(dom);

    renderChart("chart", historical);
  } catch (err) {
    console.error(err);
    el.main.innerHTML = "<p class='error'>Failed to load company data.</p>";
  }
}

initCompanyPage();
