export class Importer {
    constructor(modToURL) {
        this.modToURL = modToURL;
        this.mods = {};
        this.target = new EventTarget();
        for (const name of Object.keys(modToURL)) {
            this.target.addEventListener(`load-${name}`, async () => {
                this.mods[name] = await new Function(`return import(${JSON.stringify(modToURL[name])})`)();
                this.target.dispatchEvent(new Event(`loaded-${name}`));
            }, { once: true });
        }
    }
    async getMod(name) {
        const val = this.mods[name];
        if (val !== undefined) {
            return val;
        }
        this.target.dispatchEvent(new Event(`load-${name}`));
        return new Promise(r => {
            this.target.addEventListener(`loaded-${name}`, () => {
                r(this.mods[name]);
            });
        });
    }
}
