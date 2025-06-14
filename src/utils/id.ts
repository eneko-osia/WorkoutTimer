// methods
export function generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}
