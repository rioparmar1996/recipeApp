const mealsE1 =  document.getElementById("meals");
const favContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    addMeals(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}

async function getMealBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

    const respData = await resp.json();
    const meals = respData.meals;
    console.log(meals);
    return meals;
}

function addMeals(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
            ${random ? `
            <span class="random">Random Recipe</span>` : ""}
            <img 
                src="${mealData.strMealThumb}" 
                alt="${mealData.strMeal}"  >
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div> `
        const btn = meal.querySelector(".meal-body .fav-btn");

        btn.addEventListener("click", () => {
            if(btn.classList.contains("active")){
                removeMealsLS(mealData.idMeal);
                btn.classList.remove("active");
            }else{
                addMealsLS(mealData.idMeal);
                btn.classList.add("active");
            }
            fetchFavMeals();
        });
    mealsE1.appendChild(meal);
}

function addMealsLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds,mealId]));
    
}

function removeMealsLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    favContainer.innerHTML = "";
    const mealIds = getMealsLS();
    
    const meals = [];
    for(let i=0; i < mealIds.length; i++){
        const mealsId = mealIds[i];
        meal = await getMealById(mealsId);

        addMealFav(meal);
    }
}

function addMealFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" 
        alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
        <button class="clear">
        <i class="fas fa-window-close"></i>
        </button>`;

        const btn = favMeal.querySelector(".clear");

        btn.addEventListener('click', () => {
            removeMealsLS(mealData.idMeal);
            fetchFavMeals();
        });

        favContainer.appendChild(favMeal);
}

searchBtn.addEventListener("click", async () => {
        mealsE1.innerHTML = "";
        const searchkey = searchTerm.value;
        const meals = await getMealBySearch(searchkey);

        if(meals){
            meals.forEach((meal) =>{
            addMeals(meal);
        }); }
});
