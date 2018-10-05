const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    loading: false,
    lastSearch: '',
    newSearch: 'anime',
    price: PRICE,
    results: [],
    items: [],
    cart: []
  },
  methods: {
    onSubmit: function () {
      this.items = [];

      this.loading = true;
      this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function (res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;

          this.appendItems();
          this.loading = false;
        });
    },
    appendItems: function () {
      if (this.items.length < this.results.length) {
        const append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    addItem: function (index) {
      this.total += this.price;

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
          price: this.price,
          quantity: 1
        });
      }
    },
    inc: function (item) {
      item.quantity++;
      this.total += this.price;
    },
    dec: function (item) {
      item.quantity--;
      this.total -= this.price;
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
  },
  computed: {
    noMoreItems: function () {
      return this.results.length && this.results.length > 0;
    }
  },
  mounted: function () {
    this.onSubmit();
    const vueInstance = this;

    const element = document.getElementById('product-list-bottom');
    const watcher = scrollMonitor.create(element);
    watcher.enterViewport(function () {
      vueInstance.appendItems();
    });
  },
});