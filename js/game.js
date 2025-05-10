class Game {
    constructor(config) {
        this.config = config
        this.ground = config.ground.fn
        this.ground_min = -config.ground.buffer
        this.ground_max = width + config.ground.buffer
        this.target = {}
        this.show_crosshair = false
        this.hit = false
        this.hit_count = 0
        this.shoot_count = 0
        this.projectile_out = false
    }

    spawnTarget() {
        this.target.left = random(
            this.config.target.left_margin,
            width - this.config.target.right_margin,
        )
        this.target.right = this.target.left + this.config.target.length
    }

    _showAlongGround(start, end, color, weight) {
        stroke(color)
        strokeWeight(weight)
        for (let x = start; x < end - this.config.ground.step; x += this.config.ground.step) {
            line(
                x,
                this.ground(x),
                x + this.config.ground.step,
                this.ground(x + this.config.ground.step),
            )
        }
    }

    showGround() {
        this._showAlongGround(
            this.ground_min,
            this.ground_max,
            this.config.ground.color,
            this.config.ground.weight,
        )
    }

    showTarget() {
        this._showAlongGround(
            this.target.left,
            this.target.right,
            this.config.target.color,
            this.config.target.weight
        )
    }

    showText() {
        noStroke()
        textSize(this.config.text.size)
        textAlign(RIGHT, TOP)
        fill(this.config.text.color)
        let accuracy = 0
        if (this.shoot_count !== 0) {
            accuracy = nfc(this.hit_count / this.shoot_count * 100, 2) + '%'
        }
        text(
            'Shot: ' + this.shoot_count + '    Hit: ' + this.hit_count + '   Accuracy: ' + accuracy,
            this.config.text.position.x,
            this.config.text.position.y,
        )
    }

    showPowerMeter() {
        strokeCap(SQUARE)
        strokeWeight(this.config.power_meter.weight)
        stroke(this.config.power_meter.background)
        line(
            this.config.power_meter.position.x,
            height / 2 + this.config.power_meter.length / 2,
            this.config.power_meter.position.x,
            height / 2 - this.config.power_meter.length / 2,
        )
        stroke(this.config.power_meter.color)
        let filled_length = map(
            cannon.power,
            cannon.config.power.min,
            cannon.config.power.max,
            0,
            this.config.power_meter.length,
        )
        line(
            this.config.power_meter.position.x,
            height / 2 + this.config.power_meter.length / 2,
            this.config.power_meter.position.x,
            height / 2 + this.config.power_meter.length / 2 - filled_length,
        )
        strokeCap(ROUND)
    }
}
