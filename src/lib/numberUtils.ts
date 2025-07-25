// Utility functions for number formatting with Arabic-Indic numerals

// Convert English/Persian numbers to Arabic-Indic numerals
export const toArabicIndic = (input: string | number): string => {
  const str = input.toString()
  const arabicIndicMap: { [key: string]: string } = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    // Persian numerals
    '۰': '٠',
    '۱': '١',
    '۲': '٢',
    '۳': '٣',
    '۴': '٤',
    '۵': '٥',
    '۶': '٦',
    '۷': '٧',
    '۸': '٨',
    '۹': '٩'
  }
  
  return str.replace(/[0-9۰-۹]/g, (match) => arabicIndicMap[match] || match)
}

// Format date with Arabic-Indic numerals (Gregorian calendar) - D/M/YYYY format (no leading zeros)
export const formatDateArabicIndic = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const day = dateObj.getDate()
  const month = dateObj.getMonth() + 1
  const year = dateObj.getFullYear()
  const formatted = `${day}/${month}/${year}`
  return toArabicIndic(formatted)
}

// Format number with thousands separator using Arabic-Indic numerals
export const formatNumberArabicIndic = (num: number): string => {
  const formatted = num.toLocaleString('en-US')
  return toArabicIndic(formatted)
}