import { SearchResults } from './SearchResults.js';

export class SearchForm {
  constructor(container) {
    this.container = container;
    this.apiKey = "eZhpxtdkvM5eKOLwdmfzzKGRZjZg8nYE";
    this.searchInput = null;
    this.searchTimeout = null;
    this.resultsContainer = null;
  }

  render() {
    this.container.innerHTML = `
      <div class="search-form">
        <input type="text" id="searchInput" placeholder="Search companies...">
        <div id="resultsContainer" class="search-results"></div>
      </div>
    `;
    this.searchInput = this.container.querySelector("#searchInput");
    this.resultsContainer = this.container.querySelector("#resultsContainer");
    this.searchInput.addEventListener("input", () => this.debouncedSearch());
  }

  debouncedSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.performSearch(), 500);
  }

  async performSearch() {
    const query = this.searchInput.value.trim();
    if (!query) {
      this.resultsContainer.innerHTML = "";
      return;
    }

    const searchUrl = `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ&apikey=${this.apiKey}`;

    try {
      const res = await fetch(searchUrl);
      const searchResults = await res.json();

      if (!Array.isArray(searchResults)) {
        throw new Error("Expected an array but got: " + JSON.stringify(searchResults));
      }

      const symbols = searchResults.map(company => company.symbol);
      const profiles = await this.fetchProfiles(symbols);

      const results = new SearchResults(this.resultsContainer);
      results.render(profiles, query);
    } catch (err) {
      console.error("Search failed", err);
      this.resultsContainer.innerHTML = `<div class="search-error">Failed to search</div>`;
    }
  }

  async fetchProfiles(symbols) {
    const url = `https://financialmodelingprep.com/api/v3/profile/${symbols.join(",")}?apikey=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch profiles");
    const data = await res.json();
    return data;
  }
}
