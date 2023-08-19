//const { init } = require("browser-sync");
 console.log('hello');
 import * as flsFunctions from "./modules/functions.js";

 flsFunctions.isWebp();
/* $(function(){
   $('block__title').on( "click", function( event ) {
      $(this).toggleClass('active').next().slideToggle(300);

   });
}); */
const faqs = document.querySelectorAll(".block__item");

faqs.forEach((item) => {
   item.addEventListener("click", () => {
   item.classList.toggle("active");
});
});