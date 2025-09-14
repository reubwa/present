
class Slide {
    constructor(title, content, number, entryTransition, exitTransition, transitionSpeed, autoAnimate) {
        this.title = title;
        this.content = content;
        this.number = number;
        this.entryTransition = entryTransition || 'fade';
        this.exitTransition = exitTransition || 'fade';
        this.transitionSpeed = transitionSpeed || 'default';
    }
}

class SlideContent {
    constructor(type, strings = []) {
        this.type = type;
        this.strings = strings;
    }
}

class Presentation {
    constructor(title, theme, slides = []) {
        this.title = title;
        this.slides = slides;
        this.theme = theme || 'white';
    }

    addSlide(title, type) {
        const slideNumber = this.slides.length + 1;
        // REFINEMENT: Ensure new bullet slides start with one empty string.
        const initialStrings = type === 'bullet' ? [''] : [];
        const newSlide = new Slide(title, new SlideContent(type, initialStrings), slideNumber, 'fade', 'fade', 'default');
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

function typeToIcon(type) {
    switch (type) {
        case "title":
            return "title";
        case "bullet":
            return "format_list_bulleted";
        case "markdown":
            return "markdown";
        case "image":
            return "image";
        case "maths":
            return "calculate";
        case "code":
            return "code";
        default:
            return "description";
    }
}

function sidebarSlide(name, type) {
    return `
        <div class="sidebar-el" data-slide-number="${name}">
            <span class="material-symbols-rounded">${type}</span>
            <p>${name}</p>
        </div>
    `;
}

function sidebarSlideSelected(name, type) {
    return `
        <div class="sidebar-el-selected" data-slide-number="${name}">
            <span class="material-symbols-rounded">${type}</span>
            <p>${name}</p>
        </div>
    `;
}

// REFINEMENT: Parameterized functions for safer HTML generation.
function midBullet(index, text) {
    return `
        <div class="HStack">
            <p>•</p>
            <input class="bullet" id="b-${index}" value="${text}" placeholder="Bullet" oninput="saveBulletSlide()"/>
            <button onclick="moveBulletUp(${index})"><span class="material-symbols-rounded">arrow_drop_up</span></button>
            <button onclick="moveBulletDown(${index})"><span class="material-symbols-rounded">arrow_drop_down</span></button>
            <button onclick="deleteBullet(${index})"><span class="material-symbols-rounded">delete</span></button>
        </div>    
    `;
}

function bottomBullet(index, text) {
    return `
        <div class="HStack">
            <p>•</p>
            <input class="bullet" id="b-${index}" value="${text}" placeholder="Bullet" oninput="saveBulletSlide()"/>
            <button onclick="moveBulletUp(${index})"><span class="material-symbols-rounded">arrow_drop_up</span></button>
            <button onclick="moveBulletDown(${index})" id="b-dis"><span class="material-symbols-rounded">arrow_drop_down</span></button>
            <button onclick="deleteBullet(${index})"><span class="material-symbols-rounded">delete</span></button>
        </div> 
    `;
}

function topBullet(index, text){
    const isOnlyBullet = pres.slides[currentSlide - 1].content.strings.length === 1;
    return `
        <div class="HStack">
            <p>•</p>
            <input class="bullet" id="b-${index}" value="${text}" placeholder="Bullet" oninput="saveBulletSlide()"/>
            <button onclick="moveBulletUp(${index})" id="b-dis"><span class="material-symbols-rounded">arrow_drop_up</span></button>
            <button onclick="moveBulletDown(${index})" ${isOnlyBullet ? 'disabled' : ''}><span class="material-symbols-rounded">arrow_drop_down</span></button>
            <button onclick="deleteBullet(${index})" ${isOnlyBullet ? 'disabled' : ''}><span class="material-symbols-rounded">delete</span></button>
        </div>
    `;
}

let addBulletButton = `
    <button onclick="addBullet()"><span class="material-symbols-rounded">format_list_bulleted_add</span></button>
    `;

let titleEditor = `
    <div class="VStack">
        <input id="title" placeholder="Title" oninput="saveTitleSlide()"/>
        <input id="subtitle" placeholder="Subtitle" oninput="saveTitleSlide()"/>
    </div>
    `;

let markdownEditor = `
    <div class="VStack">
            <textarea id="md-editor" placeholder="Markdown" oninput="saveMarkdownSlide()"></textarea>
    </div>
    `;

let imageEditor = `
    <div class="VStack">
        <input id="title" placeholder="Title" style="text-align: left;" oninput="saveImageSlide()"/>
        <input id="image-url" placeholder="Image URL" oninput="saveImageSlide()"/>
    </div>
    `;

let mathsEditor = `
    <div class="VStack">
        <input id="title" placeholder="Title" oninput="saveMathsSlide()" style="text-align: left;"/>
        <textarea id="maths-editor" placeholder="LaTeX" oninput="saveMathsSlide()"></textarea>
    </div>
    `;

let codeEditor = `
    <div class="VStack">
            <input id="title" placeholder="Title" oninput="saveCodeSlide()" style="text-align: left;"/>
            <textarea id="code-editor" placeholder="Code" oninput="saveCodeSlide()"></textarea>
    </div>
    `;

// --- SCRIPT LOGIC ---

const sidebar = document.getElementById("sb");
let currentSlide = 1;
let pres;

function newPres(name) {
    pres = new Presentation(name, []);
    pres.addSlide("Title", "title");
    renderSidebar();
    showEditor();
    document.title = name + " - Present";
}

function showSlideDlg(){
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.showPopover();
}

function renderSidebar() {
    let sidebarHTML = "";
    pres.slides.forEach(presSlide => {
        const slideTitle = presSlide.title;
        const slideType = presSlide.content.type;
        const slideNumber = presSlide.number;

        if (slideNumber == currentSlide) {
            sidebarHTML += sidebarSlideSelected(slideTitle, typeToIcon(slideType));
        } else {
            sidebarHTML += sidebarSlide(slideTitle, typeToIcon(slideType));
        }
    });
    sidebar.innerHTML = sidebarHTML;
}

function newBulletSlide() {
    pres.addSlide("New Slide", "bullet");
    currentSlide = pres.slides.length; // Select the new slide
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.hidePopover();
    renderSidebar();
    showEditor();
}

function showEditor() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    if (slide.content.type === "title") {
        showTitleEditor();
    } else if (slide.content.type === "bullet") {
        showBulletEditor();
    } else if (slide.content.type === "markdown") {
        showMarkdownEditor();
    } else if (slide.content.type === "image") {
        showImageEditor();
    } else if (slide.content.type === "maths") {
        showMathsEditor();
    } else if (slide.content.type === "code") {
        showCodeEditor();
    } else {
        document.getElementById("editor").innerHTML = "<p>Unknown slide type.</p>";
    }
}

function showTitleEditor() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    
    document.getElementById("editor").innerHTML = titleEditor;
    const titleInput = document.getElementById("title");
    const subtitleInput = document.getElementById("subtitle");
    titleInput.value = slide.title;
    subtitleInput.value = slide.content.strings[0] || "";
}

function saveTitleSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const titleInput = document.getElementById("title");
    const subtitleInput = document.getElementById("subtitle");

    slide.title = titleInput.value || "Title";
    slide.content.strings = [subtitleInput.value || ""];

    renderSidebar();
}

function showBulletEditor() {
    // BUG FIX: The main logic is now in assembleBulletSlide, which is always called.
    // This ensures the data and view are always in sync.
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    assembleBulletSlide(slide);
}

function assembleBulletSlide(slide) {
    // REFINEMENT: Simplified assembly logic using parameterized functions.
    let bulletHTML = `<div class="VStack" id="bullets">
        <input id="title" placeholder="Title" style="text-align: left;" value="${slide.title}" oninput="saveBulletSlide()"/>`;

    slide.content.strings.forEach((bulletText, index) => {
        if (index === 0) {
            bulletHTML += topBullet(index, bulletText);
        } else if (index === slide.content.strings.length - 1) {
            bulletHTML += bottomBullet(index, bulletText);
        } else {
            bulletHTML += midBullet(index, bulletText);
        }
    });

    bulletHTML += addBulletButton + `</div>`;
    document.getElementById("editor").innerHTML = bulletHTML;
}

function moveBulletUp(index) {
    if (index === 0) return;
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    // Swap the bullets in the data model
    [slide.content.strings[index - 1], slide.content.strings[index]] =
        [slide.content.strings[index], slide.content.strings[index - 1]];
    assembleBulletSlide(slide);
}

function moveBulletDown(index) {
    const slide = pres.slides[currentSlide - 1];
    if (!slide || index === slide.content.strings.length - 1) return;

    // Swap the bullets in the data model
    [slide.content.strings[index + 1], slide.content.strings[index]] =
        [slide.content.strings[index], slide.content.strings[index + 1]];

    assembleBulletSlide(slide);
}

function deleteBullet(index) {
    const slide = pres.slides[currentSlide - 1];
    if (!slide || slide.content.strings.length === 1) return;
    slide.content.strings.splice(index, 1);
    saveBulletSlide(); // Save and re-render
    assembleBulletSlide(slide);
}

function addBullet() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    slide.content.strings.push("");
    saveBulletSlide(); // Save and re-render
    assembleBulletSlide(slide);
}

function saveBulletSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const titleInput = document.getElementById("title");
    slide.title = titleInput.value || "Title";

    slide.content.strings = slide.content.strings.map((_, index) => {
        const bulletInput = document.getElementById(`b-${index}`);
        return bulletInput ? bulletInput.value : "";
    });

    renderSidebar();
}

sidebar.addEventListener('click', function(event) {
    let target = event.target;
    while (target && target !== sidebar) {
        if (target.classList.contains('sidebar-el') || target.classList.contains('sidebar-el-selected')) {
            const index = Array.from(sidebar.children).indexOf(target);
            if (index !== -1 && pres.slides[index]) {
                currentSlide = pres.slides[index].number;
                renderSidebar();
                showEditor();
            }
            return;
        }
        target = target.parentElement;
        
    }
});

function removeSlide() {
    if (pres.slides.length === 1) return; // Prevent removing the last slide
    pres.removeSlide(currentSlide);
    if (currentSlide > pres.slides.length) {
        currentSlide = pres.slides.length;
    }
    renderSidebar();
    showEditor();
}

function newTitleSlide() {
    pres.addSlide("New Slide", "title");
    currentSlide = pres.slides.length; // Select the new slide
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.hidePopover();
    renderSidebar();
    showEditor();
}

function savePresentation() {
    const presData = JSON.stringify(pres, null, 2);
    const blob = new Blob([presData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pres.title || 'presentation'}.present`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function openPresentation() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.present';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const json = JSON.parse(event.target.result);
                pres = new Presentation(json.title, json.theme, json.slides.map(s => new Slide(s.title, new SlideContent(s.content.type, s.content.strings), s.number, s.entryTransition, s.exitTransition, s.transitionSpeed)));
                currentSlide = 1;
                renderSidebar();
                showEditor();
            } catch (error) {
                alert('Invalid presentation file.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}


function launchPresentation() {
    // For debugging: this message will appear in the browser's console when you click the button.
    console.log("Attempting to launch presentation...");

    if (pres) {
        try {
            // For debugging: shows the object you're about to save.
            console.log("Saving presentation object:", pres);

            // Save the entire presentation object to the browser's local storage
            localStorage.setItem('currentPresentation', JSON.stringify(pres));

            // For debugging: confirms the data was saved.
            console.log("Successfully saved to localStorage.");

            // Open the presentation page in a new tab
            window.open('present.html', '_blank');

        } catch (error) {
            // For debugging: shows an error if the data could not be saved.
            console.error("Failed to save to localStorage:", error);
            alert('Could not save the presentation data. Please check the console for errors.');
        }
    } else {
        // For debugging: shows why the presentation isn't launching.
        console.error("Cannot launch: The 'pres' object is empty.");
        alert('There is no presentation to show!');
    }
}

function exportPresentation() {
    // For debugging: this message will appear in the browser's console when you click the button.
    console.log("Attempting to launch presentation...");

    if (pres) {
        try {
            // For debugging: shows the object you're about to save.
            console.log("Saving presentation object:", pres);

            // Save the entire presentation object to the browser's local storage
            localStorage.setItem('currentPresentation', JSON.stringify(pres));

            // For debugging: confirms the data was saved.
            console.log("Successfully saved to localStorage.");

            // Open the presentation page in a new tab
            window.open('present.html?print-pdf', '_blank');

        } catch (error) {
            // For debugging: shows an error if the data could not be saved.
            console.error("Failed to save to localStorage:", error);
            alert('Could not save the presentation data. Please check the console for errors.');
        }
    } else {
        // For debugging: shows why the presentation isn't launching.
        console.error("Cannot launch: The 'pres' object is empty.");
        alert('There is no presentation to show!');
    }
}

function changeTheme(theme){
    localStorage.setItem('theme', theme);
    pres.theme = theme;
    const themeDlg = document.getElementById("themeDlg");
    themeDlg.hidePopover();
}

function showThemeDlg(){
    const themeDlg = document.getElementById("themeDlg");
    themeDlg.showPopover();
}

function setEntryTransition(transition){
    const slide = pres.slides[currentSlide - 1];
    if(!slide) return;
    slide.entryTransition = transition;
    const transitionInDlg = document.getElementById("transitionInDlg");
    transitionInDlg.hidePopover();
}
function setExitTransition(transition){
    const slide = pres.slides[currentSlide - 1];
    if(!slide) return;
    slide.exitTransition = transition;
    const transitionOutDlg = document.getElementById("transitionOutDlg");
    transitionOutDlg.hidePopover();
}
function showEntryTransitionDlg(){
    const transitionInDlg = document.getElementById("transitionInDlg");
    transitionInDlg.showPopover();
}
function showExitTransitionDlg(){
    const transitionOutDlg = document.getElementById("transitionOutDlg");
    transitionOutDlg.showPopover();
}
function setTransitionSpeed(speed){
    const slide = pres.slides[currentSlide - 1];
    if(!slide) return;
    slide.transitionSpeed = speed;
    const transitionSpeedDlg = document.getElementById("transitionSpeedDlg");
    transitionSpeedDlg.hidePopover();
}
function showTransitionSpeedDlg(){
    const transitionSpeedDlg = document.getElementById("transitionSpeedDlg");
    transitionSpeedDlg.showPopover();
}
function newPresFromDlg(){
    const presNameInput = document.getElementById("presNameInput");
    const presName = presNameInput.value.trim() || "Untitled Presentation";
    newPres(presName, "defaultTheme"); // Specify a default theme
    const newPresDlg = document.getElementById("newPresDlg");
    newPresDlg.hidePopover();
    presNameInput.value = "";
}
function showNewPresDlg(){
    const newPresDlg = document.getElementById("newPresDlg");
    newPresDlg.showPopover();
}

function showMarkdownEditor() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    
    document.getElementById("editor").innerHTML = markdownEditor;
    const titleInput = document.getElementById("title");
    const mdEditor = document.getElementById("md-editor");
    titleInput.value = slide.title;
    mdEditor.value = slide.content.strings[0] || "";
}

function saveMarkdownSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const titleInput = document.getElementById("title");
    const mdEditor = document.getElementById("md-editor");

    slide.title = titleInput.value || "Title";

    slide.content.strings = [mdEditor.value.replace(/</g, "&lt;").replace(/>/g, "&gt;") || ""];

    renderSidebar();
}

function newMarkdownSlide() {
    pres.addSlide("Markdown", "markdown");
    currentSlide = pres.slides.length; // Select the new slide
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.hidePopover();
    renderSidebar();
    showEditor();
}

function showImageEditor() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    
    document.getElementById("editor").innerHTML = imageEditor;
    const imageUrlInput = document.getElementById("image-url");
    const titleInput = document.getElementById("title");
    titleInput.value = slide.title;
    imageUrlInput.value = slide.content.strings[0] || "";
}

function saveImageSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const imageUrlInput = document.getElementById("image-url");
    const titleInput = document.getElementById("title");
    titleInput.value = slide.title;
    imageUrlInput.value = slide.content.strings[0] || "";
}

function saveImageSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const imageUrlInput = document.getElementById("image-url");
    const titleInput = document.getElementById("title");

    slide.title = titleInput.value || "Title";
    slide.content.strings = [imageUrlInput.value || ""];

    renderSidebar();
}

function newImageSlide() {
    pres.addSlide("Image", "image");
    currentSlide = pres.slides.length; // Select the new slide
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.hidePopover();
    renderSidebar();
    showEditor();
}

function showMathsEditor() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    
    document.getElementById("editor").innerHTML = mathsEditor;
    const titleInput = document.getElementById("title");
    const mathsEditorInput = document.getElementById("maths-editor");
    titleInput.value = slide.title;
    mathsEditorInput.value = slide.content.strings[0] || "";
}

function saveMathsSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const titleInput = document.getElementById("title");
    const mathsEditorInput = document.getElementById("maths-editor");

    slide.title = titleInput.value || "Title";
    slide.content.strings = [mathsEditorInput.value || ""];

    renderSidebar();
}

function newMathsSlide() {
    pres.addSlide("Maths", "maths");
    currentSlide = pres.slides.length; // Select the new slide
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.hidePopover();
    renderSidebar();
    showEditor();
}

function showCodeEditor() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;
    
    document.getElementById("editor").innerHTML = codeEditor;
    const titleInput = document.getElementById("title");
    const codeEditorInput = document.getElementById("code-editor");
    titleInput.value = slide.title;
    codeEditorInput.value = slide.content.strings[0] || "";
}

function saveCodeSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const titleInput = document.getElementById("title");
    const codeEditorInput = document.getElementById("code-editor");

    slide.title = titleInput.value || "Title";
    slide.content.strings = [codeEditorInput.value || ""];

    renderSidebar();
}

function newCodeSlide() {
    pres.addSlide("Code", "code");
    currentSlide = pres.slides.length; // Select the new slide
    const newSlideDlg = document.getElementById("addSlideDlg");
    newSlideDlg.hidePopover();
    renderSidebar();
    showEditor();
}

function showAboutDlg(){
    const aboutDlg = document.getElementById("aboutDlg");
    aboutDlg.showPopover();
}

function duplicateSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const newSlide = new Slide(
        slide.title + " (Copy)",
        new SlideContent(slide.content.type, [...slide.content.strings]),
        pres.slides.length + 1,
        slide.entryTransition,
        slide.exitTransition,
        slide.transitionSpeed
    );

    pres.slides.push(newSlide);
    currentSlide = pres.slides.length; // Select the new duplicated slide
    renderSidebar();
    showEditor();
}

function exportSlide() {
    const slide = pres.slides[currentSlide - 1];
    if (!slide) return;

    const slideData = JSON.stringify(slide, null, 2);
    const blob = new Blob([slideData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slide.title || 'slide'}.presentslide`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importSlide() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.presentslide';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const json = JSON.parse(event.target.result);
                if (json && json.title && json.content && json.content.type && Array.isArray(json.content.strings)) {
                    const newSlide = new Slide(
                        json.title,
                        new SlideContent(json.content.type, json.content.strings),
                        pres.slides.length + 1,
                        json.entryTransition,
                        json.exitTransition,
                        json.transitionSpeed
                    );
                    pres.slides.push(newSlide);
                    currentSlide = pres.slides.length; // Select the newly imported slide
                    renderSidebar();
                    showEditor();
                } else {
                    alert('Invalid slide file.');
                }
            } catch (error) {
                alert('Error importing slide: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
