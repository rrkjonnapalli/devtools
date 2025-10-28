import _ from "lodash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
String.prototype.fmt = String.prototype.fmt || function (this: string, ...props: any[]): string {
    let str = this.toString();
    if (props.length) {
        const t = typeof props[0];
        const args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(props)
            : props[0];

        // Find all placeholders in the template string like {name} or {emp[0].name}
        const placeholderRegex = /\{([^}]+)\}/g;
        let match;
        
        while ((match = placeholderRegex.exec(str)) !== null) {
            const placeholder = match[0]; // Full match including braces: {emp[0].name}
            const path = match[1];        // Path without braces: emp[0].name
            
            // Use lodash _.get to retrieve the value using the path
            const value = _.get(args, path);
            
            if (value !== undefined) {
                console.log('Replacing placeholder:', placeholder, 'with value:', value);
                // Escape special regex characters in the placeholder for safe replacement
                const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                str = str.replace(new RegExp(escapedPlaceholder, 'g'), value);
            }
        }
    }
    return str;
};