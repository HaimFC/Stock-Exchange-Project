export class CompareListManager {
  constructor(container) {
    this.container = container;
    this.selectedCompanies = new Map();
  }

  addCompany(profile) {
    if (this.selectedCompanies.has(profile.symbol)) return;

    this.selectedCompanies.set(profile.symbol, profile);
    console.log('Added:', profile.symbol); // for debug
    this.render();
  }

  removeCompany(symbol) {
    this.selectedCompanies.delete(symbol);
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'compare-bar-inner';

    for (const [symbol, profile] of this.selectedCompanies) {
      const btn = document.createElement('button');
      btn.className = 'compare-item';
      btn.textContent = symbol;

      const close = document.createElement('span');
      close.textContent = ' ×';
      close.className = 'remove-x';
      close.onclick = () => this.removeCompany(symbol);

      btn.appendChild(close);
      inner.appendChild(btn);
    }

    if (this.selectedCompanies.size > 0) {
      const compareBtn = document.createElement('a');
      compareBtn.className = 'compare-final-button';
      compareBtn.textContent = 'Compare →';
      compareBtn.href = `compare.html?symbols=${[...this.selectedCompanies.keys()].join(',')}`;
      inner.appendChild(compareBtn);
    }

    this.container.appendChild(inner);
  }
}
