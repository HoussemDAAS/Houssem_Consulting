// polyfills.js
if (typeof String.prototype.substring === 'undefined') {
    String.prototype.substring = function(start, end) {
      return this.slice(start, end);
    };
  }