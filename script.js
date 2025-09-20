const searchButton = document.getElementById('search-button');
const ingredientInput = document.getElementById('ingredient-input');
const dietSelect = document.getElementById('diet-type');
const mealSelect = document.getElementById('meal-type');
const recipesContainer = document.getElementById('recipes');
const spinner = document.getElementById('spinner');
const favoritesContainer = document.getElementById('favorites');

searchButton.addEventListener('click', () => {
    const ingredients = ingredientInput.value.trim();
    const diet = dietSelect.value;
    const meal = mealSelect.value;

    if (!ingredients) {
        alert('Please enter some ingredients!');
        return;
    }

    fetchRecipes(ingredients, diet, meal);
});

function fetchRecipes(ingredients, diet, meal) {
    spinner.classList.remove('hidden');
    recipesContainer.innerHTML = '';

    let apiUrl = `http://localhost:3000/recipes?ingredients=${encodeURIComponent(ingredients)}`;

    if (diet) apiUrl += `&diet=${encodeURIComponent(diet)}`;
    if (meal) apiUrl += `&type=${encodeURIComponent(meal)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            spinner.classList.add('hidden');
            displayRecipes(data.results || []);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            spinner.classList.add('hidden');
            alert('Failed to fetch recipes. Please try again later.');
        });
}

function displayRecipes(recipes) {
    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found for the given ingredients and filters.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const ingredientsList = Array.isArray(recipe.extendedIngredients)
            ? recipe.extendedIngredients.map(i => `${i.name} (${i.amount} ${i.unit})`).join(', ')
            : 'Ingredients info not available';

        const card = document.createElement('div');
        card.className = 'recipe-card';

        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Ingredients:</strong> ${ingredientsList}</p>
            <a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a>
            <button class="favorite-button">Save to Favorites</button>
        `;

        card.querySelector('.favorite-button').addEventListener('click', () => saveToFavorites(recipe));

        recipesContainer.appendChild(card);
    });

    loadFavorites();
}

function saveToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(fav => fav.id === recipe.id);
    if (!exists) {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites();
    }
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesContainer.innerHTML = '';

    favorites.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <a href="${recipe.sourceUrl}" target="_blank">View Full Recipe</a>
        `;

        favoritesContainer.appendChild(card);
    });
}

loadFavorites();
