// LocalStorage keys
const FAVORITES_KEY = 'wanderwise_favorites';
const RECENT_SEARCHES_KEY = 'wanderwise_recent_searches';

export class StorageService {
  getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(city) {
    const favorites = this.getFavorites();

    // Check if already favorited
    if (!favorites.some((fav) => fav.id === city.id)) {
      favorites.push(city);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  removeFavorite(cityId) {
    let favorites = this.getFavorites();
    favorites = favorites.filter((fav) => fav.id !== cityId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  isFavorite(cityId) {
    const favorites = this.getFavorites();
    return favorites.some((fav) => fav.id === cityId);
  }

  saveRecentSearch(city) {
    let recentSearches = this.getRecentSearches();

    // Remove if already exists
    recentSearches = recentSearches.filter((search) => search.id !== city.id);

    // Add to beginning
    recentSearches.unshift(city);

    // Limit to 5 items
    if (recentSearches.length > 5) {
      recentSearches.pop();
    }

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  }

  getRecentSearches() {
    const recentSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return recentSearches ? JSON.parse(recentSearches) : [];
  }
}
