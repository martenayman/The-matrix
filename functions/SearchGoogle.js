module.exports =  async function searchGoogle(query,API_KEY,CX) {
  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`
  );
  const data = await res.json();
  console.log(data.items.map(item => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet
})));
return data
}