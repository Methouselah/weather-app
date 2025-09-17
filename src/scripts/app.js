// high-level flow: handleSearch → render → error handling
import { getCurrentWeather } from "./api.js";
import { renderCard, showError, showLoader, renderCards } from "./ui.js";
export default function initApp() {
  const formElement = document.querySelector("[data-js-form]");
  const inputElement = document.querySelector("[data-js-input]");
  const infoElement = document.querySelector("[data-js-info]");

  renderCards();
  formElement.addEventListener("submit", async (e) => {
    e.preventDefault(); // чтобы страница не перезагружалась

    const city = inputElement.value.trim();
    if (!city) {
      infoElement.textContent = "Please enter a city";
      return;
    }
    try {
      showLoader(true);
      const data = await getCurrentWeather(city);
      showLoader(false);

      renderCard(data);
    } catch (error) {
      showLoader(false);
      showError(error);
    } finally {
      inputElement.value = "";
    }
  });
}
