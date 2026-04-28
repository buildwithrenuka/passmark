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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VISUAL / UI SUITE
// Uses visual_user — has intentional UI bugs baked in
// These tests are designed to CATCH those bugs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

test("Visual user - product images are correct", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Check product images for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "All 6 product images are visible and not broken" },
      { assertion: "Each product has a different image, not all showing the same image" },
      { assertion: "Sauce Labs Backpack image shows a backpack" },
      { assertion: "Sauce Labs Bike Light image shows a bike light" },
      { assertion: "Sauce Labs Fleece Jacket image shows a jacket" },
    ],
    test,
    expect,
  });
});

test("Visual user - product names and prices match", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Check product names and prices for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "Sauce Labs Backpack price is exactly $29.99" },
      { assertion: "Sauce Labs Bike Light price is exactly $9.99" },
      { assertion: "Sauce Labs Bolt T-Shirt price is exactly $15.99" },
      { assertion: "Sauce Labs Fleece Jacket price is exactly $49.99" },
      { assertion: "Sauce Labs Onesie price is exactly $7.99" },
      { assertion: "Test.allTheThings() T-Shirt (Red) price is exactly $15.99" },
      { assertion: "No price is showing $0.00 or missing" },
    ],
    test,
    expect,
  });
});

test("Visual user - Add to cart button is visible and clickable", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Check cart buttons for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "All 6 products have an Add to cart button visible" },
      { assertion: "Add to cart buttons are not hidden behind other elements" },
      { assertion: "Add to cart buttons are aligned properly with their product cards" },
    ],
    test,
    expect,
  });
});

test("Visual user - product detail page looks correct", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Check product detail page for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click on Sauce Labs Backpack" },
    ],
    assertions: [
      { assertion: "Product name Sauce Labs Backpack is visible" },
      { assertion: "Product image is visible and shows a backpack, not a wrong item" },
      { assertion: "Product price is exactly $29.99" },
      { assertion: "Product description is visible and not empty" },
      { assertion: "Add to cart button is visible and not misaligned" },
      { assertion: "Back to products button is visible" },
    ],
    test,
    expect,
  });
});

test("Visual user - cart icon and badge display correctly", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Check cart UI for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Add to cart for Sauce Labs Backpack" },
    ],
    assertions: [
      { assertion: "Cart badge is visible in the top right corner" },
      { assertion: "Cart badge shows exactly 1, not 0 or any other number" },
      { assertion: "Cart badge is not overlapping with other UI elements" },
    ],
    test,
    expect,
  });

  // Raw Playwright — cart icon unlabelled even for visual_user
  await page.locator(".shopping_cart_link").click();

  await runSteps({
    page,
    userFlow: "Verify cart page UI",
    steps: [],
    assertions: [
      { assertion: "Cart page layout is correct, items are not overlapping" },
      { assertion: "Sauce Labs Backpack is listed in the cart with correct name" },
      { assertion: "Price $29.99 is clearly visible in the cart" },
      { assertion: "Remove button is visible and not hidden" },
      { assertion: "Checkout button is visible at the bottom" },
    ],
    test,
    expect,
  });
});

test("Visual user - checkout form layout is correct", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Check checkout form UI for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
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
    userFlow: "Verify checkout form",
    steps: [
      { description: "Click on Checkout" },
    ],
    assertions: [
      { assertion: "First Name input field is visible and not misaligned" },
      { assertion: "Last Name input field is visible and not misaligned" },
      { assertion: "Zip/Postal Code input field is visible and not misaligned" },
      { assertion: "Continue button is visible and not hidden behind other elements" },
      { assertion: "Cancel button is visible" },
      { assertion: "All form fields are empty by default" },
    ],
    test,
    expect,
  });
});

test("Visual user - sorting UI works correctly", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Check sorting UI for visual_user",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "visual_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Select Price (low to high) from the sort dropdown" },
    ],
    assertions: [
      { assertion: "Sort dropdown is visible and shows Price (low to high)" },
      { assertion: "Products are reordered after sorting, cheapest item appears first" },
      { assertion: "Product prices are still visible after sorting" },
      { assertion: "Product images are still visible after sorting, not broken" },
    ],
    test,
    expect,
  });
});