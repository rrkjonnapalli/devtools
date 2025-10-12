// eslint-disable-next-line @typescript-eslint/no-explicit-any
String.prototype.fmt = String.prototype.fmt || function (this: string, ...props: any[]): string {
    let str = this.toString();
    if (props.length) {
        const t = typeof props[0];
        const args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(props)
            : props[0];

        for (const key in args) {
            // eslint-disable-next-line no-prototype-builtins
            if (args?.hasOwnProperty(key)) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }
    }
    return str;
};