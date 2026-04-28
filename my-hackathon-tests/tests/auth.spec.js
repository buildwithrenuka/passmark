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
// AUTH SUITE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

test("Login with valid credentials", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Valid login",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "User is redirected to Products page after login" },
      { assertion: "Swag Labs header is visible" },
      { assertion: "Login page is no longer visible" },
      { assertion: "Shopping cart icon is visible" },
    ],
    test,
    expect,
  });
});

test("Login with invalid password", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Invalid password login",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "wrong_password" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "Error message is visible saying username and password do not match" },
      { assertion: "User is still on the login page, not redirected to products" },
      { assertion: "Error message contains Epic sadface" },
    ],
    test,
    expect,
  });
});

test("Login with invalid username", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Invalid username login",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "wrong_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "Error message is visible" },
      { assertion: "User is still on login page" },
      { assertion: "Products page is not visible" },
    ],
    test,
    expect,
  });
});

test("Login with empty credentials", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Empty credentials login",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Click on Login without entering any credentials" },
    ],
    assertions: [
      { assertion: "Error message says Username is required" },
      { assertion: "User is still on login page" },
    ],
    test,
    expect,
  });
});

test("Login with locked out user", async ({ page }) => {
  test.setTimeout(120000);

  await runSteps({
    page,
    userFlow: "Locked out user login",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "locked_out_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
    ],
    assertions: [
      { assertion: "Error message says user has been locked out" },
      { assertion: "User is not redirected to products page" },
      { assertion: "Login page is still visible" },
    ],
    test,
    expect,
  });
});

test("Logout after login", async ({ page }) => {
  test.setTimeout(180000);

  await runSteps({
    page,
    userFlow: "Login then logout",
    steps: [
      { description: "Navigate to https://www.saucedemo.com/" },
      { description: "Enter username", data: { value: "standard_user" } },
      { description: "Enter password", data: { value: "secret_sauce" } },
      { description: "Click on Login" },
      { description: "Click on Open Menu" },
      { description: "Click on Logout" },
    ],
    assertions: [
      { assertion: "User is redirected to login page after logout" },
      { assertion: "Username and password fields are empty" },
      { assertion: "Login button is visible" },
      { assertion: "Products page is not accessible" },
    ],
    test,
    expect,
  });
});