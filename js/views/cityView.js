export class CityView {
  constructor() {
    this.citySection = document.getElementById('city-section');
    this.cityName = document.getElementById('city-name');
    this.cityCountry = document.getElementById('city-country');
    this.cityRegion = document.getElementById('city-region');
    this.cityPopulation = document.getElementById('city-population');
    this.cityElevation = document.getElementById('city-elevation');
    this.cityLatitude = document.getElementById('city-latitude');
    this.cityLongitude = document.getElementById('city-longitude');
    this.imageGallery = document.getElementById('image-gallery');
    this.favoriteBtn = document.getElementById('favorite-btn');
  }
  
  renderCityDetails(city) {
    this.cityName.textContent = `${city.name}, ${city.country}`;
    this.cityCountry.textContent = city.country;
    this.cityRegion.textContent = city.region;
    this.cityPopulation.textContent = city.population ? city.population.toLocaleString() : 'N/A';
    this.cityElevation.textContent = city.elevation ? `${city.elevation} m` : 'N/A';
    this.cityLatitude.textContent = city.latitude;
    this.cityLongitude.textContent = city.longitude;
    this.renderMap(city); 
  }
  
  renderImageGallery(images) {
    this.imageGallery.innerHTML = '';
    
    if (images.length === 0) {
      this.imageGallery.innerHTML = '<p>No images found for this city.</p>';
      return;
    }
    
    images.forEach(image => {
      const imgElement = document.createElement('div');
      imgElement.className = 'image-item';
      imgElement.innerHTML = `
        <img src="${image.webformatURL}" alt="${image.tags}" />
      `;
      this.imageGallery.appendChild(imgElement);
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
    this.citySection.classList.remove('hidden');
  }
  
  hide() {
    this.citySection.classList.add('hidden');
  }

  renderMap(city) {
  // Remove existing map instance if exists
  if (this.map) {
    this.map.remove();
  }

  this.map = L.map('map').setView([city.latitude, city.longitude], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  L.marker([city.latitude, city.longitude]).addTo(this.map)
    .bindPopup(`${city.name}, ${city.country}`)
    .openPopup();
}

}