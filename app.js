const PRESET_IMAGES = {
  city:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'>
        <defs>
          <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#223a5e'/>
            <stop offset='100%' stop-color='#151d33'/>
          </linearGradient>
          <linearGradient id='light' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#ffcc66'/>
            <stop offset='100%' stop-color='#ff9966'/>
          </linearGradient>
        </defs>
        <rect width='800' height='800' fill='url(#sky)'/>
        <circle cx='680' cy='120' r='55' fill='#f6e9b2'/>
        <rect x='40' y='360' width='130' height='400' fill='#1e2a44'/>
        <rect x='190' y='280' width='160' height='480' fill='#26385f'/>
        <rect x='370' y='330' width='140' height='430' fill='#1d2940'/>
        <rect x='530' y='230' width='220' height='530' fill='#2b3f62'/>
        <rect x='0' y='740' width='800' height='60' fill='#132032'/>
        <g fill='url(#light)'>
          <rect x='220' y='320' width='20' height='18'/><rect x='260' y='320' width='20' height='18'/><rect x='300' y='320' width='20' height='18'/>
          <rect x='220' y='360' width='20' height='18'/><rect x='260' y='360' width='20' height='18'/><rect x='300' y='360' width='20' height='18'/>
          <rect x='560' y='270' width='22' height='18'/><rect x='600' y='270' width='22' height='18'/><rect x='640' y='270' width='22' height='18'/><rect x='680' y='270' width='22' height='18'/>
          <rect x='560' y='310' width='22' height='18'/><rect x='600' y='310' width='22' height='18'/><rect x='640' y='310' width='22' height='18'/><rect x='680' y='310' width='22' height='18'/>
        </g>
      </svg>`),
  mountain:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'>
        <defs>
          <linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#ffd49b'/>
            <stop offset='100%' stop-color='#ff8f7a'/>
          </linearGradient>
        </defs>
        <rect width='800' height='800' fill='url(#bg)'/>
        <circle cx='620' cy='180' r='90' fill='#ffe8bb'/>
        <polygon points='60,640 280,280 500,640' fill='#385170'/>
        <polygon points='220,640 430,240 680,640' fill='#273952'/>
        <polygon points='360,640 570,320 780,640' fill='#1e2a3d'/>
        <polygon points='280,280 240,360 320,360' fill='#f4f7fa'/>
        <polygon points='430,240 390,320 470,320' fill='#f4f7fa'/>
        <polygon points='570,320 535,380 605,380' fill='#f4f7fa'/>
        <rect y='640' width='800' height='160' fill='#2d5b4c'/>
      </svg>`),
  forest:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'>
        <defs>
          <linearGradient id='mist' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#b9e4c9'/>
            <stop offset='100%' stop-color='#3f7c69'/>
          </linearGradient>
        </defs>
        <rect width='800' height='800' fill='url(#mist)'/>
        <rect y='640' width='800' height='160' fill='#2f5848'/>
        <g fill='#244538'>
          <polygon points='80,660 150,430 220,660'/>
          <polygon points='180,660 250,390 320,660'/>
          <polygon points='300,660 370,410 440,660'/>
          <polygon points='430,660 500,360 570,660'/>
          <polygon points='540,660 610,420 680,660'/>
          <polygon points='650,660 710,460 770,660'/>
        </g>
        <circle cx='120' cy='130' r='55' fill='#f2ffd6' opacity='0.8'/>
      </svg>`),
};

const BOARD_ROWS = 6;
const BOARD_COLS = 4;
const BOARD_TOTAL = BOARD_ROWS * BOARD_COLS;

const dom = {
  board: document.getElementById("board"),
  tray: document.getElementById("tray"),
  titleButton: document.getElementById("titleButton"),
  presetSelect: document.getElementById("presetSelect"),
  uploadInput: document.getElementById("uploadInput"),
  gridSizeSelect: document.getElementById("gridSizeSelect"),
  startButton: document.getElementById("startButton"),
  resetButton: document.getElementById("resetButton"),
  timerText: document.getElementById("timerText"),
  movesText: document.getElementById("movesText"),
  hintText: document.getElementById("hintText"),
  settingsModal: document.getElementById("settingsModal"),
  closeSettingsButton: document.getElementById("closeSettingsButton"),
  winModal: document.getElementById("winModal"),
  winStats: document.getElementById("winStats"),
  playAgainButton: document.getElementById("playAgainButton"),
};

const GameState = {
  tiles: [],
  boardSlots: [],
  trayTileIds: [],
  startTime: null,
  elapsed: 0,
  moves: 0,
  status: "idle",
  sourceImage: PRESET_IMAGES.city,
};

let timerId = null;
let selectedTile = null;
let touchDragState = null;

function initGame() {
  bindEvents();
  loadImage(PRESET_IMAGES[dom.presetSelect.value]);
  resetGame(false);
}

function bindEvents() {
  dom.titleButton.addEventListener("click", () => {
    dom.settingsModal.classList.remove("hidden");
  });

  dom.closeSettingsButton.addEventListener("click", () => {
    dom.settingsModal.classList.add("hidden");
  });

  dom.settingsModal.addEventListener("click", (event) => {
    if (event.target === dom.settingsModal) {
      dom.settingsModal.classList.add("hidden");
    }
  });

  dom.presetSelect.addEventListener("change", () => {
    dom.uploadInput.value = "";
    loadImage(PRESET_IMAGES[dom.presetSelect.value]);
    resetGame(false);
  });

  dom.uploadInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageData = await readFileAsDataURL(file);
    loadImage(imageData);
    resetGame(false);
  });

  dom.gridSizeSelect.addEventListener("change", () => {
    resetGame(false);
  });

  dom.startButton.addEventListener("click", () => startRound());
  dom.resetButton.addEventListener("click", () => resetGame(true));
  dom.playAgainButton.addEventListener("click", () => {
    dom.winModal.classList.add("hidden");
    startRound();
  });

}

function loadImage(imageSrc) {
  GameState.sourceImage = imageSrc;
}

function sliceImageToTiles() {
  GameState.tiles = Array.from({ length: BOARD_TOTAL }, (_, index) => ({
    id: index,
    correctIndex: index,
  }));
  GameState.boardSlots = Array.from({ length: BOARD_TOTAL }, () => null);
}

function shuffleTiles() {
  const ids = GameState.tiles.map((tile) => tile.id);
  if (ids.length <= 1) return ids;

  let shuffled = ids.slice();
  do {
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffled.every((value, index) => value === ids[index]));

  return shuffled;
}

function renderBoard() {
  dom.board.innerHTML = "";
  dom.board.style.gridTemplateColumns = `repeat(${BOARD_COLS}, 1fr)`;
  dom.board.style.gridTemplateRows = `repeat(${BOARD_ROWS}, 1fr)`;

  GameState.boardSlots.forEach((tileId, slotIndex) => {
    const slot = document.createElement("div");
    slot.className = "board-slot";
    slot.dataset.slotIndex = String(slotIndex);

    if (tileId !== null) {
      const tileNode = createTileNode(tileId, "board", slotIndex);
      slot.appendChild(tileNode);
    }

    dom.board.appendChild(slot);
  });
}

function renderTray() {
  dom.tray.innerHTML = "";

  GameState.trayTileIds.forEach((tileId, trayIndex) => {
    const tileNode = createTileNode(tileId, "tray", trayIndex);
    dom.tray.appendChild(tileNode);
  });
}

function createTileNode(tileId, sourceType, sourceIndex) {
  const tile = getTileById(tileId);

  const node = document.createElement("div");
  node.className = "tile";
  node.draggable = false;
  node.dataset.tileId = String(tileId);
  node.dataset.sourceType = sourceType;
  node.dataset.sourceIndex = String(sourceIndex);

  if (selectedTile && selectedTile.type === sourceType && selectedTile.index === sourceIndex && selectedTile.tileId === tileId) {
    node.classList.add("selected");
  }

  const x = (tile.correctIndex % BOARD_COLS) * 100;
  const y = Math.floor(tile.correctIndex / BOARD_COLS) * 100;
  node.style.backgroundImage = `url('${GameState.sourceImage}')`;
  node.style.backgroundSize = `${BOARD_COLS * 100}% ${BOARD_ROWS * 100}%`;
  node.style.backgroundPosition = `${x / (BOARD_COLS - 1 || 1)}% ${y / (BOARD_ROWS - 1 || 1)}%`;

  node.addEventListener("pointerdown", (event) => {
    startPointerDrag(event, { type: sourceType, index: sourceIndex, tileId }, node);
  });

  return node;
}

function startPointerDrag(event, source, node) {
  if (GameState.status !== "playing") return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  event.preventDefault();
  cleanupTouchDrag();

  const proxy = node.cloneNode(true);
  const rect = node.getBoundingClientRect();
  proxy.classList.add("drag-proxy");
  proxy.classList.remove("selected", "is-dragging");
  proxy.draggable = false;
  proxy.style.width = `${rect.width}px`;
  proxy.style.height = `${rect.height}px`;
  document.body.appendChild(proxy);

  touchDragState = {
    pointerId: event.pointerId,
    source,
    proxy,
    lastHighlight: null,
  };

  selectedTile = source;
  moveTouchProxy(event.clientX, event.clientY);
  updateTouchDropHighlight(event.clientX, event.clientY);

  document.addEventListener("pointermove", onPointerDragMove, { passive: false });
  document.addEventListener("pointerup", onPointerDragEnd, { passive: false });
  document.addEventListener("pointercancel", onPointerDragCancel, { passive: false });
}

function onPointerDragMove(event) {
  if (!touchDragState) return;
  if (event.pointerId !== touchDragState.pointerId) return;

  event.preventDefault();
  moveTouchProxy(event.clientX, event.clientY);
  updateTouchDropHighlight(event.clientX, event.clientY);
}

function onPointerDragEnd(event) {
  if (!touchDragState) return;
  if (event.pointerId !== touchDragState.pointerId) return;

  event.preventDefault();
  const target = resolveDropTarget(event.clientX, event.clientY);
  const source = touchDragState.source;
  cleanupTouchDrag();

  if (target) {
    handleDrop(source, target);
  }

}

function onPointerDragCancel(event) {
  if (!touchDragState) return;
  if (event.pointerId !== touchDragState.pointerId) return;
  cleanupTouchDrag();
}

function moveTouchProxy(clientX, clientY) {
  if (!touchDragState) return;
  touchDragState.proxy.style.left = `${clientX}px`;
  touchDragState.proxy.style.top = `${clientY}px`;
}

function resolveDropTarget(clientX, clientY) {
  const targetElement = document.elementFromPoint(clientX, clientY);
  if (!targetElement) return null;

  const slotNode = targetElement.closest(".board-slot");
  if (slotNode) {
    return { type: "board", index: Number(slotNode.dataset.slotIndex) };
  }

  const tileNode = targetElement.closest(".tile");
  if (tileNode) {
    const targetType = tileNode.dataset.sourceType;
    if (targetType === "board") {
      return { type: "board", index: Number(tileNode.dataset.sourceIndex) };
    }
    if (targetType === "tray") {
      return { type: "tray" };
    }
  }

  if (targetElement.closest("#tray")) {
    return { type: "tray" };
  }

  return null;
}

function updateTouchDropHighlight(clientX, clientY) {
  if (!touchDragState) return;
  clearTouchDropHighlight();

  const target = resolveDropTarget(clientX, clientY);
  if (!target) return;

  if (target.type === "board") {
    const slot = dom.board.querySelector(`.board-slot[data-slot-index="${target.index}"]`);
    if (slot) {
      slot.classList.add("drop-target");
      touchDragState.lastHighlight = slot;
    }
    return;
  }

  if (target.type === "tray") {
    dom.tray.classList.add("drop-target");
    touchDragState.lastHighlight = dom.tray;
  }
}

function clearTouchDropHighlight() {
  if (!touchDragState || !touchDragState.lastHighlight) return;
  touchDragState.lastHighlight.classList.remove("drop-target");
  touchDragState.lastHighlight = null;
}

function cleanupTouchDrag() {
  if (touchDragState) {
    clearTouchDropHighlight();
    if (touchDragState.proxy && touchDragState.proxy.parentNode) {
      touchDragState.proxy.parentNode.removeChild(touchDragState.proxy);
    }
  }

  document.removeEventListener("pointermove", onPointerDragMove);
  document.removeEventListener("pointerup", onPointerDragEnd);
  document.removeEventListener("pointercancel", onPointerDragCancel);

  touchDragState = null;
}

function handleDrop(source, target) {
  if (GameState.status !== "playing") return;

  const sourcePayload = source || selectedTile;
  if (!sourcePayload) return;

  const moved = moveTile(sourcePayload, target);
  if (!moved) return;

  GameState.moves += 1;
  dom.movesText.textContent = String(GameState.moves);
  selectedTile = null;

  renderBoard();
  renderTray();

  if (checkWin()) {
    finishRound();
  }
}

function moveTile(source, target) {
  const tileId = resolveTileAtSource(source);
  if (tileId === null || tileId === undefined) return false;

  if (target.type === "tray") {
    if (source.type !== "board") return false;
    GameState.boardSlots[source.index] = null;
    GameState.trayTileIds.push(tileId);
    return true;
  }

  if (target.type !== "board") return false;

  if (source.type === "board" && source.index === target.index) {
    return false;
  }

  const targetTileId = GameState.boardSlots[target.index];

  if (source.type === "tray") {
    GameState.trayTileIds.splice(source.index, 1);
    GameState.boardSlots[target.index] = tileId;
    if (targetTileId !== null) {
      GameState.trayTileIds.push(targetTileId);
    }
    return true;
  }

  if (source.type === "board") {
    GameState.boardSlots[source.index] = targetTileId;
    GameState.boardSlots[target.index] = tileId;
    return true;
  }

  return false;
}

function resolveTileAtSource(source) {
  if (source.type === "tray") {
    return GameState.trayTileIds[source.index] ?? null;
  }
  if (source.type === "board") {
    return GameState.boardSlots[source.index] ?? null;
  }
  return null;
}

function readDragSource(event) {
  event.preventDefault();
  if (!event.dataTransfer) return selectedTile;

  const raw = event.dataTransfer.getData("text/plain");
  if (!raw) return selectedTile;

  try {
    return JSON.parse(raw);
  } catch {
    return selectedTile;
  }
}

function checkWin() {
  if (GameState.trayTileIds.length > 0) return false;
  return GameState.boardSlots.every((tileId, slotIndex) => {
    if (tileId === null) return false;
    const tile = getTileById(tileId);
    return tile.correctIndex === slotIndex;
  });
}

function startTimer() {
  stopTimer();
  GameState.startTime = Date.now();
  timerId = window.setInterval(() => {
    GameState.elapsed = Math.floor((Date.now() - GameState.startTime) / 1000);
    dom.timerText.textContent = formatTime(GameState.elapsed);
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function startRound() {
  dom.winModal.classList.add("hidden");
  dom.settingsModal.classList.add("hidden");

  GameState.moves = 0;
  GameState.elapsed = 0;
  GameState.status = "playing";
  selectedTile = null;

  dom.movesText.textContent = "0";
  dom.timerText.textContent = "00:00";

  sliceImageToTiles();
  GameState.trayTileIds = shuffleTiles();

  renderBoard();
  renderTray();
  startTimer();

  dom.hintText.textContent = "把碎片栏中的拼块拖到棋盘中，拼回完整图片。";
}

function finishRound() {
  stopTimer();
  GameState.status = "won";
  GameState.elapsed = Math.floor((Date.now() - GameState.startTime) / 1000);
  dom.timerText.textContent = formatTime(GameState.elapsed);

  dom.winStats.textContent = `用时 ${formatTime(GameState.elapsed)}，共 ${GameState.moves} 步。`;
  dom.winModal.classList.remove("hidden");
  dom.hintText.textContent = "你已完成拼图，可点击“再玩一局”继续挑战。";

  renderBoard();
  renderTray();
}

function resetGame(showHint = true) {
  stopTimer();
  GameState.status = "idle";
  GameState.moves = 0;
  GameState.elapsed = 0;
  GameState.startTime = null;
  selectedTile = null;

  dom.movesText.textContent = "0";
  dom.timerText.textContent = "00:00";

  sliceImageToTiles();
  GameState.trayTileIds = shuffleTiles();

  renderBoard();
  renderTray();
  dom.winModal.classList.add("hidden");

  if (showHint) {
    dom.hintText.textContent = "已重置。点击标题打开设置，再点击“开始游戏”开始计时。";
  } else {
    dom.hintText.textContent = "棋盘为空，碎片在下方。点击标题打开设置并开始挑战。";
  }
}

function getTileById(tileId) {
  return GameState.tiles.find((tile) => tile.id === tileId);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

initGame();

