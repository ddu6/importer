export function createImporter<Mods extends Object>(modToURL: {
    [key in keyof Mods]: string
}) {
    const mods: {
        [key in keyof Mods]?: Mods[key]
    } = {}
    const target = new EventTarget()
    for (const name in modToURL) {
        target.addEventListener(`load-${name}`, async () => {
            mods[name] = await new Function(`return import(${JSON.stringify(modToURL[name])})`)()
            target.dispatchEvent(new Event(`loaded-${name}`))
        }, {once: true})
    }
    async function getMod<T extends keyof Mods>(name: T): Promise<Mods[T]> {
        const val = mods[name]
        if (val !== undefined) {
            return <Mods[T]>val
        }
        target.dispatchEvent(new Event(`load-${name}`))
        return new Promise(r => {
            target.addEventListener(`loaded-${name}`, () => {
                r(<Mods[T]>mods[name])
            })
        })
    }
    return {
        getMod
    }
}