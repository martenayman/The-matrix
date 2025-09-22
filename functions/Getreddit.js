const snoowrap = require('snoowrap');
require('dotenv').config();

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

async function Reddit(params) {
    try {
        console.log(params)
        const results = await reddit.search({
            query: `"${params}"`,
            sort: 'relevance',
            time: 'all',
            limit: 10
        });
        return results.map(post => ({
            subreddit: post.subreddit.display_name,
            title: post.title,
            url: `https://reddit.com${post.permalink}`,
            score: post.score,
            created: new Date(post.created_utc * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
        }))
    } catch (err) {
        console.error(err);
        return err
    }
}
module.exports = Reddit