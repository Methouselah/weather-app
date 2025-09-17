// все network-запросы (fetch wrappers, timeouts, retries)

import { BASE_URL, API_KEY } from "./constants.js";

export const getCurrentWeather = async (city) => {
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);

    // Проверяем, что сервер ответил успешно
    if (!res.ok) {
      const errData = await res.json().catch((error) => ({}));
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Weather API error:", error.massage);
    throw error; // пробрасываем ошибку дальше
  }
};
