let fileInput = document.getElementById('file-input');
let contrastRange = document.getElementById('contrast');
let brightnessRange = document.getElementById('brightness');
let transparentRamge = document.getElementById('transparent');
let saveButton = document.getElementById('save-button');
let contrast = 0;
let brightness = 0;
let transparent = 1;
let canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;
let ctx;
let image;

fileInput.addEventListener('change', function(ev) {
    if(ev.target.files) {
        let file = ev.target.files[0];
        var reader  = new FileReader();

        reader.onloadend = function (e) {
            image = new Image();
            console.log("loading");
            image.src = e.target.result;
            image.onload = function(ev) {
                console.log("loading");
                // canvas = document.getElementById('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx = canvas.getContext('2d');
                ctx.drawImage(image,0,0);
            }
        }
        reader.readAsDataURL(file);
    }
})

function truncate(exp) {
    if(exp > 255) {
        return 255;
    } else if(exp <= 0) {
        return 0;
    } else {
        return exp;
    }
}


contrastRange.addEventListener("change", () => onPaint());

brightnessRange.addEventListener('change', () => onPaint());

transparentRamge.addEventListener('change', () => onPaint());

saveButton.addEventListener('click', () => downloadImage());

function downloadImage() {
    var result = canvas.toDataURL();

    var tmpLink = document.createElement('a');
    tmpLink.download = 'result.png';
    tmpLink.href = result;

    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
}

function adjustContrastAndBrightness(pixels, contrast, brightness) {

    let factor = (259*(255+contrast)/(255*(259-contrast)));

    for(let i = 0; i < pixels.length; i += 4) {
        pixels[i] = truncate(factor*(pixels[i] - 128) + 128 + brightness);
        pixels[i+1] = truncate(factor*(pixels[i+1] - 128) + 128 + brightness);
        pixels[i+2] = truncate(factor*(pixels[i+2] - 128) + 128 + brightness);
    }

}

function adjustBrightness(pixels, brightness) {

    for(let i = 0; i < pixels.length; i += 4) {
        pixels[i] = truncate(pixels[i] + brightness);
        pixels[i+1] = truncate(pixels[i+1] + brightness);
        pixels[i+2] = truncate(pixels[i+2] + brightness);
    }

}

function adjustTransparency(pixels, transparent) {
    for(let i = 3; i < pixels.length; i += 4) {
        pixels[i] = pixels[i] * transparent;
    }
}

function onPaint(event){

    brightness = parseInt(brightnessRange.value, 10);
    contrast = parseInt(contrastRange.value, 10);
    transparent = parseFloat(transparentRamge.value);

    redrawImage();

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;

    adjustContrastAndBrightness(pixels, contrast, brightness);
    adjustTransparency(pixels, transparent);

    ctx.putImageData(imageData, 0, 0);


}

function printImage(image) {
    ctx.drawImage(image, 0, 0);
}

function redrawImage() {
    printImage(image);
}