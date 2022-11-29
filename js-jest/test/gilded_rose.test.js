const { Shop, Item } = require('../src/gilded_rose');

jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('Shop', function () {
  describe('Item', () => {
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

  describe('Item: Aged Brie', () => {
    it('should upgrade over time', () => {
      let shop = new Shop([new Item('Aged Brie', 1, 0)]);
      shop = shop.updateQuality(); // +1
      shop = shop.updateQuality(); // +2
      shop = shop.updateQuality(); // +2
      expect(shop.items[0].quality).toBe(5);
    });
  });

  describe('Item: Sulfuras, Hand of Ragnaros', () => {
    it('should never update its quality / sellin', () => {
      let shop = new Shop([new Item('Sulfuras, Hand of Ragnaros', 10, 10)]);
      expect(shop.items[0].quality).toBe(80);
      expect(shop.items[0].sellIn).toBe(Infinity);
      shop = shop.updateQuality();
      expect(shop.items[0].quality).toBe(80);
      expect(shop.items[0].sellIn).toBe(Infinity);
    });
  });

  describe('Item: Backstage passes to a TAFKAL80ETC concert', () => {
    test('should increase in quality as sellIn approaches', () => {
      let shop = new Shop([
        new Item('Backstage passes to a TAFKAL80ETC concert', 11, 20),
      ]);
      shop = shop.updateQuality(); // sellIn: 10, quality: 21
      shop = shop.updateQuality(); // sellIn: 9, quality: 23
      expect(shop.items[0].sellIn).toBe(9);
      expect(shop.items[0].quality).toBe(23);
      shop = shop.updateQuality(); // sellIn: 8, quality: 25
      shop = shop.updateQuality(); // sellIn: 7, quality: 27
      shop = shop.updateQuality(); // sellIn: 6, quality: 29
      shop = shop.updateQuality(); // sellIn: 5, quality: 31
      shop = shop.updateQuality(); // sellIn: 4, quality: 34
      expect(shop.items[0].sellIn).toBe(4);
      expect(shop.items[0].quality).toBe(34);
      shop = shop.updateQuality(); // sellIn: 3, quality: 37
      shop = shop.updateQuality(); // sellIn: 2, quality: 40
      shop = shop.updateQuality(); // sellIn: 1, quality: 43
      expect(shop.items[0].sellIn).toBe(1);
      expect(shop.items[0].quality).toBe(43);
      shop = shop.updateQuality(); // sellIn: 0, quality: 47
      shop = shop.updateQuality(); // sellIn: -1, quality: 0
      expect(shop.items[0].sellIn).toBe(-1);
      expect(shop.items[0].quality).toBe(0);
    });
  });
});
