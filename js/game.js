// ==========================================
// ДРОБНЫЙ РЫЦАРЬ — 2D ПЛАТФОРМЕР
// ==========================================

// ===== КОНСТАНТЫ =====
const GRAVITY = 0.5;
const PLAYER_SPEED = 4;
const JUMP_FORCE = -12;
const TILE = 40;
const BATTLE_TIME = 12;

// ===== СОСТОЯНИЕ ИГРЫ =====
const State = {
    player: null,
    currentLevel: 1,
    score: 0,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    keys: 0,
    keysNeeded: 0,
    enemies: [],
    enemiesTotal: 0,
    running: false,
    paused: false,
    battleActive: false,
    battleEnemy: null,
    battleStartTime: 0
};

// ===== CANVAS =====
let canvas, ctx;
let canvasWidth, canvasHeight;
let keysPressed = {};

// ===== ДАННЫЕ 20 УРОВНЕЙ =====
const LEVELS = {
    // === ЭТАЖ 1: ЛЕТУЧИЕ МЫШИ ===
    1: {
        name: "Начало пути",
        bg: "#1a1a2e",
        ground: "#4a3728",
        enemies: [{ type: 'bat', x: 350, y: 280 }],
        keys: [{ x: 500, y: 300 }],
        doors: [],
        coins: [{ x: 200, y: 320 }, { x: 400, y: 250 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 250, y: 300, w: 120, h: 15 },
            { x: 450, y: 250, w: 100, h: 15 }
        ],
        exit: { x: 700, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    2: {
        name: "Тёмная пещера",
        bg: "#151528",
        ground: "#3d2d1d",
        enemies: [
            { type: 'bat', x: 250, y: 250 },
            { type: 'bat', x: 550, y: 300 }
        ],
        keys: [],
        doors: [],
        coins: [{ x: 350, y: 200 }, { x: 600, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 150, y: 300, w: 150, h: 15 },
            { x: 400, y: 240, w: 120, h: 15 },
            { x: 600, y: 310, w: 100, h: 15 }
        ],
        exit: { x: 720, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    3: {
        name: "Ключ от двери",
        bg: "#1a1a2e",
        ground: "#4a3728",
        enemies: [{ type: 'bat', x: 350, y: 200 }],
        keys: [{ x: 150, y: 270 }],
        doors: [{ x: 600, y: 295, needKeys: 1 }],
        coins: [{ x: 400, y: 180 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 300, w: 100, h: 15 },
            { x: 280, y: 240, w: 150, h: 15 },
            { x: 550, y: 310, w: 150, h: 15 }
        ],
        exit: { x: 720, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    4: {
        name: "Высокие платформы",
        bg: "#1e1e30",
        ground: "#3a2a1a",
        enemies: [
            { type: 'bat', x: 300, y: 180 },
            { type: 'bat', x: 550, y: 260 }
        ],
        keys: [{ x: 400, y: 120 }],
        doors: [{ x: 680, y: 295, needKeys: 1 }],
        coins: [{ x: 200, y: 280 }, { x: 500, y: 200 }],
        platforms: [
            { x: 0, y: 380, w: 300, h: 40 },
            { x: 500, y: 380, w: 300, h: 40 },
            { x: 120, y: 300, w: 100, h: 15 },
            { x: 280, y: 220, w: 100, h: 15 },
            { x: 380, y: 150, w: 80, h: 15 },
            { x: 500, y: 230, w: 120, h: 15 },
            { x: 650, y: 310, w: 120, h: 15 }
        ],
        exit: { x: 730, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    5: {
        name: "БОСС: Королева Мышей",
        bg: "#2a1a1a",
        ground: "#5a3a2a",
        enemies: [],
        boss: { type: 'bat_queen', x: 600, y: 260 },
        keys: [],
        doors: [],
        coins: [{ x: 300, y: 280 }, { x: 500, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 200, y: 300, w: 400, h: 15 }
        ],
        exit: { x: 720, y: 310 },
        playerStart: { x: 50, y: 320 }
    },

    // === ЭТАЖ 2: ПРИЗРАКИ ===
    6: {
        name: "Царство призраков",
        bg: "#0f0f23",
        ground: "#2d2d4a",
        enemies: [{ type: 'ghost', x: 400, y: 280 }],
        keys: [],
        doors: [],
        coins: [{ x: 250, y: 260 }, { x: 550, y: 300 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 180, y: 290, w: 140, h: 15 },
            { x: 450, y: 320, w: 120, h: 15 }
        ],
        exit: { x: 700, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    7: {
        name: "Призрачный коридор",
        bg: "#101025",
        ground: "#252540",
        enemies: [
            { type: 'ghost', x: 280, y: 220 },
            { type: 'ghost', x: 520, y: 280 }
        ],
        keys: [{ x: 350, y: 160 }],
        doors: [{ x: 680, y: 295, needKeys: 1 }],
        coins: [{ x: 180, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 300, w: 120, h: 15 },
            { x: 260, y: 240, w: 100, h: 15 },
            { x: 350, y: 180, w: 80, h: 15 },
            { x: 480, y: 300, w: 130, h: 15 },
            { x: 650, y: 310, w: 120, h: 15 }
        ],
        exit: { x: 730, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    8: {
        name: "Два ключа",
        bg: "#0a0a20",
        ground: "#202040",
        enemies: [
            { type: 'ghost', x: 200, y: 200 },
            { type: 'ghost', x: 450, y: 250 }
        ],
        keys: [{ x: 150, y: 170 }, { x: 550, y: 220 }],
        doors: [{ x: 680, y: 295, needKeys: 2 }],
        coins: [{ x: 300, y: 300 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 80, y: 220, w: 140, h: 15 },
            { x: 300, y: 320, w: 100, h: 15 },
            { x: 420, y: 270, w: 120, h: 15 },
            { x: 530, y: 200, w: 80, h: 15 },
            { x: 650, y: 310, w: 120, h: 15 }
        ],
        exit: { x: 730, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    9: {
        name: "Лабиринт духов",
        bg: "#0d0d28",
        ground: "#1d1d3d",
        enemies: [
            { type: 'ghost', x: 350, y: 140 },
            { type: 'ghost', x: 550, y: 240 }
        ],
        keys: [{ x: 400, y: 110 }, { x: 650, y: 200 }],
        doors: [{ x: 700, y: 295, needKeys: 2 }],
        coins: [{ x: 200, y: 280 }, { x: 500, y: 300 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 300, w: 120, h: 15 },
            { x: 250, y: 220, w: 100, h: 15 },
            { x: 380, y: 150, w: 80, h: 15 },
            { x: 500, y: 220, w: 100, h: 15 },
            { x: 620, y: 280, w: 80, h: 15 },
            { x: 680, y: 310, w: 100, h: 15 }
        ],
        exit: { x: 750, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    10: {
        name: "БОСС: Древний Призрак",
        bg: "#0a0a1a",
        ground: "#1a1a3a",
        enemies: [],
        boss: { type: 'ancient_ghost', x: 580, y: 240 },
        keys: [],
        doors: [],
        coins: [{ x: 250, y: 280 }, { x: 400, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 150, y: 300, w: 450, h: 15 }
        ],
        exit: { x: 720, y: 310 },
        playerStart: { x: 50, y: 320 }
    },

    // === ЭТАЖ 3: МАГИ ===
    11: {
        name: "Башня мага",
        bg: "#1a0a2e",
        ground: "#3d2a5c",
        enemies: [{ type: 'mage', x: 400, y: 260 }],
        keys: [],
        doors: [],
        coins: [{ x: 300, y: 220 }, { x: 550, y: 300 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 200, y: 260, w: 150, h: 15 },
            { x: 450, y: 320, w: 150, h: 15 }
        ],
        exit: { x: 700, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    12: {
        name: "Магические платформы",
        bg: "#200a30",
        ground: "#402050",
        enemies: [
            { type: 'mage', x: 280, y: 180 },
            { type: 'mage', x: 520, y: 280 }
        ],
        keys: [{ x: 350, y: 120 }],
        doors: [{ x: 680, y: 295, needKeys: 1 }],
        coins: [{ x: 180, y: 260 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 280, w: 100, h: 15 },
            { x: 240, y: 210, w: 100, h: 15 },
            { x: 340, y: 150, w: 70, h: 15 },
            { x: 460, y: 230, w: 100, h: 15 },
            { x: 580, y: 310, w: 120, h: 15 },
            { x: 650, y: 310, w: 120, h: 15 }
        ],
        exit: { x: 730, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    13: {
        name: "Три ключа",
        bg: "#1a0a28",
        ground: "#351a4a",
        enemies: [
            { type: 'mage', x: 200, y: 180 },
            { type: 'mage', x: 450, y: 200 }
        ],
        keys: [{ x: 120, y: 150 }, { x: 350, y: 280 }, { x: 550, y: 180 }],
        doors: [{ x: 680, y: 295, needKeys: 3 }],
        coins: [{ x: 400, y: 320 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 60, y: 200, w: 120, h: 15 },
            { x: 220, y: 280, w: 100, h: 15 },
            { x: 350, y: 220, w: 80, h: 15 },
            { x: 480, y: 150, w: 120, h: 15 },
            { x: 650, y: 310, w: 120, h: 15 }
        ],
        exit: { x: 730, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    14: {
        name: "Сложный путь",
        bg: "#150820",
        ground: "#2a1540",
        enemies: [
            { type: 'mage', x: 300, y: 120 },
            { type: 'mage', x: 550, y: 220 }
        ],
        keys: [{ x: 200, y: 200 }, { x: 620, y: 180 }],
        doors: [{ x: 700, y: 295, needKeys: 2 }],
        coins: [{ x: 400, y: 150 }, { x: 500, y: 300 }],
        platforms: [
            { x: 0, y: 380, w: 300, h: 40 },
            { x: 500, y: 380, w: 300, h: 40 },
            { x: 100, y: 280, w: 100, h: 15 },
            { x: 230, y: 200, w: 80, h: 15 },
            { x: 350, y: 130, w: 100, h: 15 },
            { x: 480, y: 200, w: 80, h: 15 },
            { x: 580, y: 280, w: 100, h: 15 },
            { x: 680, y: 310, w: 100, h: 15 }
        ],
        exit: { x: 750, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    15: {
        name: "БОСС: Архимаг",
        bg: "#200030",
        ground: "#3a1a5a",
        enemies: [],
        boss: { type: 'archmage', x: 580, y: 220 },
        keys: [],
        doors: [],
        coins: [{ x: 250, y: 280 }, { x: 400, y: 280 }, { x: 550, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 150, y: 300, w: 500, h: 15 }
        ],
        exit: { x: 720, y: 310 },
        playerStart: { x: 50, y: 320 }
    },

    // === ЭТАЖ 4: ДРАКОН ===
    16: {
        name: "Логово дракона",
        bg: "#2a0a0a",
        ground: "#5c2a2a",
        enemies: [{ type: 'fire', x: 350, y: 280 }],
        keys: [],
        doors: [],
        coins: [{ x: 250, y: 260 }, { x: 500, y: 300 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 180, y: 290, w: 150, h: 15 },
            { x: 420, y: 320, w: 130, h: 15 }
        ],
        exit: { x: 700, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    17: {
        name: "Огненные платформы",
        bg: "#300a0a",
        ground: "#602020",
        enemies: [
            { type: 'fire', x: 280, y: 200 },
            { type: 'dragonling', x: 550, y: 280 }
        ],
        keys: [{ x: 350, y: 140 }],
        doors: [{ x: 680, y: 295, needKeys: 1 }],
        coins: [{ x: 180, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 300, w: 100, h: 15 },
            { x: 240, y: 230, w: 100, h: 15 },
            { x: 360, y: 160, w: 70, h: 15 },
            { x: 480, y: 240, w: 100, h: 15 },
            { x: 600, y: 310, w: 120, h: 15 },
            { x: 660, y: 310, w: 100, h: 15 }
        ],
        exit: { x: 730, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    18: {
        name: "Драконье гнездо",
        bg: "#250505",
        ground: "#501515",
        enemies: [
            { type: 'fire', x: 200, y: 180 },
            { type: 'dragonling', x: 500, y: 220 }
        ],
        keys: [{ x: 150, y: 150 }, { x: 400, y: 280 }, { x: 600, y: 180 }],
        doors: [{ x: 700, y: 295, needKeys: 3 }],
        coins: [{ x: 300, y: 200 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 80, y: 200, w: 120, h: 15 },
            { x: 250, y: 280, w: 100, h: 15 },
            { x: 400, y: 200, w: 100, h: 15 },
            { x: 550, y: 140, w: 100, h: 15 },
            { x: 680, y: 310, w: 100, h: 15 }
        ],
        exit: { x: 750, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    19: {
        name: "Перед троном",
        bg: "#200000",
        ground: "#401010",
        enemies: [
            { type: 'dragonling', x: 280, y: 180 },
            { type: 'dragonling', x: 500, y: 220 },
            { type: 'fire', x: 400, y: 300 }
        ],
        keys: [{ x: 200, y: 140 }, { x: 550, y: 180 }],
        doors: [{ x: 700, y: 295, needKeys: 2 }],
        coins: [{ x: 350, y: 320 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 280, w: 100, h: 15 },
            { x: 220, y: 190, w: 80, h: 15 },
            { x: 340, y: 120, w: 80, h: 15 },
            { x: 460, y: 190, w: 80, h: 15 },
            { x: 560, y: 280, w: 100, h: 15 },
            { x: 680, y: 310, w: 100, h: 15 }
        ],
        exit: { x: 750, y: 310 },
        playerStart: { x: 50, y: 320 }
    },
    20: {
        name: "ФИНАЛ: Дракон Целочислен",
        bg: "#1a0000",
        ground: "#3a0a0a",
        enemies: [],
        boss: { type: 'dragon', x: 550, y: 180 },
        keys: [],
        doors: [],
        coins: [{ x: 200, y: 280 }, { x: 350, y: 280 }, { x: 500, y: 280 }],
        platforms: [
            { x: 0, y: 380, w: 800, h: 40 },
            { x: 100, y: 300, w: 550, h: 15 }
        ],
        exit: { x: 720, y: 310 },
        playerStart: { x: 50, y: 320 }
    }
};

// ===== ТИПЫ ВРАГОВ =====
const ENEMY_TYPES = {
    bat: { emoji: '🦇', name: 'Летучая мышь', hp: 1, w: 40, h: 40, speed: 0.8, difficulty: 'easy' },
    bat_queen: { emoji: '🦇', name: 'Королева Мышей', hp: 3, w: 60, h: 60, speed: 0.5, difficulty: 'easy', isBoss: true },
    ghost: { emoji: '👻', name: 'Призрак', hp: 1, w: 44, h: 44, speed: 0.7, difficulty: 'medium' },
    ancient_ghost: { emoji: '👻', name: 'Древний Призрак', hp: 3, w: 65, h: 65, speed: 0.4, difficulty: 'medium', isBoss: true },
    mage: { emoji: '🧙', name: 'Ученик мага', hp: 1, w: 44, h: 48, speed: 0.6, difficulty: 'conversion' },
    archmage: { emoji: '🧙', name: 'Архимаг', hp: 4, w: 60, h: 64, speed: 0.3, difficulty: 'hard', isBoss: true },
    fire: { emoji: '🔥', name: 'Огненный элементаль', hp: 1, w: 40, h: 44, speed: 0.9, difficulty: 'hard' },
    dragonling: { emoji: '🐲', name: 'Дракончик', hp: 2, w: 50, h: 50, speed: 0.5, difficulty: 'expert' },
    dragon: { emoji: '🐉', name: 'Дракон Целочислен', hp: 5, w: 100, h: 100, speed: 0.2, difficulty: 'expert', isBoss: true }
};

// ===== ИГРОК =====
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 36;
        this.h = 48;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.facingRight = true;
        this.animFrame = 0;
        this.animTimer = 0;
    }

    update(platforms) {
        // Управление
        if (keysPressed['ArrowLeft'] || keysPressed['KeyA']) {
            this.vx = -PLAYER_SPEED;
            this.facingRight = false;
        } else if (keysPressed['ArrowRight'] || keysPressed['KeyD']) {
            this.vx = PLAYER_SPEED;
            this.facingRight = true;
        } else {
            this.vx *= 0.8;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        // Прыжок
        if ((keysPressed['ArrowUp'] || keysPressed['KeyW'] || keysPressed['Space']) && this.onGround) {
            this.vy = JUMP_FORCE;
            this.onGround = false;
        }

        // Гравитация
        this.vy += GRAVITY;
        if (this.vy > 12) this.vy = 12;

        // Движение
        this.x += this.vx;
        this.y += this.vy;

        // Границы экрана
        if (this.x < 0) this.x = 0;
        if (this.x + this.w > canvasWidth) this.x = canvasWidth - this.w;

        // Падение
        if (this.y > canvasHeight + 50) {
            loseLife();
            return;
        }

        // Коллизии с платформами
        this.onGround = false;
        for (const p of platforms) {
            if (this.collides(p)) {
                // Сверху
                if (this.vy > 0 && this.y + this.h - this.vy <= p.y + 5) {
                    this.y = p.y - this.h;
                    this.vy = 0;
                    this.onGround = true;
                }
                // Снизу
                else if (this.vy < 0 && this.y - this.vy >= p.y + p.h - 5) {
                    this.y = p.y + p.h;
                    this.vy = 0;
                }
                // Слева
                else if (this.vx > 0) {
                    this.x = p.x - this.w;
                }
                // Справа
                else if (this.vx < 0) {
                    this.x = p.x + p.w;
                }
            }
        }

        // Анимация
        this.animTimer++;
        if (this.animTimer > 10) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
    }

    collides(rect) {
        return this.x < rect.x + rect.w &&
               this.x + this.w > rect.x &&
               this.y < rect.y + rect.h &&
               this.y + this.h > rect.y;
    }

    draw() {
        ctx.save();
        
        // Тень
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h + 3, this.w / 2 - 5, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        const cx = this.x + this.w / 2;
        const cy = this.y + this.h / 2;

        if (!this.facingRight) {
            ctx.translate(cx, cy);
            ctx.scale(-1, 1);
            ctx.translate(-cx, -cy);
        }

        // Тело рыцаря (пиксельный стиль)
        const bounce = this.onGround && Math.abs(this.vx) > 0.5 ? Math.sin(this.animFrame * Math.PI / 2) * 2 : 0;
        
        // Броня (тело)
        ctx.fillStyle = '#708090';
        ctx.fillRect(this.x + 8, this.y + 18 - bounce, 20, 22);
        
        // Шлем
        ctx.fillStyle = '#5f6f7f';
        ctx.fillRect(this.x + 6, this.y + 4 - bounce, 24, 18);
        
        // Визор
        ctx.fillStyle = '#2a3a4a';
        ctx.fillRect(this.x + 10, this.y + 10 - bounce, 12, 6);
        
        // Забрало
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.x + 8, this.y + 8 - bounce, 4, 10);
        
        // Ноги
        const legOffset = this.onGround && Math.abs(this.vx) > 0.5 ? this.animFrame % 2 * 3 : 0;
        ctx.fillStyle = '#505a60';
        ctx.fillRect(this.x + 10, this.y + 38 - bounce, 6, 10);
        ctx.fillRect(this.x + 20, this.y + 38 - bounce + legOffset, 6, 10 - legOffset);
        
        // Меч
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(this.x + 28, this.y + 20 - bounce, 6, 20);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.x + 26, this.y + 38 - bounce, 10, 4);
        
        // Щит
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x - 2, this.y + 20 - bounce, 8, 16);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.x, this.y + 24 - bounce, 4, 8);

        ctx.restore();
    }
}

// ===== ВРАГ =====
class Enemy {
    constructor(data, type) {
        const t = ENEMY_TYPES[type];
        this.x = data.x;
        this.y = data.y;
        this.startX = data.x;
        this.w = t.w;
        this.h = t.h;
        this.emoji = t.emoji;
        this.name = t.name;
        this.hp = t.hp;
        this.maxHp = t.hp;
        this.speed = t.speed;
        this.difficulty = t.difficulty;
        this.isBoss = t.isBoss || false;
        this.defeated = false;
        this.dir = 1;
        this.animOffset = Math.random() * Math.PI * 2;
    }

    update() {
        if (this.defeated) return;
        
        // Движение
        this.x += this.speed * this.dir;
        const range = this.isBoss ? 60 : 40;
        if (this.x > this.startX + range || this.x < this.startX - range) {
            this.dir *= -1;
        }
    }

    draw() {
        if (this.defeated) return;
        
        // Плавная анимация (замедленная)
        const time = Date.now() / 1000;
        const floatY = Math.sin(time * 1.5 + this.animOffset) * 4;
        
        // Тень
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.w / 2, this.y + this.h + 5, this.w / 2 - 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Враг
        ctx.font = `${this.isBoss ? 60 : 40}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.emoji, this.x + this.w / 2, this.y + this.h / 2 + 12 + floatY);
        
        // Индикатор босса
        if (this.isBoss) {
            ctx.font = '10px "Press Start 2P"';
            ctx.fillStyle = '#ff4757';
            ctx.fillText('БОСС', this.x + this.w / 2, this.y - 10);
            
            // HP бар босса
            const barW = 60;
            const barH = 6;
            const barX = this.x + this.w / 2 - barW / 2;
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, this.y - 5, barW, barH);
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(barX, this.y - 5, barW * (this.hp / this.maxHp), barH);
        }
        
        ctx.textAlign = 'left';
    }

    collidesPlayer(player) {
        return !this.defeated &&
               player.x < this.x + this.w - 10 &&
               player.x + player.w > this.x + 10 &&
               player.y < this.y + this.h - 10 &&
               player.y + player.h > this.y + 10;
    }
}

// ===== ТЕКУЩИЙ УРОВЕНЬ =====
let currentLevel = {
    platforms: [],
    enemies: [],
    coins: [],
    keys: [],
    doors: [],
    exit: null,
    bg: '#1a1a2e',
    ground: '#4a3728'
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Клавиатура
    window.addEventListener('keydown', e => {
        keysPressed[e.code] = true;
        if (e.code === 'Escape' && State.running && !State.battleActive) {
            State.paused ? Game.resume() : Game.pause();
        }
    });
    window.addEventListener('keyup', e => keysPressed[e.code] = false);
    
    // Мобильное управление
    setupMobile();
    
    // UI
    Players.render();
    Records.render();
    
    console.log('🗡️ Дробный Рыцарь — Платформер загружен!');
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

function setupMobile() {
    // Определяем тачскрин по возможностям устройства, а не по User Agent
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    
    const left = document.getElementById('mobile-left');
    const right = document.getElementById('mobile-right');
    const jump = document.getElementById('mobile-jump');
    
    // Вибрация (если поддерживается)
    function vibrate(duration = 20) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    
    // Добавляем визуальный класс при нажатии
    function addPressedClass(btn) {
        btn.classList.add('pressed');
    }
    
    function removePressedClass(btn) {
        btn.classList.remove('pressed');
    }
    
    // Универсальная функция для привязки событий
    function bindTouchEvents(btn, keyCode, action = null) {
        if (!btn) return;
        
        const startHandler = (e) => {
            e.preventDefault();
            if (action) {
                action();
            } else {
                keysPressed[keyCode] = true;
            }
            addPressedClass(btn);
            vibrate();
        };
        
        const endHandler = (e) => {
            e.preventDefault();
            if (!action) {
                keysPressed[keyCode] = false;
            }
            removePressedClass(btn);
        };
        
        btn.addEventListener('touchstart', startHandler, { passive: false });
        btn.addEventListener('touchend', endHandler, { passive: false });
        btn.addEventListener('touchcancel', endHandler, { passive: false });
        
        // Предотвращаем контекстное меню при долгом нажатии
        btn.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    // Привязываем события к кнопкам
    bindTouchEvents(left, 'ArrowLeft');
    bindTouchEvents(right, 'ArrowRight');
    bindTouchEvents(jump, 'ArrowUp');
    
    // Предотвращаем двойной тап зум на всём документе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Предотвращаем зум при pinch на игровом экране
    document.addEventListener('gesturestart', e => e.preventDefault());
    document.addEventListener('gesturechange', e => e.preventDefault());
    document.addEventListener('gestureend', e => e.preventDefault());
}

// ===== UI УПРАВЛЕНИЕ =====
const UI = {
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
};

// ===== ИГРОКИ =====
const Players = {
    list: JSON.parse(localStorage.getItem('knight_players') || '[]'),
    current: null,

    save() {
        localStorage.setItem('knight_players', JSON.stringify(this.list));
    },

    create() {
        const input = document.getElementById('player-name-input');
        const name = input.value.trim();
        if (!name) return input.style.borderColor = '#ff4757';
        
        if (this.list.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            return alert('Имя уже занято!');
        }
        
        this.list.push({ id: Date.now(), name, maxLevel: 1, score: 0 });
        this.save();
        input.value = '';
        this.render();
    },

    select(id) {
        this.current = this.list.find(p => p.id === id);
        if (this.current) {
            document.getElementById('map-player-name').textContent = this.current.name;
            document.getElementById('map-player-score').textContent = '💰 ' + this.current.score;
            UI.showScreen('map-screen');
            Map.render();
        }
    },

    delete(id) {
        if (!confirm('Удалить героя?')) return;
        this.list = this.list.filter(p => p.id !== id);
        this.save();
        this.render();
    },

    render() {
        const container = document.getElementById('players-list');
        if (this.list.length === 0) {
            container.innerHTML = '<p class="no-players">Нет героев</p>';
            return;
        }
        container.innerHTML = this.list.map(p => `
            <div class="player-card" onclick="Players.select(${p.id})">
                <div class="info">
                    <span class="avatar">⚔️</span>
                    <div>
                        <div class="name">${esc(p.name)}</div>
                        <div class="stats">🏰 ${p.maxLevel} | 💰 ${p.score}</div>
                    </div>
                </div>
                <div class="actions">
                    <button class="play-btn" onclick="event.stopPropagation(); Players.select(${p.id})">▶</button>
                    <button class="del-btn" onclick="event.stopPropagation(); Players.delete(${p.id})">✕</button>
                </div>
            </div>
        `).join('');
    }
};

// ===== КАРТА УРОВНЕЙ =====
const Map = {
    render() {
        const maxLevel = Players.current ? Players.current.maxLevel : 1;
        
        // Этаж 1: уровни 1-5
        const floor1 = document.getElementById('floor-1-levels');
        floor1.innerHTML = this.renderFloor(1, 5, maxLevel);
        
        // Этаж 2: уровни 6-10
        const floor2 = document.getElementById('floor-2-levels');
        floor2.innerHTML = this.renderFloor(6, 10, maxLevel);
        
        // Этаж 3: уровни 11-15
        const floor3 = document.getElementById('floor-3-levels');
        floor3.innerHTML = this.renderFloor(11, 15, maxLevel);
        
        // Этаж 4: уровни 16-20
        const floor4 = document.getElementById('floor-4-levels');
        floor4.innerHTML = this.renderFloor(16, 20, maxLevel);
    },

    renderFloor(start, end, maxLevel) {
        let html = '';
        for (let i = start; i <= end; i++) {
            const isBoss = i % 5 === 0;
            const unlocked = i <= maxLevel;
            const completed = i < maxLevel;
            const current = i === maxLevel;
            
            const classes = ['level-node'];
            if (isBoss) classes.push('boss');
            if (unlocked) classes.push('unlocked');
            if (completed) classes.push('completed');
            if (current) classes.push('current');
            
            const content = isBoss ? this.getBossEmoji(i) : i;
            const onclick = unlocked ? `onclick="Game.start(${i})"` : '';
            
            html += `<div class="${classes.join(' ')}" ${onclick}>${content}</div>`;
        }
        return html;
    },

    getBossEmoji(level) {
        if (level === 5) return '🦇';
        if (level === 10) return '👻';
        if (level === 15) return '🧙';
        if (level === 20) return '🐉';
        return '👑';
    }
};

// ===== РЕКОРДЫ =====
const Records = {
    render() {
        const container = document.getElementById('records-list');
        const sorted = [...Players.list].sort((a, b) => b.score - a.score);
        
        if (sorted.length === 0) {
            container.innerHTML = '<p class="no-records">Нет рекордов</p>';
            return;
        }
        
        const medals = ['🥇', '🥈', '🥉'];
        const classes = ['gold', 'silver', 'bronze'];
        
        container.innerHTML = sorted.slice(0, 10).map((p, i) => `
            <div class="record-row ${classes[i] || ''}">
                <span>${medals[i] || (i + 1)}</span>
                <span>${esc(p.name)}</span>
                <span>🏰 ${p.maxLevel}</span>
                <span>💰 ${p.score}</span>
            </div>
        `).join('');
    }
};

// ===== ИГРА =====
const Game = {
    start(level) {
        State.currentLevel = level;
        State.score = 0;
        State.lives = 3;
        State.combo = 0;
        State.maxCombo = 0;
        State.keys = 0;
        State.running = true;
        State.paused = false;
        State.battleActive = false;
        
        loadLevel(level);
        updateHUD();
        UI.showScreen('game-screen');
        
        requestAnimationFrame(gameLoop);
    },

    pause() {
        State.paused = true;
        document.getElementById('pause-modal').classList.remove('hidden');
    },

    resume() {
        State.paused = false;
        document.getElementById('pause-modal').classList.add('hidden');
    },

    restart() {
        document.getElementById('pause-modal').classList.add('hidden');
        this.start(State.currentLevel);
    },

    exitToMap() {
        State.running = false;
        document.getElementById('pause-modal').classList.add('hidden');
        UI.showScreen('map-screen');
        Map.render();
    },

    nextLevel() {
        if (State.currentLevel < 20) {
            this.start(State.currentLevel + 1);
        }
    }
};

// ===== ЗАГРУЗКА УРОВНЯ =====
function loadLevel(num) {
    const data = LEVELS[num];
    
    currentLevel.bg = data.bg;
    currentLevel.ground = data.ground;
    currentLevel.platforms = [...data.platforms];
    currentLevel.coins = data.coins.map(c => ({ ...c, collected: false }));
    currentLevel.keys = data.keys.map(k => ({ ...k, collected: false }));
    currentLevel.doors = data.doors.map(d => ({ ...d, open: false }));
    currentLevel.exit = { ...data.exit, active: false };
    
    // Враги
    currentLevel.enemies = data.enemies.map(e => new Enemy(e, e.type));
    if (data.boss) {
        currentLevel.enemies.push(new Enemy(data.boss, data.boss.type));
    }
    
    State.enemies = currentLevel.enemies;
    State.enemiesTotal = currentLevel.enemies.length;
    State.keysNeeded = data.doors.length > 0 ? Math.max(...data.doors.map(d => d.needKeys)) : 0;
    
    // Игрок
    State.player = new Player(data.playerStart.x, data.playerStart.y);
}

// ===== ИГРОВОЙ ЦИКЛ =====
function gameLoop() {
    if (!State.running) return;
    
    if (!State.paused && !State.battleActive) {
        update();
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    const p = State.player;
    p.update(currentLevel.platforms);
    
    // Враги
    for (const e of State.enemies) {
        e.update();
        if (e.collidesPlayer(p)) {
            startBattle(e);
            return;
        }
    }
    
    // Монеты
    for (const c of currentLevel.coins) {
        if (!c.collected && rectCollide(p, { x: c.x, y: c.y, w: 25, h: 25 })) {
            c.collected = true;
            State.score += 10;
            updateHUD();
        }
    }
    
    // Ключи
    for (const k of currentLevel.keys) {
        if (!k.collected && rectCollide(p, { x: k.x, y: k.y, w: 25, h: 25 })) {
            k.collected = true;
            State.keys++;
            updateHUD();
        }
    }
    
    // Двери
    for (const d of currentLevel.doors) {
        if (!d.open && State.keys >= d.needKeys && rectCollide(p, { x: d.x, y: d.y, w: 40, h: 55 })) {
            d.open = true;
        }
    }
    
    // Выход
    const allDefeated = State.enemies.every(e => e.defeated);
    const allDoorsOpen = currentLevel.doors.every(d => d.open);
    currentLevel.exit.active = allDefeated && allDoorsOpen;
    
    if (currentLevel.exit.active && rectCollide(p, { x: currentLevel.exit.x, y: currentLevel.exit.y, w: 50, h: 60 })) {
        levelComplete();
    }
}

function render() {
    // Фон
    ctx.fillStyle = currentLevel.bg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Декор
    ctx.font = '30px Arial';
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 6; i++) {
        ctx.fillText(['☁️', '⭐', '✨'][i % 3], 100 + i * 130, 60 + Math.sin(i) * 20);
    }
    ctx.globalAlpha = 1;
    
    // Платформы
    for (const p of currentLevel.platforms) {
        ctx.fillStyle = currentLevel.ground;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        // Трава/верх
        ctx.fillStyle = p.h > 20 ? '#5a8a3a' : '#7a6a5a';
        ctx.fillRect(p.x, p.y, p.w, 4);
    }
    
    // Ключи
    ctx.font = '24px Arial';
    for (const k of currentLevel.keys) {
        if (!k.collected) {
            const bounce = Math.sin(Date.now() / 300 + k.x) * 4;
            ctx.fillText('🗝️', k.x, k.y + bounce);
        }
    }
    
    // Монеты
    for (const c of currentLevel.coins) {
        if (!c.collected) {
            const bounce = Math.sin(Date.now() / 250 + c.x) * 3;
            ctx.fillText('💎', c.x, c.y + bounce);
        }
    }
    
    // Двери
    ctx.font = '40px Arial';
    for (const d of currentLevel.doors) {
        if (d.open) {
            ctx.globalAlpha = 0.4;
            ctx.fillText('🚪', d.x, d.y + 40);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillText('🔐', d.x, d.y + 40);
            ctx.font = '12px "Press Start 2P"';
            ctx.fillStyle = '#ffd700';
            ctx.fillText(`${State.keys}/${d.needKeys}`, d.x + 5, d.y - 5);
            ctx.font = '40px Arial';
        }
    }
    
    // Выход
    if (currentLevel.exit.active) {
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;
    } else {
        ctx.globalAlpha = 0.4;
    }
    ctx.fillText('🚩', currentLevel.exit.x, currentLevel.exit.y + 45);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // Враги
    for (const e of State.enemies) {
        e.draw();
    }
    
    // Игрок
    State.player.draw();
}

// ===== БОЙ =====
function startBattle(enemy) {
    State.battleActive = true;
    State.battleEnemy = enemy;
    State.battleStartTime = Date.now();
    
    document.getElementById('battle-sprite').textContent = enemy.emoji;
    document.getElementById('battle-name').textContent = (enemy.isBoss ? '👑 ' : '') + enemy.name;
    document.getElementById('battle-modal').classList.remove('hidden');
    
    generateQuestion(enemy.difficulty);
    updateBattleTimer();
}

function generateQuestion(difficulty) {
    let q, correct, wrongs;
    
    switch (difficulty) {
        case 'easy': ({ q, correct, wrongs } = genEasy()); break;
        case 'medium': ({ q, correct, wrongs } = genMedium()); break;
        case 'conversion': ({ q, correct, wrongs } = genConversion()); break;
        case 'hard': ({ q, correct, wrongs } = genHard()); break;
        case 'expert': ({ q, correct, wrongs } = genExpert()); break;
        default: ({ q, correct, wrongs } = genEasy());
    }
    
    document.getElementById('battle-question').textContent = q;
    
    const answers = shuffle([correct, ...wrongs]);
    document.getElementById('battle-answers').innerHTML = answers.map(a =>
        `<button class="answer-btn" onclick="checkAnswer(this, '${esc(a)}', '${esc(correct)}')">${a}</button>`
    ).join('');
}

function updateBattleTimer() {
    if (!State.battleActive) return;
    
    const elapsed = (Date.now() - State.battleStartTime) / 1000;
    const remaining = Math.max(0, BATTLE_TIME - elapsed);
    document.getElementById('battle-timer').style.width = (remaining / BATTLE_TIME * 100) + '%';
    
    if (remaining <= 0) {
        battleLose();
    } else {
        setTimeout(updateBattleTimer, 100);
    }
}

function checkAnswer(btn, selected, correct) {
    if (!State.battleActive) return;
    
    document.querySelectorAll('.answer-btn').forEach(b => b.onclick = null);
    
    if (selected === correct) {
        btn.classList.add('correct');
        setTimeout(battleWin, 400);
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.answer-btn').forEach(b => {
            if (b.textContent === correct) b.classList.add('correct');
        });
        setTimeout(battleLose, 800);
    }
}

function battleWin() {
    const enemy = State.battleEnemy;
    enemy.hp--;
    
    State.combo++;
    State.maxCombo = Math.max(State.maxCombo, State.combo);
    
    const elapsed = (Date.now() - State.battleStartTime) / 1000;
    let points = 50;
    if (elapsed < 3) points += 25;
    if (State.combo >= 3) points += 30;
    if (State.combo >= 5) points += 50;
    if (enemy.isBoss) points += 100;
    
    State.score += points;
    
    if (enemy.hp <= 0) {
        enemy.defeated = true;
        State.score += enemy.isBoss ? 200 : 50;
    }
    
    endBattle();
    
    if (enemy.hp > 0) {
        setTimeout(() => startBattle(enemy), 300);
    }
}

function battleLose() {
    State.combo = 0;
    loseLife();
    
    State.player.x -= State.player.facingRight ? 60 : -60;
    State.player.vy = -8;
    
    endBattle();
}

function endBattle() {
    State.battleActive = false;
    State.battleEnemy = null;
    document.getElementById('battle-modal').classList.add('hidden');
    updateHUD();
}

function loseLife() {
    State.lives--;
    updateHUD();
    
    if (State.lives <= 0) {
        gameOver();
    } else {
        const data = LEVELS[State.currentLevel];
        State.player.x = data.playerStart.x;
        State.player.y = data.playerStart.y;
        State.player.vx = 0;
        State.player.vy = 0;
    }
}

function levelComplete() {
    State.running = false;
    
    if (Players.current) {
        if (State.currentLevel >= Players.current.maxLevel && State.currentLevel < 20) {
            Players.current.maxLevel = State.currentLevel + 1;
        }
        Players.current.score = Math.max(Players.current.score, State.score);
        Players.save();
    }
    
    if (State.currentLevel === 20) {
        document.getElementById('final-score').textContent = State.score;
        UI.showScreen('final-screen');
    } else {
        document.getElementById('win-level').textContent = State.currentLevel;
        document.getElementById('win-score').textContent = State.score;
        document.getElementById('win-combo').textContent = State.maxCombo;
        UI.showScreen('win-screen');
    }
}

function gameOver() {
    State.running = false;
    document.getElementById('lose-score').textContent = State.score;
    UI.showScreen('lose-screen');
}

// ===== HUD =====
function updateHUD() {
    // Сердца
    const hearts = document.getElementById('hud-hearts');
    hearts.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        span.className = 'heart' + (i >= State.lives ? ' lost' : '');
        span.textContent = '❤️';
        hearts.appendChild(span);
    }
    
    // Ключи
    document.getElementById('hud-keys').textContent = `${State.keys}/${State.keysNeeded || 0}`;
    
    // Враги
    const defeated = State.enemies.filter(e => e.defeated).length;
    document.getElementById('hud-enemies').textContent = `${defeated}/${State.enemiesTotal}`;
    
    // Очки и комбо
    document.getElementById('hud-score').textContent = State.score;
    document.getElementById('hud-combo').textContent = State.combo;
    document.getElementById('hud-level').textContent = LEVELS[State.currentLevel].name;
}

// ===== ГЕНЕРАТОРЫ ВОПРОСОВ (только обыкновенные дроби) =====

// Лёгкий: сложение дробей с одинаковым знаменателем
function genEasy() {
    const types = [
        () => { // Сложение
            const d = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
            const n1 = Math.floor(Math.random() * (d - 1)) + 1;
            const n2 = Math.floor(Math.random() * (d - n1)) + 1;
            return { q: `${n1}/${d} + ${n2}/${d} = ?`, correct: simplify(n1 + n2, d), wrongs: wrongFracs(n1 + n2, d) };
        },
        () => { // Вычитание
            const d = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
            const n1 = Math.floor(Math.random() * (d - 1)) + 2;
            const n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
            return { q: `${n1}/${d} − ${n2}/${d} = ?`, correct: simplify(n1 - n2, d), wrongs: wrongFracs(n1 - n2, d) };
        },
        () => { // Какая дробь больше (одинаковый знаменатель)
            const d = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
            const n1 = Math.floor(Math.random() * (d - 2)) + 1;
            const n2 = n1 + 1 + Math.floor(Math.random() * (d - n1 - 1));
            return { q: `Что больше: ${n1}/${d} или ${n2}/${d}?`, correct: `${n2}/${d}`, wrongs: [`${n1}/${d}`, `${n1+n2}/${d}`, `1/${d}`] };
        }
    ];
    return types[Math.floor(Math.random() * types.length)]();
}

// Средний: сложение/вычитание дробей с разными знаменателями
function genMedium() {
    const types = [
        () => { // Сложение разных знаменателей
            const pairs = [[2, 4], [2, 6], [3, 6], [2, 3], [3, 9], [4, 8], [2, 8], [5, 10]];
            const [d1, d2] = pairs[Math.floor(Math.random() * pairs.length)];
            const lcd = lcm(d1, d2);
            const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
            const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
            const r = n1 * (lcd / d1) + n2 * (lcd / d2);
            return { q: `${n1}/${d1} + ${n2}/${d2} = ?`, correct: simplify(r, lcd), wrongs: wrongFracs(r, lcd) };
        },
        () => { // Вычитание разных знаменателей
            const pairs = [[4, 2], [6, 2], [6, 3], [3, 2], [8, 4], [10, 5]];
            const [d1, d2] = pairs[Math.floor(Math.random() * pairs.length)];
            const lcd = lcm(d1, d2);
            const n1 = Math.floor(Math.random() * (d1 - 1)) + 2;
            const n2 = Math.floor(Math.random() * Math.min(d2 - 1, n1 * (lcd / d1) / (lcd / d2) - 1)) + 1;
            const r = n1 * (lcd / d1) - n2 * (lcd / d2);
            if (r <= 0) return genMedium();
            return { q: `${n1}/${d1} − ${n2}/${d2} = ?`, correct: simplify(r, lcd), wrongs: wrongFracs(r, lcd) };
        },
        () => { // Сравнение дробей
            const comparisons = [
                { a: '1/2', b: '1/3', bigger: '1/2' }, { a: '2/3', b: '1/2', bigger: '2/3' },
                { a: '3/4', b: '2/3', bigger: '3/4' }, { a: '1/4', b: '1/3', bigger: '1/3' },
                { a: '2/5', b: '1/2', bigger: '1/2' }, { a: '3/5', b: '1/2', bigger: '3/5' },
                { a: '5/6', b: '3/4', bigger: '5/6' }, { a: '2/3', b: '3/5', bigger: '2/3' },
                { a: '3/8', b: '1/2', bigger: '1/2' }, { a: '5/8', b: '1/2', bigger: '5/8' }
            ];
            const item = comparisons[Math.floor(Math.random() * comparisons.length)];
            const smaller = item.a === item.bigger ? item.b : item.a;
            return { q: `Что больше: ${item.a} или ${item.b}?`, correct: item.bigger, wrongs: [smaller, '1/6', '1/5'] };
        }
    ];
    return types[Math.floor(Math.random() * types.length)]();
}

// Сравнение и сокращение дробей (для магов)
function genConversion() {
    const types = [
        () => { // Сокращение дроби
            const reductions = [
                { orig: '2/4', ans: '1/2' }, { orig: '2/6', ans: '1/3' }, { orig: '3/6', ans: '1/2' },
                { orig: '4/8', ans: '1/2' }, { orig: '3/9', ans: '1/3' }, { orig: '2/8', ans: '1/4' },
                { orig: '4/6', ans: '2/3' }, { orig: '6/8', ans: '3/4' }, { orig: '4/10', ans: '2/5' },
                { orig: '6/9', ans: '2/3' }, { orig: '5/10', ans: '1/2' }, { orig: '3/12', ans: '1/4' },
                { orig: '6/12', ans: '1/2' }, { orig: '8/12', ans: '2/3' }, { orig: '9/12', ans: '3/4' }
            ];
            const item = reductions[Math.floor(Math.random() * reductions.length)];
            const allAns = ['1/2', '1/3', '1/4', '2/3', '3/4', '2/5', '1/5', '1/6'];
            return { q: `Сократи: ${item.orig} = ?`, correct: item.ans, wrongs: shuffle(allAns.filter(x => x !== item.ans)).slice(0, 3) };
        },
        () => { // Какая дробь меньше
            const comparisons = [
                { a: '1/2', b: '2/3', smaller: '1/2' }, { a: '1/3', b: '1/4', smaller: '1/4' },
                { a: '2/5', b: '1/3', smaller: '1/3' }, { a: '3/4', b: '4/5', smaller: '3/4' },
                { a: '1/6', b: '1/5', smaller: '1/6' }, { a: '2/3', b: '5/6', smaller: '2/3' },
                { a: '3/8', b: '1/4', smaller: '1/4' }, { a: '5/6', b: '7/8', smaller: '5/6' }
            ];
            const item = comparisons[Math.floor(Math.random() * comparisons.length)];
            const bigger = item.a === item.smaller ? item.b : item.a;
            return { q: `Что меньше: ${item.a} или ${item.b}?`, correct: item.smaller, wrongs: [bigger, '1/2', '1/3'] };
        },
        () => { // Приведение к общему знаменателю
            const tasks = [
                { q: '1/2 = ?/6', ans: '3/6', wrongs: ['2/6', '4/6', '1/6'] },
                { q: '1/3 = ?/6', ans: '2/6', wrongs: ['1/6', '3/6', '4/6'] },
                { q: '1/4 = ?/8', ans: '2/8', wrongs: ['1/8', '3/8', '4/8'] },
                { q: '3/4 = ?/8', ans: '6/8', wrongs: ['4/8', '5/8', '7/8'] },
                { q: '2/3 = ?/9', ans: '6/9', wrongs: ['3/9', '4/9', '5/9'] },
                { q: '1/5 = ?/10', ans: '2/10', wrongs: ['1/10', '3/10', '5/10'] }
            ];
            const item = tasks[Math.floor(Math.random() * tasks.length)];
            return { q: item.q, correct: item.ans, wrongs: item.wrongs };
        }
    ];
    return types[Math.floor(Math.random() * types.length)]();
}

// Сложный: умножение дробей
function genHard() {
    const types = [
        () => { // Умножение
            const n1 = Math.floor(Math.random() * 3) + 1;
            const d1 = Math.floor(Math.random() * 4) + 2;
            const n2 = Math.floor(Math.random() * 3) + 1;
            const d2 = Math.floor(Math.random() * 3) + 2;
            const rn = n1 * n2, rd = d1 * d2;
            return { q: `${n1}/${d1} × ${n2}/${d2} = ?`, correct: simplify(rn, rd), wrongs: wrongFracs(rn, rd) };
        },
        () => { // Умножение на целое число
            const n = Math.floor(Math.random() * 3) + 1;
            const d = Math.floor(Math.random() * 4) + 2;
            const m = Math.floor(Math.random() * 3) + 2;
            const rn = n * m;
            return { q: `${n}/${d} × ${m} = ?`, correct: simplify(rn, d), wrongs: wrongFracs(rn, d) };
        },
        () => { // Нахождение части числа
            const parts = [
                { q: '1/2 от 10 = ?', ans: '5', wrongs: ['4', '6', '2'] },
                { q: '1/3 от 9 = ?', ans: '3', wrongs: ['2', '4', '6'] },
                { q: '1/4 от 12 = ?', ans: '3', wrongs: ['2', '4', '6'] },
                { q: '2/3 от 6 = ?', ans: '4', wrongs: ['2', '3', '5'] },
                { q: '3/4 от 8 = ?', ans: '6', wrongs: ['4', '5', '7'] },
                { q: '1/5 от 15 = ?', ans: '3', wrongs: ['2', '4', '5'] },
                { q: '2/5 от 10 = ?', ans: '4', wrongs: ['2', '3', '5'] }
            ];
            return parts[Math.floor(Math.random() * parts.length)];
        }
    ];
    return types[Math.floor(Math.random() * types.length)]();
}

// Экспертный: смешанные числа и неправильные дроби
function genExpert() {
    const types = [
        () => { // Неправильная дробь в смешанное число
            const w = Math.floor(Math.random() * 3) + 1;
            const d = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
            const n = Math.floor(Math.random() * (d - 1)) + 1;
            const imp = w * d + n;
            return { q: `${imp}/${d} = ?`, correct: `${w} ${n}/${d}`, wrongs: [`${w + 1} ${n}/${d}`, `${w} ${(n + 1) % d || 1}/${d}`, `${w - 1 || 1} ${n}/${d}`] };
        },
        () => { // Смешанное число в неправильную дробь
            const w = Math.floor(Math.random() * 2) + 1;
            const d = [2, 3, 4][Math.floor(Math.random() * 3)];
            const n = Math.floor(Math.random() * (d - 1)) + 1;
            const imp = w * d + n;
            return { q: `${w} ${n}/${d} = ?`, correct: `${imp}/${d}`, wrongs: [`${imp + 1}/${d}`, `${imp - 1}/${d}`, `${w + n}/${d}`] };
        },
        () => { // Сложение смешанных чисел
            const d = [2, 3, 4][Math.floor(Math.random() * 3)];
            const w1 = Math.floor(Math.random() * 2) + 1;
            const n1 = Math.floor(Math.random() * (d - 1)) + 1;
            const w2 = Math.floor(Math.random() * 2) + 1;
            const n2 = Math.floor(Math.random() * (d - n1)) + 1;
            const sumN = n1 + n2;
            const extraW = Math.floor(sumN / d);
            const finalN = sumN % d;
            const finalW = w1 + w2 + extraW;
            const ans = finalN === 0 ? `${finalW}` : `${finalW} ${finalN}/${d}`;
            return { q: `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ?`, correct: ans, wrongs: [`${finalW + 1} ${finalN || 1}/${d}`, `${finalW - 1} ${finalN || 1}/${d}`, `${w1 + w2} ${n1 + n2}/${d}`] };
        }
    ];
    return types[Math.floor(Math.random() * types.length)]();
}

// ===== УТИЛИТЫ =====
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
function simplify(n, d) {
    if (n === 0) return '0';
    const g = gcd(n, d);
    const sn = n / g, sd = d / g;
    return sd === 1 ? `${sn}` : `${sn}/${sd}`;
}
function wrongFracs(n, d) {
    const g = gcd(n, d);
    const sn = n / g, sd = d / g;
    return [simplify(sn + 1, sd), simplify(Math.max(1, sn - 1), sd), simplify(sn, sd > 2 ? sd - 1 : sd + 1)];
}
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function rectCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', init);
