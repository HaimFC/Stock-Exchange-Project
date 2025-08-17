import { Marquee } from './Marquee.js';
import { SearchForm } from './SearchForm.js';
import { SearchResults } from './SearchResults.js';
import { CompareListManager } from './CompareListManager.js';

const marqueeElement = document.getElementById('marquee-container');
const searchContainer = document.getElementById('search-container');
const resultsContainer = document.getElementById('results-container');
const compareBarContainer = document.getElementById('compare-bar');

const marquee = new Marquee(marqueeElement);
marquee.loadAndRender();

const compareManager = new CompareListManager(compareBarContainer);

const results = new SearchResults(resultsContainer);
results.setCompareCallback(profile => {
  compareManager.addCompany(profile);
});

const searchForm = new SearchForm(searchContainer);
searchForm.render();
searchForm.resultsContainer = resultsContainer;
searchForm.results = results;
