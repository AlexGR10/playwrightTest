import { test, expect } from '@playwright/test';
import fs from 'fs';

test('Verificación de promociones y ofertas en eBay', async ({ page, context }) => {
  // Constantes para los selectores y variables
  const baseURL = 'https://mx.ebay.com/';
  const offersSectionSelector = 'a:has-text("Ofertas")';
  const shareButtonSelector = 'span.ux-textspans:has-text("Compartir")';
  const copyLinkButtonSelector = 'div.icon-content:has(svg.icon--24)';
  const screenshotPath = 'tests/screen_test/promotion/offers.png';
  const linkFilePath = 'tests/screen_test/promotion/link.txt';

  // Navegar a la página principal de eBay
  await page.goto(baseURL);
  console.log('Navegado a eBay México.');

  // Ir a la sección de ofertas
  await page.waitForSelector(offersSectionSelector);
  await page.click(offersSectionSelector);
  console.log('Navegó a la sección de ofertas.');

  // Pausar el script para permitir la selección manual del producto
  console.log('Por favor, selecciona manualmente un producto de las ofertas.');
  await page.pause();

  // Esperar a que se cargue la página del producto y hacer clic en "Compartir"
  await page.waitForSelector(shareButtonSelector);
  await page.click(shareButtonSelector);
  console.log('Hizo clic en "Compartir".');

  // Hacer clic en el botón para copiar el enlace
  await page.waitForSelector(copyLinkButtonSelector);
  await page.click(copyLinkButtonSelector);
  console.log('Hizo clic en el botón para copiar el enlace.');

  // Obtener el enlace copiado desde el portapapeles y guardarlo en un archivo .txt
  const link = await page.evaluate(() => navigator.clipboard.readText());
  fs.writeFileSync(linkFilePath, link);
  console.log(`El enlace se ha copiado y guardado en: ${linkFilePath}`);

  // Tomar una captura de pantalla de la página del producto
  await page.screenshot({ path: screenshotPath });
  console.log(`Tomó una captura de pantalla de la oferta seleccionada: ${screenshotPath}`);
});
