export class CityModel {
  constructor() {
    this.currentCity = null;
  }

  setCurrentCity(city) {
    this.currentCity = city;
  }

  getCurrentCity() {
    return this.currentCity;
  }
}
