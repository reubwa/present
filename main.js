class Slide {
    constructor(title, content, number) {
        this.title = title;
        this.content = content;
        this.number = number;
    }
}

class SlideContent {
    constructor(type, strings = []) {
        this.type = type;
        this.strings = strings;
    }
}

class Presentation {
    constructor(title, slides = []) {
        this.title = title;
        this.slides = slides;
    }

    addSlide(title, type) {
        const slideNumber = this.slides.length + 1;
        const newSlide = new Slide(title, new SlideContent(type), slideNumber);
        this.slides.push(newSlide);
        return newSlide;
    }

    removeSlide(number) {
        this.slides = this.slides.filter(slide => slide.number !== number);
        // Reassign slide numbers
        this.slides.forEach((slide, index) => {
            slide.number = index + 1;
        });
    }
}

// Note: The 'type' parameter is unused here, but kept for future use (e.g., showing different icons).
function sidebarSlide(name, type) {
    return `
        <div class="sidebar-el">
            <span class="material-symbols-rounded">text_fields</span>
            <p>${name}</p>
        </div>
    `;
}

function sidebarSlideSelected(name, type) {
    return `
        <div class="sidebar-el-selected">
            <span class="material-symbols-rounded">title</span>
            <p>${name}</p>
        </div>
    `;
}

// --- SCRIPT LOGIC ---

const sidebar = document.getElementById("sb");
let currentSlide = 1; // FIX 1: Start at 1 to match slide numbering.
let pres; // FIX 2: Declare 'pres' in the correct scope.

function newPres(name) {
    pres = new Presentation(name, []);
    pres.addSlide("Title", "Title");
    renderSidebar(); // Changed function name for clarity
}

function renderSidebar() {
    let sidebarHTML = ""; // FIX 3: Build the HTML string first.

    pres.slides.forEach(presSlide => {
        // FIX 4: Use correct properties 'title' and 'content.type'.
        const slideTitle = presSlide.title;
        const slideType = presSlide.content.type;

        if (presSlide.number == currentSlide) {
            sidebarHTML += sidebarSlideSelected(slideTitle, slideType);
        } else {
            sidebarHTML += sidebarSlide(slideTitle, slideType);
        }
    });

    sidebar.innerHTML = sidebarHTML; // FIX 3 (cont.): Update the DOM only once.
}   