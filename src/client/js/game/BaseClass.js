class BaseClass {
  constructor(x, y, width, height, angle) {
    const options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
    };
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;
    this.image = loadImage('/src/client/assets/sprites/base.png');
    World.add(world, this.body);
  }

  display() {
    const { angle } = this.body;
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.image, 0, 0, this.width, this.height);
    pop();
  }
}
