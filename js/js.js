const { animate, svg, stagger, createTimeline } = anime;
let corners = [0, 0, window.screen.width, 0, 0, window.screen.height, window.screen.width, window.screen.height];
// corners = [-5, -24, 3835, -68, 0, 2142, 3845, 2126];

let BC;
if (new URLSearchParams(window.location.search).get("corners-bc")) {
    BC = new BroadcastChannel(new URLSearchParams(window.location.search).get("corners-bc"));
}

(async () => {
    var svgElement = await fetch('assets/img/color.svg')
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement);
    svgElement.id = 'outline-svg';
    document.querySelector('div#svg-con').appendChild(svgElement);
    colorChange();

    // calculate maximum distance from center for all paths
    const svgCenterX = svgElement.viewBox.baseVal.width / 2;
    const svgCenterY = svgElement.viewBox.baseVal.height / 2;

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
    });
    
    let centerXs = [...document.querySelectorAll("#outline-svg path:not([fill=none])")].map(p => [p, p.dataset.centerX]).sort((a, b) => a[1] - b[1]);
    let centerYs = [...document.querySelectorAll("#outline-svg path:not([fill=none])")].map(p => [p, p.dataset.centerY]).sort((a, b) => a[1] - b[1]);
    let distances = [...document.querySelectorAll("#outline-svg path:not([fill=none])")].map(p => [p, p.dataset.distanceFromCenter]).sort((a, b) => a[1] - b[1]);

    for (let index = 0; index < [...document.querySelectorAll("#outline-svg path:not([fill=none])")].length; index++) {
        centerXs[index][0].dataset.centerXIndex = index;
    }
    for (let index = 0; index < [...document.querySelectorAll("#outline-svg path:not([fill=none])")].length; index++) {
        centerYs[index][0].dataset.centerYIndex = index;
    }
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

    var timeline = createTimeline({
        loop: true,
    })
    .add("#outline-svg #shapes path", {
        opacity: 0,
        ease: 'inOutSine',
        duration: 1000,
        delay: stagger(10 , { use: "data-center-y-index", from: "first" })
    })
    .add("#outline-svg #shapes path", {
        opacity: 1,
        ease: 'inOutSine',
        duration: 1000,
        delay: stagger(10 , { use: "data-distance-index", from: "center" })
    })
    .add({
        duration: 200,
        loop: 20,
        onLoop: () => mapColorArrayToGroups([
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
            { color: greenColors, groupID: "a1-og-bg" },
            { color: blueColors, groupID: "windows" }
        ]),
    })
    .add({
        duration: 1000 * 30
    })
    .add("#outline-svg #shapes path", {
        opacity: 0,
        ease: 'inOutSine',
        duration: 1000,
        delay: stagger(10 , { use: "data-center-x-index", from: "first" })
    })
    .call(colorChange)
    .add("#outline-svg #shapes path", {
        opacity: 1,
        ease: 'inOutSine',
        duration: 1000,
        delay: stagger(10 , { use: "data-distance-index", from: "first" })
    })
    .add({
        duration: 200,
        loop: 200,
        onLoop: () => mapTreeColors(treeColors, "oklch(0.2255 0.0549 145)"),
    })
    .add({
        duration: 1000 * 30
    });

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
            if (new URLSearchParams(window.location.search).get("corners-bc")) {
                BC.postMessage({
                    type: "corner-updated",
                    cornerIndex: index,
                    cornerValue: e.target.value
                });
            }
        });
    }
    if (new URLSearchParams(window.location.search).get("corners-bc")) {
        BC.onmessage = (e) => {
            if (e.data && e.data.type !== undefined && e.data.type == "corner-update" && e.data.cornerIndex !== undefined && e.data.cornerValue !== undefined) {
                corners[e.data.cornerIndex] = parseInt(e.data.cornerValue);
                update();
            }
            if (e.data && e.data.type !== undefined && e.data.type == "get-corners") {
                BC.postMessage({
                    type: "corners",
                    corners: corners,
                    min: -200,
                    max: Math.max(window.screen.width, window.screen.height) + 200
                });
            }
        };
    }
})();

function update() {
    var box = document.querySelector("div#svg-con");
    transform2d(
        box,
        corners[0], corners[1],
        corners[2], corners[3],
        corners[4], corners[5],
        corners[6], corners[7]
    );
    for (var i = 0; i < 8; i += 1) {
        corners.forEach((c, i) => {
            document.querySelectorAll("div#input-con input")[i].value = c;
        });
    }
}

function colorChange() {
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
        { color: greenColors, groupID: "a1-og-bg" },
        { color: blueColors, groupID: "windows" }
    ]);
    mapTreeColors(treeColors, "oklch(0.2255 0.0549 145)");
}