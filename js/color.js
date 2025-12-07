var treeColors = [
    "oklch(0.3 0.1 145)",
    "oklch(0.35 0.12 150)",
    "oklch(0.45 0.15 155)",
    "oklch(0.5 0.16 158)"
    // "oklch(0.4955 0.0896 126.19)",
    // "oklch(0.6769 0.1492 118.43)",
    // "oklch(0.8466 0.1311 117.39)",
    // "oklch(0.9566 0.0462 115.18)"
];
var blueColors = [
    "oklch(0.4 0.15 220)",
    "oklch(0.45 0.15 230)",
    "oklch(0.55 0.18 235)",
    "oklch(0.6 0.16 238)",
    "oklch(0.65 0.15 240)",
    "oklch(0.7 0.13 243)",
    "oklch(0.75 0.12 245)",
    "oklch(0.82 0.08 250)",

    // "oklch(0.6759 0.2611 316.38)",
    // "oklch(0.6759 0.2119 316.38)",
    // "oklch(0.6759 0.1263 286.29)",

    // "oklch(0.7407 0.1226 162.58)",
    // "oklch(0.7896 0.0995 218.15)",
    // "oklch(0.5663 0.1539 258.67)"
];
var greenColors = [
    "oklch(0.24 0.03 115)",
    "oklch(0.45 0.06 110)",
    "oklch(0.68 0.07 105)",
    "oklch(0.85 0.03 95)",
    "oklch(0.72 0.11 65)",
    "oklch(0.57 0.13 50)",
    
    // "oklch(0.8688 0.1427 144.6554)",
    // "oklch(0.4777 0.0999 144.6554)",
    // "oklch(0.4777 0.1512 144.6554)",
    // "oklch(0.4777 0.1512 139.77)",
    // "oklch(0.8546 0.1669 111.1)"
];
var pinkColors = [
    "oklch(0.4 0.18 330)",
    "oklch(0.45 0.2 335)",
    "oklch(0.5 0.22 340)",
    "oklch(0.55 0.23 345)",
    "oklch(0.6 0.22 350)",
    "oklch(0.65 0.2 355)",
    "oklch(0.7 0.18 0)",
    "oklch(0.75 0.15 5)"
];

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

    // get all lowset groups with only paths as children
    let groups = Array.from(svgElement.querySelectorAll("#shapes g")).filter(g => {
        return Array.from(g.children).every(child => child.tagName === 'path');
    });

    groups.forEach((group, groupIndex) => {
        let paths = Array.from(group.querySelectorAll("path"));
        paths.forEach((path, pathIndex) => {
            let colorArray;
            if (groupIndex % 3 === 1) {
                colorArray = blueColors;
            } else if (groupIndex % 3 === 2) {
                colorArray = pinkColors;
            } else {
                colorArray = greenColors;
            }    
            let color = colorArray[pathIndex % colorArray.length];
            path.style.fill = color;
        });
    }); 
    document.querySelectorAll("#shapes #trees g g").forEach((group, groupIndex) => {
        let paths = Array.from(group.querySelectorAll("path"));
        paths.forEach((path, pathIndex) => {
            let colorArray = treeColors
            let color = colorArray[pathIndex % colorArray.length];
            path.style.fill = color;
        });
    }); 
    document.querySelectorAll("#shapes #trees > g > path").forEach((path) => {
        path.style.fill = "oklch(0.2255 0.0549 145)";
    }); 
})();

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