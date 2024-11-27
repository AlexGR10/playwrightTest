import { test, expect } from '@playwright/test';

test('Proceso de pago simulado en eBay con múltiples pestañas y navegación dentro de la misma pestaña', async ({ page, context }) => {
  // Constantes para los selectores y variables
  const searchQuery = 'laptop';
  const baseURL = 'https://mx.ebay.com/';
  const searchInputSelector = 'input[id="gh-ac"]';
  const searchButtonSelector = 'input[id="gh-btn"]';
  const buyNowButtonSelector = 'span:has-text("¡Cómpralo ahora!")';
  const guestCheckoutButtonSelector = 'span:has-text("Completar la compra como usuario invitado")';
  const enterAddressButtonSelector = 'span:has-text("Ingresa el nombre y la dirección")';
  const firstNameSelector = 'input[id="firstName"]';
  const lastNameSelector = 'input[id="lastName"]';
  const addressLine1Selector = 'input[id="addressLine1"]';
  const citySelector = 'input[id="city"]';
  const stateSelector = 'input[id="stateOrProvince"]';
  const postalCodeSelector = 'input[id="postalCode"]';
  const emailSelector = 'input[id="email"]';
  const confirmEmailSelector = 'input[id="emailConfirm"]';
  const phoneSelector = 'input[id="phoneNumber"]';
  const continueButtonSelector = 'button[data-test-id="ADD_ADDRESS_SUBMIT"]';
  const cardNumberSelector = 'input[id="cardNumber"]';
  const expiryMonthSelector = 'input[id="cardExpiryMonth"]';
  const expiryYearSelector = 'input[id="cardExpiryYear"]';
  const securityCodeSelector = 'input[id="securityCode"]';
  const screenshotPath = `tests/screen_test/checkout/checkout_${searchQuery}.png`;
  const waitTime = 5000;

  // Datos personales y de la tarjeta
  const personalDetails = {
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Fake Street',
    city: 'Fake City',
    state: 'CA',
    postalCode: '12345',
    email: 'john.doe@example.com',
    confirmEmail: 'john.doe@example.com',
    phoneNumber: '1234567890',
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '23',
    securityCode: '123'
  };

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

  // Hacer clic en "¡Cómpralo ahora!"
  await newPage.waitForSelector(buyNowButtonSelector);
  await newPage.click(buyNowButtonSelector);
  console.log('Hizo clic en "¡Cómpralo ahora!".');

  // Seleccionar "Completar la compra como usuario invitado"
  await newPage.waitForSelector(guestCheckoutButtonSelector);
  await newPage.click(guestCheckoutButtonSelector);
  console.log('Seleccionó "Completar la compra como usuario invitado".');

  // Aumentar el tiempo de espera para la página de checkout
  await newPage.waitForTimeout(waitTime);

  // Hacer clic en "Ingresa el nombre y la dirección"
  await newPage.waitForSelector(enterAddressButtonSelector);
  await newPage.click(enterAddressButtonSelector);
  console.log('Hizo clic en "Ingresa el nombre y la dirección".');

  // Esperar a que los campos del formulario estén visibles antes de rellenarlos
  await newPage.waitForSelector(firstNameSelector, { state: 'visible' });
  await newPage.waitForSelector(lastNameSelector, { state: 'visible' });
  await newPage.waitForSelector(addressLine1Selector, { state: 'visible' });
  await newPage.waitForSelector(citySelector, { state: 'visible' });
  await newPage.waitForSelector(stateSelector, { state: 'visible' });
  await newPage.waitForSelector(postalCodeSelector, { state: 'visible' });
  await newPage.waitForSelector(emailSelector, { state: 'visible' });
  await newPage.waitForSelector(confirmEmailSelector, { state: 'visible' });
  await newPage.waitForSelector(phoneSelector, { state: 'visible' });

  // Rellenar los datos personales
  await newPage.fill(firstNameSelector, personalDetails.firstName);
  await newPage.fill(lastNameSelector, personalDetails.lastName);
  await newPage.fill(addressLine1Selector, personalDetails.addressLine1);
  await newPage.fill(citySelector, personalDetails.city);
  await newPage.fill(stateSelector, personalDetails.state);
  await newPage.fill(postalCodeSelector, personalDetails.postalCode);
  await newPage.fill(emailSelector, personalDetails.email);
  await newPage.fill(confirmEmailSelector, personalDetails.confirmEmail);
  await newPage.fill(phoneSelector, personalDetails.phoneNumber);
  console.log('Rellenó los datos personales.');

  // Hacer clic en "Continuar"
  await newPage.waitForSelector(continueButtonSelector);
  await newPage.click(continueButtonSelector);
  console.log('Hizo clic en "Continuar".');

  // Esperar a que los campos de la tarjeta estén visibles antes de rellenarlos
  await newPage.waitForSelector(cardNumberSelector, { state: 'visible' });
  await newPage.waitForSelector(expiryMonthSelector, { state: 'visible' });
  await newPage.waitForSelector(expiryYearSelector, { state: 'visible' });
  await newPage.waitForSelector(securityCodeSelector, { state: 'visible' });

  // Rellenar los datos de la tarjeta
  await newPage.fill(cardNumberSelector, personalDetails.cardNumber);
  await newPage.fill(expiryMonthSelector, personalDetails.expiryMonth);
  await newPage.fill(expiryYearSelector, personalDetails.expiryYear);
  await newPage.fill(securityCodeSelector, personalDetails.securityCode);
  console.log('Rellenó los datos de la tarjeta.');

  // Esperar un momento para verificar visualmente el estado
  await newPage.waitForTimeout(waitTime);

  // Tomar una captura de pantalla del estado actual del proceso de pago
  await newPage.screenshot({ path: screenshotPath });
  console.log(`Tomó una captura de pantalla del proceso de pago: ${screenshotPath}`);
});
