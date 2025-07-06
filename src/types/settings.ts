import { Colors } from '../types/colors';
import { ColorSchemeName } from 'react-native';

export class Settings {
    static readonly kStorageKey: string = 'settings';

    private _dark: Colors;
    private _light: Colors;

    constructor({dark, light}: { dark: Colors; light: Colors; }) {
        this._dark = dark;
        this._light = light;
    }

    getColors(scheme: ColorSchemeName) : Colors {
        return (scheme === 'dark' ? this._dark : this._light);
    }

    static fromJSON(data: any): Settings {
        return new Settings(data);
    }

    toJSON(): any {
        return {
            dark: this._dark,
            light: this._light,
        };
    }
}
