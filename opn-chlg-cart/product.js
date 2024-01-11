const products = [
  {
    id: 1,
    name: "Apple",
    price: 10,
  },
  {
    id: 2,
    name: "Orange",
    price: 20,
  },
  {
    id: 3,
    name: "Banana",
    price: 30,
  },
  {
    id: 99,
    name: "Expensive",
    price: 500,
  },
];

export default class Products {
  constructor() {
    this.products = products;
  }

  find(id) {
    if (typeof id !== "number") {
      throw new Error("id must be a number");
    }
    return this.products.find((p) => p.id === id);
  }
}
