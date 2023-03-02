export class payLoadSupplier{
    name?: string
    description?: string
    email?: string
    moq?: Number
    leadTime?: Number
    orderInterval?: Number
    serviceLevel?: Number
    targetOrderValue?: Number
    freeFreightMinimum?: Number
    restockModel?: string
    addressData?: [
        {
            key?: string,
            vendorKey?: string,
            countryCode?: string,
            fullName?: string,
            addressLine1?: string,
            addressLine2?: string,
            city?: string,
            stateOrProvinceCode?: string,
            postalCode?: string,
            phoneNumber?: string
        }
    ]

}