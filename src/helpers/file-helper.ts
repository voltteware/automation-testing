import { DataTable } from '@cucumber/cucumber';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { stringify } from 'csv-stringify';

export function convertDataTableToCSVFile(dataTable: DataTable, section: string, fileName: string) {
    var rows = dataTable.rows();
    switch (section) {
        case 'supplier':
            rows.forEach((row: any, index: number) => {
                // Supplier Name
                if (row[0] === 'random') {
                    rows[index][0] = `supplier ${index} from upload auto ${Date.now()}`
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

            // Write data to csv file            
            const filePath = `./src/data/${fileName}`;
            const writableStream = fs.createWriteStream(filePath);
            const header = dataTable.raw()[0]; // Set header
            const stringifier = stringify({ header: true, columns: header });
            rows.forEach((row: any) => {
                stringifier.write(row)
            }) // Write data
            stringifier.pipe(writableStream);
            break;

        default:
            break;
    }
    return rows
}