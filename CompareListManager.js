export class CompareListManager {
  constructor(container) {
    this.container = container;
    this.selectedCompanies = new Map();
    this.MAX = 3;
    this.messageTimer = null;
  }

  addCompany(profile) {
    if (!profile || !profile.symbol) return;

    if (this.selectedCompanies.has(profile.symbol)) return;

    if (this.selectedCompanies.size >= this.MAX) {
      this.flashMessage(`You can compare up to ${this.MAX} companies`);
      return;
    }

    this.selectedCompanies.set(profile.symbol, profile);
    this.render();
  }

  removeCompany(symbol) {
    this.selectedCompanies.delete(symbol);
    this.render();
  }

  flashMessage(text) {
    if (!this.container) return;
    clearTimeout(this.messageTimer);
    let el = this.container.querySelector('.compare-msg');
    if (!el) {
      el = document.createElement('div');
      el.className = 'compare-msg';
      this.container.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    this.messageTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  render() {
    this.container.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'compare-bar-inner';

    for (const [symbol] of this.selectedCompanies) {
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
      compareBtn.title = this.selectedCompanies.size > 1 ? 'Open comparison' : 'Compare selected';
      inner.appendChild(compareBtn);
    }

    const hint = document.createElement('div');
    hint.className = 'compare-hint';
    hint.textContent = `${this.selectedCompanies.size}/${this.MAX} selected`;
    inner.appendChild(hint);

    this.container.appendChild(inner);
  }
}
