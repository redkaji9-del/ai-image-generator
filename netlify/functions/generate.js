const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt missing" }),
      };
    }

    // API request to Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "black-forest-labs/flux-schnell", // example stable model
        input: { prompt },
      }),
    });

    const data = await response.json();

    // If Replicate returned an error
    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error }),
      };
    }

    // Replicate returns output images in "urls" or "output"
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
