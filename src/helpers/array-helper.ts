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

//Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function sortLocale(array: Array<any>, field: string, direction: 'asc' | 'desc' = 'asc') {
    return array.sort((a, b) => {
        if (isNaN(a[field])){
            const sortResult = a[field].localeCompare(b[field]);
            // if direction = asc => sortResult else reverse sortResult
            return direction === 'asc' ? sortResult : !sortResult;
        }
        
        else {
            const valueA = a[field];
            const valueB = b[field];

            if (valueA === valueB) {
                return 0;
            }

            if (direction === 'asc') {
                return valueA > valueB ? 1 : -1;
            }

            if (direction === 'desc') {
                return valueA < valueB ? 1 : -1;
            }
        }
    });
}

export {
    flattenArray,
    sortLocale
}