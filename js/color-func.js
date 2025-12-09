const treeColors = [
    "oklch(0.3 0.1 145)",
    "oklch(0.35 0.12 150)",
    "oklch(0.45 0.15 155)",
    "oklch(0.5 0.16 158)"
];
const redColors = [
    "oklch(0.348 0.111 17.0)",
    "oklch(0.394 0.133 17.0)",
    "oklch(0.445 0.151 17.0)",
    "oklch(0.513 0.168 17.0)",
    "oklch(0.599 0.184 17.0)",
    "oklch(0.647 0.176 17.0)",
    "oklch(0.699 0.166 17.0)"
];
const blueColors = [
    "oklch(0.4 0.15 220)",
    "oklch(0.45 0.15 230)",
    "oklch(0.55 0.18 235)",
    "oklch(0.6 0.16 238)",
    "oklch(0.65 0.15 240)",
    "oklch(0.7 0.13 243)",
    "oklch(0.75 0.12 245)",
    "oklch(0.82 0.08 250)",
];
const greenColors = [
    "oklch(0.45 0.06 110)",
    "oklch(0.68 0.07 105)",
    "oklch(0.85 0.03 95)",
    "oklch(0.72 0.11 65)",
    "oklch(0.57 0.13 50)",
];
const yellowColors = [
    "oklch(0.381 0.119 91.0)",
    "oklch(0.431 0.140 91.0)",
    "oklch(0.498 0.161 91.0)",
    "oklch(0.588 0.183 91.0)",
    "oklch(0.725 0.187 91.0)",
    "oklch(0.780 0.171 91.0)",
    "oklch(0.892 0.108 91.0)"
];
const limeColors = [
    "oklch(0.331 0.111 120.0)",
    "oklch(0.377 0.137 120.0)",
    "oklch(0.428 0.161 120.0)",
    "oklch(0.496 0.184 120.0)",
    "oklch(0.585 0.205 120.0)",
    "oklch(0.703 0.205 120.0)",
    "oklch(0.761 0.186 120.0)",
    "oklch(0.875 0.117 120.0)"
];
const pinkColors = [
    "oklch(0.4 0.18 330)",
    "oklch(0.45 0.2 335)",
    "oklch(0.5 0.22 340)",
    "oklch(0.55 0.23 345)",
    "oklch(0.6 0.22 350)",
    "oklch(0.65 0.2 355)",
    "oklch(0.7 0.18 0)",
    "oklch(0.75 0.15 5)"
];
const tomatoColors = [
    "oklch(0.338 0.106 25.0)",
    "oklch(0.384 0.130 25.0)",
    "oklch(0.435 0.151 25.0)",
    "oklch(0.503 0.172 25.0)",
    "oklch(0.591 0.192 25.0)",
    "oklch(0.657 0.183 25.0)",
    "oklch(0.712 0.172 25.0)"
];

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
                    const hex = new Color(colorArray[Math.floor(Math.random() * colorArray.length)]).toString({format: 'hex'});
                    path.setAttribute("fill", hex);
                    path.style.fill = "";
                });
            });
        }
        if (map.groupClass) {
            document.querySelectorAll(`#shapes .${map.groupClass}`).forEach((group, groupIndex) => {
                let paths = Array.from(group.querySelectorAll("path"));
                paths.forEach((path, pathIndex) => {
                    let colorArray = map.color;
                    const hex = new Color(colorArray[Math.floor(Math.random() * colorArray.length)]).toString({format: 'hex'});
                    path.setAttribute("fill", hex);
                    path.style.fill = "";
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
            const hex = new Color(colorArray[Math.floor(Math.random() * colorArray.length)]).toString({format: 'hex'});
            path.setAttribute("fill", hex);
            path.style.fill = "";
        });
    });
    document.querySelectorAll("#shapes #trees > g > path").forEach((path) => {
        const hex = new Color(trunkColor).toString({format: 'hex'});
        path.setAttribute("fill", hex);
        path.style.fill = "";
    });
}