# Lanyard Wrapper
Fully-typed Lanyard API wrapper for JavaScript/TypeScript (in browser environment)
<br><br>
[![npm](https://img.shields.io/npm/v/lanyard-wrapper)](https://www.npmjs.com/package/lanyard-wrapper)
[![npm](https://img.shields.io/npm/dt/lanyard-wrapper)](https://www.npmjs.com/package/lanyard-wrapper)

Looking for Node.js version? Check out [node-lanyard-wrapper](https://github.com/brokiem/node-lanyard-wrapper)

## Features
- Fully-typed
- Supports WebSocket connection
- Supports REST API
- Supports managing Lanyard KV

## Installation
#### NPM
```bash
npm i lanyard-wrapper
```
#### Yarn
```bash
yarn add lanyard-wrapper
```
#### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/lanyard-wrapper/dist/index.browser.js"></script>
```

## Usage

Check out [Lanyard API Documentation](https://brokiem.is-a.dev/lanyard-wrapper/) for more information about the data object.

### Browser
#### Connecting with WebSocket
```html
<script src="https://cdn.jsdelivr.net/npm/lanyard-wrapper/dist/index.browser.js"></script>

<script type="text/javascript">
    function onUpdate(data) {
        // data is a Lanyard data object
        console.log(data);
    }

    LanyardWrapper.connectWebSocket("USER_ID", onUpdate)
            .then(ws => {
                // ws is a WebSocket object
                console.log(ws);
            })
            .catch(err => {
                console.error(err);
            });
</script>
```
<br>

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

### CommonJS / ES Modules / TypeScript
#### Connecting with WebSocket
```ts
// Use require() if you are using CommonJS
const LanyardWrapper = require("lanyard-wrapper");

// Use import if you are using ES Modules
import { connectWebSocket } from "lanyard-wrapper";

function onUpdate(data) {
    // data is a Lanyard data object
    console.log(data);
}

connectWebSocket("USER_ID", onUpdate)
    .then(ws => {
        // ws is a WebSocket object
        console.log(ws);
    })
    .catch(err => {
        console.error(err);
    });
```
<br>

#### OR Using the REST API
```ts
// Use require() if you are using CommonJS
const LanyardWrapper = require("lanyard-wrapper");

// Use import if you are using ES Modules
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
