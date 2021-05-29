
const MOVE_SPEED = 200;
const TIME_LEFT = 120;
const INVADER_SPEED = 100;
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 50;
const BULLET_SPEED = 500;

layer(['obj', 'ui'], 'obj')

addLevel([
  '!               &',
  '!^^^^^^^^^^     &',
  '!^^^^^^^^^^     &',
  '!^^^^^^^^^^     &',
  '!               &',
  '!               &',
  '!               &',
  '!               &',
  '!               &',
], {
  width: 30,
  height: 22,
  '^' : [ sprite('space-invader'), 'space-invader'],
  '!' : [ sprite('wall'), 'left-wall'],
  '&' : [ sprite('wall'), 'right-wall']
})

const player = add([
  sprite('space-ship'),
  pos(width() / 2, height() - (height() / 8)),
  origin('center')
])


keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

const spawnBullet = (p) => {
  add([
    rect(6,18), 
    pos(p), 
    origin('center'), 
    color(0.5, 0.5, 1),
    'bullet'
    ])
}

// function spawnBullet(p) {
//   console.log('fire!');
//   add([
//     rect(6,18), 
//     pos(p), 
//     origin('center'), 
//     color(0.5, 0.5, 1),
//     'bullet'
//     ])
// }

keyPress('space', () => {
  // spawnBullet(player.pos.add(0,0));
  spawnBullet(player.pos.add(0,-25));
})

action('bullet', (b) => {
  b.move(0,- BULLET_SPEED)
  if (b.pos.y < 0) {
    destroy(b);
  }
})

collides('bullet', 'space-invader', (b,s) => {
  destroy(b);
  destroy(s);
  score.value++;
  score.text = score.value;
  camShake(4);
})

const score = add([
  text('0'),
  pos(40, 5),
  layer('ui'),
  scale(3),
  {
    value: 0
  }
])

const timer = add([
  text('0'),
  pos(100,5),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT,
  }
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(1)
  if (timer.time <= 0) {
    go('lose', { score: score.value})
  }
})



action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})

collides('space-invader','right-wall', () => {
  // console.log(CURRENT_SPEED)
  CURRENT_SPEED = -1 * INVADER_SPEED;
  every('space-invader', (invader) => {
    invader.move(0, LEVEL_DOWN)
  })
})

collides('space-invader','left-wall', () => {
  // console.log(CURRENT_SPEED)
  CURRENT_SPEED = INVADER_SPEED;
  every('space-invader', (invader) => {
    invader.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  go('lose', { score: score.value})
})

action('space-invader', (s) => {
  if (s.pos.y >=  (height() - (height() / 8))) {
    go('lose', { score: score.value })
  }
})


