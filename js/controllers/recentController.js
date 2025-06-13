import { StorageService } from '../services/storageService.js';
import { RecentView } from '../views/recentView.js';
import { CityController } from './cityController.js';

export class RecentController {
  constructor(cityController) {
    this.storageService = new StorageService();
    this.recentView = new RecentView();
    this.cityController = cityController;

    this.initEventListeners();
    this.renderRecentSearches();
  }

  initEventListeners() {
    document.getElementById('recent-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('recent-item')) {
        const cityId = e.target.dataset.id;
        this.loadRecentCity(cityId);
      }
    });
  }

  renderRecentSearches() {
    this.recentView.renderRecentSearches(this.storageService.getRecentSearches());
  }

  async loadRecentCity(cityId) {
    const recentSearches = this.storageService.getRecentSearches();
    const city = recentSearches.find((city) => city.id === cityId);

    if (city) {
      try {
        this.cityController.loadingView.show();
        const images = await this.cityController.apiService.fetchCityImages(city.name);

        this.cityController.currentCity = city;
        this.cityController.cityView.renderCityDetails(city);
        this.cityController.cityView.renderImageGallery(images);
        this.cityController.cityView.updateFavoriteButton(this.storageService.isFavorite(city.id));
        this.cityController.cityView.show();

        this.cityController.loadingView.hide();
      } catch (error) {
        this.cityController.loadingView.hide();
        this.cityController.errorView.showError('Failed to load city details');
      }
    }
  }
}
