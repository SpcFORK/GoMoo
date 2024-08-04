/** Boyer Moore String Search */

class BoyerMoore {
  /**
   * The pattern to search for in the text.
   * @type {string}
   */
  pattern;

  /**
   * The bad character shift table.
   * @type {number[]}
   */
  badChar;

  /**
   * The good suffix shift table.
   * @type {number[]}
   */
  goodSuffix;

  /**
   * Creates an instance of BoyerMoore.
   * @param {string} pattern - The pattern to search for.
   */
  constructor(pattern) {
    this.pattern = pattern;
    this.badChar = this.buildBadCharTable();
    this.goodSuffix = this.buildGoodSuffixTable();
  }

  /**
   * Builds the bad character table.
   * @returns {number[]} The bad character table.
   */
  buildBadCharTable() {
    const table = new Array(256).fill(-1);
    for (let i = 0; i < this.pattern.length; i++)
      table[this.pattern.charCodeAt(i)] = i;
    return table;
  }

  /**
   * Initializes the Good Suffix Table.
   * @returns {{ left: number, right: number, m: number, z: number[], table: number[] }} The initialized values.
   */
  #initGST() {
    const m = this.pattern.length;
    return {
      left: m,
      right: m,
      m,
      z: new Array(m).fill(0),
      table: new Array(m).fill(0),
    };
  }

  /**
   * Handles prefixes of the pattern for the Good Suffix Table.
   * @param {number} m - The length of the pattern.
   * @param {number[]} z - The Z array.
   * @param {number[]} table - The Good Suffix Table.
   */
  #handlePatternPrefixes(m, z, table) {
    let j = 0;
    for (let i = m - 1; i >= 0; i--)
      if (i + 1 === z[i])
        for (; j <= m - 1 - i; j++) if (table[j] === 0) table[j] = m - 1 - i;
  }

  /**
   * Fills the Good Suffix Table based on the Z array.
   * @param {number} m - The length of the pattern.
   * @param {number[]} table - The Good Suffix Table.
   * @param {number[]} z - The Z array.
   */
  #fillGST(m, table, z) {
    for (let i = 0; i < m - 1; i++) table[m - 1 - z[i]] = m - 1 - i;
  }

  /**
   * Determines if 'left' should be decremented based on the pattern.
   * @param {number} left - The current left index.
   * @param {number} m - The length of the pattern.
   * @param {number} right - The current right index.
   * @returns {boolean} True if 'left' should be decremented, false otherwise.
   */
  #shouldDecLeft(left, m, right) {
    return (
      left >= 0 && this.pattern[left] === this.pattern[left + m - 1 - right]
    );
  }

  /**
   * Processes the left and right boundaries while constructing the Z array.
   * @param {number} i - The current index in the Z array.
   * @param {number} left - The current left boundary of the Z array.
   * @param {number} right - The current right boundary of the Z array.
   * @param {number} m - The length of the pattern.
   * @param {number[]} z - The Z array being constructed.
   * @returns {{left: number, right: number}} The updated left and right boundaries.
   */
  #processLeftRightZ(i, left, right, m, z) {
    if (i < left) right = i;
    left = Math.min(i, left);
    while (this.#shouldDecLeft(left, m, right)) left--;
    z[i] = right - left;
    return { left, right };
  }

  /**
   * Handles the Z array index during its construction.
   * @param {number} i - The current index in the Z array.
   * @param {number} left - The current left boundary in the Z array.
   * @param {number[]} z - The Z array being constructed.
   * @param {number} m - The length of the pattern.
   * @param {number} right - The current right boundary in the Z array.
   * @returns {{left: number, right: number}} The updated left and right boundaries.
   */
  #handleZArrInd(i, left, z, m, right) {
    if (this.#isIndexGTLeftBoundary(i, left, z, m, right))
      z[i] = z[i + m - 1 - right];
    else ({ left, right } = this.#processLeftRightZ(i, left, right, m, z));
    return { left, right };
  }

  /**
   * Checks if the current index is greater than the left boundary and if the Z value is less than the distance to the left boundary.
   * @param {number} i - The current index in the Z array.
   * @param {number} left - The current left boundary in the Z array.
   * @param {number[]} z - The Z array being constructed.
   * @param {number} m - The length of the pattern.
   * @param {number} right - The current right boundary in the Z array.
   * @returns {boolean} True if the conditions are met, false otherwise.
   */
  #isIndexGTLeftBoundary(i, left, z, m, right) {
    return i > left && z[i + m - 1 - right] < i - left + 1;
  }

  /**
   * Populates the Z array with values.
   * @param {number} m - The length of the pattern.
   * @param {number} left - The current left boundary in the Z array.
   * @param {number[]} z - The Z array being constructed.
   * @param {number} right - The current right boundary in the Z array.
   * @returns {{left: number, right: number}} The updated left and right boundaries.
   */
  #populateZArray(m, left, z, right) {
    for (let i = m - 2; i >= 0; i--)
      ({ left, right } = this.#handleZArrInd(i, left, z, m, right));
    return { left, right };
  }

  /**
   * Builds the Z array for the Good Suffix Table.
   * @param {number} m - The length of the pattern.
   * @param {number} left - The current left boundary in the Z array.
   * @param {number[]} z - The Z array being constructed.
   * @param {number} right - The current right boundary in the Z array.
   * @returns {{left: number, right: number}} The final left and right boundaries.
   */
  #buildZArray(m, left, z, right) {
    this.#fillGST(left, m, right);
    ({ left, right } = this.#populateZArray(m, left, z, right));
    return { left, right };
  }

  /**
   * Builds the good suffix table.
   * @returns {number[]} The good suffix table.
   */
  buildGoodSuffixTable() {
    var { left, right, m, z, table } = this.#initGST();
    ({ left, right } = this.#buildZArray(m, left, z, right));
    this.#fillGST(m, table, z);
    this.#handlePatternPrefixes(m, z, table);
    return table;
  }

  /**
   * Finds the match for the pattern in the given text.
   * @param {string} text - The text in which to search.
   * @param {number} s - The starting index of the search in the text.
   * @param {number} j - The current index in the pattern.
   * @returns {number} The updated index in the pattern.
   */
  #findMatch(text, s, j) {
    while (j >= 0 && this.pattern[j] === text[s + j]) j--;
    return j;
  }

  /**
   * Records a match in the results array.
   * @param {number[]} results - The array to store the match results.
   * @param {number} s - The starting index of the match in the text.
   * @param {string} text - The text in which the pattern was matched.
   * @param {number} n - The length of the text.
   * @param {number} m - The length of the pattern.
   */
  #recordMatch(results, s, text, n, m) {
    results.push(s);
    s += s + m < n ? m - this.badChar[text.charCodeAt(s + m)] : 1;
  }

  /**
   * Calculates the shift for the search index.
   * @param {string} text - The text within which the search is being performed.
   * @param {number} s - The current starting index of the search in the text.
   * @param {number} j - The current index in the pattern.
   * @returns {number} The computed shift for the next search iteration.
   */
  #calculateShift(text, s, j) {
    const badCharShift = j - this.badChar[text.charCodeAt(s + j)];
    const goodSuffixShift = this.goodSuffix[j];
    return Math.max(1, Math.max(badCharShift, goodSuffixShift));
  }

  /**
   * Initializes search parameters.
   * @param {string} text - The text to be searched.
   * @returns {object} An object containing initialized search parameters.
   */
  #initSearch(text) {
    return {
      s: 0,
      n: text.length,
      m: this.pattern.length,
      results: [],
    };
  }

  /**
   * Conducts the search for the pattern in the text.
   * @param {number} s - The current starting index in the text.
   * @param {number} n - The length of the text.
   * @param {number} m - The length of the pattern.
   * @param {string} text - The text in which to search.
   * @param {number[]} results - The array to store the match results.
   * @returns {number} The updated starting index after the search iteration.
   */
  #doSearch(s, n, m, text, results) {
    while (s <= n - m) s = this.#handleSearchInd(m, text, s, results, n);
    return s;
  }

  /**
   * Handles the search index during the search process.
   * @param {number} m - The length of the pattern.
   * @param {string} text - The text in which to search.
   * @param {number} s - The current starting index in the text.
   * @param {number[]} results - The array to store the match results.
   * @param {number} n - The length of the text.
   * @returns {number} The updated starting index after processing the current search index.
   */
  #handleSearchInd(m, text, s, results, n) {
    let j = this.#findMatch(text, s, m - 1);
    if (j < 0) this.#recordMatch(results, s, text, n, m);
    else s += this.#calculateShift(text, s, j);
    return s;
  }

  /**
   * Searches for the pattern in the given text.
   * @param {string} text - The text to search within.
   * @returns {number[]} An array of starting positions where the pattern is found in the text.
   */
  search(text) {
    var { s, n, m, results } = this.#initSearch(text);
    s = this.#doSearch(s, n, m, text, results);
    return results;
  }
}

// // Example usage
// const bm = new BoyerMoore("example");
// const text = "Here is an example of the Boyer-Moore string search algorithm";
// const index = bm.search(text);

// if (index !== -1) {
//   console.log(`Pattern found at index ${index}`);
// } else {
//   console.log("Pattern not found");
// }
