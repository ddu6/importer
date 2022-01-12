export class Importer<Mods extends Object>{
    readonly mods: {
        [key in keyof Mods]?: Mods[key]
    } = {}
    readonly target = new EventTarget()
    constructor(readonly modToURL: {
        [key in keyof Mods]: string
    }) {
        for (const name of <(keyof typeof modToURL)[]>Object.keys(modToURL)) {
            this.target.addEventListener(`load-${name}`, async () => {
                this.mods[name] = await new Function(`return import(${JSON.stringify(modToURL[name])})`)()
                this.target.dispatchEvent(new Event(`loaded-${name}`))
            }, {once: true})
        }
    }
    async getMod<T extends keyof Mods>(name: T): Promise<Mods[T]> {
        const val = this.mods[name]
        if (val !== undefined) {
            return <Mods[T]>val
        }
        this.target.dispatchEvent(new Event(`load-${name}`))
        return new Promise(r => {
            this.target.addEventListener(`loaded-${name}`, () => {
                r(<Mods[T]>this.mods[name])
            })
        })
    }
}