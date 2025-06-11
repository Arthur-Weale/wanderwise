export class ErrorView {
  constructor() {
    this.errorSection = document.getElementById('error-section');
    this.errorMessage = document.getElementById('error-message');
  }
  
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorSection.classList.remove('hidden');
  }
  
  hide() {
    this.errorSection.classList.add('hidden');
  }
}