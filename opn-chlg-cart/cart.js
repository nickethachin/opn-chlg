import Products from "./product.js";

const products = new Products();

export class Cart {
  /* ----------------------------- Main Functions ----------------------------- */
  constructor(customer_id) {
    this.customer_id = customer_id;
    this.items = [];
    this.discountList = [];
    this.freebieList = [];
  }

  create(customer_id) {
    return new Cart(customer_id);
  }

  add(product_id, quantity) {
    const product = products.find(product_id);
    console.log("Adding", product.name, "for", quantity, "ea");
    // If product already exists, then update quantity
    if (this.has(product_id)) {
      this.update(product_id, quantity);
      return;
    }
    // Else add new item
    this.items.push({ product_id, quantity });
  }

  update(product_id, quantity) {
    const product = products.find(product_id);
    console.log("Updating", product.name, "to", quantity, "ea");
    // If product does not exist, then return
    if (!this.has(product_id)) return;
    // Else update quantity
    const item = this.items.find((item) => item.product_id === product_id);
    item.quantity = quantity;
  }

  remove(product_id) {
    const product = products.find(product_id);
    console.log("Removing", product.name);
    // If product does not exist, then return
    if (!this.has(product_id)) return;
    // Else remove item
    this.items = this.items.filter((item) => item.product_id !== product_id);
  }

  destroy() {
    console.log("Destroying cart", this.customer_id);
    this.items = [];
    this.discountList = [];
  }

  /* --------------------------- Calculate Functions -------------------------- */
  flatTotal() {
    return this.items.reduce((acc, item) => {
      const product = products.find(item.product_id);
      return acc + product.price * item.quantity;
    }, 0);
  }
  totalDiscount() {
    if (this.discountList.length === 0) return 0;
    if (this.items.length === 0) return 0;
    return this.discountList.reduce((acc, discountItem) => {
      // Extract discount details
      const { type, amount, max } = discountItem.discount;
      // If discount type is not percentage or fixed, then ignore
      if (type !== "percentage" && type !== "fixed") return acc;
      // Get flat total price
      const flatTotal = this.flatTotal();
      // Calculate discount amount by type
      // If discount is percentage, then calculate percentage of flat total, else use fixed amount
      const discount =
        type === "percentage" ? (flatTotal * amount) / 100 : amount;
      //  If max is provided, then use min of discount or max
      const discountAmount = max ? Math.min(discount, max) : discount;
      // Return total discount to accumulator
      return acc + discountAmount;
    }, 0);
  }
  total() {
    return this.flatTotal() - this.totalDiscount();
  }

  /* ---------------------------- Utility Function ---------------------------- */
  has(product_id) {
    return !!this.items.find((item) => item.product_id === product_id);
  }
  isEmpty() {
    return this.items.length === 0;
  }
  count() {
    // return list of items and quantity
    return this.items.map((item) => {
      const product = products.find(item.product_id);
      return { name: product.name, quantity: item.quantity };
    });
  }
  quantity() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  /* ---------------------------- Discount Function --------------------------- */
  addDiscount(name, discount) {
    console.log("Adding discount", name, discount);
    if (this.discountList.find((discountItem) => discountItem.name === name)) {
      throw new Error("Discount name already exists");
    }
    this.discountList.push({ name, discount });
  }

  removeDiscount(name) {
    console.log("Removing discount", name);
    if (!this.discountList.find((discountItem) => discountItem.name === name)) {
      throw new Error("Discount name does not exists");
    }
    this.discountList = this.discountList.filter(
      (discountItem) => discountItem.name !== name,
    );
  }

  /* ---------------------------- Freebie Function ---------------------------- */
  addFreebie(name, condition, reward) {
    console.log("Adding freebie", name, condition, reward);
    if (this.freebieList.find((freebieItem) => freebieItem.name === name)) {
      throw new Error("Freebie name already exists");
    }
    // If condition type is contains AND product_id is found in items
    if (condition.type === "contains") {
      if (this.items.find((item) => item.product_id === condition.product_id)) {
        this.add(reward.product_id, reward.quantity);
        this.freebieList.push({ name, condition, reward });
        console.log("Freebie added");
        return;
      }
    }

    // If condition type is not contains, then ignore
    console.log("Freebie condition not met");
  }
}
