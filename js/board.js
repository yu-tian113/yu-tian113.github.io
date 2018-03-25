import Tile from './tile.js';
export default class Board{
  /**
   * constructor
   * @param {number} cols number of columns of the board
   * @param {number} rows number of rows of the board
   * @param {css string} tileSize size of the tile
   */
  constructor(cols, rows, tileSize){
    this.cols = cols;
    this.rows = rows;
    this.tilesCount = this.cols * this.rows;
    this.tileSize = tileSize;
    this.node = this.buildDomNode();
    this.tiles = this.buildTiles();
  }
  /**
   * @return {DOM Node} a new DOM node representing the board
   */
  buildDomNode(){
    if(this.node){
      return this.node;
    }
    const node = document.createElement('ul');
    node.classList.add('board');
    node.style.setProperty('--cols', this.cols);
    node.style.setProperty('--rows', this.rows);
    node.style.setProperty('--tile-size', this.tileSize);
    return node;
  }
  /**
   * Build Tile nodes and append to Board node
   */
  buildTiles(){
    if(this.tiles){
      return this.tiles;
    }
    let tiles = new Map(); // A map of [TileNode, TileObject] pairs
    for(var i = 1; i < this.tilesCount; i++){
      let tile = new Tile(i);
      tiles.set(tile.node, tile);
      this.node.appendChild(tile.node);
    }
    this.missing = i; // Empty slot is always initialized at last position
    this.inPositionCount = i; // All tiles are in position on initialization
    return tiles;
  }
  /**
   * Move the tile to empty slot
   * @param {Tile} targetTile the tile object to move
   */
  moveTile(targetTile){
    const tileOriginalPosition = targetTile.label,
          tileCurrentPosition = targetTile.position,
          tileNewPosition = this.missing;
    const movingOffset = this.getMovingOffset(tileOriginalPosition, tileNewPosition);
    if(movingOffset.y === 0 && movingOffset.x === 0){
      // tile is move back to correct position, inPosition counter + 1
      this.inPositionCount++;
    }
    else if(targetTile.isInPosition()){
      // tile is moved away from correct position, inPosition count - 1
      this.inPositionCount--;
    }
    targetTile.move(movingOffset, tileNewPosition);
    this.missing = tileCurrentPosition;
  }
  /**
   * Get the moving offset from a tile's current position(1-based) to new position
   * @param {number} from current position
   * @param {number} to new position
   * @return {object} an object with y and x properties(with css expression) representing the offset distance to move
   */
  getMovingOffset(from, to){
    const cols = this.cols;
    const verticalMovingUnits = Math.trunc((to - 1) / cols) - Math.trunc((from - 1) / cols);
    const horizontalMovingUnits = (to - 1) % cols - (from - 1) % cols;
    return {
      y: verticalMovingUnits === 0 ? 0 : `calc(${verticalMovingUnits} * 100% + ${verticalMovingUnits} * var(--tile-gap))`,
      x: horizontalMovingUnits === 0 ? 0 : `calc(${horizontalMovingUnits} * 100% + ${horizontalMovingUnits} * var(--tile-gap))`
    }
  }
  /**
   * @return {Boolean} Check whether all tiles are in position
   */
  isAllInPosition(){
    return this.tilesCount === this.inPositionCount;
  }
}
