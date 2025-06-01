import { config } from "../config/constants";
import { pinyin } from 'pinyin-pro';

const include = (text, searchBox, usePinyin = false) => {
  if (!text) return false;
  if (!searchBox) return true;

  const lowerText = text.toLowerCase();
  const lowerSearchBox = searchBox.toLowerCase();

  if (lowerText.includes(lowerSearchBox)) {
    return true;
  }

  if (usePinyin) {
    const pinyinText = pinyin(text, { toneType: 'none', type: 'string' }).toLowerCase();
    const pinyinTextWithoutSpaces = pinyinText.replace(/\s+/g, '');

    if (pinyinTextWithoutSpaces.includes(lowerSearchBox)) {
      return true;
    }

    const chineseText = text.replace(/[^\u4e00-\u9fa5]/g, '');
    const initials = pinyin(chineseText, { pattern: 'first', toneType: 'none', type: 'string' }).toLowerCase();
    const initialsWithoutSpaces = initials.replace(/\s+/g, '');

    if (initialsWithoutSpaces.startsWith(lowerSearchBox)) {
      return true;
    }

    const chinesePart = lowerSearchBox.replace(/[^\u4e00-\u9fa5]/g, '');
    const pinyinPart = lowerSearchBox.replace(/[\u4e00-\u9fa5]/g, '');

    if (chinesePart && !lowerText.includes(chinesePart)) {
      return false;
    }

    if (pinyinPart && !pinyinTextWithoutSpaces.includes(pinyinPart)) {
      return false;
    }

    if (chinesePart && pinyinPart) {
      const chinesePinyin = pinyin(chinesePart, { toneType: 'none', type: 'string' }).toLowerCase();
      const chinesePinyinWithoutSpaces = chinesePinyin.replace(/\s+/g, '');

      if (!pinyinTextWithoutSpaces.includes(chinesePinyinWithoutSpaces + pinyinPart)) {
        return false;
      }
    }

    return true;
  }

  return false;
};

const getCursor = () => {
  return config.Cursor ? 'url("./assets/cursor/pointer.png"), pointer' : '';
};

module.exports = { include, getCursor };