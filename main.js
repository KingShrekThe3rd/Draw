var drawcolour = black;
var slider = document.getElementById("myRange");
const canvas = document.getElementById("canvas");
var size = slider.value;
let mode = 0;
let toolx;
let tooly;
let custom; //rgb
let open = false;
let picking = false;
const colorpicker = document.getElementById("pick")
const pickcanvas = document.querySelector("#pickcanvas")
const hueslider = document.getElementById("hue");
const ctxp = pickcanvas.getContext('2d');
const opsl = document.getElementById('alpha');
const ctx = canvas.getContext('2d');
pickcanvas.height = 200;
pickcanvas.width = 200;
let s = 100;
let v = 100;
let r;
let g;
let b;
let a;

function download(){
    canvas.toBlob((blob) =>{
        const timestamp = Date.now().toString();
        const a = document.createElement('a');
        document.body.append(a);
        a.download = `image-${timestamp}.png`
        a.href = URL.createObjectURL(blob);
        a.click();
        a.remove();
    });
}

function newcc() {
    try {
        $(document).ready(function () {
            $('#colorInput').change(function () {
                let color = $(this).val();
                drawcolour = color;
                $('#colorPreview').css('background-color', color);
            });
        });
    } catch (e) {
        console.log("Error in JS code", e);
    }
}

//rgb to hsv
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => (num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: (h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}


//hsb to hsl
function hsb_to_hsl(h, s, b) {
    const x = (200 - s) * b / 100;
    return `hsla(${h},${x === 0 || x === 200 ? 0 : (s * b / (x <= 100 ? x : 200 - x))}%,${(x / 2)}%,${opsl.value/100})`;
}

//draw clour picker
function drawcanvaspick(){
    var x;
    var y;

    for(y = 0; y < 201; y++){
        for(x = 0; x < 201; x++){
            ctxp.fillStyle = hsb_to_hsl(hueslider.value,x/2,y/2);
            ctxp.fillRect(x,y,1,1);
        }
    }
    ctxp.beginPath();
    ctxp.arc(s*2, v*2, 5, 0, 2 * Math.PI, false);
    ctxp.fillStyle = drawcolour;
    ctxp.fill();
    ctxp.lineWidth = 2;
    ctxp.strokeStyle = 'black';
    ctxp.stroke();
}

//get mouse pos
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

//change colour
function colourChange(c){
    drawcolour = c;
}

//change mode
function changeMode(m){
    mode = m;
    switch(mode){
        case 0:
            canvas.style.cursor = "url(images/draw.png) 0 32, auto";
            break;
        case 1:
            canvas.style.cursor = "url(images/draw.png) 0 32, auto";
            break;
        case 2:
            canvas.style.cursor = "url(images/draw.png) 0 32, auto";
            break;
        case 3:
            canvas.style.cursor = "url(images/eyedropper.png) 0 32, auto";
            break;
        case 4:
            canvas.style.cursor = "url(images/eyedropper.png) 0 32, auto";
            break;
        case 5:
            canvas.style.cursor = "url(images/eyedropper.png) 0 32, auto";
            break;
    };
}

//update custom colour
function updhue(){
    hueslider.style.setProperty('--SliderColor', `hsl(${hueslider.value}, 100%, 50%)`);
    drawcolour =  hsb_to_hsl(hueslider.value,s,v);
    drawcanvaspick();
}

// saturation and vibrance update
function SV(e){
    if(picking){
        let pos = getMousePos(pickcanvas, e);
        s = pos.x/2;
        v = pos.y/2;
        updhue();
        drawcanvaspick;
    }
}

//open colour picker
function openpick(e){
    if(open){
        colorpicker.style.display = 'none';
        open = false;
    }else{
        colorpicker.style.display = 'block';
        open = true;
        drawcanvaspick();
        SV(e);
    }
}


//

//events
window.addEventListener('load', () =>{
    const clear = document.querySelector('#clear');
    const fill = document.querySelector('#fill');
    canvas.height = window.innerHeight-60;
    canvas.width = window.innerWidth-25;
    let painting = false;


    // start draw
    function startPosition(e){
        let pos = getMousePos(canvas, e);
        if (mode == 0){
            ctx.beginPath();
            painting = true;
            draw(e);
        } else if(mode == 1) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        } else if(mode == 2){
            toolx = pos.x;
            tooly = pos.y;
        }else if(mode == 3) {
            const imgData = ctx.getImageData(pos.x, pos.y, 1, 1);
            r = imgData.data[0];
            g = imgData.data[1];
            b = imgData.data[2];
            a = imgData.data[3];
            opsl.value = a/2.55;
            let hsv = rgb2hsv(r, g, b);
            hueslider.value = hsv.h;
            s = hsv.s;
            v = hsv.v;
            updhue();
            SV();
            changeMode(0);
        }else if(mode == 4){
            console.log('');
        } else if(mode == 5){
            painting = true;
            ctx.clearRect(pos.x-slider.value/2, pos.y-slider.value/2, slider.value, slider.value);
        }
    }

    //end draw
    function finishedPosition(e){
        let pos = getMousePos(canvas, e);
        if (mode == 0){
            painting = false;
            ctx.beginPath();
        } else if (mode == 1){
            size = slider.value;
            ctx.lineWidth = size;
            ctx.lineCap = "round";
            ctx.strokeStyle = drawcolour;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else if(mode == 2){
            ctx.fillStyle = drawcolour;
            ctx.fillRect(toolx, tooly, pos.x-toolx, pos.y-tooly)
        }else if(mode == 5){
            painting = false;
            ctx.clearRect(pos.x-slider.value/2, pos.y-slider.value/2, slider.value, slider.value);
    }
    }

    //draw
    function draw(e){
        let pos = getMousePos(canvas, e);
        if(mode != 5){
        if(!painting) return;
        size = slider.value;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.strokeStyle = drawcolour;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        }
        if(mode == 5){
            ctx.clearRect(pos.x-slider.value/2, pos.y-slider.value/2, slider.value, slider.value);
        }
    }

    //main canvas events
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);

    // clear event
    clear.addEventListener('click', () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    }); 


    // colour picker events
    pickcanvas.addEventListener('mousedown', (e) =>{
        picking = true;
        SV(e);
    });
    pickcanvas.addEventListener('mouseup', () =>{
        picking = false;
    });
    pickcanvas.addEventListener('mousemove', SV);
    //
});

/* modes
0: draw
1: Line
2: Rect
3: Eye Dropper
4: fill
5: eraser
*/
