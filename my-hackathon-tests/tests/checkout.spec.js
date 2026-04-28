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
// CHECKOUT SUITE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

test("Checkout with missing first name", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Checkout validation - missing first name",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
    ],
    assertions: [],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Submit checkout without first name",
    steps: [
      { description: "Click on Checkout" },
      { description: "Enter Last Name", data: { value: "Doe" } },
      { description: "Enter Postal Code", data: { value: "482003" } },
      { description: "Click on Continue" },
    ],
    assertions: [
      { assertion: "Error message says First Name is required" },
      { assertion: "User is still on checkout information page" },
    ],
    test,
    expect,
  });
});

test("Checkout with missing last name", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Checkout validation - missing last name",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
    ],
    assertions: [],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Submit checkout without last name",
    steps: [
      { description: "Click on Checkout" },
      { description: "Enter First Name", data: { value: "John" } },
      { description: "Enter Postal Code", data: { value: "482003" } },
      { description: "Click on Continue" },
    ],
    assertions: [
      { assertion: "Error message says Last Name is required" },
      { assertion: "User is still on checkout information page" },
    ],
    test,
    expect,
  });
});

test("Checkout with missing postal code", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Checkout validation - missing postal code",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
    ],
    assertions: [],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Submit checkout without postal code",
    steps: [
      { description: "Click on Checkout" },
      { description: "Enter First Name", data: { value: "John" } },
      { description: "Enter Last Name", data: { value: "Doe" } },
      { description: "Click on Continue" },
    ],
    assertions: [
      { assertion: "Error message says Postal Code is required" },
      { assertion: "User is still on checkout information page" },
    ],
    test,
    expect,
  });
});

test("Complete checkout with multiple items", async ({ page }) => {
  test.setTimeout(300000);

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
    ],
    assertions: [
      { assertion: "Cart badge shows 2" },
    ],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();
  await expect(page.locator(".cart_item")).toHaveCount(2);

  await runSteps({
    page,
    userFlow: "Checkout with 2 items",
    steps: [
      { description: "Click on Checkout" },
      { description: "Enter First Name", data: { value: "John" } },
      { description: "Enter Last Name", data: { value: "Doe" } },
      { description: "Enter Postal Code", data: { value: "482003" } },
      { description: "Click on Continue" },
    ],
    assertions: [
      { assertion: "Checkout overview shows 2 items" },
      { assertion: "Sauce Labs Backpack is listed at $29.99" },
      { assertion: "Sauce Labs Bike Light is listed at $9.99" },
      { assertion: "Item total is exactly $39.98" },
      { assertion: "Final total includes correct tax amount" },
    ],
    test,
    expect,
  });

  await runSteps({
    page,
    userFlow: "Finish order",
    steps: [
      { description: "Click on Finish" },
    ],
    assertions: [
      { assertion: "Thank you for your order message is visible" },
      { assertion: "Cart is empty after order is placed" },
    ],
    test,
    expect,
  });
});

test("Cancel checkout goes back to cart", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Cancel checkout",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
    ],
    assertions: [],
    test,
    expect,
  });

  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Cancel from checkout form",
    steps: [
      { description: "Click on Checkout" },
      { description: "Click on Cancel" },
    ],
    assertions: [
      { assertion: "User is back on the cart page" },
      { assertion: "Sauce Labs Backpack is still in the cart" },
      { assertion: "Cart badge still shows 1" },
    ],
    test,
    expect,
  });
});