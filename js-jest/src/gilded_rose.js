const DEFAULT_MAX_QUALITY = 50;

const DEFAULT_QUALITY_DELTA = 1;

const EXPIRED_QUALITY_DELTA = 2;

const LEGENDARY_QUALITY = 80;

const Category = {
  AGED_QUALITY: 'AGED_QUALITY',
  CONJURED: 'CONJURED',
  LEGENDARY: 'LEGENDARY',
  TICKETS: 'TICKETS',
};

class Item {
  #quality;
  #sellIn;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.quality = quality;
    this.sellIn = sellIn;
  }

  get category() {
    if (this.name === 'Aged Brie') {
      return Category.AGED_QUALITY;
    }
    if (this.name === 'Conjured Mana Cake') {
      return Category.CONJURED;
    }
    if (this.name === 'Sulfuras, Hand of Ragnaros') {
      return Category.LEGENDARY;
    }
    if (this.name === 'Backstage passes to a TAFKAL80ETC concert') {
      return Category.TICKETS;
    }
    return null;
  }

  get isExpired() {
    return this.sellIn <= 0;
  }

  get quality() {
    return this.#quality;
  }

  set quality(value) {
    switch (this.category) {
      case Category.LEGENDARY:
        this.#quality = LEGENDARY_QUALITY;
        break;
      default:
        this.#quality = Math.max(0, Math.min(DEFAULT_MAX_QUALITY, value));
    }
  }

  get sellIn() {
    return this.#sellIn;
  }

  set sellIn(value) {
    switch (this.category) {
      case Category.LEGENDARY:
        this.#sellIn = Infinity;
        break;
      default:
        this.#sellIn = value;
    }
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  update() {
    return new Shop(
      this.items.map((item) => {
        const newItem = new Item(item.name, item.sellIn, item.quality);
        const defaultQualityDelta = newItem.isExpired
          ? EXPIRED_QUALITY_DELTA
          : DEFAULT_QUALITY_DELTA;
        switch (item.category) {
          case Category.AGED_QUALITY:
            newItem.quality += defaultQualityDelta;
            break;
          case Category.CONJURED:
            newItem.quality -= defaultQualityDelta * 2;
            break;
          case Category.TICKETS:
            if (item.sellIn <= 0) {
              newItem.quality = 0;
            } else if (item.sellIn <= 5) {
              newItem.quality += 3;
            } else if (item.sellIn <= 10) {
              newItem.quality += 2;
            } else {
              newItem.quality += 1;
            }
            break;
          default:
            newItem.quality -= defaultQualityDelta;
        }
        newItem.sellIn -= 1;
        return newItem;
      }),
    );
  }
}

module.exports = {
  Item,
  Shop,
};
