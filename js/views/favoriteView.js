export class FavoriteView {
  constructor() {
    this.favoritesSection = document.getElementById('favorites-section');
    this.favoritesList = document.getElementById('favorites-list');
    this.favoriteBtn = document.getElementById('favorite-btn');
  }
  
  renderFavoritesList(favorites) {
    this.favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
      this.favoritesList.innerHTML = '<p class="no-favorites">No favorite cities yet.</p>';
      return;
    }
    
    favorites.forEach(city => {
      const favoriteItem = document.createElement('div');
      favoriteItem.className = 'favorite-item';
      favoriteItem.dataset.id = city.id;
      favoriteItem.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <div>
          <strong>${city.name}</strong>
          <p>${city.country}</p>
        </div>
      `;
      this.favoritesList.appendChild(favoriteItem);
    });
  }
  
  updateFavoriteButton(isFavorite) {
    if (isFavorite) {
      this.favoriteBtn.classList.add('active');
    } else {
      this.favoriteBtn.classList.remove('active');
    }
  }
  
  show() {
    this.favoritesSection.classList.remove('hidden');
  }
  
  hide() {
    this.favoritesSection.classList.add('hidden');
  }
  
  isVisible() {
    return !this.favoritesSection.classList.contains('hidden');
  }
}