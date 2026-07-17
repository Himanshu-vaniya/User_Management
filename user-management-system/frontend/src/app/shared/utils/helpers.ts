export class StorageHelper {
  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  static clear(): void {
    localStorage.clear();
  }
}

export class DateHelper {
  static formatDate(date: Date): string {
    return date.toISOString();
  }
}
