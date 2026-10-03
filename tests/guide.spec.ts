import { expect, test, type Page } from "@playwright/test";

/** Scroll so the hero (and its mascot) is gone and the guide takes over. */
async function pastHero(page: Page) {
  // Wait until the client has mounted the guide, so the scroll sticks.
  await page.locator("[data-visible]").waitFor({ state: "attached" });
  await page.evaluate(() => {
    const work = document.querySelector("#work");
    if (work) window.scrollTo(0, work.getBoundingClientRect().top + window.scrollY + 40);
  });
}

const root = (page: Page) => page.locator("[data-visible]");
const avatar = (page: Page) => page.getByRole("button", { name: "Open guide" });

test.describe("guide", () => {
  test("hands off from the hero and welcomes once", async ({ page }) => {
    await page.goto("/");
    await expect(root(page)).toHaveAttribute("data-visible", "false");
    await pastHero(page);
    await expect(root(page)).toHaveAttribute("data-visible", "true");
    await expect(page.getByRole("button", { name: "Show me around" })).toBeVisible();

    // Same visit, reload: no second welcome.
    await page.reload();
    await pastHero(page);
    await expect(root(page)).toHaveAttribute("data-visible", "true");
    await page.waitForTimeout(800);
    await expect(page.getByRole("button", { name: "Show me around" })).toHaveCount(0);
  });

  test("click opens the card; Esc closes it and returns focus", async ({ page }) => {
    await page.goto("/");
    await pastHero(page);
    await avatar(page).click();
    const card = page.getByRole("dialog", { name: "Where to?" });
    await expect(card).toBeVisible();
    await expect(avatar(page)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
    await expect(avatar(page)).toBeFocused();
  });

  test("case study chips navigate", async ({ page }) => {
    await page.goto("/");
    await pastHero(page);
    await avatar(page).click();
    await page.getByRole("dialog").getByRole("link", { name: /Trading platform/ }).click();
    await expect(page).toHaveURL(/\/work\/trading-platform$/);
  });

  test("case study card skips to key decisions", async ({ page }) => {
    await page.goto("/work/community-servers");
    await expect(root(page)).toHaveAttribute("data-visible", "true");
    await avatar(page).click();
    const card = page.getByRole("dialog", { name: "The TL;DR" });
    await expect(card).toContainText("1.5M");
    await card.getByRole("button", { name: "Skip to key decisions" }).click();
    await expect(page.locator("#decisions-title")).toBeInViewport();
  });

  test("tour steps through and can be skipped", async ({ page }) => {
    await page.goto("/");
    await pastHero(page);
    await page.getByRole("button", { name: "Show me around" }).click();
    await expect(page.getByText("1 / 5", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("2 / 5", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByText(/\d \/ 5/)).toHaveCount(0);
  });

  test("hide persists and the footer brings him back", async ({ page }) => {
    await page.goto("/work/brand-identity");
    await avatar(page).click();
    await page.getByRole("button", { name: "Hide me" }).click();
    await expect(root(page)).toHaveCount(0);
    await page.reload();
    await expect(root(page)).toHaveCount(0);
    // Both the sleeping tab and the footer link can bring him back.
    const restore = page.getByRole("button", { name: "Bring back the guide" });
    await expect(restore).toHaveCount(2);
    await restore.first().click();
    await expect(root(page)).toHaveAttribute("data-visible", "true");
    await expect(page.getByText("I'm back. Did you miss me?").last()).toBeVisible();
  });

  test("hero and contact mascots answer clicks", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-visible]").waitFor({ state: "attached" });
    await page.locator("[data-hero-disc]").click();
    await expect(page.getByText("Hi! Yes, I'm clickable. Everything here is.")).toBeVisible();
    await page.locator("[data-contact-mascot]").scrollIntoViewIfNeeded();
    await page.locator("[data-contact-mascot]").click();
    await expect(page.getByText(/Email works|The real me|Go on, say hi|handing you over/).first()).toBeVisible();
  });

  test("hero bubble stays on screen", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-visible]").waitFor({ state: "attached" });
    await page.locator("[data-hero-disc]").click();
    const bubble = page.getByText("Hi! Yes, I'm clickable. Everything here is.");
    await expect(bubble).toBeVisible();
    const right = await bubble.evaluate((e) => e.getBoundingClientRect().left + (e as HTMLElement).offsetWidth);
    const width = await page.evaluate(() => document.documentElement.clientWidth);
    expect(right).toBeLessThanOrEqual(width);
  });

  test("ducks out when the contact mascot is on screen", async ({ page }) => {
    await page.goto("/");
    await pastHero(page);
    await expect(root(page)).toHaveAttribute("data-visible", "true");
    await page.locator("[data-contact-mascot]").scrollIntoViewIfNeeded();
    await expect(root(page)).toHaveAttribute("data-visible", "false");
  });

  test("never overlaps the See it live dock", async ({ page }) => {
    await page.goto("/work/community-servers");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.4));
    const dock = page.locator("a[aria-hidden='false']", { hasText: "See it live" });
    await expect(dock).toBeVisible();
    await page.waitForTimeout(600);
    const a = await avatar(page).boundingBox();
    const d = await dock.boundingBox();
    expect(a && d).toBeTruthy();
    const overlap = a!.x < d!.x + d!.width && d!.x < a!.x + a!.width && a!.y < d!.y + d!.height && d!.y < a!.y + a!.height;
    expect(overlap).toBe(false);
  });

  test("works with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await pastHero(page);
    await expect(root(page)).toHaveAttribute("data-visible", "true");
    await avatar(page).click();
    await expect(page.getByRole("dialog", { name: "Where to?" })).toBeVisible();
  });
});
