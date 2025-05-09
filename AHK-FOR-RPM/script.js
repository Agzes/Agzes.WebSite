document.addEventListener('DOMContentLoaded', function () {
	const versionGrid = document.getElementById('versionGrid')
	const versionSearch = document.getElementById('versionSearch')
	const statusFilter = document.getElementById('statusFilter')
	const loadingElement = document.getElementById('loading')
	const noResultsElement = document.getElementById('noResults')

	let versionsData = []

	async function fetchVersions() {
		try {
			loadingElement.style.display = 'flex'
			versionGrid.innerHTML = ''
			noResultsElement.style.display = 'none'

			const response = await fetch(
				'https://raw.githubusercontent.com/Agzes/AHK-FOR-RPM/refs/heads/main/versions.json'
			) 
			versionsData = await response.json();

			await new Promise(resolve => setTimeout(resolve, 800))

			renderVersions(versionsData)
		} catch (error) {
			console.error('Error fetching versions:', error)
			versionGrid.innerHTML =
				'<div class="error" >Ошибка в загрузке версий!</div>'
		} finally {
			loadingElement.style.display = 'none'
		}
	}

	function renderVersions(versions) {
		versionGrid.innerHTML = ''

		if (versions.length === 0) {
			noResultsElement.style.display = 'flex'
			return
		} else {
            noResultsElement.style.display = 'none'
        }

		versions.forEach(version => {
			const card = createVersionCard(version)
			versionGrid.appendChild(card)
		})
	}

	function createVersionCard(version) {
		const card = document.createElement('div')
		card.className = 'version-card'

		let statusClass = ''
		let statusText = ''

		if (version.Status === '1') {
			statusClass = 'status-released'
			statusText = 'Стабильна'
		} else if (version.Status === '2') {
			statusClass = 'status-updating'
			statusText = 'В обновлении...'
		} else if (version.Status === '3') {
			statusClass = 'status-development'
			statusText = 'В разработке'
		} else if (version.Status === '4') {
			statusClass = 'status-old'
			statusText = 'Устарела'
		} else if (version.Status === '6') {
			statusClass = 'status-updating'
			statusText = 'Бета'
		} else if (version.Status === '7') {
			statusClass = 'status-updating'
			statusText = 'Бета'
		}

        if (version.Status === '1' || version.Status === '2' || version.Status === '4' || version.Status === '6') {
				card.innerHTML = `
            <div class="version-header">
                <h3 class="version-title">${version.Tittle}</h3>
                <span class="version-number">v${version.Version}</span>
            </div>
            <div class="version-rpm">AFR Version: ${version.RVersion}</div>
            <p class="version-desc">${version.Description}</p>
            <div class="version-footer">
                <span class="version-status ${statusClass}">${statusText}</span>
                <a href="${version['DownloadLink']}" class="download-btn" target="_blank">
                    <i class="fas fa-download"></i> Загрузить
                </a>
            </div>
        `
			} else if (version.Status === '7') {
				card.innerHTML = `
            <div class="version-header">
                <h3 class="version-title">${version.Tittle}</h3>
                <span class="version-number">v${version.Version}</span>
            </div>
            <div class="version-rpm">AFR Version: ${version.RVersion}</div>
            <p class="version-desc">${version.Description}</p>
            <div class="version-footer">
                <span class="version-status ${statusClass}">${statusText}</span>
                <a href="${version['DownloadLink']}" class="download-btn" target="_blank">
                    <i class="fas fa-link"></i> Перейти
                </a>
            </div>
        `
			} else {
				card.innerHTML = `
            <div class="version-header">
                <h3 class="version-title">${version.Tittle}</h3>
            </div>
            <p class="version-desc">${version.Description}</p>
            <div class="version-footer">
                <span class="version-status ${statusClass}">${statusText}</span>
            </div>
        `
			}

		return card
	}

	function filterVersions() {
		const searchTerm = versionSearch.value.toLowerCase()
		const statusValue = statusFilter.value

		const filtered = versionsData.filter(version => {
			const matchesSearch =
				version.Tittle.toLowerCase().includes(searchTerm) ||
				version.Description.toLowerCase().includes(searchTerm) ||
				version.Version.toLowerCase().includes(searchTerm)

			let matchesStatus = true
            if (statusValue === 'Stable') {
				matchesStatus = version.Status === '1'
			} 

			return matchesSearch && matchesStatus
		})

		renderVersions(filtered)
	}

	versionSearch.addEventListener('input', filterVersions)
	statusFilter.addEventListener('change', filterVersions)

	fetchVersions()
})
