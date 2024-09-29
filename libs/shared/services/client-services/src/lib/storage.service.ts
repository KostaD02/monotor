import { Injectable } from '@angular/core';

class MemoryStorage implements Storage {
  private readonly data: Record<string, unknown> = {};

  [key: string]: unknown;
  [index: number]: string;

  get length() {
    return 1;
  }

  key(index: number): string | null {
    return Object.keys(this.data)[index] || null;
  }

  getItem(key: string): string | null {
    return this.data[key] as string | null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  clear(): void {
    Object.keys(this.data).forEach((key) => delete this.data[key]);
  }

  toString(): string {
    return '[object Storage]';
  }
}

export abstract class BaseStorageService {
  protected readonly storage: Storage;

  constructor(token: string) {
    if (this.isSupported(token)) {
      this.storage = this.window[token];
    } else {
      this.storage = new MemoryStorage();
    }
  }

  get window() {
    // ? Since it's a window object it could contain everything
    return window as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  }

  getItem(key: string) {
    return this.safeJSONParse(this.storage.getItem(key));
  }

  setItem(key: string, value: unknown) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  setEncryptedItem(key: string, value: unknown) {
    if (!key) {
      return;
    }

    this.storage.setItem(key, this.encodeItem(value));
  }

  getEncodedItem(key: string) {
    if (!key) {
      return null;
    }

    try {
      return this.decodeItem(this.storage.getItem(key));
    } catch {
      return null;
    }
  }

  private encodeItem(value: unknown) {
    if (value === null || value === undefined) {
      return null;
    }

    return (
      (this.window['btoa'] && this.window['btoa'](JSON.stringify(value))) ||
      value
    );
  }

  private decodeItem(value: unknown) {
    if (value === null || value === undefined) {
      return null;
    }

    return (
      (this.window['atob'] && JSON.parse(this.window['atob'](value))) || value
    );
  }

  private safeJSONParse(value: string | null) {
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  protected isSupported(token: string) {
    try {
      const key = 'test_supported_token';
      this.window[token].setItem(key, 'test');
      this.window[token].removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends BaseStorageService {
  constructor() {
    super('localStorage');
  }
}

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService extends BaseStorageService {
  constructor() {
    super('sessionStorage');
  }
}
