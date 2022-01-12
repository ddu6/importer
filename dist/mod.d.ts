export declare function createImporter<Mods extends Object>(modToURL: {
    [key in keyof Mods]: string;
}): {
    getMod: <T extends keyof Mods>(name: T) => Promise<Mods[T]>;
};
