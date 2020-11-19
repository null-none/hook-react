import { useState, useEffect, useRef, useMemo } from "react";
import {
  useParams,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import queryString from "query-string";

exports.hooks = {
  /*
    // Use the previous obj value if the "id" property hasn't changed
    const objFinal = useMemoCompare(obj, (prev, next) => {
        return prev && prev.id === next.id;
    });
  */
  useMemoCompare: function (next, compare) {
    // Ref for storing previous value
    const previousRef = useRef();
    const previous = previousRef.current;

    // Pass previous and next value to compare function
    // to determine whether to consider them equal.
    const isEqual = compare(previous, next);

    // If not equal update previousRef to next value.
    // We only update if not equal so that this hook continues to return
    // the same old value if compare keeps returning true.
    useEffect(() => {
      if (!isEqual) {
        previousRef.current = next;
      }
    });

    // Finally, if equal then return the previous value
    return isEqual ? previous : next;
  },
  /*
  // Get the router object
  const router = useRouter();

  // Get value from query string (?postId=123) or route param (/:postId)
  console.log(router.query.postId);

  // Get current pathname
  console.log(router.pathname)
  */
  useRouter: function () {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    // Return our custom router object
    // Memoize so that a new object is only returned if something changes
    return useMemo(() => {
      return {
        // For convenience add push(), replace(), pathname at top level
        push: history.push,
        replace: history.replace,
        pathname: location.pathname,
        // Merge params and parsed query string into single "query" object
        // so that they can be used interchangeably.
        // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
        query: {
          ...queryString.parse(location.search), // Convert string to object
          ...params,
        },
        // Include match, location, history objects so we have
        // access to extra React Router functionality if needed.
        match,
        location,
        history,
      };
    }, [params, match, location, history]);
  },
  // useEventListener('mousemove', handler);
  useEventListener: function (eventName, handler, element = window) {
    // Create a ref that stores handler
    const savedHandler = useRef();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);

    useEffect(
      () => {
        // Make sure element supports addEventListener
        // On
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        // Create event listener that calls handler function stored in ref
        const eventListener = (event) => savedHandler.current(event);

        // Add event listener
        element.addEventListener(eventName, eventListener);

        // Remove event listener on cleanup
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
      },
      [eventName, element] // Re-run if eventName or element changes
    );
  },
  // useWhyDidYouUpdate('Counter', props);
  useWhyDidYouUpdate: function (name, props) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = useRef();

    useEffect(() => {
      if (previousProps.current) {
        // Get all keys from previous and current props
        const allKeys = Object.keys({ ...previousProps.current, ...props });
        // Use this object to keep track of changed props
        const changesObj = {};
        // Iterate through keys
        allKeys.forEach((key) => {
          // If previous is different from current
          if (previousProps.current[key] !== props[key]) {
            // Add to changesObj
            changesObj[key] = {
              from: previousProps.current[key],
              to: props[key],
            };
          }
        });

        // If changesObj not empty then output to console
        if (Object.keys(changesObj).length) {
          console.log("[why-did-you-update]", name, changesObj);
        }
      }

      // Finally update previousProps with current props for next hook call
      previousProps.current = props;
    });
  },
  //  const happyPress = useKeyPress('h');
  useKeyPress: function (targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    // Add event listeners
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
  },
  /*
    // Ref for the element that we want to detect whether on screen
    const ref = useRef();
    // Call the hook passing in ref and root margin
    // In this case it would only be considered onScreen if more ...
    // ... than 300px of element is visible.
    const onScreen = useOnScreen(ref, '-300px');
  */
  useOnScreen: function(ref, rootMargin = '0px') {
    // State and setter for storing whether element is visible
    const [isIntersecting, setIntersecting] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update our state when observer callback fires
          setIntersecting(entry.isIntersecting);
        },
        {
          rootMargin
        }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => {
        observer.unobserve(ref.current);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
  
    return isIntersecting;
  },
  /*
  // State value and setter for our example
  const [count, setCount] = useState(0);
  
  // Get the previous value (was passed into hook on last render)
  const prevCount = usePrevious(count);
  */
  usePrevious: function(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  },
  // const size = useWindowSize();
  useWindowSize: function() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
  
    return windowSize;
  },
  /*
  const [hoverRef, isHovered] = useHover();

  return (
    <div ref={hoverRef}>
      {isHovered ? '😁' : '☹️'}
    </div>
  );
  */
  useHover: function() {
    const [value, setValue] = useState(false);
  
    const ref = useRef(null);
  
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);
  
    useEffect(
      () => {
        const node = ref.current;
        if (node) {
          node.addEventListener('mouseover', handleMouseOver);
          node.addEventListener('mouseout', handleMouseOut);
  
          return () => {
            node.removeEventListener('mouseover', handleMouseOver);
            node.removeEventListener('mouseout', handleMouseOut);
          };
        }
      },
      [ref.current] // Recall only if ref changes
    );
  
    return [ref, value];
  },
  // const [name, setName] = useLocalStorage('name', 'Bob');
  useLocalStorage: function(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
  
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
  
    return [storedValue, setValue];
  }
};
