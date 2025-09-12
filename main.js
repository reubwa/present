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

let titleEditor = `
    <div class="VStack">
        <input id="title" placeholder="Title" oninput="saveSlide()"/>
        <input id="subtitle" placeholder="Subtitle" oninput="saveSlide()"/>
    </div>
    `;

// --- SCRIPT LOGIC ---

const sidebar = document.getElementById("sb");
const addSlideDlg = document.getElementById("addSlideDlg");
let currentSlide = 1;
let pres;

function newPres(name) {
    pres = new Presentation(name, []);
    pres.addSlide("Title", "title");
    requestAnimationFrame(renderSidebar);
    requestAnimationFrame(showEditor);
}

function renderSidebar() {
    let sidebarHTML = "";

    pres.slides.forEach(presSlide => {
        const slideTitle = presSlide.title;
        const slideType = presSlide.content.type;

        if (presSlide.number == currentSlide) {
            sidebarHTML += sidebarSlideSelected(slideTitle, slideType);
        } else {
            sidebarHTML += sidebarSlide(slideTitle, slideType);
        }
    });

    sidebar.innerHTML = sidebarHTML;
}

function newBulletSlide() {
    pres.addSlide("New Slide", "bullet");
    const dlg = document.getElementById("addSlideDlg");
    dlg.hidePopover();
    renderSidebar(); // Add this back
}

function showEditor(){
    // Get the slide using the correct 0-based index
    const slide = pres.slides[currentSlide - 1];

    // First, check if the slide actually exists, then check its type
    if (slide && slide.content.type === "title") {
        document.getElementById("editor").innerHTML = titleEditor;
    }
}

function saveSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return; // Safety check in case there's no slide

    const titleInput = document.getElementById("title");
    const subtitleInput = document.getElementById("subtitle");

    // Update the data model
    slide.title = titleInput.value || "Title";
    slide.content.strings = [subtitleInput.value || ""]; // Storing an empty string is fine

    // Re-render the sidebar to show the new title
    renderSidebar();
}

function showSlideDlg() {
    const dlg = document.getElementById("addSlideDlg");
    dlg.showPopover();
}