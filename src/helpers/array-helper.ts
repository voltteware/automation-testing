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

function sortLocale(array: Array<any>, field: string, direction: 'asc' | 'desc' = 'asc') {
    return array.sort((a, b) => {
        const sortResult = a[field].localeCompare(b[field]);
        // if direction = asc => sortResult else reverse sortResult
        return direction === 'asc' ? sortResult : !sortResult;
    });
}

export {
    flattenArray,
    sortLocale
}