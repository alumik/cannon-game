class Bullet {
    constructor(config) {
        this.config = config
        this.pos = undefined
        this.velocity = undefined
        this.trajectory = []
        this.last_trajectory = []
    }

    static __showTrajectoryByType(trajectory, color, weight) {
        if (trajectory.length > 1) {
            stroke(color)
            strokeWeight(weight)
            for (let i = 0; i < trajectory.length - 1; i++) {
                line(
                    trajectory[i].x, trajectory[i].y,
                    trajectory[i + 1].x, trajectory[i + 1].y
                )
            }
        }
    }

    move() {
        this.velocity.add(game.config.gravity)
        let speed = this.velocity.mag()
        let friction_acc = this.velocity.copy().setMag(this.config.friction * sq(speed))
        this.velocity.sub(friction_acc)
        this.pos.add(this.velocity)
        this.trajectory.push(this.pos.copy())
    }

    judge() {
        if (this.pos.y >= game.ground(this.pos.x) || this.pos.x > game.ground_max || this.pos.x < game.ground_min) {
            game.shoot_count++
            if (this.pos.x > game.target.left && this.pos.x < game.target.right) {
                game.hit_count++
                game.hit = true
                game.makeTarget()
            } else {
                game.hit = false
            }
            game.bullet_out = false
            this.last_trajectory = this.trajectory
            this.trajectory = []
        }
    }

    show() {
        stroke(this.config.bullet.color)
        strokeWeight(this.config.bullet.weight)
        point(this.pos.x, this.pos.y)
    }

    showLastTrajectory() {
        let stroke_color
        if (game.hit) {
            stroke_color = this.config.last_trajectory.color_hit
        } else {
            stroke_color = this.config.last_trajectory.color_miss
        }
        Bullet.__showTrajectoryByType(
            this.last_trajectory,
            stroke_color,
            this.config.last_trajectory.weight
        )
        if (this.last_trajectory.length > 0) {
            stroke(stroke_color)
            strokeWeight(game.config.target.weight)
            let hit_point = this.last_trajectory[this.last_trajectory.length - 1]
            point(hit_point.x, hit_point.y)
        }
    }

    showTrajectory() {
        Bullet.__showTrajectoryByType(
            this.trajectory,
            this.config.trajectory.color,
            this.config.trajectory.weight
        )
    }
}
