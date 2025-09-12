function sidebarSlide(name, type){
    return `
        <div class="sidebar-el">
                <span class="material-symbols-rounded">text_fields</span>
                <p>${name}</p>
        </div>
    `;
}
function sidebarSlideSelected(name, type){
    return `
        <div class="sidebar-el-selected">
                <span class="material-symbols-rounded">title</span>
                <p>${name}</p>
        </div>
    `;
}
export { sidebarSlide, sidebarSlideSelected };