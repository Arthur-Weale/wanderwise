export class FavoriteModel {
  constructor() {
    this.favorites = [];
  }

  getFavorites() {
    return this.favorites;
  }

  addFavorite(city) {
    // Prevent duplicates
    if (!this.favorites.some((fav) => fav.id === city.id)) {
      this.favorites.push(city);
    }
  }

  removeFavorite(cityId) {
    this.favorites = this.favorites.filter((fav) => fav.id !== cityId);
  }

  isFavorite(cityId) {
    return this.favorites.some((fav) => fav.id === cityId);
  }
}
