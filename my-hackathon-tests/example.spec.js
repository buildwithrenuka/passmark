import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";

configure({
  ai: {
    gateway: "openrouter"
    // Make sure to set AI_GATEWAY_API_KEY (Vercel) or OPENROUTER_API_KEY (OpenRouter) in your .env file
  }
});


test.use({
  headless: !!process.env.CI,
});

test("Add to cart", async ({ page }) => {
  test.setTimeout(60000);
  await runSteps({
    page,
    userFlow: "Add product to cart",
    steps: [
      { description: "Navigate to https://demo.vercel.store" },
      { description: "Click Acme Circles T-Shirt" },
      { description: "Select color", data: { value: "White" } },
      { description: "Select size", data: { value: "S" } },
      { description: "Add to cart", waitUntil: "My Cart is visible"},
    ],
    assertions: [
      { assertion: "You can see My Cart with Acme Circles T-Shirt" },
    ],
    test,
    expect,
  });
});















// // @ts-check
// import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });


