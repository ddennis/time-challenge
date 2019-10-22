
#### My solution

I went down the rabbit hole and spend most of my time focusing on the UI eg.
scrolling , dragging and animation. Which means there properly some performance optimizations and refactoring to be done.npm

The solution is mostly an example on how to handle scheduling in a calendar and not an answer to the scheduling flow we talked about last time.

TypeScript 
Using Typescript became more and more enjoyable along the way. I havent spend alot time with Typescript and not completely sure on best practice on organizing types.

Bugs:
Its tested on pixel 3, iphone 6 and windows laptop on Chrome.
I could imagine there could be some funny scrolling issues using a macbook trackpad. 


##### Libaries used:
CSS framework: ```Bootstrap 4```

Generating array of timeslots from minuts of the day: 
```time-slots-generator```

Animation 
```react-spring```

Gestures (drag, onWheel )
```react-use-gestures```

Utils:
```lodash```

