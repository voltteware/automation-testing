function flattenArray(nestedArray: Array<any>, nestedPropName: string): Array<any> {
    let result: Array<any> = [];

    nestedArray.forEach(item => {
        result.push(item);
        // Check if the item is still available
        if (Array.isArray(item[nestedPropName])) {
            result = result.concat(flattenArray(item[nestedPropName], nestedPropName));
        }
    });

    return result;
}

function isSubset(array1: Array<any>, array2: Array<any>) {
    return array2.every((element) => array1.includes(element));
    // For example:
    // console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6])); => true
}

//Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function sortLocale(array: Array<any>, field: string, direction: 'asc' | 'desc' = 'asc') {
    return array.sort((a, b) => {
        if (field.includes("Date")) {
            const valueA = new Date(a[field]);
            const valueB = new Date(b[field]);

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
        if (isNaN(a[field])) {
            const sortResult = a[field].localeCompare(b[field]);
            // if direction = asc => sortResult else reverse sortResult
            return direction === 'asc' ? sortResult : !sortResult;
        }

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
    });
}

export {
    flattenArray,
    sortLocale,
    isSubset
}