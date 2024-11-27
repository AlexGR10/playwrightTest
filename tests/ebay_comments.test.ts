import { test, expect } from '@playwright/test';

test('Verificación de comentarios en eBay con múltiples pestañas y espera para el filtro', async ({ page, context }) => {
  // Constantes para los selectores y variables
  const searchQuery = 'balon';
  const filterQuery = 'Negativa';
  const baseURL = 'https://mx.ebay.com/';
  const searchInputSelector = 'input[id="gh-ac"]';
  const searchButtonSelector = 'input[id="gh-btn"]';
  const reviewsSectionSelector = 'a:has-text("Ver todos los comentarios")';
  const sortButtonSelector = 'span:has-text("Ordenar")';
  const negativeReviewsSelector = `button:has-text("${filterQuery}")`;
  const closeFilterButtonSelector = 'button[class="icon-btn panel-dialog__close"]';
  const screenshotPath = `tests/screen_test/comments/comments_${filterQuery}_${searchQuery}.png`;
  const waitTime = 5000;

  // Navegar a la página principal de eBay
  await page.goto(baseURL);
  console.log('Navegado a eBay México.');

  // Realizar una búsqueda de un producto
  await page.fill(searchInputSelector, searchQuery);
  await page.click(searchButtonSelector);
  console.log(`Realizó una búsqueda de "${searchQuery}"`);

  // Esperar que se carguen los resultados de la búsqueda
  await page.waitForSelector('.s-item');

  // Pausar el script para permitir la selección manual del producto
  console.log('Por favor, selecciona manualmente un producto de los resultados de búsqueda.');
  await page.pause();

  // Esperar a que se abra una nueva página tras hacer clic en un producto
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    // Aquí el usuario ya seleccionó el producto y abrió una nueva pestaña
  ]);
  await newPage.waitForLoadState();
  console.log('Nueva pestaña abierta con el producto seleccionado.');

  // Esperar a que se cargue la sección de comentarios y hacer clic en "Ver todos los comentarios"
  await newPage.waitForSelector(reviewsSectionSelector);
  const [commentsPage] = await Promise.all([
    context.waitForEvent('page'),
    newPage.click(reviewsSectionSelector)
  ]);
  await commentsPage.waitForLoadState();
  console.log('Nueva pestaña abierta con todos los comentarios.');

  // Esperar a que se carguen los comentarios
  await commentsPage.waitForTimeout(waitTime);

  // Ordenar los comentarios por los más negativos
  await commentsPage.click(sortButtonSelector);
  await commentsPage.click(negativeReviewsSelector);
  console.log('Ordenó los comentarios por los más negativos.');

  // Esperar a que el filtro se aplique completamente
  await commentsPage.waitForTimeout(waitTime);

  // Cerrar el filtro para visualizar la página con el resultado
  await commentsPage.click(closeFilterButtonSelector);
  console.log('Cerró el filtro de comentarios.');

  // Tomar una captura de pantalla de los comentarios ordenados
  await commentsPage.screenshot({ path: screenshotPath });
  console.log(`Tomó una captura de pantalla de los comentarios: ${screenshotPath}`);
});
