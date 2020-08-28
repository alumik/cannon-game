class Cannon {
    constructor(config) {
        this.config = config
        this.muzzle = createVector(
            config.cannon.x,
            game.ground(config.cannon.x) - config.cannon.len
        )
        this.pos = createVector(
            config.cannon.x,
            game.ground(config.cannon.x)
        )
        this.cannon_vec = createVector(
            mouseX - this.pos.x,
            mouseY - this.pos.y
        )
        this.power = config.power.min
    }

    _showAimLine() {
        stroke(this.config.aim_line.color)
        strokeWeight(this.config.aim_line.weight)
        line(this.pos.x, this.pos.y, mouseX, mouseY)
        strokeWeight(this.config.aim_line.end_weight)
        point(mouseX, mouseY)
    }

    _showBody() {
        stroke(this.config.cannon.color)
        strokeWeight(this.config.cannon.weight)
        strokeCap(SQUARE)
        point(this.pos.x, this.pos.y)
        line(this.pos.x, this.pos.y, this.muzzle.x, this.muzzle.y)
        strokeCap(ROUND)
    }

    _showText() {
        textSize(this.config.text.size)
        textAlign(CENTER, CENTER)
        stroke(this.config.text.outline.color)
        strokeWeight(this.config.text.outline.weight)
        fill(this.config.text.color)
        text(
            nfc(-this.cannon_vec.heading(), 2) + '°',
            this.pos.x + this.config.text.offset.x,
            this.pos.y + this.config.text.offset.y
        )
    }

    setPower() {
        this.power = constrain(
            map(
                dist(mouseX, mouseY, this.pos.x, this.pos.y),
                this.config.aim_line.min,
                this.config.aim_line.max,
                this.config.power.min,
                this.config.power.max
            ),
            this.config.power.min,
            this.config.power.max
        )
    }

    show() {
        let mouse_vec = createVector(
            mouseX - this.pos.x,
            mouseY - this.pos.y
        )
        mouse_vec.setMag(this.config.cannon.len)
        let muzzle = p5.Vector.add(this.pos, mouse_vec)
        if (muzzle.y <= game.ground(muzzle.x)) {
            this.muzzle = muzzle
        }
        this.cannon_vec = p5.Vector.sub(this.muzzle, this.pos)
        this._showAimLine()
        this._showBody()
        this._showText()
    }

    showAim() {
        let projectile_pos = this.muzzle.copy()
        let projectile_velocity = this.cannon_vec.copy()
        projectile_velocity.setMag(this.power)
        while (true) {
            projectile_velocity.add(game.config.gravity)
            let speed = projectile_velocity.mag()
            let friction_acc = projectile_velocity.copy().setMag(projectile.config.friction * sq(speed))
            projectile_velocity.sub(friction_acc)
            projectile_pos.add(projectile_velocity)
            if (projectile_pos.y >= game.ground(projectile_pos.x) || projectile_pos.x > game.ground_max || projectile_pos.x < game.ground_min) {
                break
            }
        }
        stroke(this.config.aim.color)
        strokeWeight(this.config.aim.weight)
        noFill()
        ellipse(
            projectile_pos.x,
            projectile_pos.y,
            this.config.aim.radius,
            this.config.aim.radius
        )
        line(
            projectile_pos.x,
            projectile_pos.y - this.config.aim.len,
            projectile_pos.x,
            projectile_pos.y + this.config.aim.len)
        line(
            projectile_pos.x - this.config.aim.len,
            projectile_pos.y,
            projectile_pos.x + this.config.aim.len,
            projectile_pos.y
        )
    }
}
