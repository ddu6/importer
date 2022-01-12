export declare class Importer<Mods extends Object> {
    readonly modToURL: {
        [key in keyof Mods]: string;
    };
    readonly mods: {
        [key in keyof Mods]?: Mods[key];
    };
    readonly target: EventTarget;
    constructor(modToURL: {
        [key in keyof Mods]: string;
    });
    getMod<T extends keyof Mods>(name: T): Promise<Mods[T]>;
}
