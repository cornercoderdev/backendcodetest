export default class Util {
  /**
   * Returns a random integer between given range.
   * @param min - Minimum number of the range
   * @param max - Maximum number of the range
   * @returns A random integer between given range
   */
  static getRandomIntFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
