"use strict"
//Spollers
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
   //получение обічніх спойлеров
   const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
   });
   //инициализаия обічніх спойлеров
   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   }

   // получение слайдеров с медиа запросами
   const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0];
   });
   // инициализация Спойлеров с медиа запросами
   if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach(item => {
         const params = item.dataset.spollers;
         const breakpoint = {};
         const paramsArray = params.split(",");
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
         breakpoint.item = item;
         breakpointsArray.push(breakpoint);
      });
      //получаем уникальніе брейкпоинті
      let mediaQueries = breakpointsArray.map(function (item) {
         return `(` + item.type + "-width: " + item.value + "px)," + item.value + `,` + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
         return self.indexOf(item) === index;
      });

      //Работаем с каждім брейкпоитном 
      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(",");
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);
 
         //об'єкти з нужними условиями
         const spollersArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType){
               return true;
            }
         });

         //Собітие
         matchMedia.addListener(function () {// addListener
            initSpollers(spollersArray, matchMedia); 
         });
         initSpollers(spollersArray, matchMedia);
      });
   }  
}

//ініціалізація
function initSpollers(spollersArray, matchMedia = false) {
   spollersArray.forEach(spollersBlock => {
      spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
      if (matchMedia.matches || !matchMedia) {
         spollersBlock.classList.add('_init');
         initSpollerBody(spollersBlock);
         spollersBlock.addEventListener("click", setSpollerAction);
      } else {
         spollersBlock.classList.remove('_init');
         initSpollerBody(spollersBlock, false);
         spollersBlock.removeEventListener("click", setSpollerAction);
      }
   });

   //Работа з контентом

   function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
         spollerTitles.forEach(spollerTitle => {
            if (hideSpollerBody) {
               spollerTitle.removeAttribute('tabindex');
               if (!spollerTitle.classList.contains('_active')) {
                  spollerTitle.nextElementSibling.hidden = true;
               }
            } else {
               spollerTitle.setAttribute('tabindex', '-1');
               spollerTitle.nextElementSibling.hidden = false;
            }
         });
      }
   }

   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
         const spollerTitle = el.hasAttribute('data-spollers') ? el : el.closest('[data-spoller]');
         const spollersBlock = spollerTitle.closest('[data-spollers]');
         const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true :false;
         if (!spollersBlock.querySelectorAll('_slide').length) {
            if (oneSpoller && !spollerTitle.classList.contains('_active')) {
               hideSpollerBody(spollersBlock);
            }
            spollerTitle.classList.toggle('_active');
            _slideToggle(spollerTitle.nextElementSibling, 500);
         }
         e.preventDefault();
      }
   }

   function hideSpollerBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
      if (spollerActiveTitle) {
         spollerActiveTitle.classList.remove('_active');
         _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
   }
}

//slideToggle
let _slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
};
let _slideDown = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionProperty = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
}
};
let _slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return _slideDown(target, duration);
   } else {
      return _slideUp(target, duration);
   }
};



const isMobile = {
  Android: function () {
     return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
     return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
     return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
     return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
     return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
     return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows());
  }
};

if (isMobile.any()) {
  document.body.classList.add('_touch');

  let menuArrows = document.querySelectorAll('.menu__arrow');
  if (menuArrows.length > 0) {
     for (let index = 0; index < menuArrows.length; index++) {
        const menuArrow = menuArrows[index];
        menuArrow.addEventListener("click", function(e){
           menuArrow.parentElement.classList.toggle('_active');
        });
     }
  }
}  else {
  document.body.classList.add('_pc');
}

//Меню Бургер
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
const menuCart = document.querySelector('.menu__cart');

if (iconMenu) {
  iconMenu.addEventListener("click", function(e){
  document.body.classList.toggle('_lock');
  iconMenu.classList.toggle('_active');
  menuBody.classList.toggle('_active');
  menuCart.classList.toggle('_active');
  });
}

//Прокрутка при клике 
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
  menuLinks.forEach(menuLink => {
     menuLink.addEventListener("click", onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
     const menuLink = e.target;
     if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
        const gotoBlock = document.querySelector(menuLink.dataset.goto);
        const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY -document.querySelector('header').offsetHeight;

        if (iconMenu.classList.contains('_active')){
           document.body.classList.remove('_lock');
           iconMenu.classList.remove('_active');
           menuBody.classList.remove('_active');
        }
        window.scrollTo({
           top: gotoBlockValue,
           behavior: "smooth"
        });
        e.preventDefault();
     } 
  }
} 
/*====================================================*/
/* window.onload = function () {
   document.addEventListener("click", documentActions);

function documentActions(e) {
   const targetElement = e.target;
   if (targetElement.classList.contains('search-form__icon')) {
      document.querySelector('.search').classList.toggle('_active');
   }
}
} */
const myButton = document.querySelector('.search');
if (myButton) {
   myButton.addEventListener("click", function(e){
   myButton.classList.toggle('_active');
   });
 }
 const mySpoiler = document.querySelector('.about-us__spoiler');
 if (mySpoiler) {
    mySpoiler.addEventListener("click", function(e){
    mySpoiler.classList.toggle('_active');
    });
  }
 

/*==================================================================*/
const swiper = new Swiper('.feature-item__slider', {
   // Optional parameters
   loop: false,
   slidesPerView: 5,
   spaceBetween: 30,
   breakpoints: {
      310: {
          slidesPerView: 1,
          spaceBetween: 15,
      },
      640: {
          slidesPerView: 3,
      },
      768: {
          slidesPerView: 4,
          spaceBetween: 20,
      },
      968: {
         slidesPerView: 5,
         spaceBetween: 30,
      }
  },
   // Navigation arrows
   navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
   },
 });

 const swiperStuff = new Swiper('.stuff__slider', {
   // Optional parameters
   loop: true,
   slidesPerView: 3,
   spaceBetween: 20,
   speed:800,
   breakpoints:{
      968: {
         slidesPerView: 2,
         spaceBetween: 15,
      },
      310: {
         slidesPerView: 1,
         spaceBetween: 0,
      }
   },
   
   // Navigation arrows
   navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
   },
 });





 const swiperBlog = new Swiper('.blog__slider', {
   // Optional parameters
   loop: true,
   slidesPerView: 3,
   spaceBetween: 30,
   speed:800,
    breakpoints:{
      968: {
         slidesPerView: 3,
         spaceBetween: 30,
      },
      767: {
         slidesPerView: 2,
         spaceBetween: 15,
      },
      310: {
         slidesPerView: 1,
         spaceBetween: 0,
      }
   }, 
   
   // Navigation arrows
   navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
   },
 });


 
 const swiperHeader = new Swiper('.header__slider', {
   // Optional parameters
   loop: true,
   slidesPerView: 1,
   speed:800,
   }, 

 );

