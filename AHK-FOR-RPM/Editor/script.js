let configs = JSON.parse(localStorage.getItem('afrConfigs')) || []
let currentConfigId = null
let editingItemId = null
let editingItemType = null
let tabScroller = null
let isDraggingTabs = false
let startX = 0
let scrollLeft = 0
let importedConfigData = null

const configGrid = document.getElementById('configGrid')
const emptyState = document.getElementById('emptyState')
const newConfigBtn = document.getElementById('newConfigBtn')
const configModal = document.getElementById('configModal')
const closeModal = document.getElementById('closeModal')
const cancelModal = document.getElementById('cancelModal')
const saveConfig = document.getElementById('saveConfig')
const configName = document.getElementById('configName')
const revName = document.getElementById('revName')

const editorModal = document.getElementById('editorModal')
const closeEditorModal = document.getElementById('closeEditorModal')
const editorTitle = document.getElementById('editorTitle')
const saveEditor = document.getElementById('saveEditor')
const deleteConfigBtn = document.getElementById('deleteConfigBtn')
const copyCodeBtn = document.getElementById('copyCodeBtn')
const importConfigBtn = document.getElementById('importConfigBtn')
const exportConfigBtn = document.getElementById('exportConfigBtn')
const buildConfigBtn = document.getElementById('buildConfigBtn')
const exportText = document.querySelector('.export-text')

const tabButtons = document.querySelectorAll('.tab-btn')
const tabContents = document.querySelectorAll('.tab-content')
const tabButtonsContainer = document.getElementById('tabButtons')

const ahkVersion = document.getElementById('ahkVersion')
const codeVersion = document.getElementById('codeVersion')
const font = document.getElementById('font')
const fontSize = document.getElementById('fontSize')
const configPath = document.getElementById('configPath')
const revNameEditor = document.getElementById('revNameEditor')
const bindsBgHeight = document.getElementById('bindsBgHeight')
const bindsSortedArrayForSet = document.getElementById('bindsSortedArrayForSet')
const bindsSortedArray = document.getElementById('bindsSortedArray')
const bindsSortedArrayForSetGen = document.getElementById('bindsSortedArrayForSetGen')
const bindsSortedArrayGen = document.getElementById('bindsSortedArrayGen')

const bindsList = document.getElementById('bindsList')
const paramsList = document.getElementById('paramsList')
const actionsList = document.getElementById('actionsList')
const windowsList = document.getElementById('windowsList')
const afrSettingsList = document.getElementById('afrSettingsList')

const addBindBtn = document.getElementById('addBindBtn')
const addParamBtn = document.getElementById('addParamBtn')
const addActionBtn = document.getElementById('addActionBtn')
const addWindowBtn = document.getElementById('addWindowBtn')
const addAfrSettingBtn = document.getElementById('addAfrSettingBtn')

const bindModal = document.getElementById('bindModal')
const closeBindModal = document.getElementById('closeBindModal')
const cancelBindModal = document.getElementById('cancelBindModal')
const saveBind = document.getElementById('saveBind')
const bindName = document.getElementById('bindName')
const bindKey = document.getElementById('bindKey')
const bindDesc = document.getElementById('bindDesc')

const paramModal = document.getElementById('paramModal')
const closeParamModal = document.getElementById('closeParamModal')
const cancelParamModal = document.getElementById('cancelParamModal')
const saveParam = document.getElementById('saveParam')
const paramType = document.getElementById('paramType')
const paramName = document.getElementById('paramName')
const paramValue = document.getElementById('paramValue')
const paramDisplayName = document.getElementById('paramDisplayName')
const paramDesc = document.getElementById('paramDesc')

const actionModal = document.getElementById('actionModal')
const closeActionModal = document.getElementById('closeActionModal')
const cancelActionModal = document.getElementById('cancelActionModal')
const saveAction = document.getElementById('saveAction')
const actionName = document.getElementById('actionName')
const actionBind = document.getElementById('actionBind')
const actionType = document.getElementById('actionType')
const actionContent = document.getElementById('actionContent')
const actionContentGroup = document.getElementById('actionContentGroup')
const rpActionEditor = document.getElementById('rpActionEditor')
const rpActionRows = document.getElementById('rpActionRows')
const addRpActionRow = document.getElementById('addRpActionRow')

const windowModal = document.getElementById('windowModal')
const closeWindowModal = document.getElementById('closeWindowModal')
const cancelWindowModal = document.getElementById('cancelWindowModal')
const saveWindow = document.getElementById('saveWindow')
const windowType = document.getElementById('windowType')
const windowTitle = document.getElementById('windowTitle')
const windowLabel = document.getElementById('windowLabel')
const windowBind = document.getElementById('windowBind')
const windowElements = document.getElementById('windowElements')

const afrSettingModal = document.getElementById('afrSettingModal')
const closeAfrSettingModal = document.getElementById('closeAfrSettingModal')
const cancelAfrSettingModal = document.getElementById('cancelAfrSettingModal')
const saveAfrSetting = document.getElementById('saveAfrSetting')
const afrSettingType = document.getElementById('afrSettingType')
const afrSettingName = document.getElementById('afrSettingName')
const afrSettingBind = document.getElementById('afrSettingBind')

const importModal = document.getElementById('importModal')
const exportModal = document.getElementById('exportModal')
const closeImportModal = document.getElementById('closeImportModal')
const cancelImportModal = document.getElementById('cancelImportModal')
const importCode = document.getElementById('importCode')
const importCodeBtn = document.getElementById('importCodeBtn')
const importConfirmModal = document.getElementById('importConfirmModal')
const closeImportConfirmModal = document.getElementById('closeImportConfirmModal')
const cancelImportConfirmModal = document.getElementById('cancelImportConfirmModal')
const createNewConfig_ = document.getElementById('createNewConfig')
const replaceCurrentConfig_ = document.getElementById('replaceCurrentConfig')

const bindAutocomplete = document.getElementById('bindAutocomplete')
const windowBindAutocomplete = document.getElementById('windowBindAutocomplete')
const elementsAutocomplete = document.getElementById('elementsAutocomplete')
const afrSettingBindAutocomplete = document.getElementById('afrSettingBindAutocomplete')

const notification = document.getElementById('notification')

document.addEventListener('DOMContentLoaded', () => {
	renderConfigs()
	setupSortableLists()
	setupEventListeners()
	setupTabScroller()
	actionModal.addEventListener('shown', setupSortableForRpActionRows)
})

function setupTabScroller() {
	tabScroller = document.querySelector('.tab-scroller')
	tabScroller.addEventListener('mousedown', e => {
		isDraggingTabs = true
		startX = e.pageX - tabScroller.offsetLeft
		scrollLeft = tabScroller.scrollLeft
		tabScroller.style.cursor = 'grabbing'
		tabScroller.style.userSelect = 'none'
	})
	document.addEventListener('mouseup', () => {
		isDraggingTabs = false
		tabScroller.style.cursor = 'grab'
		tabScroller.style.removeProperty('user-select')
	})
	document.addEventListener('mousemove', e => {
		if (!isDraggingTabs) return
		e.preventDefault()
		const x = e.pageX - tabScroller.offsetLeft
		const walk = (x - startX) * 2
		tabScroller.scrollLeft = scrollLeft - walk
	})
}

function setupSortableLists() {
	new Sortable(bindsList, {
		animation: 150,
		ghostClass: 'sortable-ghost',
		handle: '.drag-handle',
	})

	new Sortable(paramsList, {
		animation: 150,
		ghostClass: 'sortable-ghost',
		handle: '.drag-handle',
	})

	new Sortable(actionsList, {
		animation: 150,
		ghostClass: 'sortable-ghost',
		handle: '.drag-handle',
	})

	new Sortable(windowsList, {
		animation: 150,
		ghostClass: 'sortable-ghost',
		handle: '.drag-handle',
	})

	new Sortable(afrSettingsList, {
		animation: 150,
		ghostClass: 'sortable-ghost',
		handle: '.drag-handle',
	})

	new Sortable(rpActionRows, {
		animation: 150,
		ghostClass: 'sortable-ghost',
		handle: '.rp-action-drag-handle',
	})
}

function setupEventListeners() {
	newConfigBtn.addEventListener('click', () => {
		configName.value = ''
		revName.value = 'Custom'
		configModal.classList.add('active')
	})

	closeModal.addEventListener('click', () =>
		configModal.classList.remove('active')
	)

	cancelModal.addEventListener('click', () =>
		configModal.classList.remove('active')
	)

	saveConfig.addEventListener('click', createNewConfig)

	closeEditorModal.addEventListener('click', () =>
		editorModal.classList.remove('active')
	)

	deleteConfigBtn.addEventListener('click', deleteCurrentConfig)

	saveEditor.addEventListener('click', saveCurrentConfig)

	copyCodeBtn.addEventListener('click', copyExportCode)

	importConfigBtn.addEventListener('click', () =>
		importModal.classList.add('active')
	)

	buildConfigBtn.addEventListener('click', () => {
		showNotification("Ссылка открыта в новой вкладке", "info")
		open('https://github.com/Agzes/AHK-FOR-RPM/tree/main/!Docs/Build.md')
	})

	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const tabId = button.getAttribute('data-tab')
			switchTab(tabId)
		})
	})

	addBindBtn.addEventListener('click', () => {
		editingItemId = null
		bindName.value = ''
		bindKey.value = ''
		bindDesc.value = ''
		bindModal.classList.add('active')
	})

	addParamBtn.addEventListener('click', () => {
		editingItemId = null
		paramType.value = 'CheckBox'
		paramName.value = ''
		paramValue.value = ''
		paramDisplayName.value = ''
		paramDesc.value = ''
		paramModal.classList.add('active')
	})

	addActionBtn.addEventListener('click', () => {
		editingItemId = null
		actionName.value = ''
		actionBind.value = ''
		actionType.value = 'RPAction'
		actionContent.value = ''
		rpActionRows.innerHTML = ''
		actionModal.classList.add('active')
		updateActionEditorVisibility()
	})

	addWindowBtn.addEventListener('click', () => {
		editingItemId = null
		windowType.value = 'Custom'
		windowTitle.value = ''
		windowLabel.value = ''
		windowBind.value = ''
		windowElements.value = ''
		windowModal.classList.add('active')
	})

	addAfrSettingBtn.addEventListener('click', () => {
		editingItemId = null
		afrSettingType.value = 'AFR'
		afrSettingName.value = 'Menu'
		afrSettingBind.value = ''
		afrSettingModal.classList.add('active')
	})

	closeBindModal.addEventListener('click', () =>
		bindModal.classList.remove('active')
	)

	cancelBindModal.addEventListener('click', () =>
		bindModal.classList.remove('active')
	)

	saveBind.addEventListener('click', saveBindItem)

	closeParamModal.addEventListener('click', () =>
		paramModal.classList.remove('active')
	)

	cancelParamModal.addEventListener('click', () =>
		paramModal.classList.remove('active')
	)

	saveParam.addEventListener('click', saveParamItem)

	closeActionModal.addEventListener('click', () =>
		actionModal.classList.remove('active')
	)

	cancelActionModal.addEventListener('click', () =>
		actionModal.classList.remove('active')
	)

	saveAction.addEventListener('click', saveActionItem)

	actionType.addEventListener('change', updateActionEditorVisibility)

	addRpActionRow.addEventListener('click', addNewRpActionRow)

	closeWindowModal.addEventListener('click', () =>
		windowModal.classList.remove('active')
	)

	cancelWindowModal.addEventListener('click', () =>
		windowModal.classList.remove('active')
	)

	saveWindow.addEventListener('click', saveWindowItem)

	closeAfrSettingModal.addEventListener('click', () =>
		afrSettingModal.classList.remove('active')
	)

	cancelAfrSettingModal.addEventListener('click', () =>
		afrSettingModal.classList.remove('active')
	)

	saveAfrSetting.addEventListener('click', saveAfrSettingItem)

	closeImportModal.addEventListener('click', () =>
		importModal.classList.remove('active')
	)

	cancelImportModal.addEventListener('click', () =>
		importModal.classList.remove('active')
	)

	importCodeBtn.addEventListener('click', () => {
		const code = importCode.value.trim()
		if (!code) {
			showNotification('Введите код конфига', 'error')
			return
		}

		try {
			const importedConfigData = JSON.parse(code)
			if (currentConfigId) {
				window.importedConfigData = importedConfigData
				document.getElementById('importConfirmModal').classList.add('active')
			} else {
				createNewConfigFromImport(importedConfigData)
			}
		} catch (err) {
			console.error('Ошибка импорта JSON:', err)
			showNotification(
				'Ошибка при импорте конфига. Убедитесь, что JSON код корректен.',
				'error'
			)
		}
	})

	createNewConfig_.addEventListener('click', () => {
		if (window.importedConfigData) {
			createNewConfigFromImport(window.importedConfigData)
			document.getElementById('importConfirmModal').classList.remove('active')
			importModal.classList.remove('active')
			window.importedConfigData = null
		}
	})

	replaceCurrentConfig_.addEventListener('click', () => {
		if (window.importedConfigData && currentConfigId) {
			replaceCurrentConfig(window.importedConfigData)
			document.getElementById('importConfirmModal').classList.remove('active')
			importModal.classList.remove('active')
			window.importedConfigData = null
		}
	})

	closeImportConfirmModal.addEventListener('click', () => {
		importConfirmModal.classList.remove('active')
	})

	cancelImportConfirmModal.addEventListener('click', () => {
		importConfirmModal.classList.remove('active')
	})

	actionBind.addEventListener('input', () =>
		handleAutocomplete(actionBind, bindAutocomplete, 'binds')
	)

	windowBind.addEventListener('input', () =>
		handleAutocomplete(windowBind, windowBindAutocomplete, 'binds')
	)

	windowElements.addEventListener('input', () =>
		handleAutocomplete(windowElements, elementsAutocomplete, 'actions')
	)

	afrSettingBind.addEventListener('input', () =>
		handleAutocomplete(afrSettingBind, afrSettingBindAutocomplete, 'binds')
	)

    bindsSortedArrayForSetGen.addEventListener('click', () =>
        bindsSortedArrayForSet.value = generateSortedArrayGen(true)
    )

    bindsSortedArrayGen.addEventListener('click', () =>
        bindsSortedArray.value = generateSortedArrayGen(false)
    )

	document.addEventListener('click', e => {
		if (!e.target.classList.contains('autocomplete-input')) {
			closeAllAutocomplete()
		}
	})
}

function generateSortedArrayGen(forSet) {
    const config = configs.find(c => c.id === currentConfigId)
    let filteredBinds = config.binds

	if (!forSet) {
		filteredBinds = filteredBinds.filter(bind => {
			const afrSetting = config.afrSettings.find(setting => setting.bind === bind.name)
			if (afrSetting) return false
			const window = config.windows.find(window => window.bind === bind.name)
			if (window) return false

			return true
		})
	}

	const sortedBinds = filteredBinds.sort((a, b) => a.name.localeCompare(b.name))
	const sortedListText = sortedBinds.map(bind => bind.name).join(', ')

	return sortedListText
}

function renderConfigs() {
	configGrid.innerHTML = ''

	if (configs.length === 0) {
		emptyState.style.display = 'block'
		configGrid.appendChild(emptyState)
		return
	}

	emptyState.style.display = 'none'

	configs.forEach(config => {
		const card = document.createElement('div')
		card.className = 'config-card'
		card.dataset.id = config.id

		card.innerHTML = `
                    <div class="config-card-header">
                        <div class="config-card-title">${config.name}</div>
                        <div class="config-card-actions">
                            <button class="btn btn-secondary btn-sm edit-config" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ревизия:</label>
                        <span>${config.revName || 'Custom'}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Биндов:</label>
                        <span>${config.binds ? config.binds.length : 0}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Отыгровок:</label>
                        <span>${
													config.actions ? config.actions.length : 0
												}</span>
                    </div>
                `

		const editBtn = card.querySelector('.edit-config')
		editBtn.addEventListener('click', () => openEditor(config.id))

		configGrid.appendChild(card)
	})
}

function createNewConfig() {
	const name = configName.value.trim()
	const rev = revName.value.trim() || 'Custom'

	if (!name) {
		showNotification('Введите название конфига', 'error')
		return
	}

	const newConfig = {
		id: Date.now().toString(),
		name,
		revName: rev,
		ahkVersion: '1.0',
		codeVersion: 405,
		font: 'Segoe UI',
		fontSize: 11,
		configPath: 'HKEY_CURRENT_USER\\Software\\Author\\AFR\\Custom',
		bindsBgHeight: 400,
		binds: [
			{name: 'ForceStop',key: 'Insert',desc: '[ForceStop] - Остановка отыгровок',},
			{ name: 'UI_Main', key: 'F4', desc: '[UI] Основное' },
			{ name: 'UI_Menu', key: 'F9', desc: '[UI] Меню' },
			{ name: 'Restart', key: 'F10', desc: 'Перезагрузка' },
		],
		params: [],
		actions: [],
		bindsSortedArrayForSet: 'ForceStop, UI_Main, UI_Menu, Restart',
		bindsSortedArray: '',
		windows: [],
		afrSettings: [
			{ type: 'AFR', name: 'Menu', bind: 'UI_Menu'},
			{ type: 'AFR', name: 'ForceStop', bind: 'ForceStop' },
			{ type: 'SYS', name: 'Restart', bind: 'Restart' },
		],
	}

	configs.push(newConfig)
	saveToLocalStorage()
	configModal.classList.remove('active')
	renderConfigs()
	openEditor(newConfig.id)

	showNotification('Конфиг успешно создан', 'success')
}

function updateExportCodeFormat() {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	const formatSelector = document.getElementById('exportFormatSelector')
	if (formatSelector) {
		if (formatSelector.value === 'json') {
			exportCode.textContent = generateJsonExportCode(config)
		} else {
			generateExportCode(config)
		}
	}
}

function openEditor(id) {
	const config = configs.find(c => c.id === id)
	if (!config) return

	currentConfigId = id
	editorTitle.textContent = `Редактор конфига: ${config.name}`

	ahkVersion.value = config.ahkVersion
	codeVersion.value = config.codeVersion
	font.value = config.font
	fontSize.value = config.fontSize
	configPath.value = config.configPath
	revNameEditor.value = config.revName
	bindsBgHeight.value = config.bindsBgHeight
	bindsSortedArrayForSet.value = config.bindsSortedArrayForSet
	bindsSortedArray.value = config.bindsSortedArray

	renderBindsList(config.binds)
	renderParamsList(config.params)
	renderActionsList(config.actions)
	renderWindowsList(config.windows)
	renderAfrSettingsList(config.afrSettings)

	const exportTab = document.getElementById('export-tab')
	if (exportTab && !document.getElementById('exportFormatSelector')) {
		const formatSelector = document.createElement('div')
		formatSelector.className = 'format-selector'
		formatSelector.innerHTML = `
      <label class="form-label">Формат экспорта:</label>
      <select id="exportFormatSelector" class="form-control">
        <option value="ahk">AHK Script (для создания AHK скрипта)</option>
        <option value="json">JSON (для экспорта/импорта в AFR Editor)</option>
      </select>
    `

		const sectionTitle = exportTab.querySelector('.section-title')
		const instructionText = exportTab.querySelector('.form-label')

		if (sectionTitle && instructionText) {
			sectionTitle.parentNode.insertBefore(formatSelector, instructionText)
		}

		const formatSelectorElement = document.getElementById(
			'exportFormatSelector'
		)
		if (formatSelectorElement) {
			formatSelectorElement.addEventListener('change', updateExportCodeFormat)
		}
	}

	generateExportCode(config)
	editorModal.classList.add('active')
}

function saveCurrentConfig() {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	config.ahkVersion = ahkVersion.value
	config.codeVersion = parseInt(codeVersion.value)
	config.font = font.value
	config.fontSize = parseInt(fontSize.value)
	config.configPath = configPath.value
	config.revName = revNameEditor.value
	config.bindsBgHeight = parseInt(bindsBgHeight.value)
	config.bindsSortedArrayForSet = bindsSortedArrayForSet.value
	config.bindsSortedArray = bindsSortedArray.value

	config.binds = getBindsFromDOM()
	config.params = getParamsFromDOM()
	config.actions = getActionsFromDOM()
	config.windows = getWindowsFromDOM()
	config.afrSettings = getAfrSettingsFromDOM()

	saveToLocalStorage()
	editorModal.classList.remove('active')
	renderConfigs()

	showNotification('Конфиг успешно сохранен', 'success')
}

function deleteCurrentConfig() {
	if (!confirm('Вы уверены, что хотите удалить этот конфиг?')) return

	configs = configs.filter(c => c.id !== currentConfigId)
	saveToLocalStorage()
	editorModal.classList.remove('active')
	renderConfigs()

	showNotification('Конфиг удален', 'warning')
}

function saveToLocalStorage() {
	localStorage.setItem('afrConfigs', JSON.stringify(configs))
}

function switchTab(tabId) {
	tabContents.forEach(content => {
		content.classList.remove('active')
	})

	tabButtons.forEach(button => {
		button.classList.remove('active')
	})

	document.getElementById(`${tabId}-tab`).classList.add('active')

	document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active')

	const activeTab = document.querySelector(`.tab-btn[data-tab="${tabId}"]`)
	activeTab.scrollIntoView({
		behavior: 'smooth',
		block: 'nearest',
		inline: 'center',
	})

	if (tabId === 'export') {
		updateExportCodeFormat()
	}
}

function renderBindsList(binds) {
	bindsList.innerHTML = ''

	if (!binds || binds.length === 0) {
		bindsList.innerHTML = '<div class="empty-state"><p>Нет биндов</p></div>'
		return
	}

	binds.forEach((bind, index) => {
		const item = document.createElement('li')
		item.className = 'action-item'
		item.dataset.id = index

		item.innerHTML = `
                    <div class="action-header">
                        <div>
                            <i class="fas fa-grip-vertical drag-handle"></i>
                            <span class="action-name">${bind.name}</span>
                        </div>
                        <div>
                            <button class="btn btn-secondary btn-sm edit-bind" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-bind" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="action-params">
                        <div><strong>Клавиша:</strong> ${bind.key}</div>
                        <div><strong>Описание:</strong> ${bind.desc}</div>
                    </div>
                `

		const editBtn = item.querySelector('.edit-bind')
		const deleteBtn = item.querySelector('.delete-bind')

		editBtn.addEventListener('click', () => editBind(index))
		deleteBtn.addEventListener('click', () => deleteBind(index))

		bindsList.appendChild(item)
	})
}

function editBind(index) {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.binds || index >= config.binds.length) return

	const bind = config.binds[index]
	editingItemId = index
	editingItemType = 'bind'

	bindName.value = bind.name
	bindKey.value = bind.key
	bindDesc.value = bind.desc

	bindModal.classList.add('active')
}

function deleteBind(index) {
	if (!confirm('Вы уверены, что хотите удалить этот бинд?')) return

	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.binds || index >= config.binds.length) return

	config.binds.splice(index, 1)
	saveToLocalStorage()
	renderBindsList(config.binds)

	showNotification('Бинд удален', 'warning')
}

function saveBindItem() {
	const name = bindName.value.trim()
	const key = bindKey.value.trim()
	const desc = bindDesc.value.trim()

	if (!name) {
		showNotification('Заполните обязательные поля', 'error')
		return
	}

	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	if (!config.binds) config.binds = []

	const newBind = { name, key, desc }

	if (editingItemId !== null) {
		config.binds[editingItemId] = newBind
	} else {
		config.binds.push(newBind)
	}

	saveToLocalStorage()
	renderBindsList(config.binds)
	bindModal.classList.remove('active')

	showNotification('Бинд сохранен', 'success')
}

function getBindsFromDOM() {
	const items = bindsList.querySelectorAll('.action-item')
	const binds = []

	items.forEach(item => {
		const id = item.dataset.id
		const name = item.querySelector('.action-name').textContent
		const params = item.querySelectorAll('.action-params div')
		const key = params[0].textContent.replace('Клавиша:', '').trim()
		const desc = params[1].textContent.replace('Описание:', '').trim()

		binds.push({ name, key, desc })
	})

	return binds
}

function renderParamsList(params) {
	paramsList.innerHTML = ''

	if (!params || params.length === 0) {
		paramsList.innerHTML =
			'<div class="empty-state"><p>Нет параметров</p></div>'
		return
	}

	params.forEach((param, index) => {
		const item = document.createElement('div')
		item.className = 'params-item'
		item.dataset.id = index

		item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                        <i class="fas fa-grip-vertical drag-handle"></i>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between;">
                                <span class="params-name" style="font-weight: 600;">${param.displayName}</span>
                                <div>
                                    <button class="btn btn-secondary btn-sm edit-param" title="Редактировать">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm delete-param" title="Удалить">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div style="font-size: 13px; color: var(--text-secondary);">
                                <strong>Имя:</strong> ${param.name} | 
                                <strong>Тип:</strong> ${param.type} | 
                                <strong>Значение:</strong> ${param.value}
                            </div>
                            <div style="font-size: 13px; color: var(--text-secondary);">
                                <strong>Описание:</strong> ${param.desc}
                            </div>
                        </div>
                    </div>
                `

		const editBtn = item.querySelector('.edit-param')
		const deleteBtn = item.querySelector('.delete-param')

		editBtn.addEventListener('click', () => editParam(index))
		deleteBtn.addEventListener('click', () => deleteParam(index))

		paramsList.appendChild(item)
	})
}

function editParam(index) {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.params || index >= config.params.length) return

	const param = config.params[index]
	editingItemId = index
	editingItemType = 'param'

	paramType.value = param.type
	paramName.value = param.name
	paramValue.value = param.value
	paramDisplayName.value = param.displayName
	paramDesc.value = param.desc

	paramModal.classList.add('active')
}

function deleteParam(index) {
	if (!confirm('Вы уверены, что хотите удалить этот параметр?')) return

	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.params || index >= config.params.length) return

	config.params.splice(index, 1)
	saveToLocalStorage()
	renderParamsList(config.params)

	showNotification('Параметр удален', 'warning')
}

function saveParamItem() {
	const type = paramType.value
	const name = paramName.value.trim()
	const value =
		type === 'CheckBox' ? paramValue.value === 'true' : paramValue.value.trim()
	const displayName = paramDisplayName.value.trim()
	const desc = paramDesc.value.trim()

	if (!name || !displayName) {
		showNotification('Заполните обязательные поля', 'error')
		return
	}

	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	if (!config.params) config.params = []

	const newParam = { type, name, value, displayName, desc }

	if (editingItemId !== null) {
		config.params[editingItemId] = newParam
	} else {
		config.params.push(newParam)
	}

	saveToLocalStorage()
	renderParamsList(config.params)
	paramModal.classList.remove('active')

	showNotification('Параметр сохранен', 'success')
}

function getParamsFromDOM() {
	const items = paramsList.querySelectorAll('.params-item[data-id]')
	const params = []

	items.forEach(item => {
		const id = item.dataset.id
		const header = item.querySelector('span[style="font-weight: 600;"]')
		const info = item.querySelectorAll('div[style="font-size: 13px; color: var(--text-secondary);"]')

		const displayName = header.textContent
		const infoParts = info[0].textContent.split('|').map(p => p.trim())

		const name = infoParts[0].replace('Имя:', '').trim()
		const type = infoParts[1].replace('Тип:', '').trim()
		const value = infoParts[2].replace('Значение:', '').trim()
		const desc = info[1].textContent.replace('Описание:', '').trim()

		params.push({ type, name, value: type === 'CheckBox' ? value === 'true' : value, displayName, desc,})
	})

	return params
}

function renderActionsList(actions) {
	actionsList.innerHTML = ''

	if (!actions || actions.length === 0) {
		actionsList.innerHTML =
			'<div class="empty-state"><p>Нет отыгровок</p></div>'
		return
	}

	actions.forEach((action, index) => {
		const item = document.createElement('li')
		item.className = 'action-item'
		item.dataset.id = index

		const displayContent = action.content
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')

		item.innerHTML = `
                    <div class="action-header">
                        <div>
                            <i class="fas fa-grip-vertical drag-handle"></i>
                            <span class="action-name">${action.name}</span>
                        </div>
                        <div>
                            <button class="btn btn-secondary btn-sm edit-action" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-action" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="action-params">
                        <div><strong>Бинд:</strong> ${action.bind}</div>
                        <div><strong>Тип:</strong> ${action.type}</div>
                        <div><strong>Содержимое:</strong> <pre style="margin-top: 5px; white-space: pre-wrap; word-break: break-all; font-family: monospace; font-size: 12px;">${displayContent}</pre></div>
                    </div>
                `

		const editBtn = item.querySelector('.edit-action')
		const deleteBtn = item.querySelector('.delete-action')

		editBtn.addEventListener('click', () => editAction(index))
		deleteBtn.addEventListener('click', () => deleteAction(index))

		actionsList.appendChild(item)
	})
}

function editAction(index) {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.actions || index >= config.actions.length) return

	const action = config.actions[index]
	editingItemId = index
	editingItemType = 'action'

	actionName.value = action.name
	actionBind.value = action.bind
	actionType.value = action.type

	if (action.type === 'RPAction') {
		rpActionRows.innerHTML = ''

		try {
			const actionContent = action.content.trim()
			if (actionContent.startsWith('[') && actionContent.endsWith(']')) {
				const innerContent = actionContent.substring(1, actionContent.length - 1).trim()
				const items = []
				let currentItem = ''
				let inQuotes = false
				let bracketLevel = 0
				for (let i = 0; i < innerContent.length; i++) {
					const char = innerContent[i]
					if (char === '"' && (i === 0 || innerContent[i - 1] !== '\\')) {inQuotes = !inQuotes}
					if (char === '[' && !inQuotes) bracketLevel++
					if (char === ']' && !inQuotes) bracketLevel--
					if (char === ',' && !inQuotes && bracketLevel === 0) {
						let nextNonSpace = i + 1
						while (
							nextNonSpace < innerContent.length &&
							innerContent[nextNonSpace] === ' '
						) {
							nextNonSpace++
						}
						if (
							nextNonSpace < innerContent.length &&
							innerContent[nextNonSpace] === '['
						) {
							items.push(currentItem.trim())
							currentItem = ''
							continue
						}
					}
					currentItem += char
				}

				if (currentItem.trim()) {
					items.push(currentItem.trim())
				}

				items.forEach((item, idx) => {
					if (item.startsWith('[') && item.endsWith(']')) {
						const innerItem = item.substring(1, item.length - 1).trim()
						const parts = []
						let currentPart = ''
						let inPartQuotes = false
						for (let i = 0; i < innerItem.length; i++) {
							const char = innerItem[i]
							if (char === '"' && (i === 0 || innerItem[i - 1] !== '\\')) {inPartQuotes = !inPartQuotes}
							if (char === ',' && !inPartQuotes) {
								parts.push(currentPart.trim())
								currentPart = ''
								continue
							}
							currentPart += char
						}

						if (currentPart.trim()) {
							parts.push(currentPart.trim())
						}

						if (parts.length >= 4) {
							let type = parts[0].trim()
							if (type.startsWith('"') && type.endsWith('"')) {type = type.substring(1, type.length - 1)}
							let content = parts[1].trim()
							if (content.startsWith('"') && content.endsWith('"')) {content = content.substring(1, content.length - 1)}

							content = content.replace(/\\"/g, '"')
							const sleepBefore = parts[2].trim()
							const sleepAfter = parts[3].trim()

							addRpActionRowToEditor( type, content, sleepBefore, sleepAfter, idx === items.length - 1)
						}
					}
				})
			}
		} catch (e) {
			console.error('Error parsing RPAction:', e)
		}

		if (rpActionRows.children.length === 0) {
			addNewRpActionRow()
		}
	} else {
		actionContent.value = action.content
	}

	updateActionEditorVisibility()
	actionModal.classList.add('active')

	setupSortableForRpActionRows()
}

function setupSortableForRpActionRows() {
	if (rpActionRows) {
		new Sortable(rpActionRows, {
			animation: 150,
			ghostClass: 'sortable-ghost',
			handle: '.rp-action-drag-handle',
		})
	}
}

function deleteAction(index) {
	if (!confirm('Вы уверены, что хотите удалить эту отыгровку?')) return

	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.actions || index >= config.actions.length) return

	config.actions.splice(index, 1)
	saveToLocalStorage()
	renderActionsList(config.actions)

	showNotification('Отыгровка удалена', 'warning')
}

function saveActionItem() {
	const name = actionName.value.trim()
	const bind = actionBind.value.trim()
	const type = actionType.value

	if (!name || !bind) {
		showNotification('Заполните обязательные поля', 'error')
		return
	}

	let content = ''
	if (type === 'RPAction') {
		const actions = []
		const rows = rpActionRows.querySelectorAll('.rp-action-row')

		rows.forEach(row => {
			const actionType = row.querySelector('.rp-action-type').value
			const actionContent = row.querySelector('.rp-action-content').value

			let sleepBefore = 'S100'
			let sleepAfter = 'S300'

			if (actionType !== 'AutoChat') {
				sleepBefore = row.querySelector('.rp-action-sleep').value
				sleepAfter = row.querySelector('.rp-action-sleep-after').value
			}

			if (actionContent) {
				const escapedContent = actionContent.replace(/"/g, '\\"')
				actions.push(
					`["${actionType}", "${escapedContent}", ${sleepBefore}, ${sleepAfter}]`
				)
			}
		})

		if (actions.length === 0) {
			showNotification('Добавьте хотя бы одно действие', 'error')
			return
		}

		content = `[ ${actions.join(', ')} ]`
	} else {
		content = actionContent.value.trim()
		if (!content) {
			showNotification('Введите содержимое функции', 'error')
			return
		}
	}

	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	if (!config.actions) config.actions = []

	const newAction = { name, bind, type, content }

	if (editingItemId !== null) {
		config.actions[editingItemId] = newAction
	} else {
		config.actions.push(newAction)
	}

	saveToLocalStorage()
	renderActionsList(config.actions)
	actionModal.classList.remove('active')

	showNotification('Отыгровка сохранена', 'success')
}

function updateActionEditorVisibility() {
	const type = actionType.value
	if (type === 'RPAction') {
		rpActionEditor.style.display = 'block'
		actionContent.style.display = 'none'

		if (rpActionRows.children.length === 0) {
			addNewRpActionRow()
		}
	} else {
		rpActionEditor.style.display = 'none'
		actionContent.style.display = 'block'
	}
}

function updateActionEditorVisibility() {
  const type = actionType.value
  if (type === 'RPAction') {
    rpActionEditor.style.display = 'block'
    actionContent.style.display = 'none'

    if (rpActionRows.children.length === 0) {
      addNewRpActionRow()
    }
  } else {
    rpActionEditor.style.display = 'none'
    actionContent.style.display = 'block'
  }
}

function addNewRpActionRow() {
  addRpActionRowToEditor('Chat', '', 'S100', 'S300', true)
}

function addRpActionRowToEditor(type, content, sleepBefore, sleepAfter, isLast) {
  const row = document.createElement('div')
  row.className = 'rp-action-row'

  row.innerHTML = `
    <div class="rp-action-drag-handle">
      <i class="fas fa-grip-vertical"></i>
    </div>
    <select class="form-control rp-action-type">
      <option value="Chat">Chat</option>
      <option value="AutoChat">AutoChat</option>
    </select>
    <input type="text" class="form-control rp-action-content" placeholder="Текст действия">
    <div class="sleep-controls">
      <select class="form-control rp-action-sleep">
        <option value="S100">S100</option>
        <option value="S250">S250</option>
        <option value="S300">S300</option>
        <option value="S500">S500</option>
        <option value="S700">S700</option>
        <option value="S800">S800</option>
        <option value="S1000">S1000</option>
        <option value="S2000">S2000</option>
        <option value="S3000">S3000</option>
        <option value="S4000">S4000</option>
      </select>
      <select class="form-control rp-action-sleep-after">
        <option value="S100">S100</option>
        <option value="S250">S250</option>
        <option value="S300">S300</option>
        <option value="S500">S500</option>
        <option value="S700">S700</option>
        <option value="S800">S800</option>
        <option value="S1000">S1000</option>
        <option value="S2000">S2000</option>
        <option value="S3000">S3000</option>
        <option value="S4000">S4000</option>
      </select>
    </div>
    <div class="rp-action-remove">
      <i class="fas fa-times"></i>
    </div>
  `

  const typeSelect = row.querySelector('.rp-action-type')
  typeSelect.value = type
  
  const contentInput = row.querySelector('.rp-action-content')
  contentInput.value = content
  
  const sleepBeforeSelect = row.querySelector('.rp-action-sleep')
  sleepBeforeSelect.value = sleepBefore
  
  const sleepAfterSelect = row.querySelector('.rp-action-sleep-after')
  sleepAfterSelect.value = sleepAfter
  
  const sleepControls = row.querySelector('.sleep-controls')
  if (type === 'AutoChat') {
    sleepControls.classList.add('hidden')
  }

  const actionTypeSelect = row.querySelector('.rp-action-type')
  actionTypeSelect.addEventListener('change', (e) => {
    const sleepControls = row.querySelector('.sleep-controls')
    if (e.target.value === 'AutoChat') {
      sleepControls.classList.add('hidden')
    } else {
      sleepControls.classList.remove('hidden')
    }
  })

  const removeBtn = row.querySelector('.rp-action-remove')
  removeBtn.addEventListener('click', () => {
    if (rpActionRows.children.length > 1 || !isLast) {
      row.remove()
    } else {
      showNotification('Нельзя удалить последнее действие', 'error')
    }
  })

  rpActionRows.appendChild(row)
}

function getActionsFromDOM() {
	const items = actionsList.querySelectorAll('.action-item')
	const actions = []

	items.forEach(item => {
		const id = item.dataset.id
		const name = item.querySelector('.action-name').textContent
		const params = item.querySelectorAll('.action-params div')
		const bind = params[0].textContent.replace('Бинд:', '').trim()
		const type = params[1].textContent.replace('Тип:', '').trim()
		const preElement = item.querySelector('pre')
		const content = preElement.innerHTML
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
		actions.push({ name, bind, type, content })
	})

	return actions
}

function renderWindowsList(windows) {
	windowsList.innerHTML = ''

	if (!windows || windows.length === 0) {
		windowsList.innerHTML = '<div class="empty-state"><p>Нет окон</p></div>'
		return
	}

	windows.forEach((window, index) => {
		const item = document.createElement('li')
		item.className = 'action-item'
		item.dataset.id = index

		item.innerHTML = `
                    <div class="action-header">
                        <div>
                            <i class="fas fa-grip-vertical drag-handle"></i>
                            <span class="action-name">${window.name}</span>
                        </div>
                        <div>
                            <button class="btn btn-secondary btn-sm edit-window" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-window" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="action-params">
                        <div><strong>Тип:</strong> ${window.type}</div>
                        <div><strong>Label:</strong> ${window.label}</div>
                        <div><strong>Бинд:</strong> ${window.bind}</div>
                        <div><strong>Элементы:</strong> ${window.elements}</div>
                    </div>
                `

		const editBtn = item.querySelector('.edit-window')
		const deleteBtn = item.querySelector('.delete-window')

		editBtn.addEventListener('click', () => editWindow(index))
		deleteBtn.addEventListener('click', () => deleteWindow(index))

		windowsList.appendChild(item)
	})
}

function editWindow(index) {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.windows || index >= config.windows.length) return

	const win = config.windows[index]
	editingItemId = index
	editingItemType = 'window'

	windowType.value = win.type
	windowTitle.value = win.name
	windowLabel.value = win.label
	windowBind.value = win.bind
	windowElements.value = win.elements

	windowModal.classList.add('active')
}

function deleteWindow(index) {
	if (!confirm('Вы уверены, что хотите удалить это окно?')) return

	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.windows || index >= config.windows.length) return

	config.windows.splice(index, 1)
	saveToLocalStorage()
	renderWindowsList(config.windows)

	showNotification('Окно удалено', 'warning')
}

function saveWindowItem() {
	const type = windowType.value
	const name = windowTitle.value.trim()
	const label = windowLabel.value.trim()
	const bind = windowBind.value.trim()
	const elements = windowElements.value.trim()

	if (!name || !label || !elements || !bind) {
		showNotification('Заполните обязательные поля', 'error')
		return
	}

	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	if (!config.windows) config.windows = []

	const newWindow = { type, name, label, bind, elements }

	if (editingItemId !== null) {
		config.windows[editingItemId] = newWindow
	} else {
		config.windows.push(newWindow)
	}

	saveToLocalStorage()
	renderWindowsList(config.windows)
	windowModal.classList.remove('active')

	showNotification('Окно сохранено', 'success')
}

function getWindowsFromDOM() {
	const items = windowsList.querySelectorAll('.action-item')
	const windows = []

	items.forEach(item => {
		const id = item.dataset.id
		const name = item.querySelector('.action-name').textContent
		const params = item.querySelectorAll('.action-params div')

		const type = params[0].textContent.replace('Тип:', '').trim()
		const label = params[1].textContent.replace('Label:', '').trim()
		const bind = params[2].textContent.replace('Бинд:', '').trim()
		const elements = params[3].textContent.replace('Элементы:', '').trim()

		windows.push({ type, name, label, bind, elements })
	})

	return windows
}

function renderAfrSettingsList(afrSettings) {
	afrSettingsList.innerHTML = ''

	if (!afrSettings || afrSettings.length === 0) {
		afrSettingsList.innerHTML =
			'<div class="empty-state"><p>Нет настроек AFR</p></div>'
		return
	}

	afrSettings.forEach((setting, index) => {
		const item = document.createElement('li')
		item.className = 'action-item'
		item.dataset.id = index

		item.innerHTML = `
                    <div class="action-header">
                        <div>
                            <i class="fas fa-grip-vertical drag-handle"></i>
                            <span class="action-name">${setting.name}</span>
                        </div>
                        <div>
                            <button class="btn btn-secondary btn-sm edit-afr-setting" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-afr-setting" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="action-params">
                        <div><strong>Тип:</strong> ${setting.type}</div>
                        <div><strong>Бинд:</strong> ${setting.bind}</div>
                    </div>
                `

		const editBtn = item.querySelector('.edit-afr-setting')
		const deleteBtn = item.querySelector('.delete-afr-setting')

		editBtn.addEventListener('click', () => editAfrSetting(index))
		deleteBtn.addEventListener('click', () => deleteAfrSetting(index))

		afrSettingsList.appendChild(item)
	})
}

function editAfrSetting(index) {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.afrSettings || index >= config.afrSettings.length)
		return

	const setting = config.afrSettings[index]
	editingItemId = index
	editingItemType = 'afrSetting'

	afrSettingType.value = setting.type
	afrSettingName.value = setting.name
	afrSettingBind.value = setting.bind

	afrSettingModal.classList.add('active')
}

function deleteAfrSetting(index) {
	if (!confirm('Вы уверены, что хотите удалить эту настройку AFR?')) return

	const config = configs.find(c => c.id === currentConfigId)
	if (!config || !config.afrSettings || index >= config.afrSettings.length)
		return

	config.afrSettings.splice(index, 1)
	saveToLocalStorage()
	renderAfrSettingsList(config.afrSettings)

	showNotification('Настройка AFR удалена', 'warning')
}

function saveAfrSettingItem() {
	const type = afrSettingType.value
	const name = afrSettingName.value
	const bind = afrSettingBind.value.trim()

	if (!bind) {
		showNotification('Заполните обязательные поля', 'error')
		return
	}

	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	if (!config.afrSettings) config.afrSettings = []

	const newSetting = { type, name, bind }

	if (editingItemId !== null) {
		config.afrSettings[editingItemId] = newSetting
	} else {
		config.afrSettings.push(newSetting)
	}

	saveToLocalStorage()
	renderAfrSettingsList(config.afrSettings)
	afrSettingModal.classList.remove('active')

	showNotification('Настройка AFR сохранена', 'success')
}

function getAfrSettingsFromDOM() {
	const items = afrSettingsList.querySelectorAll('.action-item')
	const settings = []

	items.forEach(item => {
		const id = item.dataset.id
		const name = item.querySelector('.action-name').textContent
		const params = item.querySelectorAll('.action-params div')

		const type = params[0].textContent.replace('Тип:', '').trim()
		const bind = params[1].textContent.replace('Бинд:', '').trim()

		settings.push({ type, name, bind })
	})

	return settings
}

function generateExportCode(config) {
	let code = `; /  AFR VERSION 2.2 | CONFIG | Автоматически сгенерировано в AFR Editor v2.2\n\n`

	code += `AHK_version := "${config.ahkVersion}"\n`
	code += `code_version := ${config.codeVersion}\n`
	code += `Font := "${config.font}"\n`
	code += `FontSize := ${config.fontSize}\n`
	code += `ConfigPath := "${config.configPath}"\n`
	code += `RevName := "${config.revName}"\n`
	code += `BindsBGHeight := ${config.bindsBgHeight}\n\n`

	code += `global GBinds := Map()\n`
	code += `global GBinds_cfg := Map()\n`
	code += `global GBindsAction_cfg := Map()\n\n`

	code += `InitGBinds(i) {\n`
	config.binds.forEach(bind => {
		code += `    i["${bind.name}"] := ['${bind.key}', "${bind.desc}"]\n`
	})
	code += `}\n\n`

	code += `InitGBindsCfg(i) {\n`
	config.params.forEach(param => {
		const value =
			param.type === 'CheckBox' ? (param.value ? 'true' : 'false') : param.value
		code += `    i["${param.name}"] := ${value}\n`
	})
	code += `}\n\n`

	code += `InitGBindsCfgUI() {\n`
	config.params.forEach(param => {
		code += `    RpSetUIGen(RpSetUI, "${param.type}", "${param.displayName}", "${param.name}", "${param.desc}")\n`
	})
	code += `}\n\n`

	code += `InitRPActions(i) {\n`
	config.actions.forEach(action => {
		if (action.type === 'RPAction') {
			let processedContent

			try {
				if (
					typeof action.content === 'string' &&
					action.content.trim().startsWith('[') &&
					action.content.trim().endsWith(']')
				) {
					const rpActionRegex = /\[\s*"([^"]+)"\s*,\s*"([^"]*)"\s*,\s*([^,]+)\s*,\s*([^,\]]+)\s*\]/g

					processedContent = action.content.replace(
						rpActionRegex,
						(match, type, content, sleepBefore, sleepAfter) => {
							const escapedContent = content.replace(/"/g, '\\"')
							return `["${type}", "${escapedContent}", ${sleepBefore}, ${sleepAfter}]`
						}
					)
				} else {
					processedContent = action.content
				}
			} catch (e) {
				console.error('Error processing RPAction content:', e)
				processedContent = action.content
			}

			code += `    i["${action.name}"] := ["${action.bind}", "RPAction", ${processedContent}]\n`
		} else {
			const regex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/
			const content = action.content.trim()
			const functionName = content.match(regex)

			if (functionName && functionName[1]) {
				code += `    i["${action.name}"] := ["${action.bind}", "Func", ${functionName[1]}]\n`
			} else {
				code += `    i["${action.name}"] := ["${action.bind}", "Func", ${action.content}]\n`
			}
		}
	})
	code += `}\n\n`

	code += `GBindsSortedArrayForSet := ["${config.bindsSortedArrayForSet
		.split(',')
		.map(s => s.trim())
		.join('", "')}"]\n`
	code += `GBindsSortedArray := ["${config.bindsSortedArray
		.split(',')
		.map(s => s.trim())
		.join('", "')}"]\n\n`

	code += `GWindows := [\n`
	config.windows.forEach(win => {
		const elements = win.elements
			.split(',')
			.map(s => `"${s.trim()}"`)
			.join(', ')
		code += `    ["${win.type}", "${win.name}", "${win.label}", "${win.bind}", [${elements}]],\n`
	})
	code += `]\n\n`

	code += `G_AFRSettings := [\n`
	config.afrSettings.forEach(setting => {
		code += `    ["${setting.type}", "${setting.name}", "${setting.bind}"],\n`
	})
	code += `]\n\n`

	config.actions
		.filter(a => a.type === 'Func')
		.forEach(action => {
			code += `${action.content}\n\n`
		})

	code += `; \\ AFR VERSION 2.2 | CONFIG | Автоматически сгенерировано в AFR Editor v2.2`

	exportCode.textContent = code
}

function generateJsonExportCode(config) {
	const exportConfig = { ...config }
	delete exportConfig.id
	return JSON.stringify(exportConfig, null, 2)
}

function createNewConfigFromImport(importData) {
	const newConfig = {
		id: Date.now().toString(),
		name: importData.name,
		...importData,
	}

	configs.push(newConfig)
	saveToLocalStorage()
	renderConfigs()
	openEditor(newConfig.id)

	showNotification('Конфиг успешно импортирован', 'success')
}

function replaceCurrentConfig(importData) {
	const config = configs.find(c => c.id === currentConfigId)
	if (!config) return

	const id = config.id
	const name = config.name

	Object.keys(config).forEach(key => {
		if (key !== 'id' && key !== 'name') {
			delete config[key]
		}
	})

	Object.keys(importData).forEach(key => {
		if (key !== 'id' && key !== 'name') {
			config[key] = importData[key]
		}
	})

	saveToLocalStorage()

	openEditor(id)

	showNotification('Текущий конфиг успешно обновлен', 'success')
}

function copyExportCode() {
	const code = exportCode.textContent
	navigator.clipboard
		.writeText(code)
		.then(() => {
			exportText.classList.add('export-animation')
			setTimeout(() => {
				exportText.classList.remove('export-animation')
			}, 1500)
			showNotification('Код скопирован в буфер обмена', 'success')
		})
		.catch(err => {
			console.error('Ошибка копирования: ', err)
			showNotification('Не удалось скопировать код', 'error')
		})
}

function importConfigFromCode() {
	const code = importCode.value.trim()
	if (!code) {
		showNotification('Введите код конфига', 'error')
		return
	}

	try {
		parseAhkConfig(code)

		configs.push(config)
		saveToLocalStorage()
		importModal.classList.remove('active')
		renderConfigs()
		openEditor(config.id)

		showNotification('Конфиг успешно импортирован', 'success')
	} catch (err) {
		console.error('Ошибка импорта:', err)
		showNotification(
			'Ошибка при импорте конфига. Убедитесь, что код корректен.',
			'error'
		)
	}
}

function handleAutocomplete(input, autocompleteContainer, type) {
	const val = input.value.trim()
	const config = configs.find(c => c.id === currentConfigId)

	if (!config) {
		closeAutocomplete(autocompleteContainer)
		return
	}

	const lastCommaIndex = val.lastIndexOf(',')
	const searchText =
		lastCommaIndex >= 0 ? val.substring(lastCommaIndex + 1).trim() : val

	if (val === '' || (lastCommaIndex >= 0 && searchText === '')) {
		if (input === windowElements || input === elementsAutocomplete) {
			const allActions = config.actions.map(action => {
				let displayName = action.name
				if (action.type === 'Func' && action.content) {
					const funcNameMatch = action.content.match(
						/function\s+([a-zA-Z0-9_]+)\s*\(/
					)
					if (funcNameMatch && funcNameMatch[1]) {
						displayName = `${action.name} (${funcNameMatch[1]})`
					}
				}

				return {
					text: displayName,
					value:
						lastCommaIndex >= 0
							? val.substring(0, lastCommaIndex + 1) + ' ' + action.name
							: action.name,
				}
			})

			if (allActions.length > 0) {
				renderAutocomplete(allActions, autocompleteContainer, input)
				return
			}
		} else {
			const allBinds = config.binds.map(bind => ({
				text: bind.name,
				value:
					lastCommaIndex >= 0
						? val.substring(0, lastCommaIndex + 1) + ' ' + bind.name
						: bind.name,
			}))

			if (allBinds.length > 0) {
				renderAutocomplete(allBinds, autocompleteContainer, input)
				return
			}
		}
	}

	let items = []
	if (input === windowElements || input === elementsAutocomplete) {
		if (config.actions) {
			items = config.actions
				.filter(action =>
					action.name.toLowerCase().includes(searchText.toLowerCase())
				)
				.map(action => {
					let displayName = action.name
					if (action.type === 'Func' && action.content) {
						const funcNameMatch = action.content.match(
							/function\s+([a-zA-Z0-9_]+)\s*\(/
						)
						if (funcNameMatch && funcNameMatch[1]) {
							displayName = `${action.name} (${funcNameMatch[1]})`
						}
					}

					return {
						text: displayName,
						value:
							lastCommaIndex >= 0
								? val.substring(0, lastCommaIndex + 1) + ' ' + action.name
								: action.name,
					}
				})
		}
	} else {
		if (config.binds) {
			items = config.binds
				.filter(bind =>
					bind.name.toLowerCase().includes(searchText.toLowerCase())
				)
				.map(bind => ({
					text: bind.name,
					value:
						lastCommaIndex >= 0
							? val.substring(0, lastCommaIndex + 1) + ' ' + bind.name
							: bind.name,
				}))
		}
	}

	if (items.length > 0) {
		renderAutocomplete(items, autocompleteContainer, input)
	} else {
		closeAutocomplete(autocompleteContainer)
	}
}

function renderAutocomplete(items, container, input) {
	container.innerHTML = ''

	items.forEach(item => {
		const div = document.createElement('div')
		div.innerHTML = `<strong>${item.text}</strong>`
		div.addEventListener('click', () => {
			input.value = item.value
			closeAutocomplete(container)
		})
		container.appendChild(div)
	})

	container.style.display = 'block'
}

function closeAutocomplete(container) {
	container.innerHTML = ''
	container.style.display = 'none'
}

function closeAllAutocomplete() {
	closeAutocomplete(bindAutocomplete)
	closeAutocomplete(windowBindAutocomplete)
	closeAutocomplete(elementsAutocomplete)
	closeAutocomplete(afrSettingBindAutocomplete)
}

function showNotification(message, type = 'info') {
	notification.textContent = message
	notification.className = `notification ${type} show`

	setTimeout(() => {notification.classList.remove('show')}, 3000)
}