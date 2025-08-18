export class SearchResults {
  constructor(container) {
    this.container = container;
    this.onCompareClick = () => {};
  }

  setCompareCallback(cb) {
    this.onCompareClick = cb || (() => {});
  }

  // --- helpers ---
  escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  escapeRegExp(str = "") {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  highlight(text = "", query = "") {
    if (!query) return this.escapeHtml(text);
    const safe = this.escapeHtml(text);
    const re = new RegExp(`(${this.escapeRegExp(query)})`, "ig");
    return safe.replace(re, `<span class="hl">$1</span>`);
  }
  deriveChangePct(profile) {
    const cp = profile?.changesPercentage;
    if (typeof cp === "number" && isFinite(cp)) return cp;
    if (typeof cp === "string" && cp.trim()) {
      const n = parseFloat(cp.replace('%',''));
      if (!Number.isNaN(n)) return n;
    }
    const { changes, price } = profile || {};
    if (typeof changes === "number" && typeof price === "number" && isFinite(price) && price !== 0) {
      return (changes / price) * 100;
    }
    return null;
  }
  chipHtml(pct) {
    if (pct === null) return "";
    const signClass = pct < 0 ? "down" : "up";
    return `<span class="chip ${signClass}">${pct.toFixed(2)}%</span>`;
  }
  // ----------------

  render(profiles, query = "") {
    this.container.innerHTML = "";

    profiles.forEach(profile => {
      const item = document.createElement("div");
      item.className = "result-item card";

      const nameRaw = profile.companyName || profile.name || "N/A";
      const symbolRaw = profile.symbol || "N/A";
      const imgSrc = profile.image || "";
      const website = profile.website || "";

      const priceTxt =
        profile.price !== undefined && profile.price !== null
          ? `$${Number(profile.price).toFixed(2)}`
          : "N/A";

      const pct = this.deriveChangePct(profile);

      item.innerHTML = `
        <div class="result-media">
          <img src="${imgSrc}" alt="${this.escapeHtml(symbolRaw)} logo" onerror="this.style.display='none'">
        </div>
        <div class="result-body">
          <h3 class="result-title">
            ${this.highlight(nameRaw, query)}
            <span class="ticker">(${this.highlight(symbolRaw, query)})</span>
          </h3>
          <p class="muted">
            <strong>Price:</strong> ${priceTxt}
            ${this.chipHtml(pct)}
          </p>
          <div class="actions">
            <button class="compare-btn">Compare</button>
            <a class="ghost-btn" href="company.html?symbol=${encodeURIComponent(symbolRaw)}">View</a>
            ${website ? `<a class="ghost-btn" href="${this.escapeHtml(website)}" target="_blank" rel="noopener">Site</a>` : ""}
          </div>
        </div>
      `;

      item.querySelector(".compare-btn").onclick = () => this.onCompareClick(profile);
      this.container.appendChild(item);
    });
  }
}
