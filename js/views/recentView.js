export class RecentView {
  constructor() {
    this.recentList = document.getElementById('recent-list');
  }
  
  renderRecentSearches(recentSearches) {
    this.recentList.innerHTML = '';
    
    recentSearches.forEach(city => {
      const recentItem = document.createElement('div');
      recentItem.className = 'recent-item';
      recentItem.dataset.id = city.id;
      recentItem.textContent = `${city.name}, ${city.country}`;
      this.recentList.appendChild(recentItem);
    });
  }
}