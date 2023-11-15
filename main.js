/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/utils.js
/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
function calcTileType(index, boardSize) {
  const topRight = boardSize - 1;
  const topLeft = 0;
  const bottomRight = boardSize ** 2 - 1;
  const bottomLeft = boardSize ** 2 - boardSize;
  if (index === topLeft) {
    return 'top-left';
  }
  if (index === topRight) {
    return 'top-right';
  }
  if (index === bottomLeft) {
    return 'bottom-left';
  }
  if (index === bottomRight) {
    return 'bottom-right';
  }
  if (index > topLeft && index < topRight) {
    return 'top';
  }
  if (index > bottomLeft && index < bottomRight) {
    return 'bottom';
  }
  if (index % boardSize === 0) {
    return 'left';
  }
  if (index % boardSize === topRight) {
    return 'right';
  }
  return 'center';
}
function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandomPositions(allowedPositions, count) {
  let existingPositions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const positions = new Set();
  while (positions.size < count) {
    const randIndex = getRandomInt(allowedPositions.length);
    if (!existingPositions.includes(allowedPositions[randIndex])) {
      positions.add(allowedPositions[randIndex]);
    }
  }
  return Array.from(positions);
}
function createBoard(size) {
  return [...Array(size ** 2).keys()].map(elm => elm);
}
function getRow(position, size) {
  return Math.floor(position / size, 0);
}
function getCol(position, size) {
  return position % size;
}
function getAttackCells(charPosinioned) {
  let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  const {
    character,
    position
  } = charPosinioned;
  const attackRng = character.attackRange;
  const cellsArr = [];
  const board = createBoard(size);
  const row = getRow(position, size);
  const col = getCol(position, size);
  for (const i of board) {
    const rc = getRow(i, size);
    const cc = getCol(i, size);
    if (Math.abs(cc - col) <= attackRng && Math.abs(rc - row) <= attackRng) {
      if (i !== position) {
        cellsArr.push(i);
      }
    }
  }
  return cellsArr;
}
function getMoveCells(charPosinioned) {
  let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  const {
    character,
    position
  } = charPosinioned;
  const move = character.movementRange;
  const cellsArr = [];
  const board = createBoard(size);
  const row = getRow(position, size);
  const col = getCol(position, size);
  for (const i of board) {
    const rc = Math.floor(i / size, 0);
    const cc = i % size;
    if (Math.abs(cc - col) <= move && Math.abs(rc - row) <= move) {
      if (Math.abs(col - cc) === Math.abs(row - rc)) {
        cellsArr.push(i);
      } else if (rc === row || cc === col) {
        cellsArr.push(i);
      }
    }
  }
  cellsArr.splice(cellsArr.indexOf(position), 1);
  return cellsArr;
}
function forNumSort(a, b) {
  return a - b;
}
;// CONCATENATED MODULE: ./src/js/Character.js
/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
class Character {
  constructor(level) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'generic';
    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error('new Character() is not allowed');
    }
  }
  levelUp(level) {
    const prevLevel = this.level;
    if (level > 1) {
      for (let i = prevLevel; i < level; i++) {
        this.level++;
        this.attack = this.#levelUpProp(this.attack);
        this.defence = this.#levelUpProp(this.defence);
        this.health = Math.min(100, this.health + 80);
      }
    }
  }
  #levelUpProp(prop) {
    return Math.round(Math.max(prop, prop * ((this.health + 80) / 100)), 0);
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Bowman.js

class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.movementRange = 2;
    this.attackRange = 2;
    this.levelUp(level);
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Daemon.js

class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defence = 10;
    this.movementRange = 1;
    this.attackRange = 4;
    this.levelUp(level);
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Magician.js

class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.movementRange = 1;
    this.attackRange = 4;
    this.levelUp(level);
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Swordsman.js

class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 40;
    this.defence = 10;
    this.movementRange = 4;
    this.attackRange = 1;
    this.levelUp(level);
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Undead.js

class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defence = 10;
    this.movementRange = 4;
    this.attackRange = 1;
    this.levelUp(level);
  }
}
;// CONCATENATED MODULE: ./src/js/characters/Vampire.js

class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.movementRange = 2;
    this.attackRange = 2;
    this.levelUp(level);
  }
}
;// CONCATENATED MODULE: ./src/js/constants.js






const boardSize = 8;
const charsUser = [Bowman, Swordsman, Magician];
const charsComp = [Daemon, Undead, Vampire];
const charsUserByType = {
  bowman: Bowman,
  swordsman: Swordsman,
  magician: Magician
};
const charsCompByType = {
  daemon: Daemon,
  undead: Undead,
  vampire: Vampire
};
const charsByType = {
  bowman: Bowman,
  swordsman: Swordsman,
  magician: Magician,
  daemon: Daemon,
  undead: Undead,
  vampire: Vampire
};

// const startUserPositions = [...Array(boardSize).keys()].map((elm) => elm * boardSize);
const startUserPositions = [];
const startCompPositions = [];
for (let i = 0; i < boardSize; i++) {
  startUserPositions.push(i * boardSize);
  startUserPositions.push(i * boardSize + 1);
  startCompPositions.push((i + 1) * boardSize - 2);
  startCompPositions.push((i + 1) * boardSize - 1);
}

;// CONCATENATED MODULE: ./src/js/GamePlay.js


class GamePlay {
  constructor() {
    this.boardSize = boardSize;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();
    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');
    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));
    this.boardEl = this.container.querySelector('[data-id=board]');
    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }
    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }
    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);
      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');
      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);
      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }
  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }
  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }
  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }
  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }
  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }
  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }
  static showError(message) {
    alert(message);
  }
  static showMessage(message) {
    alert(message);
  }
  selectCell(index) {
    let color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yellow';
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }
  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList).filter(o => o.startsWith('selected')));
  }
  deselectAllCells() {
    const board = createBoard(this.boardSize);
    board.map(cell => this.deselectCell(cell));
  }
  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }
  hideCellTooltip(index) {
    this.cells[index].title = '';
  }
  showDamage(index, damage) {
    return new Promise(resolve => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);
      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }
  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }
  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/themes.js
const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain'
};
/* harmony default export */ const js_themes = (themes);
;// CONCATENATED MODULE: ./src/js/PositionedCharacter.js

class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }
    this.character = character;
    this.position = position;
  }
}
;// CONCATENATED MODULE: ./src/js/Team.js




/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
class Team {
  static compStartPos = startCompPositions;
  static userStartPos = startUserPositions;
  constructor(chars) {
    let userTeam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    this.userTeam = userTeam;
    this.charsAtPositions = this.#arrangeChars(chars, true);
  }
  get characters() {
    return this.charsAtPositions.map(elm => elm.character);
  }
  checkCharsPos(index) {
    return this.getCurrentPos().includes(index);
  }
  removeChar(char) {
    const teamChars = this.charsAtPositions;
    this.charsAtPositions = teamChars.filter(elm => elm !== char);
  }
  add(char) {
    this.#arrangeChars([char]).map(elm => this.charsAtPositions.push(elm));
  }
  addAll(chars) {
    this.#arrangeChars(chars).map(elm => this.charsAtPositions.push(elm));
  }
  #getStartPositions() {
    return this.userTeam ? Team.userStartPos : Team.compStartPos;
  }
  getCurrentPos() {
    return this.charsAtPositions.map(elm => elm.position);
  }
  #arrangeChars(chars) {
    let firstCall = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const arr = [];
    const startPos = this.#getStartPositions();
    const existPos = firstCall ? [] : this.getCurrentPos();
    const posArr = getRandomPositions(startPos, chars.length, existPos);
    chars.forEach((char, index) => {
      arr.push(new PositionedCharacter(char, posArr[index]));
    });
    return arr;
  }
  getCharWithMaxProp(property) {
    const maxProp = Math.max(...this.charsAtPositions.map(elm => elm.character[property]));
    return this.charsAtPositions.find(char => char.character[property] === maxProp);
  }
  getCharWithMinProp(property) {
    const minProp = Math.min(...this.charsAtPositions.map(elm => elm.character[property]));
    return this.charsAtPositions.find(char => char.character[property] === minProp);
  }
  getCharAtPos(index) {
    return this.charsAtPositions.find(char => char.position === index);
  }
  isEmpty() {
    return this.charsAtPositions.length === 0;
  }
  createPosCharFromData(positionedDataArr) {
    positionedDataArr.forEach(positionedData => {
      const {
        position,
        character
      } = positionedData;
      const {
        type
      } = character;
      const char = new charsByType[type](character.level);
      Object.entries(character).forEach(_ref => {
        let [key, val] = _ref;
        char[key] = val;
      });
      this.charsAtPositions.push(new PositionedCharacter(char, position));
    });
  }
}
;// CONCATENATED MODULE: ./src/js/generators.js



/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randNum = getRandomInt(allowedTypes.length);
    const randLevel = getRandomInt(maxLevel) + 1;
    yield new allowedTypes[randNum](randLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @param userTeam принадлежность команды, true по умолчанию (для user)
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
function generateTeam(allowedTypes, maxLevel, characterCount) {
  let userTeam = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  const chars = [];
  const charsGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    chars.push(charsGenerator.next().value);
  }
  return new Team(chars, userTeam);
}
;// CONCATENATED MODULE: ./src/js/GameState.js


class GameState {
  constructor() {
    this.level = 1;
    this.userTeam = null;
    this.compTeam = null;
    this._selectedChar = null;
    this.userTurn = null;
    this.gameOver = false;
    this.currentScore = 0;
    this._bestScore = 0;
  }
  get bestScore() {
    return this._bestScore;
  }
  set bestScore(value) {
    if (value > this._bestScore) {
      this._bestScore = value;
    }
  }
  calcScore() {
    const userChars = this.userTeam.charsAtPositions;
    const res = userChars.reduce((sum, current) => sum + current.character.health, 0);
    return Math.round(res * 1.1 ** (this.level - 1), 0);
  }
  get charsPositioned() {
    return this.updateCharsAtPositions();
  }
  get selectedChar() {
    return this._selectedChar;
  }
  set selectedChar(char) {
    this._selectedChar = char;
    if (char) {
      this.getRangesForChar();
    }
  }
  resetToInitial() {
    this.level = 1;
    this.userTeam = null;
    this.compTeam = null;
    this._selectedChar = null;
    this.userTurn = null;
    this.gameOver = false;
    this.currentScore = 0;
  }
  setState(data) {
    this.level = data.level;
    this.userTeam = generateTeam([], this.level, 0);
    this.compTeam = generateTeam([], this.level, 0, false);
    this.userTeam.createPosCharFromData(data.userTeam.charsAtPositions);
    this.compTeam.createPosCharFromData(data.compTeam.charsAtPositions);
    this._selectedChar = null;
    this.userTurn = null;
    this.gameOver = false;
    this.currentScore = data.currentScore;
    this._bestScore = data._bestScore;
  }
  getRangesForChar() {
    const char = this._selectedChar;
    char.moveCells = getMoveCells(char);
    char.attackCells = getAttackCells(char);
  }
  updateCharsAtPositions() {
    return [...this.userTeam.charsAtPositions, ...this.compTeam.charsAtPositions];
  }
  nextLevelUp() {
    this.currentScore += this.calcScore();
    this.level++;
    this.userTeam.charsAtPositions.forEach(char => char.character.levelUp(this.level));
  }
  setGameOver() {
    this.bestScore = this.currentScore + this.calcScore();
    this.userTeam.charsAtPositions = [];
    this.compTeam.charsAtPositions = [];
    this.gameOver = true;
  }
}
;// CONCATENATED MODULE: ./src/js/cursors.js
const cursors = {
  auto: 'auto',
  pointer: 'pointer',
  crosshair: 'crosshair',
  notallowed: 'not-allowed'
};
/* harmony default export */ const js_cursors = (cursors);
;// CONCATENATED MODULE: ./src/js/GameController.js







class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
  }
  init() {
    this.start();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }
  load(data) {
    Object.entries(data).forEach(_ref => {
      let [key, value] = _ref;
      this.gameState[key] = value;
    });
  }
  start() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    // first start
    const charsNum = this.gameState.level + 1;
    if (!data) {
      if (this.gameState.level > 1) {
        const userCharsToLevelUp = this.gameState.userTeam.characters;
        const existingCharsNum = userCharsToLevelUp.length;
        const additionalChars = Math.max(0, charsNum - existingCharsNum);
        const newUserTeam = generateTeam(charsUser, this.gameState.level, additionalChars);
        newUserTeam.addAll(userCharsToLevelUp);
        this.gameState.userTeam = newUserTeam;
      } else {
        this.gameState.userTeam = generateTeam(charsUser, this.gameState.level, charsNum);
      }
      this.gameState.compTeam = generateTeam(charsComp, this.gameState.level, charsNum, false);
    } else {
      // this.gameState = data;
      this.gameState.setState(data);
    }
    this.gamePlay.drawUi(js_themes[Object.keys(js_themes)[(this.gameState.level - 1) % 4]]);
    this.gamePlay.deselectAllCells();
    this.gamePlay.redrawPositions(this.gameState.charsPositioned);
    this.gameState.userTurn = true;
  }
  onNewGameClick() {
    this.gameState.resetToInitial();
    this.start();
  }
  async onCellClick(index) {
    if (this.gameState.gameOver) {
      return;
    }
    const prevChar = this.gameState.selectedChar;
    const charIntoCell = this.checkCharIntoCell(index);
    const compCheckPos = this.gameState.compTeam.checkCharsPos(index);
    const userCheckPos = this.gameState.userTeam.checkCharsPos(index);
    if (!this.gameState.selectedChar && compCheckPos) {
      GamePlay.showError('Это персонаж противника');
      return;
    }
    if (userCheckPos) {
      if (prevChar) {
        this.gamePlay.deselectCell(prevChar.position);
      }
      this.gamePlay.selectCell(charIntoCell.position);
      this.gameState.selectedChar = charIntoCell;
    } else if (compCheckPos) {
      if (!this.gameState.selectedChar.attackCells.includes(index)) {
        return;
      }
      await this.attackAction(charIntoCell, index);
      this.compLogic();
    } else {
      if (!this.gameState.selectedChar && !this.checkCharIntoCell()) {
        return;
      }
      if (!this.gameState.selectedChar.moveCells.includes(index)) {
        return;
      }

      // movement
      this.moveAction(index);
      this.compLogic();
    }
  }
  onCellEnter(index) {
    const charIntoCell = this.checkCharIntoCell(index);
    const char = this.gameState.selectedChar;
    const userCheckPos = this.gameState.userTeam.checkCharsPos(index);
    if (userCheckPos) {
      this.gamePlay.setCursor(js_cursors.pointer);
    } else if (charIntoCell && char && char.attackCells.includes(index)) {
      this.gamePlay.setCursor(js_cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    } else {
      this.gamePlay.setCursor(js_cursors.notallowed);
    }
    if (!charIntoCell && char) {
      if (char.moveCells.includes(index)) {
        this.gamePlay.setCursor(js_cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
    }
    if (charIntoCell) {
      const msg = GameController.getCharInfo(charIntoCell.character);
      this.gamePlay.showCellTooltip(msg, index);
    }
  }
  onCellLeave(index) {
    const selChar = this.gameState.selectedChar;
    if (selChar && selChar.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }
  compLogic() {
    const compChars = this.gameState.compTeam.charsAtPositions;
    const userChars = this.gameState.userTeam.charsAtPositions;
    const charCompCanAttack = compChars.map(char => {
      const targetsArr = [];
      for (const userChar of userChars) {
        if (getAttackCells(char).includes(userChar.position)) {
          targetsArr.push(userChar);
        }
      }
      return {
        attacker: char,
        targets: targetsArr
      };
    });
    const objToAttack = charCompCanAttack.find(elm => elm.targets.length > 0);
    if (objToAttack) {
      // comp attack
      this.gameState.selectedChar = objToAttack.attacker;
      const target = objToAttack.targets[0];
      this.attackAction(target, target.position);
    } else if (!this.gameState.userTurn) {
      // comp move
      const randChar = compChars[getRandomInt(compChars.length)];
      this.gameState.selectedChar = randChar;
      const availableCellsToMove = this.gameState.selectedChar.moveCells;
      const indexToMove = availableCellsToMove[getRandomInt(availableCellsToMove.length)];
      this.moveAction(indexToMove);
    }
  }
  findTargets(char) {
    const userChars = this.gameState.userTeam.charsAtPositions;
    const targetsArr = [];
    for (const userChar of userChars) {
      if (char.attackCells.includes(userChar.position)) {
        targetsArr.push(userChar);
      }
    }
    return targetsArr ? {
      attacker: char,
      targets: targetsArr
    } : null;
  }
  async attackAction(target, index) {
    const attacker = this.gameState.selectedChar.character;
    const attackRange = this.gameState.selectedChar.attackCells;
    if (attackRange.includes(index)) {
      const tgt = target.character;
      const damage = Math.round(Math.max(attacker.attack - tgt.defence, attacker.attack * 0.1), 0);
      tgt.health -= damage;
      await this.gamePlay.showDamage(index, damage);
      this.checkAlive(target);
      this.nextTurn();
    }
  }
  moveAction(index) {
    const currentCharacter = this.gameState.selectedChar;
    const charIntoCell = this.checkCharIntoCell(index);
    if (currentCharacter && !charIntoCell) {
      const checkMoveCells = currentCharacter.moveCells.includes(index);
      if (checkMoveCells) {
        const prevPosition = currentCharacter.position;
        this.gamePlay.deselectCell(prevPosition);
        currentCharacter.position = index;
        this.gameState.getRangesForChar();
        this.gamePlay.redrawPositions(this.gameState.charsPositioned);
        this.nextTurn();
      }
    }
  }
  nextTurn() {
    this.gameState.userTurn = !this.gameState.userTurn;
    this.gamePlay.deselectAllCells();
    this.gameState.selectedChar = null;
    if (this.gameState.compTeam.isEmpty()) {
      this.nextLevel();
      this.gameState.userTurn = true;
    } else if (this.gameState.userTeam.isEmpty()) {
      this.gameState.setGameOver();
      this.gamePlay.redrawPositions(this.gameState.charsPositioned);
      GamePlay.showMessage('Game Over');
    }
  }

  // check character health and delete him from board if health less than 0
  checkAlive(target) {
    const underAttackUser = this.gameState.userTeam.charsAtPositions.includes(target);
    if (target.character.health <= 0) {
      if (underAttackUser) {
        this.gameState.userTeam.removeChar(target);
      } else {
        this.gameState.compTeam.removeChar(target);
      }
    }
    this.gamePlay.redrawPositions(this.gameState.charsPositioned);
  }
  checkCharIntoCell(index) {
    return this.gameState.charsPositioned.find(el => el.position === index);
  }
  nextLevel() {
    this.gameState.nextLevelUp();
    if (this.gameState.level < 5) {
      this.start();
    } else {
      this.gameState.setGameOver();
      this.gamePlay.redrawPositions(this.gameState.charsPositioned);
      GamePlay.showMessage('Game Over, You Won!!');
    }
  }
  static getCharInfo(character) {
    const {
      level,
      attack,
      defence,
      health
    } = character;
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }
  onSaveGameClick() {
    this.stateService.save(this.gameState);
    GamePlay.showMessage('Game has been saved!');
  }
  onLoadGameClick() {
    if (this.stateService.storage.length) {
      this.start(this.stateService.load());
      setTimeout(() => GamePlay.showMessage('Saved game has been loaded!'), 200);
    } else {
      GamePlay.showMessage('There is no saved game in local storage');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/GameStateService.js
class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }
  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }
  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
/**
 * Entry point of app: don't change this
 */



const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
;// CONCATENATED MODULE: ./src/index.js



// Точка входа webpack
// Не пишите код в данном файле
/******/ })()
;