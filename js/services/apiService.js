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
    // Attempt to fetch countries from API
    let countriesData = [];

    const countriesResponse = await fetch(`${GEO_API_URL}/countries?limit=10`, GEO_API_OPTIONS);
    if (countriesResponse.ok) {
      const json = await countriesResponse.json();
      countriesData = json.data;
    } else {
      console.warn("Falling back to hardcoded countries (API not OK)");
      countriesData = [
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'FR', name: 'France' },
        { code: 'JP', name: 'Japan' },
        { code: 'BR', name: 'Brazil' },
        { code: 'IN', name: 'India' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'NG', name: 'Nigeria' },
        { code: 'EG', name: 'Egypt' },
        { code: 'CA', name: 'Canada' }
      ];
    }

    const randomCountry = countriesData[Math.floor(Math.random() * countriesData.length)];

    // Try fetching cities for the country
    const citiesResponse = await fetch(`${GEO_API_URL}/countries/${randomCountry.code}/cities?limit=20`, GEO_API_OPTIONS);
    if (!citiesResponse.ok) throw new Error('Failed to fetch cities for country');
    
    const citiesData = await citiesResponse.json();
    const cityList = citiesData.data;

    if (!cityList || cityList.length === 0) throw new Error('No cities found');

    const randomCity = cityList[Math.floor(Math.random() * cityList.length)];

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

    // Hardcoded fallback city list
    const fallbackCities = [
      {
        id: 'new-york',
        name: 'New York',
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        population: 8419600,
        elevation: 10,
        latitude: 40.7128,
        longitude: -74.0060
      },
      {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japan',
        countryCode: 'JP',
        region: 'Tokyo',
        population: 13929286,
        elevation: 40,
        latitude: 35.6895,
        longitude: 139.6917
      },
      {
        id: 'london',
        name: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        region: 'England',
        population: 8982000,
        elevation: 11,
        latitude: 51.5074,
        longitude: -0.1278
      }
    ];

    const randomFallback = fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
    return randomFallback;
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
  const fallbackCountries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'EG', name: 'Egypt' },
    { code: 'RU', name: 'Russia' }
    // Add more if needed
  ];

  try {
    const response = await fetch(`${GEO_API_URL}/countries?limit=250`, GEO_API_OPTIONS);

    if (!response.ok) {
      console.warn('Falling back to hardcoded countries (API not OK)');
      return fallbackCountries;
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.warn('Falling back to hardcoded countries (no data returned)');
      return fallbackCountries;
    }

    return data.data.map(country => ({
      code: country.code,
      name: country.name
    }));
  } catch (error) {
    console.error('API Error (fetchCountries):', error);
    return fallbackCountries;
  }
}
}