const request = require("supertest");
const app = require("../app");
const { sequelize, Url } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("URL Shortener Integration Test", () => {
  let shortUrl;

  test("should shorten the URL", async () => {
    const response = await request(app)
      .post("/shorten")
      .send({ url: "https://example.com" })
      .expect(200);

    expect(response.body).toHaveProperty("shortUrl");
    shortUrl = response.body.shortUrl;
    expect(shortUrl).toMatch(/^[a-f0-9]{6}$/);
  });

  test("should return existing short URL for duplicate URL", async () => {
    const response = await request(app)
      .post("/shorten")
      .send({ url: "https://example.com" })
      .expect(200);

    expect(response.body.shortUrl).toBe(shortUrl);
  });

  test("should return URL for valid short code", async () => {
    const response = await request(app)
      .get("/redirect")
      .query({ code: shortUrl })
      .expect(200);

    expect(response.body).toHaveProperty("url", "https://example.com");
  });

  test("should return 404 for unknown short code", async () => {
    const response = await request(app)
      .get("/redirect")
      .query({ code: "unknown" })
      .expect(404);

    expect(response.text).toBe("Short code not found");
  });

  test("should return 400 for missing URL in shorten request", async () => {
    const response = await request(app).post("/shorten").send({}).expect(400);

    expect(response.body).toHaveProperty("error", "Missing URL");
  });

  test("should return 400 for missing code in redirect request", async () => {
    const response = await request(app).get("/redirect").expect(400);

    expect(response.text).toBe("Missing code parameter");
  });

  test("should delete the URL successfully", async () => {
    const response = await request(app)
      .delete(`/delete/${shortUrl}`)
      .expect(200);

    expect(response.body).toHaveProperty("message", "URL deleted successfully");
  });

  test("should return 404 when trying to get deleted URL", async () => {
    const response = await request(app)
      .get("/redirect")
      .query({ code: shortUrl })
      .expect(404);

    expect(response.text).toBe("Short code not found");
  });

  test("should return 404 when trying to delete non-existent URL", async () => {
    const response = await request(app)
      .delete("/delete/nonexistent")
      .expect(404);

    expect(response.body).toHaveProperty("error", "URL not found");
  });

  test("should return 400 when code parameter is missing in delete", async () => {
    const response = await request(app).delete("/delete/").expect(404);
  });
});

describe("URL Shortener Edge Cases", () => {
  beforeEach(async () => {
    await Url.destroy({ where: {} });
  });

  test("should handle multiple different URLs", async () => {
    const urls = [
      "https://google.com",
      "https://github.com",
      "https://stackoverflow.com",
    ];

    const shortUrls = [];

    for (const url of urls) {
      const response = await request(app)
        .post("/shorten")
        .send({ url })
        .expect(200);

      shortUrls.push(response.body.shortUrl);
      expect(response.body.shortUrl).toMatch(/^[a-f0-9]{6}$/);
    }

    const uniqueShortUrls = [...new Set(shortUrls)];
    expect(uniqueShortUrls).toHaveLength(urls.length);

    for (let i = 0; i < urls.length; i++) {
      const response = await request(app)
        .get("/redirect")
        .query({ code: shortUrls[i] })
        .expect(200);

      expect(response.body.url).toBe(urls[i]);
    }
  });

  test("should handle URL with query parameters", async () => {
    const urlWithParams = "https://example.com/search?q=test&type=web";

    const response = await request(app)
      .post("/shorten")
      .send({ url: urlWithParams })
      .expect(200);

    const shortUrl = response.body.shortUrl;

    const redirectResponse = await request(app)
      .get("/redirect")
      .query({ code: shortUrl })
      .expect(200);

    expect(redirectResponse.body.url).toBe(urlWithParams);
  });

  test("should handle long URLs", async () => {
    const longUrl = "https://example.com/" + "a".repeat(200);

    const response = await request(app)
      .post("/shorten")
      .send({ url: longUrl })
      .expect(200);

    const shortUrl = response.body.shortUrl;

    const redirectResponse = await request(app)
      .get("/redirect")
      .query({ code: shortUrl })
      .expect(200);

    expect(redirectResponse.body.url).toBe(longUrl);
  });

  test("should maintain data integrity after multiple operations", async () => {
    const createResponse = await request(app)
      .post("/shorten")
      .send({ url: "https://test.com" })
      .expect(200);

    const shortUrl = createResponse.body.shortUrl;

    await request(app).get("/redirect").query({ code: shortUrl }).expect(200);

    await request(app).delete(`/delete/${shortUrl}`).expect(200);

    await request(app).get("/redirect").query({ code: shortUrl }).expect(404);

    const newCreateResponse = await request(app)
      .post("/shorten")
      .send({ url: "https://test.com" })
      .expect(200);

    expect(newCreateResponse.body.shortUrl).toMatch(/^[a-f0-9]{6}$/);
  });
});
