import dotenv from 'dotenv';
dotenv.config();

import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";

configure({
  ai: {
    gateway: "openrouter"
  }
});

test.use({
  headless: !!process.env.CI,
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CART SUITE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

test("Add single item to cart", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Add single item",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
    ],
    assertions: [
      { assertion: "Cart badge shows exactly 1" },
      { assertion: "Sauce Labs Backpack button changed to Remove" },
    ],
    test,
    expect,
  });

  // Raw Playwright — cart icon unlabelled
  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Verify cart contents",
    steps: [],
    assertions: [
      { assertion: "Cart contains exactly 1 item" },
      { assertion: "Sauce Labs Backpack is in the cart" },
      { assertion: "Price shows $29.99" },
    ],
    test,
    expect,
  });
});

test("Add multiple items to cart", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Add multiple items",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
      { description: "Click Add to cart for Sauce Labs Bike Light" },
      { description: "Click Add to cart for Sauce Labs Bolt T-Shirt" },
    ],
    assertions: [
      { assertion: "Cart badge shows exactly 3" },
      { assertion: "Sauce Labs Backpack shows Remove button" },
      { assertion: "Sauce Labs Bike Light shows Remove button" },
      { assertion: "Sauce Labs Bolt T-Shirt shows Remove button" },
    ],
    test,
    expect,
  });

  // Raw Playwright — cart icon unlabelled
  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Verify multiple items in cart",
    steps: [],
    assertions: [
      { assertion: "Cart contains exactly 3 items" },
      { assertion: "Sauce Labs Backpack is in the cart at $29.99" },
      { assertion: "Sauce Labs Bike Light is in the cart at $9.99" },
      { assertion: "Sauce Labs Bolt T-Shirt is in the cart at $15.99" },
    ],
    test,
    expect,
  });
});

test("Remove item from cart", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Add then remove item",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
      { description: "Click Add to cart for Sauce Labs Bike Light" },
    ],
    assertions: [
      { assertion: "Cart badge shows 2" },
    ],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Remove one item from cart",
    steps: [
      { description: "Click Remove for Sauce Labs Backpack" },
    ],
    assertions: [
      { assertion: "Cart contains exactly 1 item" },
      { assertion: "Sauce Labs Backpack is no longer in the cart" },
      { assertion: "Sauce Labs Bike Light is still in the cart" },
      { assertion: "Cart badge shows 1" },
    ],
    test,
    expect,
  });
});

test("Cart is empty by default", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Check empty cart",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "Cart badge is not visible, cart is empty" },
    ],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Verify empty cart page",
    steps: [],
    assertions: [
      { assertion: "Cart page shows no items" },
      { assertion: "Checkout button is visible even with empty cart" },
    ],
    test,
    expect,
  });
});