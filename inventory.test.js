const {
    calculateDiscount,
    filterProducts,
    sortInventory
} = require('./inventory');


const products = [
    { id: 1, name: 'Laptop', price: 1200, stock: 5 },
    { id: 2, name: 'Mouse', price: 25, stock: 50 },
    { id: 3, name: 'Monitor', price: 300, stock: 0 },
    { id: 4, name: 'Keyboard', price: 75, stock: 20 },
];



describe('calculateDiscount', () => {

    test('should return the correct discount amount for 10% off $100', () => {

        expect(calculateDiscount(100, 0.1)).toBe(10);
    });

    test('should handle decimal prices and rates correctly', () => {

        expect(calculateDiscount(123.45, 0.25)).toBeCloseTo(30.86);
    });


    test('should return 0 when the discount rate is 0 (0% off)', () => {
        expect(calculateDiscount(50, 0)).toBe(0);
    });

    test('should return the full price when the discount rate is 1 (100% off)', () => {
        expect(calculateDiscount(50, 1)).toBe(50);
    });

    test('should return 0 when the price is 0', () => {
        expect(calculateDiscount(0, 0.5)).toBe(0);
    });


    test('should return null for non-numeric price input (e.g., string)', () => {
        expect(calculateDiscount('100', 0.1)).toBeNull();
    });

    test('should return null if discountRate is less than 0', () => {
        expect(calculateDiscount(100, -0.1)).toBeNull();
    });

    test('should return null if discountRate is greater than 1', () => {
        expect(calculateDiscount(100, 1.001)).toBeNull();
    });

    test('should return null if price is negative', () => {
        expect(calculateDiscount(-100, 0.1)).toBeNull();
    });
});



describe('filterProducts', () => {

    test('should filter products correctly for items over $100', () => {
        const result = filterProducts(products, p => p.price > 100);
        expect(result).toHaveLength(2); // Laptop (1200), Monitor (300)
        expect(result.map(p => p.name)).toEqual(expect.arrayContaining(['Laptop', 'Monitor']));
    });

    test('should filter products correctly for items with stock greater than 10', () => {
        const result = filterProducts(products, p => p.stock > 10);
        expect(result).toHaveLength(2); // Mouse (50), Keyboard (20)
    });


    test('should return an empty array if no products match the condition', () => {
        const result = filterProducts(products, p => p.price > 5000);
        expect(result).toEqual([]);
    });

    test('should handle filtering an empty input array', () => {
        expect(filterProducts([], p => p.price > 10)).toEqual([]);
    });

    test('should filter based on stock being exactly 0 (out of stock items)', () => {
        const result = filterProducts(products, p => p.stock === 0);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Monitor');
    });

     Negative/Invalid Cases
    test('should return an empty array if products input is not an array', () => {
        expect(filterProducts('not-an-array', p => p.id)).toEqual([]);
    });

    test('should return an empty array if callback is not a function', () => {
        expect(filterProducts(products, 'price')).toEqual([]);
    });
});
describe('sortInventory', () => {
    const unsortedProducts = [
        { name: 'Cherry', value: 30, stock: 2 },
        { name: 'Apple', value: 10, stock: 5 },
        { name: 'Banana', value: 20, stock: 1 }
    ];

    //  Positive Cases
    test('should sort products correctly by numerical key (value) in ascending order', () => {
        const result = sortInventory(unsortedProducts, 'value');
        expect(result.map(p => p.name)).toEqual(['Apple', 'Banana', 'Cherry']);
    });

    test('should sort products correctly by string key (name) alphabetically', () => {
        const result = sortInventory(unsortedProducts, 'name');
        expect(result.map(p => p.name)).toEqual(['Apple', 'Banana', 'Cherry']);
    });

    //  Edge Cases
    test('should return an empty array if the input inventory is empty', () => {
        expect(sortInventory([], 'name')).toEqual([]);
    });

    test('should return a new array instance, leaving the original array unchanged', () => {
        const originalArray = [{ value: 2 }, { value: 1 }];
        const sortedArray = sortInventory(originalArray, 'value');

        expect(originalArray[0].value).toBe(2); // Original is untouched
        expect(sortedArray[0].value).toBe(1); // New array is sorted
        expect(originalArray).not.toBe(sortedArray); // Check for different reference
    });

    //  Negative/Invalid Cases
    test('should return an empty array if inventory input is not an array', () => {
        expect(sortInventory('not-array', 'value')).toEqual([]);
    });

    test('should return an empty array if key input is not a string', () => {
        expect(sortInventory(unsortedProducts, 123)).toEqual([]);
    });

    test('should handle sorting by a non-existent key (returns original order copy)', () => {
        const result = sortInventory(unsortedProducts, 'nonExistentKey');
        expect(result).toHaveLength(3);

        expect(result.map(p => p.name)).toEqual(['Cherry', 'Apple', 'Banana']);
    });
});