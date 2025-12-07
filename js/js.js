const { animate, svg, stagger } = anime;
let corners = [0, 0, window.screen.width, 0, 0, window.screen.height, window.screen.width, window.screen.height];

(async () => {
    var svgElement = await fetch('assets/img/colored-muted.svg')
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement);
    svgElement.id = 'outline-svg';
    document.querySelector('div#svg-con').appendChild(svgElement);

    // calculate maximum distance from center for all paths
    const svgCenterX = svgElement.viewBox.baseVal.width / 2;
    const svgCenterY = svgElement.viewBox.baseVal.height / 2;
    const maxDistanceFromCenter = Math.hypot(0 - svgCenterX, 0 - svgCenterY);

    document.querySelectorAll("#outline-svg path:not([fill=none])").forEach((path) => {
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
    
    let distances = [...document.querySelectorAll("#outline-svg path:not([fill=none])")].map(p => [p, p.dataset.distanceFromCenter]).sort((a, b) => a[1] - b[1]);

    for (let index = 0; index < [...document.querySelectorAll("#outline-svg path:not([stroke='black'])")].length; index++) {
        distances[index][0].dataset.distanceIndex = index;
    }

    // convert colors from oklch to hex
    document.querySelectorAll("#outline-svg path").forEach((path) => {
        if (path.style.fill) {
            const oklch = path.style.fill;
            const hex = new Color(oklch).toString({format: 'hex'});
            console.log(oklch, "=>", hex);
            path.setAttribute("fill", hex);
            path.style.fill = "";
        }
    });

    // animate("#outline-svg #shapes path", {
    //     fill: "#00000000",
    //     ease: 'inOutSine',
    //     duration: 100,
    //     delay: stagger(10 , { use: "data-distance-index", from: "random" }),
    //     loop: true,
    //     loopDelay: 1000,
    //     alternate: true,
    // });

    transform2d(
        document.querySelector("div#svg-con"),
        corners[0], corners[1],
        corners[2], corners[3],
        corners[4], corners[5],
        corners[6], corners[7]
    );
    corners.forEach((c, i) => {
        document.querySelectorAll("div#input-con input")[i].value = c;
    });
    for (let index = 0; index < 8; index++) {
        const slider = document.querySelectorAll("div#input-con input")[index];
        slider.value = corners[index];
        slider.min = -200;
        slider.max = Math.max(window.screen.width, window.screen.height) + 200;
        slider.addEventListener("input", (e) => {
            corners[index] = parseInt(e.target.value);
            update();
        });
    }
})();

function update() {
    var box = document.querySelector("div#svg-con");
    console.log(corners);
    transform2d(
        box,
        corners[0], corners[1],
        corners[2], corners[3],
        corners[4], corners[5],
        corners[6], corners[7]
    );
    for (var i = 0; i < 8; i += 1) {
        document.querySelectorAll("div#input-con input")[i].value = corners[i];
    }
}