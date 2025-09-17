// DOM render/clear/update функции
import { addFavorite, removeFavorite, getFavorite } from "./storage.js";
import { getCurrentWeather } from "./api.js";

export const renderCards = async () => {
  showLoader(true);
  const listElement = document.querySelector("[data-js-list]");
  const cities = getFavorite();
  if (!cities || cities.length === 0) {
    showLoader(false);
    return;
  }

  const promises = cities.map((city) => getCurrentWeather(city));
  try {
    const results = await Promise.all(promises);

    for (let i = results.length - 1; i >= 0; i--) {
      const element = results[i];
      renderCard(element, true);
    }
  } catch (error) {
    console.error("error when rendering cards");
  }
  showLoader(false);
};

function createElement(tag, className, text, attributes) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (text) element.textContent = text;
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }
  return element;
}

export function renderCard(data, favorite) {
  const listElement = document.querySelector("[data-js-list]");

  for (let i = 0; i < listElement.childElementCount; i++) {
    const city =
      listElement.children[i].querySelector(".card__title").textContent;
    if (data.name === city) {
      const infoElement = document.querySelector("[data-js-info]");
      infoElement.textContent = "You have this city";
      return;
    }
  }

  const cardElement = createElement("li", "card");
  const titleElement = createElement("h3", "card__title", data.name);
  const tempElement = createElement(
    "div",
    "card__temp",
    Math.round(data.main.temp)
  );
  const descElement = createElement(
    "div",
    "card__description",
    data.weather[0].description
  );
  const iconElement = createElement("img", "card__icon", null, {
    alt: `icon: ${data.weather[0].description}`,
    src: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  });
  const removeElement = createElement("button", "card__remove", "x");
  const addElement = createElement("input", "card__add", null, {
    type: "checkbox",
  });
  if (favorite) addElement.checked = true;
  const actionElement = createElement("div", "card__action");

  actionElement.append(addElement, removeElement);
  cardElement.append(
    actionElement,
    titleElement,
    tempElement,
    descElement,
    iconElement
  );
  listElement.prepend(cardElement);

  addElement.addEventListener("change", () => {
    let city = addElement
      .closest(".card")
      .querySelector(".card__title").textContent;
    if (addElement.checked) {
      addFavorite(city);
    } else {
      removeFavorite(city);
    }
  });

  removeElement.addEventListener("click", () => {
    const city = removeElement
      .closest(".card")
      .querySelector(".card__title").textContent;

    deleteCard(city);
    removeFavorite(city);
  });
}

export function deleteCard(city) {
  const listElement = document.querySelector("[data-js-list]");
  for (let i = listElement.childElementCount - 1; i >= 0; i--) {
    const card = listElement.children[i];
    const cardCity = card.querySelector(".card__title").textContent;
    if (city === cardCity) {
      card.remove();
      break;
    }
  }
}

export const showLoader = (bool) => {
  const infoElement = document.querySelector("[data-js-info]");
  infoElement.textContent = "";
  infoElement.classList.toggle("loader-show", bool);
};

export const showError = (error) => {
  const infoElement = document.querySelector("[data-js-info]");
  infoElement.textContent = "not found";
};
