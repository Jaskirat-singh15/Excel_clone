grid.addEventListener("scroll", function(e){
    let currentDistanceFromTop = e.currentTarget.scrollTop; //vertical
    let currentDistanceFromLeft = e.currentTarget.scrollLeft;

    columnTags.style.transform = `translateX(-${currentDistanceFromLeft}px)`;
    rowNumbers.style.transform = `translateY(-${currentDistanceFromTop}px)`;
});