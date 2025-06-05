document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()

			const targetId = this.getAttribute('href')
			if (targetId === '#') return

			const targetElement = document.querySelector(targetId)
			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop - 80,
					behavior: 'smooth',
				})
			}
		})
	})

	const animateOnScroll = function () {
		const elements = document.querySelectorAll(
			'.feature-card, .section-title, .about-content'
		)

		elements.forEach(element => {
			const elementPosition = element.getBoundingClientRect().top
			const windowHeight = window.innerHeight

			if (elementPosition < windowHeight - 100) {
				element.classList.add('animated')
			}
		})
	}

	animateOnScroll()

	window.addEventListener('scroll', animateOnScroll)

	document.querySelectorAll('.fluent-button').forEach(button => {
		button.addEventListener('click', function (e) {
			const x = e.clientX - e.target.getBoundingClientRect().left
			const y = e.clientY - e.target.getBoundingClientRect().top

			const ripple = document.createElement('span')
			ripple.classList.add('ripple')
			ripple.style.left = `${x}px`
			ripple.style.top = `${y}px`

			this.appendChild(ripple)

			setTimeout(() => {
				ripple.remove()
			}, 1000)
		})
	})
})


const rotatingPhrases = [
	'simplicity',
	'precision',
	'efficiency',
	'automation',
	'fluidity',
	'control',
	'focus',
	'accuracy',
	'productivity',
]

const changingWordEl = document.getElementById('changing-word');
if (changingWordEl) {
    let current = 0;
    changingWordEl.style.transition = 'opacity 0.3s ease-in-out';

    setInterval(() => {
        changingWordEl.style.opacity = '0';
        setTimeout(() => {
            current = (current + 1) % rotatingPhrases.length;
            changingWordEl.textContent = rotatingPhrases[current];
            changingWordEl.style.opacity = '1';
        }, 300);
    }, 3000);
}