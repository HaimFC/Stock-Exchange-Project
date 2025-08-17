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
    this.historical = data.historical;
  }

  render() {
    const profile = this.profile;
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
      change.style.color = profile.changesPercentage.includes("+") ? "lightgreen" : "red";
    } else {
      change.textContent = " (No change data)";
      change.style.color = "gray";
    }

    const chart = document.createElement("canvas");
    chart.id = "chart";

    container.append(img, name, desc, link, stock, change, chart);
    this.container.appendChild(container);
  }

  async addChart() {
    const ctx = document.getElementById("chart").getContext("2d");
    const labels = this.historical.map(point => point.date).reverse();
    const prices = this.historical.map(point => point.close).reverse();

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
        }]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{ display: true }],
          yAxes: [{ display: true }]
        }
      }
    });
  }
}
