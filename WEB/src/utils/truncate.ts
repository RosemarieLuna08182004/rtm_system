
export const truncate = (text: string, no: number): string => {
    let str = text.slice(0, no);
    if (text.length !== str.length) str = `${str}...`
    return str;
}
