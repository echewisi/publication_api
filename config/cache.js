class Cache {
    constructor() {
      this.cache = new Map();
    }
  
    set(key, value, ttl) {
      const now = Date.now();
      const expirationTime = now + ttl * 1000;
      this.cache.set(key, { value, expirationTime });
    }
  
    get(key) {
      const cachedData = this.cache.get(key);
      if (!cachedData) return null;
  
      const now = Date.now();
      if (now > cachedData.expirationTime) {
        this.cache.delete(key);
        return null;
      }
  
      return cachedData.value;
    }
  
    delete(key) {
      this.cache.delete(key);
    }
  
    clear() {
      this.cache.clear();
    }
  }
  
  module.exports = new Cache();
  