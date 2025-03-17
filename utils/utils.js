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
		pinyinText = pinyinText.replace(/\s+/g, '');

    if (pinyinText.includes(lowerSearchBox)) {
      return true;
    }

		const chineseText = text.replace(/[^\u4e00-\u9fa5]/g, '');
		const initials = pinyin(chineseText, { pattern: 'first', toneType: 'none', type: 'string' }).toLowerCase();
		initials = initials.replace(/\s+/g, '');

    if (initials.startsWith(lowerSearchBox)) {
      return true;
    }
  }

  return false;
}

const getCursor = () => {
  return config.Cursor ? 'url("./assets/cursor/pointer.png"), pointer' : ''
}

module.exports = { include, getCursor };
