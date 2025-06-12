import { ApiService } from '../services/apiService.js';
import { StorageService } from '../services/storageService.js';
import { CityView } from '../views/cityView.js';
import { ErrorView } from '../views/errorView.js';
import { LoadingView } from '../views/loadingView.js';

export class CityController {
  constructor() {
    this.apiService = new ApiService();
    this.storageService = new StorageService();
    this.cityView = new CityView();
    this.errorView = new ErrorView();
    this.loadingView = new LoadingView();
    this.currentCity = null;
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    document.getElementById('search-btn').addEventListener('click', () => this.searchCity());
    document.getElementById('city-search').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchCity();
    });
    document.getElementById('random-btn').addEventListener('click', () => this.getRandomCity());
  }
  
  async searchCity() {
    const cityName = document.getElementById('city-search').value.trim();
    const countryCode = document.getElementById('country-filter').value;
    
    if (!cityName) {
      this.errorView.showError('Please enter a city name');
      return;
    }
    
    try {
      this.loadingView.show();
      this.errorView.hide();
      
      const cityData = await this.apiService.fetchCityData(cityName, countryCode);
      if (!cityData || cityData.length === 0) {
        throw new Error('City not found. Please try another name.');
      }
      
      this.currentCity = cityData[0];
      const images = await this.apiService.fetchCityImages(this.currentCity.name);
      
      this.storageService.saveRecentSearch(this.currentCity);
      
      this.cityView.renderCityDetails(this.currentCity);
      this.cityView.renderImageGallery(images);
      this.cityView.updateFavoriteButton(
        this.storageService.isFavorite(this.currentCity.id)
      );
      this.cityView.show();
      
      document.getElementById('city-search').value = '';
      this.loadingView.hide();
    } catch (error) {
      this.loadingView.hide();
      this.errorView.showError(error.message);
      console.error('Search error:', error);
    }
  }
  
  async getRandomCity() {
    try {
      this.loadingView.show();
      this.errorView.hide();
      
      this.currentCity = await this.apiService.fetchRandomCity();
      const images = await this.apiService.fetchCityImages(this.currentCity.name);
      
      this.storageService.saveRecentSearch(this.currentCity);
      
      this.cityView.renderCityDetails(this.currentCity);
      this.cityView.renderImageGallery(images);
      this.cityView.updateFavoriteButton(
        this.storageService.isFavorite(this.currentCity.id)
      );
      this.cityView.show();
      
      this.loadingView.hide();
    } catch (error) {
      this.loadingView.hide();
      this.errorView.showError(error.message);
      console.error('Random city error:', error);
    }
  }
  
  getCurrentCity() {
    return this.currentCity;
  }
}