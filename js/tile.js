/**
 * Tile class
 */
export default class Tile {
  /**
   * constructor
   * @param {number} label initial position(1-based) also is the text label of the tile
   */
  constructor(label){
    this.position = label;
    this.label = label;
    this.node = this.buildDomNode();
  }
  /**
   * @return {DOM Node} a new DOM node representing the tile
   */
  buildDomNode(){
    if(this.node){
      return this.node;
    }
    const node = document.createElement('li');
    node.textContent = this.label;
    node.classList.add('tile');
    return node;
  }
  /**
   * @return {Boolean} Check whether the tile is in position
   */
  isInPosition(){
    return this.position === this.label;
  }
  /**
   * @param {object} offset an object with x,y offset values for positioning the tile.
   */
  move(offset, newPosition){
    this.position = newPosition;
    this.node.style.setProperty('--offsetY', offset.y);
    this.node.style.setProperty('--offsetX', offset.x);
  }
};
