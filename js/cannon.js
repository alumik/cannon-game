class Cannon {
    constructor(config) {
        this.config = config
        this.muzzle = createVector(
            config.cannon.position.x,
            game.ground(config.cannon.position.x) - config.cannon.length,
        )
        this.position = createVector(
            config.cannon.position.x,
            game.ground(config.cannon.position.x),
        )
        this.body = createVector(
            mouseX - this.position.x,
            mouseY - this.position.y,
        )
        this.power = config.power.min
    }

    _showAimLine() {
        stroke(this.config.aim_line.color)
        strokeWeight(this.config.aim_line.weight)
        line(this.position.x, this.position.y, mouseX, mouseY)
        strokeWeight(this.config.aim_line.end_weight)
        point(mouseX, mouseY)
    }

    _showBody() {
        stroke(this.config.cannon.color)
        strokeWeight(this.config.cannon.weight)
        strokeCap(SQUARE)
        point(this.position.x, this.position.y)
        line(this.position.x, this.position.y, this.muzzle.x, this.muzzle.y)
        strokeCap(ROUND)
    }

    _showText() {
        textSize(this.config.text.size)
        textAlign(CENTER, CENTER)
        stroke(this.config.text.outline.color)
        strokeWeight(this.config.text.outline.weight)
        fill(this.config.text.color)
        text(
            nfc(-this.body.heading(), 2) + '°',
            this.position.x + this.config.text.position.x,
            this.position.y + this.config.text.position.y,
        )
    }

    getSpeedFromPower() {
        return constrain(
            map(
                dist(mouseX, mouseY, this.position.x, this.position.y),
                this.config.power.min,
                this.config.power.max,
                this.config.speed.min,
                this.config.speed.max,
            ),
            this.config.speed.min,
            this.config.speed.max,
        )
    }

    setPower() {
        this.power = constrain(
            dist(mouseX, mouseY, this.position.x, this.position.y),
            this.config.power.min,
            this.config.power.max,
        )
    }

    show() {
        let mouse_vector = createVector(
            mouseX - this.position.x,
            mouseY - this.position.y,
        )
        mouse_vector.setMag(this.config.cannon.length)
        let muzzle = p5.Vector.add(this.position, mouse_vector)
        if (muzzle.y <= game.ground(muzzle.x)) {
            this.muzzle = muzzle
        }
        this.body = p5.Vector.sub(this.muzzle, this.position)
        this._showAimLine()
        this._showBody()
        this._showText()
    }

    showCrosshair() {
        let projectile_position = this.muzzle.copy()
        let projectile_velocity = this.body.copy()
        projectile_velocity.setMag(this.getSpeedFromPower())
        while (true) {
            projectile_velocity.add(game.config.gravity)
            let speed = projectile_velocity.mag()
            let friction_acc = projectile_velocity.copy().setMag(projectile.config.friction * sq(speed))
            projectile_velocity.sub(friction_acc)
            projectile_position.add(projectile_velocity)
            if (projectile_position.y >= game.ground(projectile_position.x) || projectile_position.x > game.ground_max || projectile_position.x < game.ground_min) {
                break
            }
        }
        stroke(this.config.crosshair.color)
        strokeWeight(this.config.crosshair.weight)
        noFill()
        ellipse(
            projectile_position.x,
            projectile_position.y,
            this.config.crosshair.radius,
            this.config.crosshair.radius
        )
        line(
            projectile_position.x,
            projectile_position.y - this.config.crosshair.bar_length,
            projectile_position.x,
            projectile_position.y + this.config.crosshair.bar_length)
        line(
            projectile_position.x - this.config.crosshair.bar_length,
            projectile_position.y,
            projectile_position.x + this.config.crosshair.bar_length,
            projectile_position.y
        )
    }
}
