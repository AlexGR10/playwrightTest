import { test, expect } from '@playwright/test';

test('Búsqueda de productos en eBay México', async ({ page }) => {
  // Definir la palabra de búsqueda como una constante
  const searchQuery = 'mouse';

  // Navegar al sitio web de eBay México
  await page.goto('https://mx.ebay.com/');

  // Esperar a que el campo de búsqueda se cargue
  await page.waitForSelector('input[id="gh-ac"]');

  // Realizar una búsqueda de un producto
  await page.fill('input[id="gh-ac"]', searchQuery);
  await page.click('input[id="gh-btn"]');
  console.log(`Realizó una búsqueda de "${searchQuery}"`);

  // Esperar que se carguen los resultados de la búsqueda
  await page.waitForSelector('.s-item');

  // Tomar una captura de pantalla de los resultados de la búsqueda
  const screenshotPath = `tests/screen_test/search/search_${searchQuery}.png`;
  await page.screenshot({ path: screenshotPath });
  console.log(`Tomó una captura de pantalla de los resultados de la búsqueda: ${screenshotPath}`);

  // Verificar que los resultados de la búsqueda se muestren correctamente
  const results = await page.$$('.s-item');
  expect(results.length).toBeGreaterThan(0);

  // Imprimir un mensaje en la consola
  console.log('La búsqueda de productos funciona correctamente.');
});
