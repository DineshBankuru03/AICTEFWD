const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const API_KEY = '14389cbd081249a19be5ab4a5bd3a7e6';

app.get('/recipes', async (req, res) => {
    const { ingredients } = req.query;

    try {
        // Step 1: Get recipes matching ingredients
        const findResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
                ingredients,
                number: 10,
                apiKey: API_KEY
            }
        });

        const recipesBrief = findResponse.data;

        // Step 2: Get full details for each recipe
        const detailedPromises = recipesBrief.map(r =>
            axios.get(`https://api.spoonacular.com/recipes/${r.id}/information`, {
                params: {
                    apiKey: API_KEY
                }
            })
        );

        const detailedResponses = await Promise.all(detailedPromises);
        const recipesDetailed = detailedResponses.map(response => response.data);

        res.json({ results: recipesDetailed });
    } catch (error) {
        console.error('Proxy server error:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular API' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
