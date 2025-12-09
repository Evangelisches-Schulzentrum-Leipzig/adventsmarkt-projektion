var treeColors = [
    "oklch(0.3 0.1 145)",
    "oklch(0.35 0.12 150)",
    "oklch(0.45 0.15 155)",
    "oklch(0.5 0.16 158)"
];
var redColors = [
    "oklch(0.348 0.111 17.0)",
    "oklch(0.394 0.133 17.0)",
    "oklch(0.445 0.151 17.0)",
    "oklch(0.513 0.168 17.0)",
    "oklch(0.599 0.184 17.0)",
    "oklch(0.647 0.176 17.0)",
    "oklch(0.699 0.166 17.0)"
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
];
var greenColors = [
    "oklch(0.45 0.06 110)",
    "oklch(0.68 0.07 105)",
    "oklch(0.85 0.03 95)",
    "oklch(0.72 0.11 65)",
    "oklch(0.57 0.13 50)",
];
var yellowColors = [
    "oklch(0.381 0.119 91.0)",
    "oklch(0.431 0.140 91.0)",
    "oklch(0.498 0.161 91.0)",
    "oklch(0.588 0.183 91.0)",
    "oklch(0.725 0.187 91.0)",
    "oklch(0.780 0.171 91.0)",
    "oklch(0.892 0.108 91.0)"
];
var limeColors = [
    "oklch(0.331 0.111 120.0)",
    "oklch(0.377 0.137 120.0)",
    "oklch(0.428 0.161 120.0)",
    "oklch(0.496 0.184 120.0)",
    "oklch(0.585 0.205 120.0)",
    "oklch(0.703 0.205 120.0)",
    "oklch(0.761 0.186 120.0)",
    "oklch(0.875 0.117 120.0)"
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
var tomatoColors = [
    "oklch(0.338 0.106 25.0)",
    "oklch(0.384 0.130 25.0)",
    "oklch(0.435 0.151 25.0)",
    "oklch(0.503 0.172 25.0)",
    "oklch(0.591 0.192 25.0)",
    "oklch(0.657 0.183 25.0)",
    "oklch(0.712 0.172 25.0)"
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

    mapColorArrayToGroups([
        { color: pinkColors, groupID: "roof" },
        { color: redColors, groupID: "roof #divider" },
        { color: yellowColors, groupID: "roof #top-front" },
        { color: blueColors, groupID: "roof #roof-divider" },
        { color: pinkColors, groupID: "a3-og-bg" },
        { color: tomatoColors, groupID: "aula-headstones" },
        { color: redColors, groupID: "aula-top-bg" },
        { color: tomatoColors, groupID: "aula-top-bg-stroke" },
        { color: blueColors, groupID: "aula-awening" },
        { color: yellowColors, groupID: "aula-divider" },
        { color: limeColors, groupID: "aula-under" },
        { color: greenColors, groupID: "a2-3-divider" },
        { color: blueColors, groupID: "a2-og-awening" },
        { color: yellowColors, groupID: "a2-og" },
        { color: pinkColors, groupClass: "a1-og-awening-small" },
        { color: tomatoColors, groupClass: "a1-og-awening" },
        { color: greenColors, groupID: "a1-og-bg" }
    ]);
    mapTreeColors(treeColors, "oklch(0.2255 0.0549 145)");
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

for (var i = 0; i < 8; i++) {
    switch (i) {
        case 0:
            var colorArray = treeColors; 
            var colorString = "Tree Colors";
            break;
        case 1:
            var colorArray = blueColors;
            var colorString = "Blue Colors";
            break;
        case 2:
            var colorArray = greenColors;   
            var colorString = "Green Colors";
            break;
        case 3:
            var colorArray = yellowColors;   
            var colorString = "Yellow Colors";
            break;
        case 4:
            var colorArray = pinkColors;   
            var colorString = "Pink Colors";
            break;
        case 5:
            var colorArray = limeColors;   
            var colorString = "Lime Colors";
            break;
        case 6:
            var colorArray = redColors;   
            var colorString = "Red Colors";
            break;
        case 7:
            var colorArray = tomatoColors;   
            var colorString = "Tomato Colors";
            break;
    }


    document.body.insertAdjacentHTML('beforeend', `<span style="font-family:monospace; font-size:20px;">${colorString}:</span><br>`);
    for (const color of colorArray) {
        document.body.insertAdjacentHTML('beforeend', `<div style="width:100px; height:100px; background-color:${new Color(color).toString({format: 'hex'})}; display:inline-block;"></div>`);
    }
    document.body.insertAdjacentHTML('beforeend', `<br>`);
}

/**
 * @typedef {Object} ColorMapping
 * @property {string[]} color - The color array in OKLCH format.
 * @property {string|null} groupID - The SVG group ID to which this color should be applied.
 * @property {string|null} groupClass - The SVG group class to which this color should be applied.
 */
/**
 * @param {Array<ColorMapping>} mapping
 */
function mapColorArrayToGroups(mapping) {
    mapping.forEach((map) => {
        if (map.groupID) {
            document.querySelectorAll(`#shapes #${map.groupID}`).forEach((group, groupIndex) => {
                let paths = Array.from(group.querySelectorAll("path"));
                paths.forEach((path, pathIndex) => {
                    let colorArray = map.color;
                    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
                    path.style.fill = color;
                });
            });
        }
        if (map.groupClass) {
            document.querySelectorAll(`#shapes .${map.groupClass}`).forEach((group, groupIndex) => {
                let paths = Array.from(group.querySelectorAll("path"));
                paths.forEach((path, pathIndex) => {
                    let colorArray = map.color;
                    let color = colorArray[Math.floor(Math.random() * colorArray.length)];
                    path.style.fill = color;
                });
            });
        }
    });
}

function mapTreeColors(leafColorArray, trunkColor) {
    document.querySelectorAll("#shapes #trees g g").forEach((group, groupIndex) => {
        let paths = Array.from(group.querySelectorAll("path"));
        paths.forEach((path, pathIndex) => {
            let colorArray = leafColorArray
            let color = colorArray[Math.floor(Math.random() * colorArray.length)];
            path.style.fill = color;
        });
    });
    document.querySelectorAll("#shapes #trees > g > path").forEach((path) => {
        path.style.fill = trunkColor;
    });
}