import Board from './board.js';
export default class Game{
  /**
   * constructor
   * @param {number} cols number of columns of the board
   * @param {number} rows number of rows of the board
   * @param {css string} tileSize size of the tile
   * @param {number} randomizeFactor number of moves randomize will run
   * @param {Dom Node} root parent node the board will be appended to
   */
  constructor(cols = 3, rows = 3, tileSize = '20px', randomizeFactor = 20, root){
    this.board = new Board(cols, rows, tileSize);
    this.randomizeFactor = randomizeFactor;
    this.randomize(this.randomizeFactor);
    root.appendChild(this.board.node);
    this.bindEvents();
  }
  /**
   * Events binding initilization
   */
  bindEvents(){
    const board = this.board;
    const boardNode = board.node;
    boardNode.addEventListener('click', (e) => {
      if(boardNode.classList.contains('success')){
        boardNode.classList.remove('success');
        this.randomize(this.randomizeFactor);
      }
      else if(e.target.tagName === 'LI'){
        const targetTile = board.tiles.get(e.target);
        if(this.isMoveable(targetTile)){
          board.moveTile(targetTile);
          if(board.isAllInPosition()){
            boardNode.classList.add('success');
          }
        }
      }
    });
  }
  /**
   * Randomize tiles position based on randomizeFactor
   * Start moving tiles from default state to make sure the puzzle is solvable
   * Randomly pick one from current movable tiles, this makes sure
   * one of the tile is moved in earch randomize cycle
   * @param {number} randomizeFactor number of moves randomize will run
   */
  randomize(randomizeFactor){
    const board = this.board;
    // Get an array of TileObjects in default order(on initialization)
    const tileObjects = Array.from(board.tiles.values());
    tileObjects.push(null);
    for(let i = 0; i < randomizeFactor; i++){
      const moveablePositions = this.getMoveablePositions();
      const idx = Math.floor(Math.random() * moveablePositions.length);
      const selectedPos = moveablePositions[idx];
      // hint to solve the puzzle
      // console.log(`step ${i}: ${tileObjects[selectedPos - 1].label}`);
      (
        [tileObjects[selectedPos - 1], tileObjects[board.missing - 1]]
        =
        [tileObjects[board.missing - 1], tileObjects[selectedPos - 1]]
      )
      board.moveTile(tileObjects[board.missing - 1]);
    }
  }
  /**
   * Get current movable tiles positions
   * This function is only used in Randomize algorithm
   * Instead of randomly pick from all tiles, we randomly pick from only movable tiles.
   */
  getMoveablePositions(){
    const movables = [];
    const missing = this.board.missing;
    const cols = this.board.cols;
    const tilesCount = this.board.tilesCount;
    if(missing - 1 > 0 && missing % cols !== 1){
      movables.push(missing - 1);
    }
    if(missing + 1 <= tilesCount && missing % cols !== 0){
      movables.push(missing + 1);
    }
    if(missing - cols > 0){
      movables.push(missing - cols);
    }
    if(missing + cols <= tilesCount){
      movables.push(missing + cols);
    }
    return movables;
  }
  /**
   * Check if tile is movable.
   * @param {Tile} tile the tile to be checked
   * @return {Boolean} Whether the tile is movable
   */
  isMoveable(tile){
    const missing = this.board.missing;
    const cols = this.board.cols;
    const tilePosition = tile.position;
    return (
      (missing % cols !== 1) && (tilePosition === missing - 1)
      ||
      (missing % cols !== 0) && (tilePosition === missing + 1)
      ||
      tilePosition === missing - cols
      ||
      tilePosition === missing + cols
    )
  }
}
