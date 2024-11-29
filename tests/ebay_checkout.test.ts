import { test, expect } from '@playwright/test';

test('Proceso de pago simulado en eBay con múltiples pestañas y navegación dentro de la misma pestaña', async ({ page, context }) => {
  const searchQuery = 'telefono';
  const baseURL = 'https://mx.ebay.com/';
  const selectors = {
    searchInput: 'input[id="gh-ac"]',
    searchButton: 'input[id="gh-btn"]',
    buyNowButton: 'span:has-text("¡Cómpralo ahora!")',
    guestCheckoutButton: 'span:has-text("Completar la compra como usuario invitado")',
    enterAddressButton: 'span:has-text("Ingresa el nombre y la dirección")',
    firstName: 'input[id="firstName"]',
    lastName: 'input[id="lastName"]',
    addressLine1: 'input[id="addressLine1"]',
    city: 'input[id="city"]',
    state: 'input[id="stateOrProvince"]',
    postalCode: 'input[id="postalCode"]',
    email: 'input[id="email"]',
    confirmEmail: 'input[id="emailConfirm"]',
    phone: 'input[id="phoneNumber"]',
    continueButton: 'button[data-test-id="ADD_ADDRESS_SUBMIT"]',
    cardRadioButton: 'input[id="selectable-render-summary1"]',
    cardNumber: 'input[id="cardNumber"]',
    cardExpiryDate: 'input[id="cardExpiryDate"]',
    securityCode: 'input[id="securityCode"]',
    addCardButton: 'button[data-test-id="ADD_CARD"]',
    currencyRadioButton: 'input[value="MXN"]',
    continueCurrencyButton: 'button:has-text("Continuar en MXN")'
  };
  const waitTime = 5000;

  const personalDetails = {
    firstName: 'Alex',
    lastName: 'Gutierrez',
    addressLine1: '123 Fake Street',
    city: 'Fake City',
    state: 'CA',
    postalCode: '12345',
    email: 'alexgtz@gmail.com',
    confirmEmail: 'alexgtz@gmail.com',
    phoneNumber: '1234567890',
    cardNumber: '4111111111111111',
    cardExpiryDate: '10 / 27',
    securityCode: '097'
  };

  await page.goto(baseURL);
  console.log('Navegado a eBay México.');

  await page.fill(selectors.searchInput, searchQuery);
  await page.click(selectors.searchButton);
  console.log(`Realizó una búsqueda de "${searchQuery}"`);

  await page.waitForSelector('.s-item');
  console.log('Por favor, selecciona manualmente un producto de los resultados de búsqueda.');
  await page.pause();

  const [newPage] = await Promise.all([context.waitForEvent('page')]);
  await newPage.waitForLoadState();
  console.log('Nueva pestaña abierta con el producto seleccionado.');

  await newPage.waitForSelector(selectors.buyNowButton);
  await newPage.click(selectors.buyNowButton);
  console.log('Hizo clic en "¡Cómpralo ahora!".');

  await newPage.waitForSelector(selectors.guestCheckoutButton);
  await newPage.click(selectors.guestCheckoutButton);
  console.log('Seleccionó "Completar la compra como usuario invitado".');

  await newPage.waitForTimeout(waitTime);

  const fillField = async (selector: string, value: string) => {
    await newPage.fill(selector, value);
  };

  const fields = [
    { selector: selectors.firstName, value: personalDetails.firstName },
    { selector: selectors.lastName, value: personalDetails.lastName },
    { selector: selectors.addressLine1, value: personalDetails.addressLine1 },
    { selector: selectors.city, value: personalDetails.city },
    { selector: selectors.state, value: personalDetails.state },
    { selector: selectors.postalCode, value: personalDetails.postalCode },
    { selector: selectors.email, value: personalDetails.email },
    { selector: selectors.confirmEmail, value: personalDetails.confirmEmail },
    { selector: selectors.phone, value: personalDetails.phoneNumber }
  ];

  for (const field of fields) {
    await fillField(field.selector, field.value);
  }
  console.log('Rellenó los datos personales.');

  await newPage.screenshot({ path: `tests/screen_test/checkout/checkout_data.png` });
  console.log('Tomó una captura de pantalla del formulario de datos.');

  await newPage.waitForSelector(selectors.continueButton);
  await newPage.click(selectors.continueButton);
  console.log('Hizo clic en "Continuar".');

  await newPage.waitForSelector(selectors.cardRadioButton);
  await newPage.click(selectors.cardRadioButton);
  console.log('Seleccionó la opción de pago con tarjeta de crédito.');

  await newPage.waitForTimeout(waitTime);

  await newPage.fill(selectors.cardNumber, personalDetails.cardNumber);
  console.log('Rellenó el número de tarjeta.');

  await newPage.fill(selectors.cardExpiryDate, personalDetails.cardExpiryDate);
  console.log('Rellenó la fecha de expiración de la tarjeta.');

  await newPage.fill(selectors.securityCode, personalDetails.securityCode);
  console.log('Rellenó el código de seguridad de la tarjeta.');

  await newPage.screenshot({ path: `tests/screen_test/checkout/checkout_card.png` });
  console.log('Tomó una captura de pantalla del formulario de la tarjeta de crédito.');

  await newPage.waitForSelector(selectors.addCardButton);
  await newPage.click(selectors.addCardButton);
  console.log('Hizo clic en "Listo".');

  await newPage.waitForSelector(selectors.currencyRadioButton);
  await newPage.click(selectors.currencyRadioButton);
  console.log('Seleccionó la divisa MXN.');

  await newPage.waitForSelector(selectors.continueCurrencyButton);
  await newPage.click(selectors.continueCurrencyButton);
  console.log('Hizo clic en "Continuar en MXN".');

  await newPage.waitForTimeout(waitTime);

  await newPage.screenshot({ path: `tests/screen_test/checkout/checkout_pay.png` });
  console.log('Tomó una captura de pantalla final del proceso de pago.');
});
