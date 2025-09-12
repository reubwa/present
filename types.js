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
    addSlide(title,type){
        const slideNumber = this.slides.length + 1;
        const newSlide = new Slide(title, new SlideContent(type), slideNumber);
        this.slides.push(newSlide);
        return newSlide;
    }
    removeSlide(number){
        this.slides = this.slides.filter(slide => slide.number !== number);
        // Reassign slide numbers
        this.slides.forEach((slide, index) => {
            slide.number = index + 1;
        });
    }
}

export { Slide, SlideContent, Presentation };