let groups = []
let tempGroup = [];

(async () => {
    var svgElement = await fetch('assets/img/color.svg')
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement);
    svgElement.style.position = 'absolute';
    svgElement.style.height = '100vh';
    svgElement.style.width = '100vw';
    svgElement.style.objectFit = 'contain';
    svgElement.id = 'outline-svg';
    document.body.appendChild(svgElement);

    // calculate maximum distance from center for all paths
    const svgCenterX = svgElement.viewBox.baseVal.width / 2;
    const svgCenterY = svgElement.viewBox.baseVal.height / 2;
    const maxDistanceFromCenter = Math.hypot(0 - svgCenterX, 0 - svgCenterY);

    document.querySelectorAll("#shapes path").forEach((path) => {
        var bbox = path.getBBox();
        var centerOfRect_X = bbox.x + bbox.width / 2;
        var centerOfRect_Y = bbox.y + bbox.height / 2;

        // Store center coordinates as data attributes
        path.dataset.centerX = centerOfRect_X;
        path.dataset.centerY = centerOfRect_Y;

        // Add index based on distance from SVG center
        const distanceFromCenter = Math.hypot(centerOfRect_X - svgCenterX, centerOfRect_Y - svgCenterY);
        path.dataset.distanceFromCenter = distanceFromCenter;
        path.dataset.normalizedDistanceFromCenter = distanceFromCenter / maxDistanceFromCenter;
    });
    
    let distances = [...document.querySelectorAll("#shapes path")].map(p => [p, p.dataset.distanceFromCenter]).sort((a, b) => a[1] - b[1]);

    for (let index = 0; index < [...document.querySelectorAll("#shapes path")].length; index++) {
        distances[index][0].dataset.distanceIndex = index;
    }

    document.querySelectorAll("#shapes path").forEach((path) => {
        path.addEventListener('click', () => {
            if (tempGroup.includes(path.dataset.distanceIndex)) {
                const index = tempGroup.indexOf(path.dataset.distanceIndex);
                if (index > -1) {
                    tempGroup.splice(index, 1);
                }
                path.style.fill = path.dataset.oldFill;
            } else {
                tempGroup.push(path.dataset.distanceIndex);
                path.dataset.oldFill = path.style.fill;
                path.style.fill = "yellow"
            }
        });
    });
    // Add paths if dragged over
    let isMouseDown = false;

    document.body.addEventListener('mousedown', () => {
        isMouseDown = true;
    });
    
    document.body.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    document.querySelectorAll("#shapes path").forEach((path) => {
        path.addEventListener('mouseover', () => {
            if (isMouseDown) {
                if (!tempGroup.includes(path.dataset.distanceIndex)) {
                    tempGroup.push(path.dataset.distanceIndex);
                    path.dataset.oldFill = path.style.fill;
                    path.style.fill = "yellow"
                } else {
                    const index = tempGroup.indexOf(path.dataset.distanceIndex);
                    if (index > -1) {
                        tempGroup.splice(index, 1);
                    }
                    path.style.fill = path.dataset.oldFill;
                }
            }
        });
    });
})();

// modify svg to group paths based on selected tempGroup
function applyGrouping() {
    if (tempGroup.length === 0) {
        alert("No shapes selected for grouping.");
        return;
    }
    var topCon = document.querySelector("#shapes");
    var newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    newGroup.id = "group-" + (groups.length + 1);
    tempGroup.forEach((index) => {
        var path = [...document.querySelectorAll("#shapes path")].find(p => p.dataset.distanceIndex == index);
        if (path) {
            newGroup.appendChild(path);
        }
    });
    topCon.appendChild(newGroup);

    // remove original paths outside group
    topCon.querySelectorAll("path").forEach((path) => {
        if (tempGroup.includes(path.dataset.distanceIndex) && path.parentNode !== newGroup) {
            topCon.removeChild(path);
        }
    });

    tempGroup.forEach((index) => {
        var path = [...document.querySelectorAll("#shapes path")].find(p => p.dataset.distanceIndex == index);
        if (path) {
            path.style.fill = path.dataset.oldFill;
        }
    });

    groups.push(tempGroup.slice());
    tempGroup = [];

    isMouseDown = false;
}

function outputSVGWihtoutData() {
    var svgElement = document.querySelector("#outline-svg");
    var clonedSvgElement = svgElement.cloneNode(true);

    clonedSvgElement.querySelectorAll("path").forEach((path) => {
        Array.from(path.attributes).forEach((attr) => {
            if (attr.name.startsWith("data-") || attr.value === "") {
                path.removeAttribute(attr.name);
            }
        });
    });

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(clonedSvgElement);

    // remove empty lines 
    svgString = svgString.replace(/^\s*[\r\n]/gm, '');

    console.log(svgString);
    alert("SVG outputted to console without data attributes.");
}