
## My solution

I went down the rabbit hole and spend most of my time focusing on the UI eg.
scrolling , dragging and animation. Which means there properly some performance optimizations and refactoring to be done.

Since it's a code challenge i tried to limit the amount of npm modules.
But of course that could have been a different to route, to get further in a shorter amount of time. 

The solution is mostly an example on how to handle scheduling in a calendar and not an answer to the scheduling flow we talked about last time.

#### TypeScript 
Using Typescript became more and more enjoyable along the way. I havent spend alot time with Typescript and not completely sure on best practice on organizing types.

#### Bugs:
Its tested on pixel 3, iphone 6 and windows laptop on Chrome.
I could imagine there could be some funny scrolling issues using a macbook trackpad. 


#### Libaries used:
CSS framework: ```Bootstrap 4```

For measuring components: ```react-measure```

A simple Store solution: ```zustand```

Generating array of timeslots from minuts of the day: 
```time-slots-generator```

Animation 
```react-spring```

Gestures (drag, onWheel )
```react-use-gestures```

Utils:
```lodash```

