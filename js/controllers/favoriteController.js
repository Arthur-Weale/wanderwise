import { StorageService } from '../services/StorageService.js';
import { FavoriteView } from '../views/FavoriteView.js';
import { CityController } from './CityController.js';

export class FavoriteController {
  constructor(cityController) {
    this.storageService = new StorageService();
    this.favoriteView = new FavoriteView();
    this.cityController = cityController;
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    document.getElementById('favorite-btn').addEventListener('click', () => this.toggleFavorite());
    document.getElementById('favorites-btn').addEventListener('click', () => this.showFavorites());
    document.getElementById('close-favorites').addEventListener('click', () => this.hideFavorites());
    
    document.getElementById('favorites-list').addEventListener('click', (e) => {
      if (e.target.closest('.favorite-item')) {
        const cityId = e.target.closest('.favorite-item').dataset.id;
        this.loadFavoriteCity(cityId);
      }
    });
  }
  
  toggleFavorite() {
    const currentCity = this.cityController.getCurrentCity();
    if (!currentCity) return;
    
    const isFavorite = this.storageService.isFavorite(currentCity.id);
    
    if (isFavorite) {
      this.storageService.removeFavorite(currentCity.id);
      this.favoriteView.updateFavoriteButton(false);
    } else {
      this.storageService.addFavorite(currentCity);
      this.favoriteView.updateFavoriteButton(true);
    }
    
    if (this.favoriteView.isVisible()) {
      this.favoriteView.renderFavoritesList(this.storageService.getFavorites());
    }
  }
  
  showFavorites() {
    this.favoriteView.renderFavoritesList(this.storageService.getFavorites());
    this.favoriteView.show();
  }
  
  hideFavorites() {
    this.favoriteView.hide();
  }
  
  async loadFavoriteCity(cityId) {
    const favorites = this.storageService.getFavorites();
    const city = favorites.find(fav => fav.id === cityId);
    
    if (city) {
      try {
        this.cityController.loadingView.show();
        const images = await this.cityController.apiService.fetchCityImages(city.name);
        
        this.cityController.currentCity = city;
        this.cityController.cityView.renderCityDetails(city);
        this.cityController.cityView.renderImageGallery(images);
        this.cityController.cityView.updateFavoriteButton(true);
        this.cityController.cityView.show();
        
        this.hideFavorites();
        this.cityController.loadingView.hide();
      } catch (error) {
        this.cityController.loadingView.hide();
        this.cityController.errorView.showError('Failed to load city details');
      }
    }
  }
}