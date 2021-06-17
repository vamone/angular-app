export class Product {
    id: number;
    humanUrl: string;
    title: string;
    description: string;
    imageUrl: string;

    constructor() {
        this.id = 1;
        this.humanUrl = '';
        this.title = '';
        this.description = '';
        this.imageUrl = '';
    }
}