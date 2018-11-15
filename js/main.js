let muzzle;
let target;
let last_trajectory = [];
let trajectory = [];
let bullet;
let bullet_velocity;
let bullet_out = false;
let hit_count = 0;
let shoot_count = 0;
let hit = false;
let show_prediction = false;
let velocity_bar = VELOCITY_MIN;

function setup() {
    createCanvas(1000, 600);
    angleMode(DEGREES);
    muzzle = createVector(CANNON_X, ground(CANNON_X) - CANNON_L);
    CANNON_COLOR = 255;
    BULLET_COLOR = 255;
    TARGET_COLOR = color(0, 255, 0);
    PREDICTION_COLOR = color(255, 255, 0);
    TRAJECTORY_COLOR_HIT = color(0, 255, 0);
    TRAJECTORY_COLOR_MISS = color(255, 0, 0);
    TRAJECTORY_COLOR = color(255, 255, 0);
    GROUND_COLOR = 255;
    GRAVITY = createVector(0, 0.004);
    VELOCITY_BAR_BACKGROUND = color(0, 0, 255);
    VELOCITY_BAR_COLOR = color(0, 255, 0);
    BACKGROUND = 0;
    TEXT_COLOR = 255;
    makeTarget();
}

function draw() {
    background(BACKGROUND);
    drawGround();
    drawTarget();
    drawCannon();
    drawLastTrajectory();
    if (show_prediction) {
        drawPrediction();
    }
    if (bullet_out) {
        drawTrajectory();
        drawBullet();
        for (let i = 0; i < 10; i++) {
            if (bullet_out) {
                moveBullet();
                judge();
            } else {
                break;
            }
        }
    }
    drawText();
    drawVelocityBar();
}

function mouseClicked() {
    if (!bullet_out) {
        bullet_out = true;
        shoot_count++;
        bullet = muzzle.copy();
        trajectory.push(bullet.copy());
        bullet_velocity = createVector(muzzle.x - CANNON_X, muzzle.y - ground(CANNON_X));
        bullet_velocity.setMag(velocity_bar);
    }
}

function keyPressed() {
    if (key === 'p') {
        show_prediction = !show_prediction;
    }
}

function makeTarget() {
    target = random(TARGET_MARGIN_LEFT, width - TARGET_MARGIN_RIGHT);
}

function __drawGround(start, end, color, weight) {
    stroke(color);
    strokeWeight(weight);
    for (let  x = start; x < end - GROUND_STEP; x += GROUND_STEP) {
        line(x, ground(x), x + GROUND_STEP, ground(x + GROUND_STEP));
    }
}

function __drawTrajectory(trajectory, color, weight) {
    if (trajectory.length > 1) {
        stroke(color);
        strokeWeight(weight);
        for (let i = 0; i < trajectory.length - 1; i++) {
            line(trajectory[i].x, trajectory[i].y, trajectory[i + 1].x, trajectory[i + 1].y);
        }
    }
}

function drawGround() {
    __drawGround(0, width + GROUND_BUFFER, GROUND_COLOR, GROUND_W);
}

function drawCannon() {
    let cannon_start = createVector(CANNON_X, ground(CANNON_X));
    let mouse_vector = createVector(mouseX - cannon_start.x, mouseY - cannon_start.y);
    mouse_vector.setMag(CANNON_L);
    let cannon_end = p5.Vector.add(cannon_start, mouse_vector);
    if (cannon_end.y <= ground(cannon_end.x)) {
        muzzle = cannon_end;
    }

    stroke(255, 0, 0);
    strokeWeight(2);
    line(cannon_start.x, cannon_start.y, mouseX, mouseY);
    strokeWeight(10);
    point(mouseX, mouseY);

    stroke(CANNON_COLOR);
    strokeWeight(CANNON_W);
    strokeCap(SQUARE);
    point(cannon_start.x, cannon_start.y);
    line(cannon_start.x, cannon_start.y, muzzle.x, muzzle.y);

    textSize(TEXT_SIZE / 2);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(1);
    fill(255);
    text(nfc(-mouse_vector.heading(), 2) + '°', cannon_start.x + 60, cannon_start.y - 20);
}

function drawTarget() {
    __drawGround(target, target + TARGET_L, TARGET_COLOR, TARGET_W);
}

function drawLastTrajectory() {
    let stroke_color;
    if (hit) {
        stroke_color = TRAJECTORY_COLOR_HIT;
    } else {
        stroke_color = TRAJECTORY_COLOR_MISS;
    }
    __drawTrajectory(last_trajectory, stroke_color, LAST_TRAJECTORY_W);
    if (last_trajectory.length > 0) {
        stroke(stroke_color);
        strokeWeight(TARGET_W);
        let hit_point = last_trajectory[last_trajectory.length - 1];
        point(hit_point.x, hit_point.y);
    }
}

function drawPrediction() {
    let p_bullet = muzzle.copy();
    let p_bullet_velocity = createVector(muzzle.x - CANNON_X, muzzle.y - ground(CANNON_X));
    p_bullet_velocity.setMag(velocity_bar);
    while(true) {
        p_bullet_velocity.add(GRAVITY);
        let speed = p_bullet_velocity.mag();
        let friction_acceleration = p_bullet_velocity.copy().setMag(FRICTION_FACTOR * sq(speed));
        p_bullet_velocity.sub(friction_acceleration);
        p_bullet.add(p_bullet_velocity);
        if (p_bullet.y >= ground(p_bullet.x) || p_bullet.x >= width + GROUND_BUFFER) {
            break;
        }
    }
    stroke(PREDICTION_COLOR);
    strokeWeight(PREDICTION_W);
    noFill();
    ellipse(p_bullet.x, p_bullet.y, PREDICTION_R, PREDICTION_R);
    line(p_bullet.x, p_bullet.y - PREDICTION_L, p_bullet.x, p_bullet.y + PREDICTION_L);
    line(p_bullet.x - PREDICTION_L, p_bullet.y, p_bullet.x + PREDICTION_L, p_bullet.y);
}

function moveBullet() {
    bullet_velocity.add(GRAVITY);
    let speed = bullet_velocity.mag();
    let friction_acceleration = bullet_velocity.copy().setMag(FRICTION_FACTOR * sq(speed));
    bullet_velocity.sub(friction_acceleration);
    bullet.add(bullet_velocity);
    trajectory.push(bullet.copy());
}

function drawTrajectory() {
    __drawTrajectory(trajectory, TRAJECTORY_COLOR, TRAJECTORY_W);
}

function drawBullet() {
    stroke(BULLET_COLOR);
    strokeWeight(BULLET_W);
    point(bullet.x, bullet.y);
}

function judge() {
    if (bullet.y >= ground(bullet.x) || bullet.x >= width + GROUND_BUFFER) {
        if (bullet.x > target && bullet.x < target + TARGET_L) {
            hit_count++;
            hit = true;
            makeTarget();
        } else {
            hit = false;
        }
        bullet_out = false;
        last_trajectory = trajectory;
        trajectory = [];
    }
}

function drawText() {
    noStroke();
    textSize(TEXT_SIZE);
    textAlign(RIGHT, TOP);
    fill(TEXT_COLOR);
    let accuracy = 0;
    if (shoot_count !== 0) {
        accuracy = nfc(hit_count / shoot_count * 100, 2) + '%';
    }
    text('发射：' + shoot_count + '   命中：' + hit_count + '   命中率：' + accuracy, TEXT_X, TEXT_Y);
}

function drawVelocityBar() {
    strokeCap(SQUARE);
    strokeWeight(VELOCITY_BAR_W);
    stroke(VELOCITY_BAR_BACKGROUND);
    velocity_bar = constrain(map(dist(mouseX, mouseY, CANNON_X, ground(CANNON_X)), 0, 800, VELOCITY_MIN, VELOCITY_MAX), VELOCITY_MIN, VELOCITY_MAX);
    line(VELOCITY_BAR_X, height / 2 + VELOCITY_BAR_HL, VELOCITY_BAR_X, height / 2 - VELOCITY_BAR_HL);
    stroke(VELOCITY_BAR_COLOR);
    line(VELOCITY_BAR_X, height / 2 + VELOCITY_BAR_HL, VELOCITY_BAR_X, height / 2 + VELOCITY_BAR_HL - map(velocity_bar, VELOCITY_MIN, VELOCITY_MAX, 0, 2 * VELOCITY_BAR_HL));
}
