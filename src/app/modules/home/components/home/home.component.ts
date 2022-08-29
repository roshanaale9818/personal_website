import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    $('.nav-menu').hide();
$('.navToggler').on('click', function() {
    $('.main-content').toggleClass('slide-content');
    $('.nav-wrap').toggleClass('show-menu');
    $('.inner-nav').toggleClass('show');
    $('.nav-menu').toggle();

})
$(".nav-item").on("click", function(e) {
    $("li.nav-item").removeClass("active");
    $(this).addClass("active");
});
  }

}
