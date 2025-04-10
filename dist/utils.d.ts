export declare const colorUtils: {
    isHex(color: any): boolean;
    nameToRgb(): void;
    nameToHex(): void;
    rgbToHex(r: number, g: number, b: number): string;
    hexToRgb(): void;
    hexToHsv(hex: string): {
        h: number;
        s: number;
        v: number;
    };
    hsvToHex(hsv: any): string;
    hsvToHsl(hsv: any): {
        h: number;
        s: any;
        l: number;
    };
};
export declare const valueUtils: {
    assert: <T>(val: any, domains: Array<T>, _default?: T) => T;
    toInt: (val: any, _default: number) => number;
};
