import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  game = {
    fichas: 5000,
    apuesta: 0,
    apuestaMaxima: 500,
    on: false,
    player: {cartas: <any>[], puntos: 0, plantado: false, doblado: false},
    croupier: {cartas: <any>[], puntos: 0},
    aumentarApuesta(valor: number) {
      if(this.apuesta + valor <= this.apuestaMaxima) {
        this.apuesta += valor;
        this.fichas -= valor;
      }
    },
    empezarJuego(e: any) {
      this.on = true;
      e.target.remove();
      this.player.cartas.push(this.darCarta(), this.darCarta());
      this.croupier.cartas.push(this.darCarta());
      if (this.player.puntos === 21) {
        console.log('Blackjack!');
        this.croupier.cartas.push(this.darCarta());
        if( this.croupier.puntos !== 21) {
          this.victoriaJugador();
        } else {
          this.empate();
        }
      }
    },
    darCarta() {
      const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const palos = ['H', 'D', 'S', 'C'];
      const carta = valores[Math.round(Math.random() * 12)] + palos[Math.round(Math.random() * 3)];
      return carta;
    },
    valorCarta(char: string) {
      if(char === '1' || isNaN(+char)) {
        return 10;
      } else {
        return +char;
      }
    },
    sumarPuntos(who:any, puntos: number) {
      who.puntos += puntos;
      const nuevoPuntaje = this.player.puntos;
      if(nuevoPuntaje > 21) {
        this.victoriaCroupier()
      }
    },
    pedirCarta() {
      this.player.cartas.push(this.darCarta());
    },
    plantar() {
      this.player.plantado = true;
      this.croupier.cartas.push(this.darCarta());
      setTimeout(() => {
        if (this.croupier.puntos < 17) {
          this.plantar();
        } else if (this.croupier.puntos > 21) {
          this.victoriaJugador();
        } else {
          this.verificarGanador();
        }
      }, 1000)
    },
    doblar() {
      this.player.doblado = true;
      this.apuesta *= 2;
      this.player.cartas.push(this.darCarta());
      setTimeout(() => {
        if (this.player.puntos <= 21) {
          this.plantar();
        }
      }, 2000)
    },
    verificarGanador() {
      if (this.player.puntos > this.croupier.puntos) {
        this.victoriaJugador();
      } else if(this.player.puntos < this.croupier.puntos) {
        this.victoriaCroupier();
      } else {
        this.empate();
      }
    },
    victoriaJugador() {
      this.fichas += this.apuesta * 2;
      console.log('Ganaste!');
      const buttonVictoria = document.getElementById('btn-victory');
      buttonVictoria?.click();
      setTimeout(() => this.nuevaMano(), 2000);

    },
    victoriaCroupier() {
      this.player.plantado = true;
      if(this.player.doblado) {this.fichas -= this.apuesta / 2}
      const buttonDerrota = document.getElementById('btn-defeat');
      buttonDerrota?.click();
      setTimeout(() => this.nuevaMano(), 2000);
    },
    empate() {
      this.fichas += this.apuesta;
      console.log('Empate!');
      const buttonEmpate = document.getElementById('btn-draw');
      buttonEmpate?.click();
      setTimeout(() => this.nuevaMano(), 2000);
    },
    nuevaMano() {
      this.apuesta = 0;
      this.croupier.cartas.length = 0;
      this.croupier.puntos = 0;
      this.player.cartas.length = 0;
      this.player.puntos = 0;
      this.player.plantado = false;
      this.player.doblado = false;
      this.on = false;
    },
  }
  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  mensajeResultado(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
