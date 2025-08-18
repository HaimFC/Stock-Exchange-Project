class CompanyInfo {
  constructor(container, symbol) {
    this.container = container;
    this.symbol = symbol;
    this.apiKey = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE";
    this.profile = null;
    this.historical = [];
  }

  async load() {
    if (!this.symbol) {
      this.container.innerHTML = "<p class='error'>Missing symbol in URL.</p>";
      return;
    }

    try {
      await this.fetchProfile();
      await this.fetchHistoricalPrices();
      this.render();
      await this.addChart(); 
    } catch (err) {
      console.error("Load error:", err);
      this.container.innerHTML = "<p class='error'>Failed to load company data.</p>";
    }
  }

  async fetchProfile() {
    const url = `https://financialmodelingprep.com/api/v3/profile/${this.symbol}?apikey=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error fetching company profile");
    const data = await res.json();
    this.profile = data[0];
  }

  async fetchHistoricalPrices() {
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${this.symbol}?serietype=line&apikey=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error fetching historical prices");
    const data = await res.json();
    this.historical = Array.isArray(data.historical) ? data.historical : [];
  }

  render() {
    const p = this.profile || {};
    const wrap = document.createElement("div");
    wrap.classList.add("company-profile", "card");

    const header = document.createElement("div");
    header.className = "company-header";

    const img = document.createElement("img");
    img.src = p.image || "";
    img.alt = "Company Logo";
    img.width = 72;
    img.height = 72;
    img.onerror = () => (img.style.display = "none");

    const titleWrap = document.createElement("div");
    titleWrap.className = "company-title";

    const name = document.createElement("h1");
    name.textContent = p.companyName || p.symbol || "Company";

    const stock = document.createElement("div");
    stock.className = "price-row";
    const priceText = `Price: $${Number(p.price ?? 0).toFixed(2)}`;
    let change = "";
    if (typeof p.changesPercentage === "number") change = `${p.changesPercentage.toFixed(2)}%`;
    else if (typeof p.changesPercentage === "string") change = p.changesPercentage;
    stock.innerHTML = `<span>${priceText}</span>${
      change ? `<span class="chip ${String(change).startsWith("-") ? "down" : "up"}">${change}</span>` : ""
    }`;

    titleWrap.append(name, stock);
    header.append(img, titleWrap);

    const desc = document.createElement("p");
    desc.textContent = p.description || "";

    const link = document.createElement("a");
    link.href = p.website || "#";
    link.textContent = "Visit Website";
    link.target = "_blank";
    link.className = "ghost-btn";

    const chart = document.createElement("canvas");
    chart.id = "chart";

    wrap.innerHTML = "";
    wrap.append(header, desc, link, chart);
    this.container.innerHTML = "";
    this.container.appendChild(wrap);
  }

  async addChart() {
    const canvas = document.getElementById("chart");
    if (!canvas || !this.historical.length) return;

    const ctx = canvas.getContext("2d");
    const labels = this.historical.map(pt => pt.date).reverse();
    const prices = this.historical.map(pt => pt.close).reverse();

    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Stock Price",
          data: prices,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: true },
        scales: {
          xAxes: [{ display: true, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }],
          yAxes: [{ display: true }]
        }
      }
    });
  }
}
