export declare class HSVPicker extends HTMLElement {
    option: {
        valueType: string;
        sbSquare: boolean;
        global: {
            picker: {
                direction: string;
                length: number;
                thickness: number;
            };
            indicator: {
                type: string;
                size: number;
                border: {
                    thickness: number;
                    color: string;
                };
            };
        };
        hue: {
            picker: {
                type: string;
                direction: string;
                length: number;
                thickness: number;
                radius: number;
            };
            indicator: {
                type: string;
                size: string;
                border: {
                    thickness: number;
                    color: string;
                };
            };
        };
        saturation: {
            picker: {
                direction: string;
                length: number;
                thickness: number;
            };
            indicator: {
                type: string;
                size: string;
                border: {
                    thickness: number;
                    color: string;
                };
            };
        };
        brightness: {
            picker: {
                direction: string;
                length: number;
                thickness: number;
            };
            indicator: {
                type: string;
                size: string;
                border: {
                    thickness: number;
                    color: string;
                };
            };
        };
        selected: {
            show: boolean;
            width: number;
            height: number;
        };
    };
    state: {};
    elems: {};
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(attrName: any, oldVal: any, newVal: any): void;
    connectedCallback(): void;
    initOption(): void;
    initState(): void;
    dispatch(): void;
    initContainer(): void;
    initSelectedColor(): void;
    drawSelectedColor(): void;
    setHue(X: any, Y: any): void;
    setSaturation(X: any, Y: any): void;
    setBrightness(X: any, Y: any): void;
    setSB(X: any, Y: any): void;
    initCanvas(): void;
    initIndicators(): void;
    drawHueIndicator(): void;
    drawSBIndicator(): void;
    drawSaturationIndicator(): void;
    drawBrightnessIndicator(): void;
    drawHuePicker(): void;
    drawSaturationPicker(): void;
    drawBrightnessPicker(): void;
    drawSBPicker(): void;
    dummyMethod(): void;
    dummyMethod2(): void;
    dummyMethod3(): void;
}
