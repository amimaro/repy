import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Repy';
  length: Number = 0;
  templateSpinner: string = '<img src="assets/loader.svg">';

  public constructor() {
    this.toggleNavBar();
  }

  public ngOnInit() {
  }

  toggleNavBar() {
    document.addEventListener('DOMContentLoaded', function() {
      var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      var $navbarItems = Array.prototype.slice.call(document.querySelectorAll('.navbar-item'), 0);
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(function($el) {
          $el.addEventListener('click', function() {
            var target = $el.dataset.target;
            var $target = document.getElementById(target);
            $el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
          });
        });
        $navbarItems.forEach(function($el) {
          $el.addEventListener('click', function() {
            var $target = document.getElementById('navMenu');
            if ($target.getAttribute('class').split(' ').indexOf('is-active') >= 0) {
              $target.classList.toggle('is-active');
              $navbarBurgers.forEach(function($el) {
                $el.classList.toggle('is-active');
              });
            }
          });
        });
      }
    });
  }

}
