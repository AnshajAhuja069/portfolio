import { expect, test } from "@playwright/test";

const SLUGS = ["community-servers", "brand-identity", "trading-platform"];

test.describe("routes", () => {
  test("home and every case study load with one h1", async ({ page }) => {
    for (const path of ["/", "/resume", ...SLUGS.map((s) => `/work/${s}`)]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);
      await expect(page.locator("h1"), path).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("unknown case study is a useful 404", async ({ page }) => {
    const res = await page.goto("/work/not-a-project");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page wandered off.");
    await expect(page.getByRole("link", { name: "Making communities easier to use" })).toBeVisible();
  });

  test("resume page shows the journey and links to the real PDF", async ({ page }) => {
    const res = await page.goto("/resume");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The journey so far.");
    await expect(page.getByRole("heading", { level: 3, name: "Chief Product Officer" })).toBeAttached();
    const view = page.getByRole("link", { name: /View resume PDF/ }).first();
    await expect(view).toHaveAttribute("href", "/resume/anshaj-ahuja-resume.pdf");
    await expect(page.getByRole("link", { name: /Download/ }).first()).toHaveAttribute("download", /\.pdf$/);
    // The nav's Resume link now opens this page, not the file.
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Resume" })).toHaveAttribute(
      "href",
      "/resume",
    );
  });

  test("resume PDF is served", async ({ request }) => {
    const res = await request.get("/resume/anshaj-ahuja-resume.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
  });
});

test.describe("navigation", () => {
  test("Work and Contact anchors land on their sections", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work-title")).toBeInViewport();

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact-title")).toBeInViewport();
  });

  test("case study opens with one link and back restores the gallery position", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /Read case study: Giving Gamersberg an identity with depth/ });
    await cta.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const before = await page.evaluate(() => window.scrollY);

    await cta.click();
    await expect(page).toHaveURL(/\/work\/brand-identity$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Giving Gamersberg an identity with depth");

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    // Restoration can land a frame or two after the route commits.
    await expect
      .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - before), { timeout: 4000 })
      .toBeLessThan(200);
  });

  test("wordmark inverts over the page and turns solid over teal", async ({ page }) => {
    await page.goto("/");
    const mark = page.locator("#nav-wordmark");
    await expect(page.locator("html")).toHaveAttribute("data-nav-surface", "paper");
    await expect(mark).toHaveCSS("mix-blend-mode", "difference");
    await page.locator("#work-title").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const header = document.querySelector("#work header");
      if (header) window.scrollTo(0, header.getBoundingClientRect().top + window.scrollY + 40);
    });
    await expect(page.locator("html")).toHaveAttribute("data-nav-surface", "accent");
    await expect(mark).toHaveCSS("mix-blend-mode", "normal");
  });

  test("keyboard: skip link comes first and is visible when focused", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard check runs on desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Anshaj Ahuja" })).toBeFocused();
  });
});

test.describe("layout", () => {
  for (const width of [360, 390, 768, 1440, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "widths are set explicitly");
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/resume", `/work/${SLUGS[1]}`]) {
        await page.goto(path);
        const { sw, iw } = await page.evaluate(() => ({
          sw: document.documentElement.scrollWidth,
          iw: window.innerWidth,
        }));
        expect(sw, `${path} @ ${width}`).toBeLessThanOrEqual(iw);
      }
    });
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is static and fully visible", async ({ page }) => {
    await page.goto("/");
    // The decorative overlay layer is not rendered.
    await expect(page.locator("[data-hero-overlay]")).toBeHidden();
    // The hero track is not taller than its content (no sticky choreography).
    const track = await page.locator("[data-hero-track]").evaluate((el) => el.getBoundingClientRect().height);
    expect(track).toBeLessThan(page.viewportSize()!.height * 1.2);
    // Gallery labels are visible without scroll-triggered reveals.
    const meta = page.locator("[data-meta]").first();
    await meta.scrollIntoViewIfNeeded();
    await expect(meta.locator("h3")).toHaveCSS("opacity", "1");
    // Contact heading keeps its plain text.
    await expect(page.locator("#contact-title")).toHaveText("Let’s connect.");
  });
});

test.describe("contact", () => {
  test("copy email gives feedback", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Copy email" }).click();
    await expect(page.getByRole("status").filter({ hasText: "copied" })).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe("anshajahujaa@gmail.com");
  });

  test("email is a working mailto link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "anshajahujaa@gmail.com" }).first()).toHaveAttribute(
      "href",
      "mailto:anshajahujaa@gmail.com",
    );
  });
});

test.describe("brand identity", () => {
  test("story, logo and Peak images are present with alt text", async ({ page }) => {
    await page.goto("/work/brand-identity");
    await expect(page.getByRole("heading", { name: "Surface, depth and a mask" })).toBeVisible();
    await expect(page.getByText("04 — Meet Peak")).toBeAttached();
    await expect(page.getByRole("heading", { level: 3, name: "The logo, brought to life" })).toBeAttached();
    for (const alt of [/Gamersberg logo/, /headset/, /rocket/, /Peeking|peeking/]) {
      await expect(page.getByRole("img", { name: alt }).first()).toBeAttached();
    }
  });

  test("the unpublished discovery case study is a 404", async ({ page }) => {
    const res = await page.goto("/work/discovery-onboarding");
    expect(res?.status()).toBe(404);
  });
});

test.describe("reply demo", () => {
  test("Reply button attaches the message to the composer", async ({ page }) => {
    await page.goto(`/work/${SLUGS[0]}`);
    await page.getByRole("button", { name: "Reply to Mira" }).click();
    await expect(page.getByRole("button", { name: "Cancel reply to Mira" })).toBeVisible();
    await expect(page.locator("#demo-input")).toBeFocused();
    await page.locator("#demo-input").fill("Count me in");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByLabel("Demo conversation")).toContainText("Count me in");
    await expect(page.getByRole("button", { name: /Cancel reply/ })).toHaveCount(0);
  });

  test("swiping a message right attaches it", async ({ page, isMobile }) => {
    test.skip(isMobile, "pointer drag simulated with the mouse on desktop");
    await page.goto(`/work/${SLUGS[0]}`);
    const row = page.getByLabel("Demo conversation").locator("li").filter({ hasText: "Theo" });
    await row.scrollIntoViewIfNeeded();
    const box = (await row.boundingBox())!;
    await page.mouse.move(box.x + 60, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 100, box.y + box.height / 2, { steps: 4 });
    await page.mouse.move(box.x + 150, box.y + box.height / 2, { steps: 4 });
    await page.mouse.up();
    await expect(page.getByRole("button", { name: "Cancel reply to Theo" })).toBeVisible();
  });
});
