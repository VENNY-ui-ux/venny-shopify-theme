if (!customElements.get('countdown-timer-bar')) {
  class TG_CountdownTimerBar extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.expirationDate = this.getAttribute('data-expiration-date');
      this.expirationBehavior = this.getAttribute('data-expiration-behavior');

      this.daysElement = this.querySelector(".CountdownTimer__Amount--days");
      this.hoursElement = this.querySelector(".CountdownTimer__Amount--hours");
      this.minutesElement = this.querySelector(".CountdownTimer__Amount--minutes");
      this.secondsElement = this.querySelector(".CountdownTimer__Amount--seconds");

      if(this.expirationDate){
        if(Shopify.designMode & this.closest(".shopify-section").style.display == 'none'){
          this.style.display = 'block';
        }
        this.updateTimer();
      }
    }

    disconnectedCallback(){
      if(this.timeInterval) clearInterval(this.timeInterval);
    }

    
  updateTimer(){
    let _this = this;
    let countDownDate = new Date(this.expirationDate).getTime();
  
    // Update the count down every 1 second
    this.timeInterval = setInterval(function() {
    
      // Get today's date and time
      let nowDateTime = new Date().getTime();
    
      // Find the distance between now and the count down date
      let distance = countDownDate - nowDateTime;
    
      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance >= 0) {
        _this.daysElement.innerHTML = days;
        _this.hoursElement.innerHTML = hours;
        _this.minutesElement.innerHTML = minutes;
        _this.secondsElement.innerHTML = seconds;
      }
    
      if (distance < 0) {
        clearInterval(_this.timeInterval);
        if(_this.expirationBehavior == 'hide'){
          if(Shopify.designMode){
            _this.closest(".shopify-section").style.display = 'none';
          }else{
            _this.closest(".shopify-section").remove();
          }
        }
      }
    }, 1000);
    }

  }

  customElements.define('countdown-timer-bar', TG_CountdownTimerBar);
}
  