const spinnerCount = 2;
const backgroundColor = "LightGray";
const spinnerColor = "#005288";
const textColor = "#C80452";
const textFont = "bold 28px sans-serif";
const canvasBackground = [], ctxBackground = [], canvasForeground = [], ctxForeground = [], targetPercentage = [], currentPercent = [], visible = [], started = [], finished = [];
const speed = 0.5;
let myReq;

for (let i = 1; i < spinnerCount + 1; i++) {
    canvasBackground[i] = document.getElementById("spinnerBackground" + i);
    ctxBackground[i] = canvasBackground[i].getContext("2d");
    canvasForeground[i] = document.getElementById("spinnerForeground" + i);
    ctxForeground[i] = canvasForeground[i].getContext("2d");
    targetPercentage[i] = parseInt(document.getElementById("spinnerText" + i).textContent.split("%")[0]);
    currentPercent[i] = 1;
    visible[i] = false;
    started[i] = false;
    finished[i] = false;
}

function init(i) {
    if (!finished[i]) {
        //myReq = requestAnimationFrame(draw(i));
        myReq = requestAnimationFrame(() => draw(i));
    }
}

function draw(i)  {
    ctxForeground[i].clearRect(0, 0, 150, 150)

    // Draw spinner
    ctxForeground[i].beginPath();
    ctxForeground[i].lineWidth = 12;
    ctxForeground[i].strokeStyle = spinnerColor;
    ctxForeground[i].lineCap = "round"
    if (currentPercent[i] != 100) {
        ctxForeground[i].arc(75, 75, 60, 1.5 * Math.PI, ((2 * Math.PI) / (100 / currentPercent[i])) - (Math.PI / 2));
    }
    else {
        ctxForeground[i].arc(75, 75, 60, 1.5 * Math.PI, 3.5 * Math.PI);
    }
    ctxForeground[i].stroke();

    if (currentPercent[i] < targetPercentage[i] && currentPercent[i] < 100) {
        currentPercent[i] += speed;
        //myReq = requestAnimationFrame(draw(i));
        myReq = requestAnimationFrame(() => draw(i));
    }
    else {
        finished[i] = true;
        //cancelAnimationFrame(myReq);
    }
}

function isElementInViewport (el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

function onVisibilityChange(callback) {
    //const old_visible = [];
    const old_visible = new Array(spinnerCount + 1).fill(false);

    return function () {
        for (let i = 1; i < spinnerCount + 1; i++) {
            var new_visible = isElementInViewport(canvasForeground[i]);
            if (new_visible != old_visible[i]) {
                old_visible[i] = new_visible;
                if (new_visible) {
                    visible[i] = true;
                }
                if (typeof callback == 'function') {
                    callback(i);
                }
            }
        }
    }
}

var handler = onVisibilityChange(function() {
    for (let i = 1; i < spinnerCount + 1; i++) {
        if (visible[i] && !started[i]) {
            started[i] = true;
            init(i);
        }
    }
});

for (let i = 1; i < spinnerCount + 1; i++) {
    requestAnimationFrame(function() {
        // Draw background circle
        ctxBackground[i].beginPath();
        ctxBackground[i].strokeStyle = backgroundColor;
        ctxBackground[i].lineWidth = 12;
        ctxBackground[i].arc(75, 75, 60, 0, 2 * Math.PI);
        ctxBackground[i].stroke();
    });
}

$(window).on('DOMContentLoaded load resize scroll', handler);