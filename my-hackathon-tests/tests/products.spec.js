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
// PRODUCTS SUITE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

test("Products page shows all 6 items", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Verify products listing",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "Exactly 6 products are visible on the page" },
      { assertion: "Sauce Labs Backpack is visible" },
      { assertion: "Sauce Labs Bike Light is visible" },
      { assertion: "Sauce Labs Bolt T-Shirt is visible" },
      { assertion: "Sauce Labs Fleece Jacket is visible" },
      { assertion: "Sauce Labs Onesie is visible" },
      { assertion: "Test.allTheThings() T-Shirt (Red) is visible" },
      { assertion: "All products show a price" },
      { assertion: "All products show an Add to cart button" },
    ],
    test,
    expect,
  });
});

test("Sort products by price low to high", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Sort by price low to high",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Select Price (low to high) from the sort dropdown" },
    ],
    assertions: [
      { assertion: "Products are sorted by price from lowest to highest" },
      { assertion: "Sauce Labs Onesie at $7.99 appears before Sauce Labs Backpack at $29.99" },
      { assertion: "Sort dropdown shows Price (low to high) as selected" },
    ],
    test,
    expect,
  });
});

test("Sort products by price high to low", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Sort by price high to low",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Select Price (high to low) from the sort dropdown" },
    ],
    assertions: [
      { assertion: "Products are sorted by price from highest to lowest" },
      { assertion: "Sauce Labs Fleece Jacket at $49.99 appears first" },
      { assertion: "Sort dropdown shows Price (high to low) as selected" },
    ],
    test,
    expect,
  });
});

test("Sort products by name Z to A", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Sort by name Z to A",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Select Name (Z to A) from the sort dropdown" },
    ],
    assertions: [
      { assertion: "Products are sorted alphabetically in reverse order" },
      { assertion: "Test.allTheThings() T-Shirt appears first in the list" },
      { assertion: "Sort dropdown shows Name (Z to A) as selected" },
    ],
    test,
    expect,
  });
});

test("Product detail page shows correct info", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Product detail page",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click on Sauce Labs Backpack" },
    ],
    assertions: [
      { assertion: "Product name Sauce Labs Backpack is visible" },
      { assertion: "Product price is exactly $29.99" },
      { assertion: "Product description is visible and not empty" },
      { assertion: "Product image is visible" },
      { assertion: "Add to cart button is visible" },
      { assertion: "Back to products button is visible" },
    ],
    test,
    expect,
  });
});