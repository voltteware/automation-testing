function flattenArray(nestedArray: Array<any>, nestedPropName: string): Array<any> {
    let result: Array<any> = [];

    nestedArray.forEach(item => {
        result.push(item);
        // Kiem tra xem co item con hay khong
        if (Array.isArray(item[nestedPropName])) {
            result = result.concat(flattenArray(item[nestedPropName], nestedPropName));
        }
    });

    return result;
}

export {
    flattenArray
}