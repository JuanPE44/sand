const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mousePosition = { x: 0, y: 0 };

function getHueColor(number) {
  number = Math.max(1, Math.min(number, 360));
  let hue = number;
  let saturation = 80;
  let lightness = 50;
  let hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  let rgbColor = hslToRgb(hue / 360, saturation / 100, lightness / 100);

  return {
    hsl: hslColor,
    rgb: `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`,
  };
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

let numberColor = 1;

const WIDTH_CANVAS = 400;
const HEIGHT_CANVAS = 400;

const matrix = 80;
const SIZE_CUBE = WIDTH_CANVAS / matrix;

canvas.width = WIDTH_CANVAS;
canvas.height = HEIGHT_CANVAS;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, WIDTH_CANVAS, HEIGHT_CANVAS);

let cubes = [];
let nextCubes = [];

for (let i = 0; i < matrix; i++) {
  cubes[i] = [];
  nextCubes[i] = [];
  for (let j = 0; j < matrix; j++) {
    cubes[i][j] = 0;
    nextCubes[i][j] = 0;
  }
}

document.addEventListener("click", (e) => {
  console.log(e);
  const { clientX, clientY } = e;
  const coordenadasX = clientX - canvas.getBoundingClientRect().left;
  const coordenadasY = clientY - canvas.getBoundingClientRect().top;
  const x = Math.floor(coordenadasX / SIZE_CUBE);
  const y = Math.floor(coordenadasY / SIZE_CUBE);

  addCubes({ x, y });

  if (numberColor > 360) {
    numberColor = 0;
  }
  numberColor += 5;
});

document.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  const coordenadasX = clientX - canvas.getBoundingClientRect().left;
  const coordenadasY = clientY - canvas.getBoundingClientRect().top;

  mousePosition.x = Math.floor(coordenadasX / SIZE_CUBE);
  mousePosition.y = Math.floor(coordenadasY / SIZE_CUBE);
});

document.addEventListener("keydown", (e) => {
  const { x, y } = mousePosition;
  animate({
    duration: 500,
    timing(timeFraction) {
      return timeFraction;
    },
    draw(progress) {
      const number = Math.floor(progress * 10);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {}
      }
    },
  });
});

function animate({ timing, draw, duration }) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction va de 0 a 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calcular el estado actual de la animación
    let progress = timing(timeFraction);

    draw(progress); // dibujar

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

function addCubes({ x, y }) {
  const rangoX = Math.floor(Math.random() * 2) + 3;
  const rangoY = Math.floor(Math.random() * 2) + 3;

  for (let i = x - rangoX; i < x + rangoX; i++) {
    for (let j = y - rangoY; j < y + rangoY; j++) {
      const numeroAleatorio = Math.random();
      if (numeroAleatorio < 0.5) {
        cubes[i][j] = 1;
      } else {
        cubes[i][j] = 0;
      }
    }
  }
}

function draw() {
  const numeroAleatorio = Math.random();
  let dir = numeroAleatorio < 0.5 ? 1 : -1;

  for (let i = matrix - 1; i >= 0; i--) {
    for (let j = matrix - 1; j >= 0; j--) {
      const rgbColor = getHueColor(cubes[i][j]).rgb;
      if (cubes[i][j] === 0) {
        ctx.fillStyle = `rgb(0,0,0)`;
      } else {
        ctx.fillStyle = rgbColor;
      }
      ctx.fillRect(i * SIZE_CUBE, j * SIZE_CUBE, SIZE_CUBE, SIZE_CUBE);
      if (cubes[i][j] === "") {
        ctx.fillStyle = `rgb(255,0,0)`;
      } else if (cubes[j][i] > 0 && cubes[j][i + 1] < 1) {
        cubes[j][i] = 0;

        if (
          cubes[j][i + 2] > 0 &&
          i < matrix - 1 &&
          j > 0 &&
          j < matrix - 1 &&
          i > 0 &&
          i < matrix - 1
        ) {
          if (cubes[j + 1][i + 2] < 1 && cubes[j - 1][i + 2] < 1) {
            cubes[j + dir][i] = numberColor;
          } else if (cubes[j + 1][i + 2] > 0 && cubes[j - 1][i + 2] < 1) {
            cubes[j - 1][i] = numberColor;
          } else if (cubes[j + 1][i + 2] < 1 && cubes[j - 1][i + 2] > 0) {
            cubes[j + 1][i] = numberColor;
          } else {
            cubes[j][i + 1] = numberColor;
          }
        } else {
          cubes[j][i + 1] = numberColor;
        }
      }
    }
  }
}

var fotogramasPorSegundo = 120;
function Animacion() {
  setTimeout(function () {
    window.requestAnimationFrame(Animacion);
    draw();
  }, 1000 / fotogramasPorSegundo);
}

Animacion();
