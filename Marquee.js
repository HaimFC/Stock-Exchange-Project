export class Marquee {
  constructor(container) {
    this.container = container;
    this.symbols = [
      "AAPL", "MSFT", "GOOG", "TSLA", "NVDA",
      "AMZN", "META", "NFLX", "AMD", "INTC"
    ]; // max 10
    this.apiKey = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE";
  }

  async loadAndRender() {
    const url = `https://financialmodelingprep.com/api/v3/quote/${this.symbols.join(",")}?apikey=${this.apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected an array but got: " + JSON.stringify(data));
      }

      const items = data.map(item => {
        const price = item.price?.toFixed(2) ?? "N/A";
        const change = item.changesPercentage !== undefined
          ? `${item.changesPercentage.toFixed(2)}%`
          : "N/A";
        return `<span>${item.symbol}: $${price} (${change})</span>`;
      }).join(' • ');

      const wrapper = document.createElement('div');
      wrapper.classList.add('marquee');
      wrapper.innerHTML = `<div class="marquee-content">${items}</div>`;

      this.container.appendChild(wrapper);
    } catch (err) {
      console.error("Marquee fetch failed:", err);
      this.container.innerHTML = `<div class="marquee-error">Failed to load stock data</div>`;
    }
  }
}
