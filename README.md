# Lanyard Wrapper
Fully-typed Lanyard API wrapper for JavaScript/TypeScript (in browser environment)
<br><br>
[![npm](https://img.shields.io/npm/v/lanyard-wrapper)](https://www.npmjs.com/package/lanyard-wrapper)
[![npm](https://img.shields.io/npm/dt/lanyard-wrapper)](https://www.npmjs.com/package/lanyard-wrapper)

Looking for Node.js? Check out [node-lanyard-wrapper](https://github.com/brokiem/node-lanyard-wrapper)

## Installation
### NPM
```bash
npm i lanyard-wrapper
```
### Yarn
```bash
yarn add lanyard-wrapper
```
## CDN
```html
<script src="https://cdn.jsdelivr.net/npm/lanyard-wrapper/dist/index.browser.js"></script>
```

## Usage

### Browser
#### Connecting with WebSocket
```html
<script src="https://cdn.jsdelivr.net/npm/lanyard-wrapper/dist/index.browser.js"></script>

<script type="text/javascript">
    function onUpdate(data) {
        // data is a Lanyard data object
        console.log(data);
    }

    function onError(err) {
        // err is an error object
        console.error(err);
    }
    
    const ws = LanyardWrapper.connectWebSocket("USER_ID", onUpdate, onError);
</script>
```

#### OR Using the REST API
```html
<script src="https://cdn.jsdelivr.net/npm/lanyard-wrapper/dist/index.browser.js"></script>

<script type="text/javascript">
    LanyardWrapper.fetchUserData("USER_ID")
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error(err);
            });

    LanyardWrapper.fetchUserDataForMultipleUsers(["USER_ID_1", "USER_ID_2"])
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error(err);
            });
</script>
```

### CommonJS
#### Connecting with WebSocket
```js
const LanyardWrapper = require("lanyard-wrapper");

function onUpdate(data) {
    // data is a Lanyard data object
    console.log(data);
}

function onError(err) {
    // err is an error object
    console.error(err);
}

const ws = LanyardWrapper.connectWebSocket("USER_ID", onUpdate, onError);
```

#### OR Using the REST API
```js
const LanyardWrapper = require("lanyard-wrapper");

LanyardWrapper.fetchUserData("USER_ID")
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });

LanyardWrapper.fetchUserDataForMultipleUsers(["USER_ID_1", "USER_ID_2"])
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
```

### ES Modules / TypeScript
#### Connecting with WebSocket
```ts
import { connectWebSocket } from "lanyard-wrapper";

function onUpdate(data) {
    // data is a Lanyard data object
    console.log(data);
}

function onError(err) {
    // err is an error object
    console.error(err);
}

const ws = connectWebSocket("USER_ID", onUpdate, onError);
```

#### OR Using the REST API
```ts
import { fetchUserData, fetchUserDataForMultipleUsers } from "lanyard-wrapper";

fetchUserData("USER_ID")
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
    
fetchUserDataForMultipleUsers(["USER_ID_1", "USER_ID_2"])
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
```

## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)
