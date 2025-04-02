import { colorUtils, valueUtils } from './utils.js'

export class HSVPicker extends HTMLElement {

  constructor() {
    super()

    // 설정값
    this.option = {
      sbCombine: false,

      indicator: {
        type: 'circle',
        size: 20,
        border: {
          thickness: 2,
          color: 'white',
        }
      }
    }

    // 상태값
    this.state = {}

    // HTML 요소
    this.elems = {}

    // ?? 
    this.actions = {}

    this.style.position = 'relative'
  }

  static get observedAttributes() {
    return ['value']
  }

    attributeChangedCallback(attrName, oldVal, newVal) {

    // if (attrName == 'value') {
    //   this.svSelector.style.background = this.drawSVSelectorCSS(newVal)
    // }
  }

  connectedCallback() {
    this.value = this.getAttribute('value') ?? 'red'
    if ( !!!CSS.supports('color', this.value) ) throw Error('')
    
    this.initOption()
    this.initState()
    this.initContainer()
    this.initIndicators()
    this.initCanvas()

    this.drawHuePicker()
    if ( this.option.sbCombine ) {
      this.drawSBPicker()
    }
    else {
      this.drawSaturationPicker()
      this.drawBrightnessPicker()
    }
  }

  initOption() {

    this.option.hueDirection = this.getAttribute('hue-direction') ?? 'horizontal'
    this.option.hueType = this.getAttribute('hue-type') ?? 'linear'
    this.option.sbCombine = this.hasAttribute('sv-combine')

    if ( this.option.hueType === 'linear' ) {
      this.option.hueLength = valueUtils.toInt(this.getAttribute('hue-length'), 200)
      this.option.hueThickness = valueUtils.toInt(this.getAttribute('hue-thickness'), 10)
    }
    else if (this.option.hueType === 'circular') {
      // TODO
    }
    if ( this.option.sbCombine ) {
      this.option.sbWidth = valueUtils.toInt(this.getAttribute('sv-width'), 200)
      this.option.sbHeight = valueUtils.toInt(this.getAttribute('sv-height'), 200)
    }
  }

  initState() {

    if ( colorUtils.isHex(this.value) ) {
      const { h, s, v } = colorUtils.hexToHsv(this.value)
      this.state.hue, this.state.saturation, this.state.brightness = colorUtils.hexToHsv(this.value)
      this.state.hue = h
      this.state.saturation = s
      this.state.brightness = v

      console.log(h,s,v)

      this.state.hueHex = colorUtils.hsvToHex({ h, s: 1, v: 1 })

      this.state.huePosition = h / 360 * this.option.hueLength
      this.state.saturationPosition = s * this.option.sbWidth
      this.state.brightnessPosition = (1 - v) * this.option.sbHeight
    }
    else {
      // TODO
    }
  }

  dispatch() {
    const hex = colorUtils.hsvToHex({h: this.state.hue, s: this.state.saturation, v: this.state.brightness})

      this.value = hex
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: hex,
      })
      this.dispatchEvent(inputEvent)
  }

  initContainer() {

    // hue 컨테이너 초기화
    this.elems.hueContainer = document.createElement('div')
    this.elems.hueContainer.style.position = 'relative'
    this.elems.hueContainer.style.lineHeight = 0
    this.appendChild(this.elems.hueContainer)

    // sb 컨테이너 초기화
    if (this.option.sbCombine) {
      this.elems.sbContainer = document.createElement('div')
      this.elems.sbContainer.style.position = 'relative'
      this.elems.sbContainer.style.lineHeight = 0
      this.appendChild(this.elems.sbContainer)
    }
    // 
    else {
      // TODO
    }
  }

  setHue(X, Y) {
    const rect = this.elems.hueCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    if (this.option.hueType == 'linear' && this.option.hueDirection == 'horizontal') {
      this.state.huePosition = x
    }
    else if (this.option.hueType == 'linear' && this.option.hueDirection == 'vertical') {
      this.state.huePosition = y
    }
    
    const ctx = this.elems.hueCanvas.getContext('2d')
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    const hueHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)

    const { h } = colorUtils.hexToHsv(hueHex)
    this.state.hue = h
    this.state.hueHex = hueHex

    this.dispatch()
    this.drawHueIndicator()
    this.drawSBIndicator()
    this.drawSBPicker()
  }

  setSB(X, Y) {
    const rect = this.elems.sbCanvas.getBoundingClientRect()

    let x = X - rect.x
    let y = Y - rect.y
    x = x > 0 ? x : 0
    y = y > 0 ? y : 0
    x = x < rect.width ? x : rect.width - 1
    y = y < rect.height ? y : rect.height - 1

    this.state.saturationPosition = x
    this.state.brightnessPosition = y

    const ctx = this.elems.sbCanvas.getContext('2d')
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
    const svHex = '#' + ('000000' + colorUtils.rgbToHex(r, g, b)).slice(-6)

    const { s, v } = colorUtils.hexToHsv(svHex)
    this.state.saturation = s
    this.state.brightness = v

    this.dispatch()
    this.drawHueIndicator()
    this.drawSBIndicator()
  }

  initCanvas() {
    
    // Init hue canvas
    this.elems.hueCanvas = document.createElement('canvas')
    this.elems.hueCanvas.addEventListener('mousedown', (evt) => {
      this.setHue(evt.clientX, evt.clientY)
      this.state.hueSelect = true
      this.elems.hueDragArea.style.display = 'block'
    })
    this.elems.hueCanvas.addEventListener('mouseup', (evt) => {
      this.state.hueSelect = false
      this.elems.hueDragArea.style.display = 'none'
    })
    this.elems.hueContainer.appendChild(this.elems.hueCanvas)

    // Init sb combine canvas
    if (this.option.sbCombine) {
      this.elems.sbCanvas = document.createElement('canvas')
      this.elems.sbCanvas.addEventListener('mousedown', (evt) => {
        this.setSB(evt.clientX, evt.clientY)
        this.state.sbSelect = true
        this.elems.sbDragArea.style.display = 'block'
      })
      this.elems.sbCanvas.addEventListener('mouseup', (evt) => {
        this.state.sbSelect = false
        this.elems.sbDragArea.style.display = 'none'
      })
      this.elems.sbContainer.appendChild(this.elems.sbCanvas)
    }
    // Init sb canvas
    else {
      // TODO
    }
  }

  initIndicators() {
    
    // Init hue indicator
    this.elems.hueIndicator = document.createElement('div')
    this.elems.hueIndicator.style.position = 'absolute'
    this.elems.hueIndicator.style.zIndex = 1
    this.elems.hueIndicator.style.width = `${this.option.indicator.size - this.option.indicator.border.thickness * 2}px`
    this.elems.hueIndicator.style.height = `${this.option.indicator.size - this.option.indicator.border.thickness * 2}px`
    this.elems.hueIndicator.style.border = `${this.option.indicator.border.thickness}px solid ${this.option.indicator.border.color}`
    this.elems.hueIndicator.style.borderRadius = '50%'
    // this.elems.hueIndicator.style.backgroundColor
    this.elems.hueIndicator.style.top = `${(this.option.hueThickness - this.option.indicator.size) / 2}px`
    this.elems.hueDragArea = document.createElement('div')
    this.elems.hueDragArea.style.position = 'fixed'
    this.elems.hueDragArea.style.width = '100%'
    this.elems.hueDragArea.style.height = '100%'
    this.elems.hueDragArea.style.top = 0
    this.elems.hueDragArea.style.left = 0
    this.elems.hueDragArea.style.zIndex = 1
    this.elems.hueDragArea.style.display = 'none'
    this.elems.hueIndicator.appendChild(this.elems.hueDragArea)
    this.drawHueIndicator()
    this.elems.hueIndicator.addEventListener('mousedown', (evt) => {
      this.state.hueSelect = true
      this.elems.hueDragArea.style.display = 'block'
    })
    this.elems.hueIndicator.addEventListener('mouseup', (evt) => {
      this.state.hueSelect = false
      this.elems.hueDragArea.style.display = 'none'
    })
    this.elems.hueIndicator.addEventListener('mousemove', (evt) => {
      if (this.state.hueSelect) this.setHue(evt.clientX, evt.clientY)
    })
    this.elems.hueContainer.appendChild(this.elems.hueIndicator)

    // Init sb combine indicator
    if (this.option.sbCombine) {
      this.elems.sbIndicator = document.createElement('div')
      this.elems.sbIndicator.style.position = 'absolute'
      this.elems.sbIndicator.style.zIndex = 1
      this.elems.sbIndicator.style.width = `${this.option.indicator.size - this.option.indicator.border.thickness * 2}px`
      this.elems.sbIndicator.style.height = `${this.option.indicator.size - this.option.indicator.border.thickness * 2}px`
      this.elems.sbIndicator.style.border = `${this.option.indicator.border.thickness}px solid ${this.option.indicator.border.color}`
      this.elems.sbIndicator.style.borderRadius = '50%'
      this.elems.sbDragArea = document.createElement('div')
      this.elems.sbDragArea.style.position = 'fixed'
      this.elems.sbDragArea.style.width = '100%'
      this.elems.sbDragArea.style.height = '100%'
      this.elems.sbDragArea.style.top = 0
      this.elems.sbDragArea.style.left = 0
      this.elems.sbDragArea.style.zIndex = 1
      this.elems.sbDragArea.style.display = 'none'
      this.elems.sbIndicator.appendChild(this.elems.sbDragArea)
      this.drawSBIndicator()
      this.elems.sbIndicator.addEventListener('mousedown', (evt) => {
        this.state.sbSelect = true
        this.elems.sbDragArea.style.display = 'block'
      })
      this.elems.sbIndicator.addEventListener('mouseup', (evt) => {
        this.state.sbSelect = false
        this.elems.sbDragArea.style.display = 'none'
      })
      this.elems.sbIndicator.addEventListener('mousemove', (evt) => {
        if (this.state.sbSelect) this.setSB(evt.clientX, evt.clientY)
      })
      this.elems.sbContainer.appendChild(this.elems.sbIndicator)
    }
    // Init sb indicator
    else {
      // TODO
    }
  }

  drawHueIndicator() {
    this.elems.hueIndicator.style.left = `${this.state.huePosition - this.option.indicator.size / 2}px`
    this.elems.hueIndicator.style.backgroundColor = this.state.hueHex
  }

  drawSBIndicator() {
    this.elems.sbIndicator.style.left = `${this.state.saturationPosition - this.option.indicator.size / 2}px`
    this.elems.sbIndicator.style.top = `${this.state.brightnessPosition - this.option.indicator.size / 2}px`
    this.elems.sbIndicator.style.backgroundColor = this.value
  }

  drawSaturationIndicator() {
    // TODO
  }

  drawBrightnessIndicator() {
    // TODO
  }

  drawHuePicker() {
    
    if ( this.option.hueType === 'linear' && this.option.hueDirection == 'horizontal' ) {
      this.elems.hueCanvas.width = this.option.hueLength
      this.elems.hueCanvas.height = this.option.hueThickness
    }
    else {
      // TODO
    }

    const hueCTX = this.elems.hueCanvas.getContext('2d', { willReadFrequently: true })
    
    const hueGrad = hueCTX.createLinearGradient(0, 0, 200, 0)
    hueGrad.addColorStop(0 / 6, '#ff0000')
    hueGrad.addColorStop(1 / 6, '#ffff00')
    hueGrad.addColorStop(2 / 6, '#00ff00')
    hueGrad.addColorStop(3 / 6, '#00ffff')
    hueGrad.addColorStop(4 / 6, '#0000ff')
    hueGrad.addColorStop(5 / 6, '#ff00ff')
    hueGrad.addColorStop(6 / 6, '#ff0000')

    hueCTX.fillStyle = hueGrad
    hueCTX.fillRect(0, 0, this.option.hueLength, this.option.hueThickness)
  }

  drawSaturationPicker() {
    // TODO
  }

  drawBrightnessPicker() {
    // TODO
  }

  drawSBPicker() {

    if ( this.option.sbCombine ) {
      this.elems.sbCanvas.width = this.option.sbWidth
      this.elems.sbCanvas.height = this.option.sbHeight
    }

    const sbCTX = this.elems.sbCanvas.getContext('2d', { willReadFrequently: true })
    sbCTX.clearRect(0, 0, this.option.sbWidth, this.option.sbHeight)
    sbCTX.globalCompositeOperation = 'multiply'

    const colorGrad = sbCTX.createLinearGradient(0, 0, this.option.sbWidth, 0)
    colorGrad.addColorStop(0.02, "white")
    colorGrad.addColorStop(0.98, colorUtils.hsvToHex({ h: this.state.hue, s: 1, v: 1 }))
    sbCTX.fillStyle = colorGrad
    sbCTX.fillRect(0, 0, this.option.sbWidth, this.option.sbHeight)

    const blackGrad = sbCTX.createLinearGradient(0, 0, 0, this.option.sbHeight)
    blackGrad.addColorStop(0.02, "white")
    blackGrad.addColorStop(0.98, "black")
    sbCTX.fillStyle = blackGrad
    sbCTX.fillRect(0, 0, this.option.sbWidth, this.option.sbHeight)

  }
}

// TODO
// 주석좀 달자
// 초기값 랜덤