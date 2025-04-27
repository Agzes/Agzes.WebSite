const canvas = document.getElementById('stars')
const ctx = canvas.getContext('2d')

let w = window.innerWidth
let h = window.innerHeight
canvas.width = w
canvas.height = h

const STAR_COUNT = Math.min(Math.floor((w * h) / 2100), 1000)
const TWINKLE = true
const COLORS = ['#fff', '#aee9ff', '#c7b8ff', '#ffd6a5']
const stars = new Float32Array(STAR_COUNT * 7)

function randomBetween(a, b) {
	return a + Math.random() * (b - a)
}

for (let i = 0; i < STAR_COUNT; i++) {
	const idx = i * 7
	stars[idx] = Math.random() * w // x
	stars[idx + 1] = Math.random() * h // y
	stars[idx + 2] = randomBetween(0.5, 1.7) // r
	stars[idx + 3] = randomBetween(0.6, 1) // alpha
	stars[idx + 4] = randomBetween(0.015, 0.085) // speed
	stars[idx + 5] = Math.floor(Math.random() * COLORS.length) // color index
	stars[idx + 6] = Math.random() * Math.PI * 2 // twinkleSeed
}

function drawStars(time) {
	ctx.clearRect(0, 0, w, h)
	for (let i = 0; i < STAR_COUNT; i++) {
		const idx = i * 7
		ctx.save()

		if (TWINKLE) {
			stars[idx + 3] = 0.65 + 0.35 * Math.sin(time / 500 + stars[idx + 6])
		}
		ctx.globalAlpha = stars[idx + 3]
		ctx.beginPath()
		ctx.arc(stars[idx], stars[idx + 1], stars[idx + 2], 0, 2 * Math.PI)
		ctx.fillStyle = COLORS[stars[idx + 5]]
		ctx.shadowColor = '#b4e0ff'
		ctx.shadowBlur = 10
		ctx.fill()
		ctx.restore()

		stars[idx + 1] += stars[idx + 4]
		if (stars[idx + 1] > h) {
			stars[idx + 1] = 0
			stars[idx] = Math.random() * w
		}
	}
	requestAnimationFrame(drawStars)
}

drawStars(performance.now())

window.addEventListener('resize', () => {
	w = window.innerWidth
	h = window.innerHeight
	canvas.width = w
	canvas.height = h
})


function setupNickCopy() {
	const buttons = document.querySelectorAll('.contact-btn-ya')

	buttons.forEach(btn => {
		const nickElem = btn.querySelector('.contact-nick')
		if (!nickElem) return

		btn.style.position = 'relative'

		btn.addEventListener('click', e => {
			const text = nickElem.innerText
			if (!navigator.clipboard) return

			if (e.target === btn) {
				e.preventDefault()
			}

			navigator.clipboard.writeText(text).then(() => {
			})
		})

		btn.addEventListener('mouseenter', () => {
		})
		btn.addEventListener('mouseleave', () => {
		})
	})
}

window.addEventListener('DOMContentLoaded', setupNickCopy)
