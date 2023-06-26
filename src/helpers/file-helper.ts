import { DataTable } from '@cucumber/cucumber';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { stringify } from 'csv-stringify';

let dd: any;
let mm: any;

export function convertDataTableToCSVFile(dataTable: DataTable, section: string, fileName: string, supplierName?: string, itemName?: string) {
    var rows = dataTable.rows();
    const today = new Date();
    const yyyy = today.getFullYear();
    mm = Number(today.getMonth()) + 1; // Months start at 0!
    dd = Number(today.getDate());
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    const formattedToday = mm + '/' + dd + '/' + yyyy;
    switch (section) {
        case 'supplier':
            rows.forEach((row: any, index: number) => {
                // Supplier Name
                if (row[0] === 'random') {
                    rows[index][0] = `supplier ${index} from upload auto ${Date.now()}`
                }
                if (row[0] === 'hard') {
                    rows[index][0] = `${supplierName}`
                }
                // Lead Time
                if (row[1] === 'random') {
                    rows[index][1] = `${faker.datatype.number({ 'min': 1, 'max': 365 })}`
                }
                // Order Interval
                if (row[2] === 'random') {
                    rows[index][2] = `${Number(faker.random.numeric())}`
                }
            })
            break;
        case 'item':
            rows.forEach((row: any, index: number) => {
                // Item Name
                if (row[0] === 'random') {
                    rows[index][0] = `item ${index} from upload auto ${Date.now()}`
                }
                // Item Name
                if (row[0] === 'hard') {
                    rows[index][0] = `${itemName}`
                }
                // Supplier Name
                if (row[1] === 'random') {
                    rows[index][1] = `${supplierName}`
                }
                // Supplier Price
                if (row[2] === 'random') {
                    rows[index][2] = `${Number(faker.random.numeric())}`
                }
                // MOQ
                if (row[3] === 'random') {
                    rows[index][3] = `${Number(faker.random.numeric())}`
                }
                // Service Level
                if (row[4] === 'random') {
                    rows[index][4] = `${Number(faker.random.numeric())}`
                }
                // On Hand Qty
                if (row[5] === 'random') {
                    rows[index][5] = `${Number(faker.random.numeric())}`
                }
                // Warehouse Qty
                if (row[6] === 'random') {
                    rows[index][6] = `${Number(faker.random.numeric())}`
                }
            })
            break;
        case 'demand':
            rows.forEach((row: any, index: number) => {
                // Item Name
                if (row[0] === 'random') {
                    rows[index][0] = `${itemName}`
                }
                // Date of Sale
                if (row[1] === 'random') {
                    rows[index][1] = `${formattedToday}`
                }
                // Sales Order Qty
                if (row[2] === 'random') {
                    rows[index][2] = `${Number(faker.random.numeric(2))}`
                }
                // Open Sales Order Qty
                if (row[3] === 'random') {
                    rows[index][3] = `${Number(faker.random.numeric(1))}`
                }
                // Ref Num
                if (row[4] === 'random') {
                    rows[index][4] = `${Number(faker.random.numeric())}`
                }
                // Doc Type
                if (row[5] === 'random') {
                    rows[index][5] = `import`
                }
                // Order Key
                if (row[6] === 'random') {
                    rows[index][6] = `88516266-3e15-4356-bd20-bf595448a380`
                }
                // Row Key
                if (row[7] === 'random') {
                    rows[index][7] = `1`
                }
            })
            break;
        case 'shipmentItem':
            rows.forEach((row: any, index: number) => {
                // SKU
                if (row[0] === 'random') {
                    rows[index][0] = `item shipment ${index} from upload auto ${Date.now()}`
                }
                // Product name
                if (row[1] === 'random') {
                    rows[index][1] = ``
                }
                // Warehouse qty
                if (row[2] === 'random') {
                    rows[index][2] = `${Number(faker.random.numeric())}`
                }
            })
            break;
        case 'supply':
            rows.forEach((row: any, index: number) => {
                // PO Num
                if (row[0] === 'random') {
                    rows[index][0] = `${Number(faker.random.numeric())}`
                }
                // Supplier name
                if (row[1] === 'random') {
                    rows[index][1] = `${supplierName}`
                }
                // Receive Date
                if (row[2] === 'random') {
                    rows[index][2] = `${formattedToday}`
                }
                // PO Date
                if (row[3] === 'random') {
                    rows[index][3] = `06/24/2023`
                }
                // Item Name
                if (row[4] === 'random') {
                    rows[index][4] = `${itemName}`
                }
                // Order Qty
                if (row[5] === 'random') {
                    rows[index][5] = `${Number(faker.random.numeric())}`
                }
                // Open Qty
                if (row[6] === 'random') {
                    rows[index][6] = `${Number(faker.random.numeric())}`
                }
            })
            break;
        default:
            break;
    }
    // Write data to csv file            
    const filePath = `./src/data/${fileName}`;
    const writableStream = fs.createWriteStream(filePath);
    const header = dataTable.raw()[0]; // Set header
    const stringifier = stringify({ header: true, columns: header });
    rows.forEach((row: any) => {
        stringifier.write(row)
    }) // Write data
    stringifier.pipe(writableStream);
    return rows
}