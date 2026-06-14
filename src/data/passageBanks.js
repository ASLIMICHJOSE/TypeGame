// Quote passages for quote mode
export const quotes = [
  "The quick brown fox jumps over the lazy dog near the river bank.",
  "To be or not to be that is the question whether tis nobler in the mind to suffer.",
  "In the beginning was the word and the word was with God and the word was God.",
  "Ask not what your country can do for you ask what you can do for your country.",
  "The only thing we have to fear is fear itself nameless unreasoning unjustified terror.",
  "It was the best of times it was the worst of times it was the age of wisdom.",
  "All that glitters is not gold often have you heard that told many a man his life hath sold.",
  "We shall fight on the beaches we shall fight on the landing grounds we shall never surrender.",
  "Two roads diverged in a wood and I took the one less traveled by and that has made all the difference.",
  "Do not go gentle into that good night old age should burn and rave at close of day rage rage against the dying of the light.",
  "It does not matter how slowly you go as long as you do not stop moving forward in life.",
  "Success is not final failure is not fatal it is the courage to continue that counts always.",
  "The greatest glory in living lies not in never falling but in rising every time we fall.",
  "Spread love everywhere you go let no one ever come to you without leaving happier than before.",
  "When you reach the end of your rope tie a knot in it and hang on for as long as you can.",
];

// Code snippets for code mode
export const codeSnippets = [
  "const sum = (a, b) => a + b;",
  "function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }",
  "const arr = [1, 2, 3].map(x => x * 2).filter(x => x > 2);",
  "async function fetchData(url) { const res = await fetch(url); return res.json(); }",
  "class Stack { constructor() { this.items = []; } push(x) { this.items.push(x); } }",
  "const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };",
  "const flatten = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);",
  "function binarySearch(arr, target) { let lo = 0, hi = arr.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; if (arr[mid] === target) return mid; arr[mid] < target ? lo = mid + 1 : hi = mid - 1; } return -1; }",
  "const memoize = fn => { const cache = {}; return (...args) => { const key = JSON.stringify(args); return cache[key] ?? (cache[key] = fn(...args)); }; };",
  "export default function useDebounce(value, delay) { const [debouncedValue, setDebouncedValue] = useState(value); useEffect(() => { const handler = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(handler); }, [value, delay]); return debouncedValue; }",
];

export default { quotes, codeSnippets };
