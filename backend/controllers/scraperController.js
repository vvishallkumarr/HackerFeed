const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const HN_URL = "https://news.ycombinator.com";
console.log(async()=>{await axios.get(HN_URL)})

const scrapeHackerNews = async () => {
  const response = await axios.get(HN_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; HN-Scraper/1.0; Educational Project)",
    },
    timeout: 15000,
  });

  const $ = cheerio.load(response.data);
  const stories = [];

  const rows = $(".athing").slice(0, 10);

  rows.each((i, el) => {
    const row = $(el);
    const subtextRow = row.next();

    // Title & URL
    const titleEl = row.find(".titleline > a").first();
    const title = titleEl.text().trim();
    const href = titleEl.attr("href") || "";
    const url = href.startsWith("http")
      ? href
      : href.startsWith("item?")
      ? `${HN_URL}/${href}`
      : null;

    const hnId = row.attr("id");

    // Points
    const pointsText = subtextRow.find(".score").text();
    const points = parseInt(pointsText) || 0;

    // Author
    const author = subtextRow.find(".hnuser").text().trim() || "unknown";

    // Posted time
    const postedAt = subtextRow.find(".age").attr("title") || 
                     subtextRow.find(".age").text().trim() ||
                     "unknown";

    // Comment count
    const links = subtextRow.find("a");
    let commentCount = 0;
    links.each((_, link) => {
      const text = $(link).text();
      if (text.includes("comment") || text.includes("discuss")) {
        commentCount = parseInt(text) || 0;
      }
    });

    if (title && hnId) {
      stories.push({
        hnId,
        title,
        url,
        points,
        author,
        postedAt,
        commentCount,
        rank: i + 1,
        scrapedAt: new Date(),
      });
    }
  });

  return stories;
};

const runScraper = async () => {
  const stories = await scrapeHackerNews();

  const results = await Promise.allSettled(
    stories.map((story) =>
      Story.findOneAndUpdate(
        { hnId: story.hnId },
        { $set: story },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  const saved = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { saved, failed, total: stories.length };
};

const triggerScrape = async (req, res) => {
  try {
    const result = await runScraper();
    res.json({
      message: "Scrape completed successfully",
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Scrape error:", error.message);
    res.status(500).json({
      error: "Scraping failed",
      details: error.message,
    });
  }
};

module.exports = { runScraper, triggerScrape };
