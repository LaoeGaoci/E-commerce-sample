// src/data/localStorageUtil.ts

/**
 * 将数据保存到 localStorage
 * @param key 存储键
 * @param value 任意可 JSON 序列化的数据
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.error(`保存 localStorage 失败：key=${key}`, e);
  }
};

export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch (e) {
    console.error(`读取 localStorage 失败：key=${key}`, e);
    return null;
  }
};


/**
 * 删除某项 localStorage 数据
 * @param key 存储键
 */
export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`删除 localStorage 失败：key=${key}`, e);
  }
};

/**
 * 清空 localStorage 中的所有数据（慎用）
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('清空 localStorage 失败', e);
  }
};
