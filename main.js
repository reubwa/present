import * as types from './types.js';
import * as editors from './editors.js';
import * as dynamicElements from './dynamicElements.js';
let sidebar = document.querySelector('.sidebar');
let currentSlide = 0;
function newPres(name){
    pres = new types.Presentation(name,[]);
    pres.addSlide("Title","Title");
}
function initLoadSidebar(){
    pres.slides.forEach(presSlide => {
        if(presSlide.number == currentSlide){
            sidebar.innerHTML += dynamicElements.sidebarSlideSelected(presSlide.name, presSlide.type);
        }else{sidebar.innerHTML += dynamicElements.sidebarSlide(presSlide.name, presSlide.type);
            sidebar.innerHTML += dynamicElements.sidebarSlide(presSlide.name, presSlide.type);
        }
    });
}