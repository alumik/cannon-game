// 大炮相关参数
let CANNON_X = 50;
const CANNON_L = 50;
const CANNON_W = 10;
let CANNON_COLOR;
const BULLET_W = 10;
let BULLET_COLOR;

// 目标相关参数
const TARGET_L = 80;
const TARGET_W = 5;
const TARGET_MARGIN_LEFT = 200;
const TARGET_MARGIN_RIGHT = TARGET_L;
let TARGET_COLOR;
const PREDICTION_W = 1;
const PREDICTION_R = 40;
const PREDICTION_L = 30;
let PREDICTION_COLOR;

// 轨迹相关参数
const LAST_TRAJECTORY_W = 1;
const TRAJECTORY_W = 3;
let TRAJECTORY_COLOR_HIT;
let TRAJECTORY_COLOR_MISS;
let TRAJECTORY_COLOR;

// 地图相关参数
const GROUND_BUFFER = 50;
const GROUND_STEP = 5;
const GROUND_W = 1;
let GROUND_COLOR;
function ground(x) {
    let sigma = 150;
    let factor = 100000;
    let miu = 550;
    let offset = 500;
    return (-1 / (sqrt(2 * PI) * sigma) * exp(-sq(x - miu) / (2 * sq(sigma)))) * factor + offset;
}

// 动力相关参数
const FRICTION_FACTOR = 0.0025;
const VELOCITY_BAR_X = 950;
const VELOCITY_BAR_HL = 80;
const VELOCITY_BAR_W = 30;
const VELOCITY_MIN = 3;
const VELOCITY_MAX = 6;
let GRAVITY;
let VELOCITY_BAR_BACKGROUND;
let VELOCITY_BAR_COLOR;

// 界面相关参数
const TEXT_SIZE = 30;
const TEXT_X = 980;
const TEXT_Y = 20;
let TEXT_COLOR;
let BACKGROUND;
