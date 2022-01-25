export function createImporter(modToURL) {
    const mods = {};
    const target = new EventTarget();
    for (const name in modToURL) {
        target.addEventListener(`load-${name}`, async () => {
            mods[name] = await new Function(`return import(${JSON.stringify(modToURL[name])})`)();
            target.dispatchEvent(new Event(`loaded-${name}`));
        }, { once: true });
    }
    async function getMod(name) {
        const val = mods[name];
        if (val !== undefined) {
            return val;
        }
        target.dispatchEvent(new Event(`load-${name}`));
        return new Promise(r => {
            target.addEventListener(`loaded-${name}`, () => {
                r(mods[name]);
            });
        });
    }
    return {
        getMod
    };
}
