// present.js (Updated)

import Reveal from './node_modules/reveal.js/dist/reveal.esm.js';
import Markdown from './node_modules/reveal.js/plugin/markdown/markdown.esm.js';

// 1. Get the presentation data from local storage
const presData = localStorage.getItem('currentPresentation');

if (presData) {
    // 2. Parse the data from a string back into an object
    const pres = JSON.parse(presData);

    // 3. Build the HTML string for the slides
    let slidesHTML = '';
    pres.slides.forEach(presSlide => {
        if (presSlide.content.type === "title") {
            // Create a title slide
            slidesHTML += `<section data-transition-speed="${presSlide.transitionSpeed}" data-transition="${presSlide.entryTransition} ${presSlide.exitTransition}"><h2>${presSlide.title}</h2><p>${presSlide.content.strings[0] || ''}</p></section>`;
        } else if (presSlide.content.type === "bullet") {
            // Create a bullet point slide
            slidesHTML += `<section data-transition-speed="${presSlide.transitionSpeed}" data-transition="${presSlide.entryTransition} ${presSlide.exitTransition}"><h2>${presSlide.title}</h2><ul>`;
            presSlide.content.strings.forEach(bullet => {
                slidesHTML += `<li>${bullet}</li>`;
            });
            slidesHTML += `</ul></section>`;
        } else if (presSlide.content.type === "markdown") {
            // Create a markdown slide
            slidesHTML += `<section data-transition-speed="${presSlide.transitionSpeed}" data-transition="${presSlide.entryTransition} ${presSlide.exitTransition}" data-markdown><script type="text/template">${presSlide.content.strings[0] || ''}</script></section>`;
        }
    });

    // 4. Create the necessary reveal.js structure and add it to the page
    const revealContainer = document.createElement('div');
    revealContainer.classList.add('reveal');
    revealContainer.innerHTML = `<div class="slides">${slidesHTML}</div>`;
    document.body.appendChild(revealContainer);

    // 5. Initialise the presentation
    let deck = new Reveal({
        plugins: [Markdown]
    });
    deck.initialize();

} else {
    // Show an error message if no presentation data was found
    document.body.innerHTML = '<h1>No presentation data found. Please create a presentation first.</h1>';
}

const theme = localStorage.getItem('theme') || 'white';

if(theme){
    document.head.innerHTML += `<link rel="stylesheet" href="./node_modules/reveal.js/dist/theme/${theme}.css" id="theme">`;
}
let params = new URL(document.location.toString());
const URLSearchParams = params.searchParams;
if(URLSearchParams.has('print-pdf') === true){
    document.head.innerHTML += `<link rel="stylesheet" href="./node_modules/reveal.js/dist/theme/print/pdf.css" type="text/css" media="print">`;
    window.print();
}