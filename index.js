const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
  width: canvas.width / 1.5,
  height: canvas.height / 1.5,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 53) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 53))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 801) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32,
          },
        })
      )
    }
  })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 53) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 53))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 801) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32,
          },
          height: 4,
        })
      )
    }
  })
})

const gravity = 0.1

const player = new Player({
  position: {
    x: 55,
    y: 975,
  },
  collisionBlocks,
  platformCollisionBlocks,
    imageSrc: './Character/Fighter/Idle.png',
  frameRate: 6,
  animations: {
    Idle: {
          imageSrc: './Character/Fighter/Idle.png',
      frameRate: 6,
      frameBuffer: 9,
    },
    Run: {
        imageSrc: './Character/Fighter/Run.png',
      frameRate: 8,
      frameBuffer: 15,
    },
    Jump: {
        imageSrc: './Character/Fighter/Jump.png',
      frameRate: 10,
      frameBuffer: 20,
    },
    Fall: {
        imageSrc: './Character/Fighter/Jump.png',
      frameRate: 10,
      frameBuffer: 20,
    },
    FallLeft: {
        imageSrc: './Character/Fighter/JumpLeft.png',
      frameRate: 10,
      frameBuffer: 20,
    },
    RunLeft: {
        imageSrc: './Character/Fighter/RunLeft.png',
      frameRate: 8,
      frameBuffer: 15,
    },
    IdleLeft: {
        imageSrc: './Character/Fighter/IdleLeft.png',
      frameRate: 6,
      frameBuffer: 9,
    },
    JumpLeft: {
        imageSrc: './Character/Fighter/JumpLeft.png',
      frameRate: 10,
      frameBuffer: 20,
    },
  },
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/backgroundCastle.png',
})

const backgroundImageHeight = 1152

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.scale(1.5, 1.5)
  c.translate(camera.position.x, camera.position.y)
  background.update()
   collisionBlocks.forEach((collisionBlock) => {
     collisionBlock.update()
   })

   platformCollisionBlocks.forEach((block) => {
     block.update()
   })

  player.checkForHorizontalCanvasCollision()
  player.update()

  player.velocity.x = 0
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 2
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -2
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {
      player.shouldPanCameraUp({ camera, canvas })
      console.log("Should Pan Down")
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  c.restore()
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
      player.velocity.y = -4
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
})
