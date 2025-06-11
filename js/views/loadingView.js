export class LoadingView {
  constructor() {
    this.loadingSection = document.getElementById('loading-section');
  }
  
  show() {
    this.loadingSection.classList.remove('hidden');
  }
  
  hide() {
    this.loadingSection.classList.add('hidden');
  }
}