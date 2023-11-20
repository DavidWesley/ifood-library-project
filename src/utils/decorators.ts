type Input = unknown
type Output = unknown

type Decorator = (
    value: Input,
    context: {
        kind: string
        name: string | symbol
        access: {
            get?(): unknown
            set?(value: unknown): void
        }
        private?: boolean
        static?: boolean
        addInitializer?(initializer: () => void): void
    }
) => Output | void

type ClassMethodDecorator = (
    value: Function,
    context: {
        kind: "method"
        name: string | symbol
        access: { get(): unknown }
        static: boolean
        private: boolean
        addInitializer(initializer: () => void): void
    }
) => Function | void

function debug(value: any, { kind, name }) {
    if (kind === "method") {
        return function (...args: any[]) {
            console.log(`começando ${name} com os argumentos ${args.join(", ")}`)
            const ret = value.call(this, ...args)
            console.log(`fim de ${name}`)
            return ret
        }
    }
}

type ClassGetterDecorator = (
    value: Function,
    context: {
        kind: "getter"
        name: string | symbol
        access: { get(): unknown }
        static: boolean
        private: boolean
        addInitializer(initializer: () => void): void
    }
) => Function | void

type ClassFieldDecorator = (
    value: undefined,
    context: {
        kind: "field"
        name: string | symbol
        access: { get(): unknown; set(value: unknown): void }
        static: boolean
        private: boolean
    }
) => (initialValue: unknown) => unknown | void
