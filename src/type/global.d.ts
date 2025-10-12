export {}; // Ensure this is treated as a module

declare global {
    interface String {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fmt(...props: any[]): string;
    }
}