// Allow importing image assets in TypeScript
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

// Minimal JSX namespace fallback if React types aren't installed yet
// If @types/react is installed this will be redundant and can be removed.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
