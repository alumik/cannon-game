let game
let cannon
let projectile

function setup() {
    createCanvas(1000, 600)
    angleMode(DEGREES)
    game = new Game({
        background: 0,
        iters_per_frame: 10,
        gravity: createVector(0, 0.004),
        ground: {
            color: 255,
            weight: 1,
            fn: x => {
                let sigma = 150
                let factor = 100000
                let miu = 550
                let y_offset = 500
                return (-1 / (sqrt(2 * PI) * sigma) * exp(-sq(x - miu) / (2 * sq(sigma)))) * factor + y_offset
            },
            buffer: 50,
            step: 15,
        },
        target: {
            length: 80,
            color: color(0, 255, 0),
            weight: 5,
            left_margin: 200,
            right_margin: 80,
        },
        text: {
            position: {
                x: 980,
                y: 20,
            },
            size: 30,
            color: 255,
        },
        power_meter: {
            position: {
                x: 950,
            },
            length: 160,
            background: color(0, 0, 255),
            color: color(0, 255, 0),
            weight: 30,
        }
    })
    cannon = new Cannon({
        cannon: {
            position: {
                x: 50,
            },
            length: 50,
            color: 255,
            weight: 10
        },
        aim_line: {
            color: color(255, 0, 0),
            weight: 2,
            end_weight: 10,
        },
        crosshair: {
            color: color(255, 255, 0),
            weight: 1,
            radius: 40,
            bar_length: 30,
        },
        text: {
            position: {
                x: 60,
                y: -20,
            },
            size: 15,
            color: 255,
            outline: {
                color: 0,
                weight: 1,
            },
        },
        power: {
            min: 0,
            max: 800,
        },
        speed: {
            min: 3,
            max: 6,
        }
    })
    projectile = new Projectile({
        friction: 0.0025,
        projectile: {
            color: 255,
            weight: 10,
        },
        last_trajectory: {
            color_hit: color(0, 255, 0),
            color_miss: color(255, 0, 0),
            weight: 1,
        },
        trajectory: {
            color: color(255, 255, 0),
            weight: 3,
            step: 15,
        }
    })
    game.spawnTarget()
}

function draw() {
    background(game.config.background)
    game.showGround()
    game.showTarget()
    cannon.setPower()
    cannon.show()
    projectile.showLastTrajectory()
    if (game.show_crosshair) {
        cannon.showCrosshair()
    }
    if (game.projectile_out) {
        projectile.showTrajectory()
        projectile.show()
        for (let i = 0; i < game.config.iters_per_frame; i++) {
            if (game.projectile_out) {
                projectile.move()
                projectile.checkHit()
            } else {
                break
            }
        }
    }
    game.showText()
    game.showPowerMeter()
}

function mouseClicked() {
    if (!game.projectile_out) {
        game.projectile_out = true
        projectile.position = cannon.muzzle.copy()
        projectile.trajectory.push(projectile.position.copy())
        projectile.velocity = cannon.body.copy()
        projectile.velocity.setMag(cannon.getSpeedFromPower())
    }
}

function keyPressed() {
    if (key === 'p') {
        game.show_crosshair = !game.show_crosshair
    }
}
