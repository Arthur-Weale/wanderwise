export class RecentModel {
  constructor() {
    this.recentSearches = [];
  }

  getRecentSearches() {
    return this.recentSearches;
  }

  saveRecentSearch(city) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter((search) => search.id !== city.id);

    // Add to beginning
    this.recentSearches.unshift(city);

    // Limit to 5 items
    if (this.recentSearches.length > 5) {
      this.recentSearches.pop();
    }
  }
}
