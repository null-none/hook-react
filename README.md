# reactjs-use-hooks
React custom hooks

## Installation

```bash
npm install hook-react
```
or
```bash
yarn add hook-react
```

## Hooks
- useMemoCompare
- useRouter
- useEventListener
- useWhyDidYouUpdate
- useKeyPress
- useOnScreen
- usePrevious
- useWindowSize
- useHover
- useLocalStorage
- useInterval
- useTimeout
- useDebounce
- useBreakpoint

## Examples

```javascript
import { useLocalStorage, useWindowSize  } from 'hook-react';

const [name, setName] = useLocalStorage('name', 'Bob');
const size = useWindowSize();
...
```


## License
MIT

## Donation Button

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YYZQ6ZRZ3EW5C)
