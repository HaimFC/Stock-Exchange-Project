import { SearchResults } from './SearchResults.js';

export class SearchForm {
  constructor(container, { onCompare } = {}) {
    this.container = container;
    this.apiKey = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE";
    this.searchInput = null;
    this.searchTimeout = null;
    this.resultsContainer = null;
    this.results = null;
    this.onCompare = typeof onCompare === 'function' ? onCompare : () => {};
  }

  setResults(resultsInstance) {
    this.results = resultsInstance;
  }

  render() {
    this.container.innerHTML = `
      <div class="search-form">
        <input type="text" id="searchInput" placeholder="Search companies..." autocomplete="off">
        <div id="resultsContainer" class="search-results"></div>
      </div>
    `;
    this.searchInput = this.container.querySelector("#searchInput");
    this.resultsContainer = this.container.querySelector("#resultsContainer");
    this.searchInput.addEventListener("input", () => this.debouncedSearch());
  }

  debouncedSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.performSearch(), 400);
  }

  async performSearch() {
    const query = this.searchInput.value.trim();
    if (!query) {
      this.resultsContainer.innerHTML = "";
      return;
    }

    const searchUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10&exchange=NASDAQ&apikey=${this.apiKey}`;

    try {
      const res = await fetch(searchUrl);
      const searchResults = await res.json();
      if (!Array.isArray(searchResults)) throw new Error("Search API did not return an array");

      const symbols = searchResults.map(company => company.symbol).filter(Boolean);
      if (!symbols.length) {
        this.resultsContainer.innerHTML = `<div class="empty">No results</div>`;
        return;
      }

      const profiles = await this.fetchProfiles(symbols);

      this.results.setCompareCallback(this.onCompare);
      this.results.container = this.resultsContainer; 
      this.results.render(profiles, query);
    } catch (err) {
      console.error("Search failed", err);
      this.resultsContainer.innerHTML = `<div class="search-error">Failed to search</div>`;
    }
  }

  async fetchProfiles(symbols) {
    const url = `https://financialmodelingprep.com/api/v3/profile/${symbols.join(",")}?apikey=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch profiles");
    return await res.json();
  }
}
