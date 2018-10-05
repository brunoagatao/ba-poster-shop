const PRICE = 9.99;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
      { id: 3, title: 'Item 3' }
    ],
    cart: []
  },
  methods: {
    onSubmit: function (e) {
      e.preventDefault();
      console.log('onSubmit');
    },
    addItem: function (index) {
      this.total += PRICE;

      const item = this.items[index];
      const cartIndex = this.cart.findIndex((cartItem) => cartItem.id === item.id);

      let found = false;
      if (cartIndex >= 0) {
        found = true;
        this.cart[cartIndex].quantity++;
      }

      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          price: PRICE,
          quantity: 1
        });
      }
    },
    inc: function (item) {
      item.quantity++;
      this.total += PRICE;
    },
    dec: function (item) {
      item.quantity--;
      this.total -= PRICE;
      if (item.quantity <= 0) {
        const cartIndex = this.cart.findIndex((cartItem) => cartItem.id === item.id);
        this.cart.splice(cartIndex, 1);
      }
    }
  },
  filters: {
    currency: function (price) {
      return '$'.concat(price.toFixed(2));
    }
  }
});