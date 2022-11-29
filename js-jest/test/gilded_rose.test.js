const {Shop, Item} = require("../src/gilded_rose");

describe("Gilded Rose", function() {
  it ('should degrade sellIn', () => {
    let shop = new Shop([new Item("foo", 1, 0)]);
    shop = new Shop( shop.updateQuality());
    expect(shop.items[0].sellIn).toBe(0);
  })

  it ('should degrade quality by one when not expired', () => {
    let shop = new Shop([new Item("foo", 1, 1)]);
    shop = new Shop(shop.updateQuality())
    expect(shop.items[0].quality).toBe(0);
  })

  it('should degrade quality by two when expired', () => {
    let shop = new Shop([new Item("foo", 1, 10)]);
    shop = new Shop(shop.updateQuality());
    shop = new Shop(shop.updateQuality());
    expect(shop.items[0].quality).toBe(7);
  })
});
