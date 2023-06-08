import { Product } from "./product";

export class ProductResponse {
    constructor(
        public content: Product[],
        public pageNo: number,
        public pageSize: number,
        public totalElements: number,
        public totalPages: number) {
    }
}
