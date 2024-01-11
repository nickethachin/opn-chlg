import { Cart } from "./cart.js";

const testCart = (cart) => {
  console.log("// Cart is empty:", cart.isEmpty());
  console.log("// Cart items:", cart.count());
  console.log("// Cart total quantity of items:", cart.quantity());
  console.log("// Cart flat total:", cart.flatTotal());
  console.log("// Cart total discount:", cart.totalDiscount());
  console.log("// Cart total price:", cart.total());
};

const cartService = new Cart();

const cart = cartService.create("test");

cart.add(99, 1);
cart.update(99, 5);

console.log("// Cart total price:", cart.total());
cart.addDiscount("10%Max100", { type: "percentage", amount: 10, max: 100 });
console.log("// Cart total price:", cart.total());
cart.removeDiscount("10%Max100");
console.log("// Cart total price:", cart.total());

console.log('----------------------------------------------')

const condition = {type: "contains", product_id: 1}
const reward = {product_id: 2, quantity: 1}
cart.addFreebie("1AppleFree1Orange", condition, reward)
console.log("// Cart items:", cart.count());

console.log('----------------------------------------------')

cart.add(1, 1);
cart.addFreebie("1AppleFree1Orange", condition, reward)
console.log("// Cart items:", cart.count());

