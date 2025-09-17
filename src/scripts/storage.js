// localStorage: favorites, lastCity, units
export function addFavorite(city) {
  const keys = JSON.parse(localStorage.getItem("weatherCities")) || [];
  console.log(keys.length);
  if (!keys.includes(city)) keys.unshift(city);

  localStorage.setItem("weatherCities", JSON.stringify(keys));
}

export function removeFavorite(city) {
  let keys = JSON.parse(localStorage.getItem("weatherCities")) || [];
  keys = keys.filter((item) => item !== city);

  if (keys.length > 0) {
    localStorage.setItem("weatherCities", JSON.stringify(keys));
  } else {
    localStorage.removeItem("weatherCities");
  }
}

export function getFavorite() {
  return JSON.parse(localStorage.getItem("weatherCities"));
}
