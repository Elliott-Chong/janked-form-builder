import { test, expect, type Page } from "@playwright/test";

let page: Page;

test.beforeAll(async ({ browser }) => {
  // Create page once and sign in.
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
  await page
    .getByRole("button", {
      name: "Sign In with Google",
    })
    .click();
  // await page.locator('input[name="user"]').fill("user");
  // await page.locator('input[name="password"]').fill("password");
  // await page.locator("text=Sign in").click();
});

test.afterAll(async () => {
  await page.close();
});

test("has card title", async () => {
  await page.goto("http://localhost:3000");

  // Expect a title "to contain" a substring.
  await expect(page.getByTestId("landing-card-title")).toContainText(
    "Welcome to INC Form 🔥!",
  );
});

test("get started link", async () => {
  await page.goto("http://localhost:3000");

  // Click the get started link.
  // await page.getByRole("button", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});
