const { Shop, Item } = require('../src/gilded_rose');

jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('Gilded Rose', function () {
  it('should degrade sellIn', () => {
    let shop = new Shop([new Item('foo', 1, 0)]);
    shop = shop.updateQuality();
    expect(shop.items[0].sellIn).toBe(0);
  });

  it('should degrade quality by one when not expired', () => {
    let shop = new Shop([new Item('foo', 1, 1)]);
    shop = shop.updateQuality();
    expect(shop.items[0].quality).toBe(0);
  });

  it('should degrade quality by two when expired', () => {
    let shop = new Shop([new Item('foo', 1, 10)]);
    shop = shop.updateQuality(); // -1
    shop = shop.updateQuality(); // -2
    expect(shop.items[0].quality).toBe(7);
  });

  it('should not degrade quality under 0', () => {
    let shop1 = new Shop([new Item('foo', 10, 0)]);
    shop1 = shop1.updateQuality();
    shop1 = shop1.updateQuality();
    let shop2 = new Shop([new Item('foo', 0, 0)]);
    shop2 = shop2.updateQuality();
    shop2 = shop2.updateQuality();
    expect(shop1.items[0].quality).toBe(0);
    expect(shop2.items[0].quality).toBe(0);
  });

  it('should upgrade "Aged Brie" over time', () => {
    let shop = new Shop([new Item('Aged Brie', 1, 0)]);
    shop = shop.updateQuality(); // +1
    shop = shop.updateQuality(); // +2
    shop = shop.updateQuality(); // +2
    expect(shop.items[0].quality).toBe(5);
  });

  it('should never have quality over 50', () => {
    const shop = new Shop([new Item('Aged Brie', 1, 55)]);
    expect(shop.updateQuality().items[0].quality).toBe(50);
  });

  it('should never increase quality over 50', () => {
    let shop = new Shop([new Item('Aged Brie', 1, 49)]);
    shop = shop.updateQuality(); // +1
    shop = shop.updateQuality(); // +0
    expect(shop.items[0].quality).toBe(50);
  });
});
