const express = require('express');
const cors = require('cors');
const Reddit = require('./functions/Getreddit')
const Wiki = require('./functions/Getwiki');
const SearchGoogle = require('./functions/SearchGoogle');

// let detailed = `Give me a concise overview of ${Rtopic}. 
// Keep it under 150 words, focus on the most important points, 
// and avoid unnecessary details or jargon.`

require('dotenv').config();

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'https://subsussp.github.io',   // Vite default
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

app.get('/api/search/:topic/:Rtopic', async (req, res) => {
  let topic = req.params.topic
  let Rtopic = req.params.Rtopic
  let SimplefiedConcept = `Explain ${Rtopic} in very simple words, as if you are talking to a 10-year-old. 
Use short sentences, clear examples, and avoid difficult terms. 
Return ONLY the simplified explanation as plain text, with no greetings, no extra words.
Keep it under 5 sentences.`
  let brief = `Write a short summary (max 5 sentences) about ${Rtopic}. 
  Return only plain text, no lists, no formatting.
  `
  let reddit;
  const google =await SearchGoogle(Rtopic,process.env.GOOGLE_API,process.env.ENGINE_ID)
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "" },
          { role: "user", content: brief },
        ],
      }),
    });
  const Sresp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "" },
          { role: "user", content: SimplefiedConcept },
        ],
      }),
    });

  const data = await resp.json();
  const Dsresp = await Sresp.json();
  reddit = await Reddit(topic)
  let status = reddit.length > 0
  console.log(reddit)
  console.log(reddit.length)
  if(reddit.length < 1)reddit = await Reddit(Rtopic);
  let wiki = await Wiki(topic)
  res.json({    
    SimplefiedConcept:Dsresp.choices[0].message.content,
    SmallBrief:data.choices[0].message.content,
    DetailedDescription:"",
    SubTopics:[],
    config:{
      Redditfinding:status
    },
    Links:{
        Reddit:reddit,
        Wiki:wiki,
        Websites:google.items,
        twitter:[]
    }})
});
app.post('/api/prompt',async (req,res)=>{
  let search = req.body.search
  try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
  body: JSON.stringify({
    model: "mistralai/mistral-7b-instruct",
    messages: [
      { role: "system", content: "" },
      { role: "user", content: search },
    ],
  }),
});
const response = await resp.json();
console.log(response)
  return res.json(response.choices[0].message)
  } catch (error) {
    res.send(error)
  }

})
app.listen(3001, () => console.log('Server running on port 3001'));
