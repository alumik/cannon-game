class Game {
    constructor(config) {
        this.config = config
        this.ground = config.ground.fn
        this.ground_min = -config.ground.buffer
        this.ground_max = width + config.ground.buffer
        this.target = {}
        this.show_prediction = false
        this.hit = false
        this.hit_count = 0
        this.shoot_count = 0
        this.bullet_out = false
    }

    makeTarget() {
        this.target.left = random(
            this.config.target.margin_left,
            width - this.config.target.margin_right
        )
        this.target.right = this.target.left + this.config.target.len
    }

    __showAlongGround(start, end, color, weight) {
        stroke(color)
        strokeWeight(weight)
        for (let x = start; x < end - this.config.ground.step; x += this.config.ground.step) {
            line(
                x, this.ground(x),
                x + this.config.ground.step, this.ground(x + this.config.ground.step)
            )
        }
    }

    showGround() {
        this.__showAlongGround(
            0,
            this.ground_max,
            this.config.ground.color,
            this.config.ground.weight
        )
    }

    showTarget() {
        this.__showAlongGround(
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
            '发射：' + this.shoot_count + '   命中：' + this.hit_count + '   命中率：' + accuracy,
            this.config.text.offset.x,
            this.config.text.offset.y
        )
    }

    showSpeedBar() {
        strokeCap(SQUARE)
        strokeWeight(this.config.speed_bar.weight)
        stroke(this.config.speed_bar.background)
        line(
            this.config.speed_bar.x,
            height / 2 + this.config.speed_bar.half_len,
            this.config.speed_bar.x,
            height / 2 - this.config.speed_bar.half_len
        )
        stroke(this.config.speed_bar.color)
        let bar_len = map(
            cannon.power,
            cannon.config.power.min,
            cannon.config.power.max,
            0,
            2 * this.config.speed_bar.half_len
        )
        line(
            this.config.speed_bar.x,
            height / 2 + this.config.speed_bar.half_len,
            this.config.speed_bar.x,
            height / 2 + this.config.speed_bar.half_len - bar_len
        )
        strokeCap(ROUND)
    }
}
