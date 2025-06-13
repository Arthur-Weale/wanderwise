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

    this.moreInfoBtn = document.getElementById('more-info-btn');
    this.extraInfoBox = document.getElementById('extra-info-box');
    
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

      this.moreInfoBtn.addEventListener('click', async () => {
    if (!this.currentCity) {
      this.errorView.showError('Please select a city first.');
      return;
    }
    this.extraInfoBox.textContent = 'Loading information...';
    const info = await this.fetchExtraInfo(this.currentCity.name);
    this.extraInfoBox.textContent = info;
  });
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

  async fetchExtraInfo(cityName) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Info not found');
    const data = await response.json();
    return data.extract || 'No additional information available.';
  } catch (error) {
    console.error('Extra info fetch error:', error);
    return 'Failed to load extra info.';
  }
}

}