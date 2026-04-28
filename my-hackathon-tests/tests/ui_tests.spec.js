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

test("Add to cart and checkout", async ({ page }) => {
  test.setTimeout(300000);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOCK 1 — Login + Add to cart
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  await runSteps({
    page,
    userFlow: "Login and add product to cart",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click Sauce Labs Backpack" },
      { description: "Click on Add to cart" },
      { description: "Click on Back to products", waitUntil: "Products is visible" },
    ],
    assertions: [
      { assertion: "User is logged in and Products page is visible" },
      { assertion: "Shopping cart badge shows exactly 1 item" },
      { assertion: "Sauce Labs Backpack shows Remove button, Add to cart button is gone" },
      { assertion: "Price of Sauce Labs Backpack is exactly $29.99" },
      { assertion: "All 6 products are visible on the page" },
      { assertion: "Sort dropdown is visible and shows Name (A to Z) by default" },
    ],
    test,
    expect,
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RAW PLAYWRIGHT — Cart icon unlabelled
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await page.locator(".shopping_cart_link").click();
  await expect(page.locator(".cart_item")).toHaveCount(1);
  await expect(page.locator(".cart_item_label")).toContainText("Sauce Labs Backpack");
  await expect(page.locator(".inventory_item_price")).toHaveText("$29.99");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOCK 2 — Checkout form
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  await runSteps({
    page,
    userFlow: "Fill checkout form",
    steps: [
      { description: "Click on Checkout" },
      { description: "Enter First Name", data: { value: "John" } },
      { description: "Enter Last Name", data: { value: "Doe" } },
      { description: "Enter Postal Code", data: { value: "482003" } },
      { description: "Click on Continue" },
    ],
    timeout: 120000,
    assertions: [
      { assertion: "Checkout Overview page is visible" },
      { assertion: "Exactly 1 Sauce Labs Backpack is in the order" },
      { assertion: "Item total is exactly $29.99" },
      { assertion: "Tax is exactly $2.40" },
      { assertion: "Final total is exactly $32.39" },
      { assertion: "Payment shows SauceCard #31337" },
      { assertion: "Shipping shows Free Pony Express Delivery" },
    ],
    test,
    expect,
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOCK 3 — Finish order
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  await runSteps({
    page,
    userFlow: "Complete order",
    steps: [
      { description: "Click on Finish" },
    ],
    timeout: 60000,
    assertions: [
      { assertion: "Thank you for your order message is visible" },
      { assertion: "Order confirmation page is displayed, no error message" },
      { assertion: "Cart badge is gone, cart is empty" },
    ],
    test,
    expect,
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOCK 4 — Back home + Logout
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  await runSteps({
    page,
    userFlow: "Logout",
    steps: [
      { description: "Click on Back Home" },
      { description: "Click on Open Menu" },
      { description: "Click on Logout" },
    ],
    timeout: 60000,
    assertions: [
      { assertion: "User is redirected to login page" },
      { assertion: "Username and password fields are visible and empty" },
      { assertion: "Login button is visible" },
      { assertion: "Products page is not visible" },
    ],
    test,
    expect,
  });
});