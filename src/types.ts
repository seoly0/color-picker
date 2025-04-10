type PickerType = 'linear' | 'circular'
type LinearDirection = 'horizontal' | 'vertical'
type IndicatorType = 'circle' | 'rectangle'

export interface HSVPickerOptions {
  valueType: 'hex' | 'rgb'
  sbSquare: boolean

  common: {
    picker: {
      direction: LinearDirection
      length: number
      thickness: number
    }
    indicator: {
      type: IndicatorType
      size: number
      border: {
        thickness: number
        color: string
      }
    }
  }
  hue: {
    picker: {
      class: string
      type: PickerType
      direction: LinearDirection
      length: number
      thickness: number
      radius: number
    }
    indicator: {
      class: string
      type: IndicatorType
      size: number
      border: {
        thickness: number
        color: string
      }
    }
  }
  saturation: {
    picker: {
      class: string
      direction: LinearDirection
      length: number
      thickness: number
    }
    indicator: {
      class: string
      type: IndicatorType
      size: number
      border: {
        thickness: number
        color: string
      }
    }
  }
  brightness: {
    picker: {
      class: string
      direction: LinearDirection
      length: number
      thickness: number
    }
    indicator: {
      class: string
      type: IndicatorType
      size: number
      border: {
        thickness: number
        color: string
      }
    }
  }
  selected: {
    show: boolean
    width: number
    height: number
  }
}

export interface HSVPickerState {
  hue: number
  saturation: number
  brightness: number

  hueHex: string

  huePosition: number
  saturationPosition: number
  brightnessPosition: number

  hueSelect: boolean
  sbSelect: boolean
  saturationSelect: boolean
  brightnessSelect: boolean
}

export interface HSVPickerElems {
  hueContainer?: HTMLElement
  sbContainer?: HTMLElement
  saturationContainer?: HTMLElement
  brightnessContainer?: HTMLElement
  selectedColor?: HTMLElement
  hueCanvas?: HTMLCanvasElement
  saturationCanvas?: HTMLCanvasElement
  brightnessCanvas?: HTMLCanvasElement
  sbCanvas?: HTMLCanvasElement
  hueDragArea?: HTMLElement
  sbDragArea?: HTMLElement
  saturationDragArea?: HTMLElement
  brightnessDragArea?: HTMLElement
  hueIndicator?: HTMLElement
  sbIndicator?: HTMLElement
  saturationIndicator?: HTMLElement
  brightnessIndicator?: HTMLElement
}
