var y = Object.defineProperty;
var k = (r, o, t) => o in r ? y(r, o, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[o] = t;
var g = (r, o, t) => k(r, typeof o != "symbol" ? o + "" : o, t);
const a = {
  isHex(r) {
    return /^#([0-9a-fA-F]{3}){1,2}$/i.test(r);
  },
  nameToRgb() {
  },
  nameToHex() {
  },
  rgbToHex(r, o, t) {
    if (r > 255 || o > 255 || t > 255) throw "Invalid color component";
    return (r << 16 | o << 8 | t).toString(16);
  },
  // rgbToHsv(rgb: any) {
  // },
  // rgbToHsl(r: number, g: number, b: number) {
  //   r /= 255, g /= 255, b /= 255
  //   let max = Math.max(r, g, b), min = Math.min(r, g, b)
  //   let h: number, s: number, l: number = (max + min) / 2
  //   if(max == min){
  //       h = s = 0 // achromatic
  //   }
  //   else{
  //       var d = max - min
  //       s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  //       switch(max){
  //         case r: h = (g - b) / d + (g < b ? 6 : 0)
  //           break
  //         case g: h = (b - r) / d + 2
  //           break
  //         case b: h = (r - g) / d + 4
  //           break
  //       }
  //       h /= 6
  //   }
  //   return [h, s, l]
  // },
  hexToRgb() {
  },
  hexToHsv(r) {
    const o = parseInt(r.substring(1, 3), 16) / 255, t = parseInt(r.substring(3, 5), 16) / 255, e = parseInt(r.substring(5, 7), 16) / 255, i = Math.max(o, t, e), n = Math.min(o, t, e);
    let s;
    if (i === n)
      s = 0;
    else if (i === o)
      s = 60 * (0 + (t - e) / (i - n));
    else if (i === t)
      s = 60 * (2 + (e - o) / (i - n));
    else if (i === e)
      s = 60 * (4 + (o - t) / (i - n));
    else
      throw Error;
    s < 0 && (s += 360);
    const l = i === 0 ? 0 : (i - n) / i;
    return { h: s, s: l, v: i };
  },
  hsvToHex(r) {
    let o, t, e, i = r.h / 360, n = r.s, s = r.v, l = Math.floor(i * 6), c = i * 6 - l, h = s * (1 - n), u = s * (1 - c * n), d = s * (1 - (1 - c) * n);
    switch (l % 6) {
      case 0:
        o = s, t = d, e = h;
        break;
      case 1:
        o = u, t = s, e = h;
        break;
      case 2:
        o = h, t = s, e = d;
        break;
      case 3:
        o = h, t = u, e = s;
        break;
      case 4:
        o = d, t = h, e = s;
        break;
      case 5:
        o = s, t = h, e = u;
        break;
    }
    const p = (b) => {
      const m = Math.round(b * 255).toString(16);
      return m.length === 1 ? "0" + m : m;
    };
    return "#" + p(o) + p(t) + p(e);
  },
  hsvToHsl(r) {
    let o = r.h / 360, t = r.s, e = r.v, i = (2 - t) * e / 2;
    return i != 0 && (i == 1 ? t = 0 : i < 0.5 ? t = t * e / (i * 2) : t = t * e / (2 - i * 2)), { h: o, s: t, l: i };
  }
};
class C extends HTMLElement {
  attributeChangedCallback(o, t, e) {
  }
  connectedCallback() {
  }
}
class I extends HTMLElement {
  constructor() {
    super();
    g(this, "option");
    g(this, "state");
    g(this, "elems");
    this.option = {
      valueType: "hex",
      // hex, rgb
      sbSquare: !1,
      global: {
        picker: {
          direction: "horizontal",
          length: 0,
          thickness: 0
        },
        indicator: {
          type: "circle",
          size: 16,
          border: {
            thickness: 2,
            color: "white"
          }
        }
      },
      hue: {
        picker: {
          type: "linear",
          direction: "horizontal",
          // lenear
          length: 0,
          // lenear
          thickness: 0,
          // lenear, circular
          radius: 0
          // circular
        },
        indicator: {
          type: "circle",
          size: "",
          border: {
            thickness: 0,
            color: "white"
          }
        }
      },
      saturation: {
        picker: {
          direction: "horizontal",
          length: 0,
          thickness: 0
        },
        indicator: {
          type: "circle",
          size: "",
          border: {
            thickness: 0,
            color: "white"
          }
        }
      },
      brightness: {
        picker: {
          direction: "horizontal",
          length: 0,
          thickness: 0
        },
        indicator: {
          type: "circle",
          size: "",
          border: {
            thickness: 0,
            color: "white"
          }
        }
      },
      selected: {
        show: !1,
        width: 100,
        height: 100
      }
    }, this.state = {}, this.elems = {}, this.actions = {}, this.style.position = "relative";
  }
  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback(t, e, i) {
  }
  connectedCallback() {
    if (console.log("hello?"), this.value = this.getAttribute("value") ?? "red", !CSS.supports("color", this.value)) throw Error(`init value is not valid: ${this.value}`);
    this.initOption(), this.initState(), this.initContainer(), this.initSelectedColor(), this.initIndicators(), this.initCanvas(), this.drawHuePicker(), this.option.sbSquare ? this.drawSBPicker() : (this.drawSaturationPicker(), this.drawBrightnessPicker());
  }
  initOption() {
    this.option.sbSquare = this.hasAttribute("sb-square"), this.option.hue.picker.type = this.getAttribute("hue-picker-direction") ?? "linear", this.option.hue.picker.direction = this.getAttribute("hue-picker-direction") ?? "horizontal", this.option.hue.picker.length = this.getAttribute("hue-picker-length") ?? 200, this.option.hue.picker.thickness = this.getAttribute("hue-picker-thickness") ?? 10, this.option.hue.picker.radius = this.getAttribute("hue-picker-thickness") ?? 100, this.option.hue.indicator.type = this.getAttribute("hue-indicator-type") ?? "circle", this.option.hue.indicator.size = this.getAttribute("hue-indicator-size") ?? 16, this.option.hue.indicator.border.color = this.getAttribute("hue-indicator-border-color") ?? "white", this.option.hue.indicator.border.thickness = this.getAttribute("hue-indicator-border-thickness") ?? 2, this.option.saturation.picker.direction = this.getAttribute("saturation-picker-direction") ?? "horizontal", this.option.saturation.picker.length = this.getAttribute("saturation-picker-length") ?? 200, this.option.saturation.picker.thickness = this.getAttribute("saturation-picker-thickness") ?? 10, this.option.saturation.indicator.type = this.getAttribute("saturation-indicator-type") ?? "circle", this.option.saturation.indicator.size = this.getAttribute("saturation-indicator-size") ?? 16, this.option.saturation.indicator.border.color = this.getAttribute("saturation-indicator-border-color") ?? "white", this.option.saturation.indicator.border.thickness = this.getAttribute("saturation-indicator-border-thickness") ?? 2, this.option.brightness.picker.direction = this.getAttribute("brightness-picker-direction") ?? "horizontal", this.option.brightness.picker.length = this.getAttribute("brightness-picker-length") ?? 200, this.option.brightness.picker.thickness = this.getAttribute("brightness-picker-thickness") ?? 10, this.option.brightness.indicator.type = this.getAttribute("brightness-indicator-type") ?? "circle", this.option.brightness.indicator.size = this.getAttribute("brightness-indicator-size") ?? 16, this.option.brightness.indicator.border.color = this.getAttribute("brightness-indicator-border-color") ?? "white", this.option.brightness.indicator.border.thickness = this.getAttribute("brightness-indicator-border-thickness") ?? 2;
  }
  initState() {
    if (a.isHex(this.value)) {
      const { h: t, s: e, v: i } = a.hexToHsv(this.value);
      this.state.hue, this.state.saturation, this.state.brightness = a.hexToHsv(this.value), this.state.hue = t, this.state.saturation = e, this.state.brightness = i, this.state.hueHex = a.hsvToHex({ h: t, s: 1, v: 1 }), this.state.huePosition = t / 360 * this.option.hue.picker.length, this.state.saturationPosition = e * this.option.saturation.picker.length;
      const n = this.option.sbSquare ? 1 - i : i;
      this.state.brightnessPosition = n * this.option.brightness.picker.length;
    }
  }
  dispatch() {
    const t = a.hsvToHex({ h: this.state.hue, s: this.state.saturation, v: this.state.brightness });
    this.value = t;
    const e = new InputEvent("input", {
      bubbles: !0,
      cancelable: !1,
      data: t
    });
    this.dispatchEvent(e);
  }
  initContainer() {
    this.elems.hueContainer = document.createElement("div"), this.elems.hueContainer.style.position = "relative", this.elems.hueContainer.style.lineHeight = 0, this.appendChild(this.elems.hueContainer), this.option.sbSquare ? (this.elems.sbContainer = document.createElement("div"), this.elems.sbContainer.style.position = "relative", this.elems.sbContainer.style.lineHeight = 0, this.appendChild(this.elems.sbContainer)) : (this.elems.saturationContainer = document.createElement("div"), this.elems.saturationContainer.style.position = "relative", this.elems.saturationContainer.style.lineHeight = 0, this.appendChild(this.elems.saturationContainer), this.elems.brightnessContainer = document.createElement("div"), this.elems.brightnessContainer.style.position = "relative", this.elems.brightnessContainer.style.lineHeight = 0, this.appendChild(this.elems.brightnessContainer));
  }
  initSelectedColor() {
    this.option.selected.show && (this.elems.selectedColor = document.createElement("div"), this.elems.selectedColor.style.position = "relative", this.elems.selectedColor.style.width = `${this.option.selected.width}px`, this.elems.selectedColor.style.height = `${this.option.selected.height}px`, this.elems.selectedColor.style.backgroundColor = this.value, this.appendChild(this.elems.selectedColor));
  }
  drawSelectedColor() {
    this.option.selected.show && (this.elems.selectedColor.style.backgroundColor = this.value);
  }
  setHue(t, e) {
    const i = this.elems.hueCanvas.getBoundingClientRect();
    let n = t - i.x, s = e - i.y;
    n = n > 0 ? n : 0, s = s > 0 ? s : 0, n = n < i.width ? n : i.width - 1, s = s < i.height ? s : i.height - 1, this.option.hue.picker.type == "linear" && this.option.hue.picker.direction == "horizontal" ? this.state.huePosition = n : this.option.hue.picker.type == "linear" && this.option.hue.picker.direction == "vertical" && (this.state.huePosition = s);
    const l = this.elems.hueCanvas.getContext("2d"), [c, h, u] = l.getImageData(n, s, 1, 1).data, d = "#" + ("000000" + a.rgbToHex(c, h, u)).slice(-6), { h: p } = a.hexToHsv(d);
    this.state.hue = p, this.state.hueHex = d, this.dispatch(), this.drawHueIndicator(), this.option.sbSquare ? (this.drawSBIndicator(), this.drawSBPicker()) : (this.drawSaturationPicker(), this.drawSaturationIndicator(), this.drawBrightnessPicker(), this.drawBrightnessIndicator()), this.drawSelectedColor();
  }
  setSaturation(t, e) {
    const i = this.elems.saturationCanvas.getBoundingClientRect();
    let n = t - i.x, s = e - i.y;
    n = n > 0 ? n : 0, s = s > 0 ? s : 0, n = n < i.width ? n : i.width - 1, s = s < i.height ? s : i.height - 1, this.option.saturation.picker.direction == "horizontal" ? this.state.saturationPosition = n : this.option.saturation.picker.direction == "vertical" && (this.state.saturationPosition = s), this.state.saturation = this.state.saturationPosition / this.option.saturation.picker.length, this.dispatch(), this.drawSaturationPicker(), this.drawSaturationIndicator(), this.drawBrightnessPicker(), this.drawBrightnessIndicator();
  }
  setBrightness(t, e) {
    const i = this.elems.brightnessCanvas.getBoundingClientRect();
    let n = t - i.x, s = e - i.y;
    n = n > 0 ? n : 0, s = s > 0 ? s : 0, n = n < i.width ? n : i.width - 1, s = s < i.height ? s : i.height - 1, this.option.brightness.picker.direction == "horizontal" ? this.state.brightnessPosition = n : this.option.brightness.picker.direction == "vertical" && (this.state.brightnessPosition = s), this.state.brightness = this.state.brightnessPosition / this.option.brightness.picker.length, this.dispatch(), this.drawSaturationPicker(), this.drawSaturationIndicator(), this.drawBrightnessPicker(), this.drawBrightnessIndicator();
  }
  setSB(t, e) {
    const i = this.elems.sbCanvas.getBoundingClientRect();
    let n = t - i.x, s = e - i.y;
    n = n > 0 ? n : 0, s = s > 0 ? s : 0, n = n < i.width ? n : i.width - 1, s = s < i.height ? s : i.height - 1, this.state.saturationPosition = n, this.state.brightnessPosition = s;
    const l = this.elems.sbCanvas.getContext("2d"), [c, h, u] = l.getImageData(n, s, 1, 1).data, d = "#" + ("000000" + a.rgbToHex(c, h, u)).slice(-6), { s: p, v: b } = a.hexToHsv(d);
    this.state.saturation = p, this.state.brightness = b, this.dispatch(), this.drawHueIndicator(), this.drawSBIndicator(), this.drawSelectedColor();
  }
  initCanvas() {
    this.elems.hueCanvas = document.createElement("canvas"), this.elems.hueCanvas.addEventListener("mousedown", (t) => {
      this.setHue(t.clientX, t.clientY), this.state.hueSelect = !0, this.elems.hueDragArea.style.display = "block";
    }), this.elems.hueCanvas.addEventListener("mouseup", (t) => {
      this.state.hueSelect = !1, this.elems.hueDragArea.style.display = "none";
    }), this.elems.hueContainer.appendChild(this.elems.hueCanvas), this.option.sbSquare ? (this.elems.sbCanvas = document.createElement("canvas"), this.elems.sbCanvas.addEventListener("mousedown", (t) => {
      this.setSB(t.clientX, t.clientY), this.state.sbSelect = !0, this.elems.sbDragArea.style.display = "block";
    }), this.elems.sbCanvas.addEventListener("mouseup", (t) => {
      this.state.sbSelect = !1, this.elems.sbDragArea.style.display = "none";
    }), this.elems.sbContainer.appendChild(this.elems.sbCanvas)) : (this.elems.saturationCanvas = document.createElement("canvas"), this.elems.saturationCanvas.addEventListener("mousedown", (t) => {
      this.setSaturation(t.clientX, t.clientY), this.state.saturationSelect = !0, this.elems.saturationDragArea.style.display = "block";
    }), this.elems.saturationCanvas.addEventListener("mouseup", (t) => {
      this.state.saturationSelect = !1, this.elems.saturationDragArea.style.display = "none";
    }), this.elems.saturationContainer.appendChild(this.elems.saturationCanvas), this.elems.brightnessCanvas = document.createElement("canvas"), this.elems.brightnessCanvas.addEventListener("mousedown", (t) => {
      this.setBrightness(t.clientX, t.clientY), this.state.brightnessSelect = !0, this.elems.brightnessDragArea.style.display = "block";
    }), this.elems.brightnessCanvas.addEventListener("mouseup", (t) => {
      this.state.brightnessSelect = !1, this.elems.brightnessDragArea.style.display = "none";
    }), this.elems.brightnessContainer.appendChild(this.elems.brightnessCanvas));
  }
  initIndicators() {
    this.elems.hueIndicator = document.createElement("div"), this.elems.hueIndicator.style.position = "absolute", this.elems.hueIndicator.style.zIndex = 1, this.elems.hueIndicator.style.width = `${this.option.hue.indicator.size - this.option.hue.indicator.border.thickness * 2}px`, this.elems.hueIndicator.style.height = `${this.option.hue.indicator.size - this.option.hue.indicator.border.thickness * 2}px`, this.elems.hueIndicator.style.border = `${this.option.hue.indicator.border.thickness}px solid ${this.option.hue.indicator.border.color}`, this.elems.hueIndicator.style.borderRadius = "50%", this.elems.hueDragArea = document.createElement("div"), this.elems.hueDragArea.style.position = "fixed", this.elems.hueDragArea.style.width = "100%", this.elems.hueDragArea.style.height = "100%", this.elems.hueDragArea.style.top = 0, this.elems.hueDragArea.style.left = 0, this.elems.hueDragArea.style.display = "none", this.elems.hueIndicator.appendChild(this.elems.hueDragArea), this.drawHueIndicator(), this.elems.hueIndicator.addEventListener("mousedown", (t) => {
      this.state.hueSelect = !0, this.elems.hueDragArea.style.display = "block", this.elems.hueIndicator.style.zIndex = 2;
    }), this.elems.hueIndicator.addEventListener("mouseup", (t) => {
      this.state.hueSelect = !1, this.elems.hueDragArea.style.display = "none", this.elems.hueIndicator.style.zIndex = 1;
    }), this.elems.hueIndicator.addEventListener("mouseleave", (t) => {
      this.state.hueSelect = !1, this.elems.hueDragArea.style.display = "none", this.elems.hueIndicator.style.zIndex = 1;
    }), this.elems.hueIndicator.addEventListener("mousemove", (t) => {
      this.state.hueSelect && this.setHue(t.clientX, t.clientY);
    }), this.elems.hueContainer.appendChild(this.elems.hueIndicator), this.option.sbSquare ? (this.elems.sbIndicator = document.createElement("div"), this.elems.sbIndicator.style.position = "absolute", this.elems.sbIndicator.style.zIndex = 1, this.elems.sbIndicator.style.width = `${this.option.global.indicator.size - this.option.global.indicator.border.thickness * 2}px`, this.elems.sbIndicator.style.height = `${this.option.global.indicator.size - this.option.global.indicator.border.thickness * 2}px`, this.elems.sbIndicator.style.border = `${this.option.global.indicator.border.thickness}px solid ${this.option.global.indicator.border.color}`, this.elems.sbIndicator.style.borderRadius = "50%", this.elems.sbDragArea = document.createElement("div"), this.elems.sbDragArea.style.position = "fixed", this.elems.sbDragArea.style.width = "100%", this.elems.sbDragArea.style.height = "100%", this.elems.sbDragArea.style.top = 0, this.elems.sbDragArea.style.left = 0, this.elems.sbDragArea.style.display = "none", this.elems.sbIndicator.appendChild(this.elems.sbDragArea), this.drawSBIndicator(), this.elems.sbIndicator.addEventListener("mousedown", (t) => {
      this.state.sbSelect = !0, this.elems.sbDragArea.style.display = "block", this.elems.sbIndicator.style.zIndex = 2;
    }), this.elems.sbIndicator.addEventListener("mouseup", (t) => {
      this.state.sbSelect = !1, this.elems.sbDragArea.style.display = "none", this.elems.sbIndicator.style.zIndex = 1;
    }), this.elems.sbIndicator.addEventListener("mouseleave", (t) => {
      this.state.sbSelect = !1, this.elems.sbDragArea.style.display = "none", this.elems.sbIndicator.style.zIndex = 1;
    }), this.elems.sbIndicator.addEventListener("mousemove", (t) => {
      this.state.sbSelect && this.setSB(t.clientX, t.clientY);
    }), this.elems.sbContainer.appendChild(this.elems.sbIndicator)) : (this.elems.saturationIndicator = document.createElement("div"), this.elems.saturationIndicator.style.position = "absolute", this.elems.saturationIndicator.style.zIndex = 1, this.elems.saturationIndicator.style.width = `${this.option.saturation.indicator.size - this.option.saturation.indicator.border.thickness * 2}px`, this.elems.saturationIndicator.style.height = `${this.option.saturation.indicator.size - this.option.saturation.indicator.border.thickness * 2}px`, this.elems.saturationIndicator.style.border = `${this.option.saturation.indicator.border.thickness}px solid ${this.option.saturation.indicator.border.color}`, this.elems.saturationIndicator.style.borderRadius = "50%", this.elems.saturationDragArea = document.createElement("div"), this.elems.saturationDragArea.style.position = "fixed", this.elems.saturationDragArea.style.width = "100%", this.elems.saturationDragArea.style.height = "100%", this.elems.saturationDragArea.style.top = 0, this.elems.saturationDragArea.style.left = 0, this.elems.saturationDragArea.style.display = "none", this.elems.saturationIndicator.appendChild(this.elems.saturationDragArea), this.drawSaturationIndicator(), this.elems.saturationIndicator.addEventListener("mousedown", (t) => {
      this.state.saturationSelect = !0, this.elems.saturationDragArea.style.display = "block", this.elems.saturationIndicator.style.zIndex = 2;
    }), this.elems.saturationIndicator.addEventListener("mouseup", (t) => {
      this.state.saturationSelect = !1, this.elems.saturationDragArea.style.display = "none", this.elems.saturationIndicator.style.zIndex = 1;
    }), this.elems.saturationIndicator.addEventListener("mouseleave", (t) => {
      this.state.saturationSelect = !1, this.elems.saturationDragArea.style.display = "none", this.elems.saturationIndicator.style.zIndex = 1;
    }), this.elems.saturationIndicator.addEventListener("mousemove", (t) => {
      this.state.saturationSelect && this.setSaturation(t.clientX, t.clientY);
    }), this.elems.saturationContainer.appendChild(this.elems.saturationIndicator), this.elems.brightnessIndicator = document.createElement("div"), this.elems.brightnessIndicator.style.position = "absolute", this.elems.brightnessIndicator.style.zIndex = 1, this.elems.brightnessIndicator.style.width = `${this.option.brightness.indicator.size - this.option.brightness.indicator.border.thickness * 2}px`, this.elems.brightnessIndicator.style.height = `${this.option.brightness.indicator.size - this.option.brightness.indicator.border.thickness * 2}px`, this.elems.brightnessIndicator.style.border = `${this.option.brightness.indicator.border.thickness}px solid ${this.option.brightness.indicator.border.color}`, this.elems.brightnessIndicator.style.borderRadius = "50%", this.elems.brightnessDragArea = document.createElement("div"), this.elems.brightnessDragArea.style.position = "fixed", this.elems.brightnessDragArea.style.width = "100%", this.elems.brightnessDragArea.style.height = "100%", this.elems.brightnessDragArea.style.top = 0, this.elems.brightnessDragArea.style.left = 0, this.elems.brightnessDragArea.style.display = "none", this.elems.brightnessIndicator.appendChild(this.elems.brightnessDragArea), this.drawBrightnessIndicator(), this.elems.brightnessIndicator.addEventListener("mousedown", (t) => {
      this.state.brightnessSelect = !0, this.elems.brightnessDragArea.style.display = "block", this.elems.brightnessIndicator.style.zIndex = 2;
    }), this.elems.brightnessIndicator.addEventListener("mouseup", (t) => {
      this.state.brightnessSelect = !1, this.elems.brightnessDragArea.style.display = "none", this.elems.brightnessIndicator.style.zIndex = 1;
    }), this.elems.brightnessIndicator.addEventListener("mouseleave", (t) => {
      this.state.brightnessSelect = !1, this.elems.brightnessDragArea.style.display = "none", this.elems.brightnessIndicator.style.zIndex = 1;
    }), this.elems.brightnessIndicator.addEventListener("mousemove", (t) => {
      this.state.brightnessSelect && this.setBrightness(t.clientX, t.clientY);
    }), this.elems.brightnessContainer.appendChild(this.elems.brightnessIndicator));
  }
  drawHueIndicator() {
    this.option.hue.picker.type === "linear" ? this.option.hue.picker.direction == "horizontal" ? (this.elems.hueIndicator.style.left = `${this.state.huePosition - this.option.hue.indicator.size / 2}px`, this.elems.hueIndicator.style.top = `${(this.option.hue.picker.thickness - this.option.hue.indicator.size) / 2}px`) : this.option.hue.picker.direction == "vertical" && (this.elems.hueIndicator.style.left = `${(this.option.hue.picker.thickness - this.option.hue.indicator.size) / 2}px`, this.elems.hueIndicator.style.top = `${this.state.huePosition - this.option.hue.indicator.size / 2}px`) : this.option.hue.picker.type, this.elems.hueIndicator.style.backgroundColor = this.state.hueHex;
  }
  drawSBIndicator() {
    this.elems.sbIndicator.style.left = `${this.state.saturationPosition - this.option.global.indicator.size / 2}px`, this.elems.sbIndicator.style.top = `${this.state.brightnessPosition - this.option.global.indicator.size / 2}px`, this.elems.sbIndicator.style.backgroundColor = this.value;
  }
  drawSaturationIndicator() {
    this.elems.saturationIndicator.style.left = `${this.state.saturationPosition - this.option.saturation.indicator.size / 2}px`, this.elems.saturationIndicator.style.top = `${(this.option.saturation.picker.thickness - this.option.saturation.indicator.size) / 2}px`, this.elems.saturationIndicator.style.backgroundColor = this.value;
  }
  drawBrightnessIndicator() {
    this.elems.brightnessIndicator.style.left = `${this.state.brightnessPosition - this.option.brightness.indicator.size / 2}px`, this.elems.brightnessIndicator.style.top = `${(this.option.brightness.picker.thickness - this.option.brightness.indicator.size) / 2}px`, this.elems.brightnessIndicator.style.backgroundColor = this.value;
  }
  drawHuePicker() {
    if (this.option.hue.picker.type === "linear") {
      if (this.option.hue.picker.direction == "horizontal") {
        this.elems.hueCanvas.width = this.option.hue.picker.length, this.elems.hueCanvas.height = this.option.hue.picker.thickness;
        const t = this.elems.hueCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, this.option.hue.picker.length, 0);
        e.addColorStop(0 / 6, "#ff0000"), e.addColorStop(1 / 6, "#ffff00"), e.addColorStop(2 / 6, "#00ff00"), e.addColorStop(3 / 6, "#00ffff"), e.addColorStop(4 / 6, "#0000ff"), e.addColorStop(5 / 6, "#ff00ff"), e.addColorStop(6 / 6, "#ff0000"), t.fillStyle = e, t.fillRect(0, 0, this.option.hue.picker.length, this.option.hue.picker.thickness);
      } else if (this.option.hue.picker.direction == "vertical") {
        this.elems.hueCanvas.width = this.option.hue.picker.thickness, this.elems.hueCanvas.height = this.option.hue.picker.length;
        const t = this.elems.hueCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, 0, this.option.hue.picker.length);
        e.addColorStop(0 / 6, "#ff0000"), e.addColorStop(1 / 6, "#ffff00"), e.addColorStop(2 / 6, "#00ff00"), e.addColorStop(3 / 6, "#00ffff"), e.addColorStop(4 / 6, "#0000ff"), e.addColorStop(5 / 6, "#ff00ff"), e.addColorStop(6 / 6, "#ff0000"), t.fillStyle = e, t.fillRect(0, 0, this.option.hue.picker.thickness, this.option.hue.picker.length);
      }
    } else this.option.hue.picker.type;
  }
  drawSaturationPicker() {
    this.elems.saturationCanvas.width = this.option.saturation.picker.length, this.elems.saturationCanvas.height = this.option.saturation.picker.thickness;
    const t = this.elems.saturationCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, this.option.saturation.picker.length, 0);
    e.addColorStop(0 / 1, a.hsvToHex({ h: this.state.hue, s: 0, v: this.state.brightness })), e.addColorStop(1 / 1, a.hsvToHex({ h: this.state.hue, s: 1, v: this.state.brightness })), t.fillStyle = e, t.fillRect(0, 0, this.option.saturation.picker.length, this.option.saturation.picker.thickness);
  }
  drawBrightnessPicker() {
    this.elems.brightnessCanvas.width = this.option.brightness.picker.length, this.elems.brightnessCanvas.height = this.option.brightness.picker.thickness;
    const t = this.elems.brightnessCanvas.getContext("2d", { willReadFrequently: !0 }), e = t.createLinearGradient(0, 0, this.option.brightness.picker.length, 0);
    e.addColorStop(0 / 1, a.hsvToHex({ h: this.state.hue, s: this.state.saturation, v: 0 })), e.addColorStop(1 / 1, a.hsvToHex({ h: this.state.hue, s: this.state.saturation, v: 1 })), t.fillStyle = e, t.fillRect(0, 0, this.option.brightness.picker.length, this.option.brightness.picker.thickness);
  }
  drawSBPicker() {
    this.option.sbSquare && (this.elems.sbCanvas.width = this.option.saturation.picker.length, this.elems.sbCanvas.height = this.option.brightness.picker.length);
    const t = this.elems.sbCanvas.getContext("2d", { willReadFrequently: !0 });
    t.clearRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length), t.globalCompositeOperation = "multiply";
    const e = t.createLinearGradient(0, 0, this.option.saturation.picker.length, 0);
    e.addColorStop(0.02, "white"), e.addColorStop(0.98, a.hsvToHex({ h: this.state.hue, s: 1, v: 1 })), t.fillStyle = e, t.fillRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length);
    const i = t.createLinearGradient(0, 0, 0, this.option.brightness.picker.length);
    i.addColorStop(0.02, "white"), i.addColorStop(0.98, "black"), t.fillStyle = i, t.fillRect(0, 0, this.option.saturation.picker.length, this.option.brightness.picker.length);
  }
}
export {
  I as HSVPicker,
  C as TestComponent
};
