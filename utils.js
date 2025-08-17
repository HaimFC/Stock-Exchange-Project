async function fetchCompanyProfiles(symbols) {
  const chunks = chunkArray(symbols, 10);
  const requests = chunks.map(chunk => {
    const joined = chunk.join(',');
    return fetch(`https://financialmodelingprep.com/api/v3/profile/${joined}?apikey=demo`)
      .then(res => res.json());
  });

  const allResults = await Promise.all(requests);
  return allResults.flat();
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
