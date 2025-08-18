(function () {
  const params = new URLSearchParams(window.location.search);
  const symbol = (params.get('symbol') || '').trim();

  const container = document.getElementById('company-container');

  if (!symbol) {
    container.innerHTML = "<p class='error'>Missing symbol in URL.</p>";
    return;
  }

  try {
    const page = new CompanyInfo(container, symbol);
    page.load(); 
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p class='error'>Failed to initialize company page.</p>";
  }
})();
