const tablero = document.getElementById("juego");
const juego = tablero.getContext("2d");

tablero.width = 500;
tablero.height = 500;
let tamano = 50;
let snake = [{ x: 0, y: 200 }];
let direccion = "Derecha";
let comida = genComida();
let puntuacion = 0;
let fantasmaPick = 1;
let estado = false;
let jugando = false;
let modoJuego = 1;


const imgFantasmaRojo = new Image();
imgFantasmaRojo.src = "./img/fantasmaRojo.png";
const imgFantasmaAmarillo = new Image();
imgFantasmaAmarillo.src = "./img/fantasmaAmarillo.png";

const imgComecocosDer = new Image();
imgComecocosDer.src = "./img/comecocosDer.png";
const imgComecocosIzq = new Image();
imgComecocosIzq.src = "./img/comecocosIzq.png";
const imgComecocosArriba = new Image();
imgComecocosArriba.src = "./img/comecocosArriba.png";
const imgComecocosAbajo = new Image();
imgComecocosAbajo.src = "./img/comecocosAbajo.png";
const imgCirculo = new Image();
imgCirculo.src = "./img/circulo.png";

let tiempoUltimaTecla = Date.now();
let cooldown = 50;

document.addEventListener("keydown", cambiarDireccion);

function cambiarDireccion(event) {
  const key = event.key.toLowerCase();
  const actual = Date.now();
  if (actual - tiempoUltimaTecla < cooldown) {
    return;
  }
  tiempoUltimaTecla = actual;
  if (jugando) {
    if (estado) {
      if ((key === "w" || key === "arrowup") && direccion !== "Abajo") {
        direccion = "Arriba";
      }
      if ((key === "s" || key === "arrowdown") && direccion !== "Arriba") {
        direccion = "Abajo";
      }
      if ((key === "a" || key === "arrowleft") && direccion !== "Derecha") {
        direccion = "Izquierda";
      }
      if ((key === "d" || key === "arrowright") && direccion !== "Izquierda") {
        direccion = "Derecha";
      }
    }
    if (key === "p") {
      estado = !estado;
    }
  }
}

function iniciarJuego(tiempoActualizar, modoJuego2) {4
  const selModoJuego = document.getElementById("modoJuego");
  selModoJuego.classList.remove("active");
  cooldown = tiempoActualizar *0.75 ;
  modoJuego = modoJuego2;
  clearInterval(intervaloJuego);
  intervaloJuego = setInterval(actualizar, tiempoActualizar);
}

let intervaloJuego = null;

function actualizar() {
  if (estado && jugando) {
    limpiarTablero();
    dibujarSnake();
    moverSnake();
    dibujarComida();
    comprobarChoque();
    mostarPuntuacion();
    mostarModo();
  }
}

function limpiarTablero() {
  juego.fillStyle = "black";
  juego.fillRect(0, 0, tablero.width, tablero.height);
}

function dibujarSnake() {
  snake.forEach((segmento) => {
    if (segmento == snake[0]) {
      if (direccion == "Derecha") {
        juego.drawImage(
          imgComecocosDer,
          segmento.x,
          segmento.y,
          tamano,
          tamano
        );
      } else if (direccion == "Izquierda") {
        juego.drawImage(
          imgComecocosIzq,
          segmento.x,
          segmento.y,
          tamano,
          tamano
        );
      } else if (direccion == "Arriba") {
        juego.drawImage(
          imgComecocosArriba,
          segmento.x,
          segmento.y,
          tamano,
          tamano
        );
      } else if (direccion == "Abajo") {
        juego.drawImage(
          imgComecocosAbajo,
          segmento.x,
          segmento.y,
          tamano,
          tamano
        );
      }
    } else {
      juego.drawImage(imgCirculo, segmento.x, segmento.y, tamano, tamano);
    }
  });
}

function moverSnake() {
  const cabezaSnake = { ...snake[0] };

  if (direccion == "Derecha") {
    cabezaSnake.x += tamano;
  } else if (direccion == "Izquierda") {
    cabezaSnake.x -= tamano;
  } else if (direccion == "Abajo") {
    cabezaSnake.y += tamano;
  } else if (direccion == "Arriba") {
    cabezaSnake.y -= tamano;
  }

  if (cabezaSnake.x >= tablero.width) {
    cabezaSnake.x = 0;
  } else if (cabezaSnake.x < 0) {
    cabezaSnake.x = tablero.width - tamano;
  } else if (cabezaSnake.y >= tablero.height) {
    cabezaSnake.y = 0;
  } else if (cabezaSnake.y < 0) {
    cabezaSnake.y = tablero.height - tamano;
  }

  snake.unshift(cabezaSnake);

  if (cabezaSnake.x == comida.x && cabezaSnake.y == comida.y) {
    comida = genComida();
    if(modoJuego==1){
      puntuacion+=2;
    }else if(modoJuego==2){
      puntuacion+=3;
    }else if(modoJuego==3){
      puntuacion+=1;
    }else if(modoJuego==4){
      puntuacion+=2;
    }
  } else {
    snake.pop();
  }
}

function genComida() {
  let xComida;
  let yComida;
  let correcto = false;
  do {
    xComida = Math.floor((Math.random() * tablero.width) / tamano) * tamano;
    yComida = Math.floor((Math.random() * tablero.height) / tamano) * tamano;
    correcto = true;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === xComida && snake[i].y === yComida) {
        correcto = false;
        break;
      }
    }
  } while (!correcto);
  return { x: xComida, y: yComida };
}

function dibujarComida() {
  if (fantasmaPick === 1) {
    juego.drawImage(imgFantasmaAmarillo, comida.x, comida.y, tamano, tamano);
    fantasmaPick = 2;
  } else {
    juego.drawImage(imgFantasmaRojo, comida.x, comida.y, tamano, tamano);
    fantasmaPick = 1;
  }
}

function mostarPuntuacion() {
  juego.fillStyle = "white";
  juego.font = "15px Arial";
  juego.textAlign = "left";
  juego.fillText(`Puntuación: ${puntuacion}`, 10, 20);
}

function mostarModo() {
  juego.fillStyle = "white";
  juego.font = "15px Arial";
  juego.textAlign = "right";
  if(modoJuego==1){
    juego.fillText(`Fácil`, tablero.width-10, 20);
  }else if(modoJuego==2){
    juego.fillText(`Medio`, tablero.width-10, 20);
  }else if(modoJuego==3){
    juego.fillText(`Dificil`, tablero.width-10, 20);
  }else if(modoJuego==4){
    juego.fillText(`Hardcore`, tablero.width-10, 20);
  }
}


function comprobarChoque() {
  const cabezaSnake = snake[0];
  let finJuego = false;

  for (let i = 1; i < snake.length; i++) {
    if (cabezaSnake.x === snake[i].x && cabezaSnake.y === snake[i].y) {
      finJuego = true;
      break;
    }
  }

  if (finJuego) {
    jugando = !jugando;
    const modalOverlay = document.getElementById("overlay");
    modalOverlay.classList.add("active");
    document.getElementById("score").value = puntuacion;
    document.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      let nombre = document.getElementById("name").value;
      nombre = nombre.toUpperCase();
      const puntuacion = document.getElementById("score").value;
      fetch("guardarBBDD.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, puntuacion }),
      })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      document.querySelector("form").reset();
      modalOverlay.classList.remove("active");
      setTimeout(() => {
        cargarPuntuaciones();
      }, "1000");
      
    });
  }
}

function cargarPuntuaciones() {
  fetch("mostrarBBDD.php")
    .then((response) => response.text())
    .then((data) => {
      const modalPuntuaciones = document.getElementById("overlayPuntuaciones");
      modalPuntuaciones.classList.add("active");
      document.getElementById("puntuaciones").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
}

document.getElementById("reiniciar").addEventListener("click", function () {
  const modalPuntuaciones = document.getElementById("overlayPuntuaciones");
  modalPuntuaciones.classList.remove("active");
  resetearJuego();
});
document.getElementById("facil").addEventListener("click", function () {
  jugando=true;
  tamano=50;
  let tiempoActualizar = 150;
  const selModoJuego = document.getElementById("modoJuego");
  selModoJuego.classList.remove("active");
  iniciarJuego(tiempoActualizar, 1);
});

document.getElementById("medio").addEventListener("click", function () {
  jugando=true;
  tamano=50;
  let tiempoActualizar = 100;
  const selModoJuego = document.getElementById("modoJuego");
  selModoJuego.classList.remove("active");
  iniciarJuego(tiempoActualizar, 2);
});
document.getElementById("dificil").addEventListener("click", function () {
  jugando=true;
  tamano=25;
  let tiempoActualizar = 150;
  const selModoJuego = document.getElementById("modoJuego");
  selModoJuego.classList.remove("active");
  iniciarJuego(tiempoActualizar, 3);
});
document.getElementById("hardcore").addEventListener("click", function () {
  jugando=true;
  tamano=25;
  let tiempoActualizar = 50;
  const selModoJuego = document.getElementById("modoJuego");
  selModoJuego.classList.remove("active");
  iniciarJuego(tiempoActualizar, 4);
});

function resetearJuego() {
  snake = [{ x: 0, y: 250 }];
  direccion = "Derecha";
  puntuacion = 0;
  comida = genComida();
  estado = false;
  jugando = true;
  limpiarTablero();
  if (intervaloJuego) {
    clearInterval(intervaloJuego);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const selModoJuego = document.getElementById("modoJuego");
  selModoJuego.classList.add("active");
});