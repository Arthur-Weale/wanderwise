import { CityController } from './controllers/CityController.js';
import { FavoriteController } from './controllers/FavoriteController.js';
import { RecentController } from './controllers/RecentController.js';
import { ApiService } from './services/ApiService.js';

// Initialize controllers
const cityController = new CityController();
const favoriteController = new FavoriteController(cityController);
const recentController = new RecentController(cityController);

// Populate country filter dropdown
async function populateCountryFilter() {
  const apiService = new ApiService();
  const countries = await apiService.fetchCountries();
  const countryFilter = document.getElementById('country-filter');
  
  countryFilter.innerHTML = '<option value="">Filter by country...</option>';
  
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = country.name;
    countryFilter.appendChild(option);
  });
}

// Initialize the app
populateCountryFilter();