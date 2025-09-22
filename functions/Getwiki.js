async function Wiki(topic){
      const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          topic
        )}&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        return data   
    }
module.exports = Wiki

