export class Colors {
    background: string      = 'rgb(0, 0, 0)';
    card: string            = 'rgb(0, 0, 0)';
    notification: string    = 'rgb(0, 0, 0)';
    primary: string         = 'rgb(0, 0, 0)';
    secondary: string       = 'rgb(0, 0, 0)';
    tertiary: string        = 'rgb(0, 0, 0)';
    quaternary: string      = 'rgb(0, 0, 0)';
    text: string            = 'rgb(0, 0, 0)';
    input: string           = 'rgb(0, 0, 0)';
    border: string          = 'rgb(0, 0, 0)';

    constructor(init?: Partial<Colors>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    toJSON(): any {
        return {
            primary: this.primary,
            secondary: this.secondary,
            tertiary: this.tertiary,
            quaternary: this.quaternary,
            text: this.text,
            input: this.input,
            border: this.border,
        };
    }
}
