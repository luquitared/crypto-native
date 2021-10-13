export class Asset {
    constructor(type, token_id, total_price, date) {
        this.type = type,
        this.token_id = token_id,
        this.total_price = total_price,
        this.date = date
    }
}

export class Transfer {
    constructor(type, token_id, num_sales, date, total_price) {
        this.type = type,
        this.token_id = token_id,
        this.num_sales = num_sales,
        this.date = date,
        this.total_price = total_price
    }
}