export class SearchResults {
  constructor(container) {
    this.container = container;
    this.onCompareClick = () => {};
  }

  setCompareCallback(cb) {
    this.onCompareClick = cb;
  }

  render(profiles, query = '') {
    this.container.innerHTML = '';

    profiles.forEach(profile => {
      const item = document.createElement('div');
      item.className = 'result-item';

      const name = profile.companyName || profile.name || 'N/A';
      const symbol = profile.symbol || 'N/A';
      const price = profile.price !== undefined ? `$${profile.price}` : 'N/A';

      item.innerHTML = `
        <div class="result-info">
          <h3>${name} (${symbol})</h3>
          <p><strong>Price:</strong> ${price}</p>
          <button class="compare-btn">Compare</button>
        </div>
      `;

      item.querySelector('.compare-btn').onclick = () => this.onCompareClick(profile);
      this.container.appendChild(item);
    });
  }
}
