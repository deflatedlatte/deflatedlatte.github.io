"use strict";

/*
async function getSearchIndex() {
  const cache = window.localStorage.getItem("searchIndex");
  if (cache)
    return JSON.parse(cache);
  const fetchResult = await fetch("/index.json").then((r) => r.json());
  fetchResult["_fetchTime"] = new Date().getTime();
  window.localStorage.setItem("searchIndex", JSON.stringify(fetchResult));
  return fetchResult;
}
*/

let searchIndexCache = null;

async function getSearchIndex() {
  if (searchIndexCache)
    return searchIndexCache;
  const fetchResult = await fetch("/index.json").then((r) => r.json());
  fetchResult["_fetchTime"] = new Date().getTime();
  searchIndexCache = fetchResult;
  return fetchResult;
}

async function searchSite(query) {
  return getSearchIndex().then(async (obj) => {
    const result = [];
    for (const pg of obj.pages) {
      if (pg.title.toLowerCase().includes(query.toLowerCase())) {
        result.push(pg);
      } else if (pg.url.toLowerCase().includes(query.toLowerCase())) {
        result.push(pg);
      }
    }
    return result;
  }).catch(console.error);
}

document.getElementById("site-explorer-searchbox").addEventListener("input", async (e) => {
  let searchResult = [];
  if (e.currentTarget.value)
    searchResult = await searchSite(e.currentTarget.value);
  const searchResultDiv = document.getElementById("site-explorer-search-result");
  searchResultDiv.textContent = "";
  let count = 0;
  for (const r of searchResult) {
    if (count >= 4)
      break;
    const anchor = document.createElement("a");
    const badge = document.createElement("div");
    const title = document.createElement("p");
    const url = document.createElement("p");
    anchor.classList.add("search-result-entry-anchor");
    badge.classList.add("search-result-entry");
    title.textContent = r.title;
    title.classList.add("search-result-title");
    url.textContent = r.url;
    url.classList.add("search-result-url");
    badge.appendChild(title);
    badge.appendChild(url);
    anchor.appendChild(badge);
    anchor.href = r.url;
    searchResultDiv.appendChild(anchor);
    count += 1;
  }
});
