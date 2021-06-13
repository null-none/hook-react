# reactjs-use-hooks
React custom hooks

## Installation

```bash
npm install reactjs-use-hooks
```
or
```bash
yarn add reactjs-use-hooks
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

## Examples

```javascript
import { hooks } from 'reactjs-custom-hooks';

const [name, setName] = hooks.useLocalStorage('name', 'Bob');
const size = hooks.useWindowSize();
```


## License
MIT

## Donation Button

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YYZQ6ZRZ3EW5C)
