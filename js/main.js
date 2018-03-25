import Game from './game.js';
// new Game(columns #, rows #, tile size, randomize factor, mounting parent)
const game1 = new Game(3, 3, '50px', 50, document.querySelector('.playground'));
const game2 = new Game(4, 2, '100px', 20, document.querySelector('.playground'));
