// API Configuration
const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '531a0d63c9msh1c39074e5e042b7p1416bdjsna0b645cce4ea', // Replace with your actual API key
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
  }
};

const PIXABAY_API_URL = 'https://pixabay.com/api/';
const PIXABAY_API_KEY = '33672765-518d7195c88fbb2c43ba1bb68'; // Replace with your actual API key

export class ApiService {
  async fetchCityData(cityName, countryCode = '') {
    try {
      const url = `${GEO_API_URL}/cities?namePrefix=${encodeURIComponent(cityName)}${countryCode ? `&countryIds=${countryCode}` : ''}`;
      const response = await fetch(url, GEO_API_OPTIONS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch city data');
      }
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('City not found');
      }
      
      // Map to our desired structure
      return data.data.map(city => ({
        id: city.id,
        name: city.name,
        country: city.country,
        countryCode: city.countryCode,
        region: city.region,
        population: city.population,
        elevation: city.elevationMeters,
        latitude: city.latitude,
        longitude: city.longitude
      }));
    } catch (error) {
      console.error('API Error (fetchCityData):', error);
      throw new Error('Failed to retrieve city information. Please try again later.');
    }
  }
  
  async fetchRandomCity() {
    try {
      // First, get a random country
      const countriesResponse = await fetch(`${GEO_API_URL}/countries?limit=10`, GEO_API_OPTIONS);
      const countriesData = await countriesResponse.json();
      
      if (!countriesData.data || countriesData.data.length === 0) {
        throw new Error('Failed to fetch countries');
      }
      
      // Pick a random country
      const randomCountry = countriesData.data[Math.floor(Math.random() * countriesData.data.length)];
      
      // Get cities for that country
      const citiesResponse = await fetch(`${GEO_API_URL}/countries/${randomCountry.code}/cities?limit=20`, GEO_API_OPTIONS);
      const citiesData = await citiesResponse.json();
      
      if (!citiesData.data || citiesData.data.length === 0) {
        throw new Error('Failed to fetch cities for country');
      }
      
      // Pick a random city
      const randomCity = citiesData.data[Math.floor(Math.random() * citiesData.data.length)];
      
      return {
        id: randomCity.id,
        name: randomCity.name,
        country: randomCountry.name,
        countryCode: randomCountry.code,
        region: randomCity.region,
        population: randomCity.population,
        elevation: randomCity.elevationMeters,
        latitude: randomCity.latitude,
        longitude: randomCity.longitude
      };
    } catch (error) {
      console.error('API Error (fetchRandomCity):', error);
      throw new Error('Failed to retrieve a random city. Please try again.');
    }
  }
  
  async fetchCityImages(cityName) {
    try {
      const url = `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(cityName)}+city&image_type=photo&per_page=9`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      
      if (!data.hits || data.hits.length === 0) {
        return []; // Return empty array if no images found
      }
      
      return data.hits.map(image => ({
        id: image.id,
        previewURL: image.previewURL,
        webformatURL: image.webformatURL,
        tags: image.tags
      }));
    } catch (error) {
      console.error('API Error (fetchCityImages):', error);
      return []; // Return empty array on error
    }
  }
  
  async fetchCountries() {
    try {
      const response = await fetch(`${GEO_API_URL}/countries?limit=250`, GEO_API_OPTIONS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      
      const data = await response.json();
      
      if (!data.data) {
        throw new Error('No country data available');
      }
      
      return data.data.map(country => ({
        code: country.code,
        name: country.name
      }));
    } catch (error) {
      console.error('API Error (fetchCountries):', error);
      return [];
    }
  }
}