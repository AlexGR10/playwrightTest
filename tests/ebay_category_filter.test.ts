import { test } from '@playwright/test';

test('Navegación por categorías y filtrado en eBay', async ({ page }) => {
  // Constantes para los selectores y variables
  const baseURL = 'https://mx.ebay.com/';
  const searchButtonSelector = 'button[id="gh-shop-a"]';
  const categoryLinkSelector = 'a[href="https://mx.ebay.com/b/Car-Electronics/38635/bn_562662"]';
  const auctionFilterSelector = 'a[href*="LH_Auction=1"]';
  const screenshotPath1 = 'tests/screen_test/category/category_1.png';
  const screenshotPath2 = 'tests/screen_test/category/category_2.png';
  const waitTime = 5000;

  // Navegar al sitio web de eBay México
  await page.goto(baseURL);
  console.log('Navegado a eBay México.');

  // Hacer clic en el botón "Comprar por categoría"
  await page.click(searchButtonSelector);
  console.log('Hizo clic en "Comprar por categoría".');

  // Seleccionar la categoría "Electrónica"
  await page.click(categoryLinkSelector);
  console.log('Seleccionó la categoría "Electrónica".');

  // Esperar a que se carguen los productos
  await page.waitForTimeout(waitTime); // Espera adicional para que se carguen las imágenes
  console.log('Esperó a que se carguen los productos.');

  // Tomar una captura de pantalla de la página de la categoría
  await page.screenshot({ path: screenshotPath1 });
  console.log(`Tomó una captura de pantalla de la categoría: ${screenshotPath1}`);

  // Hacer clic en el filtro "Subasta"
  await page.click(auctionFilterSelector);
  console.log('Hizo clic en el filtro "Subasta".');

  // Esperar a que se filtren los resultados
  await page.waitForTimeout(waitTime); // Espera adicional para que se filtren los resultados
  console.log('Esperó a que se filtren los resultados.');

  // Tomar una captura de pantalla de los productos filtrados
  await page.screenshot({ path: screenshotPath2 });
  console.log(`Tomó una captura de pantalla de los productos filtrados: ${screenshotPath2}`);
});
