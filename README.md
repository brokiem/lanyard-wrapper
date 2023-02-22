# Lanyard Wrapper
Fully-typed Lanyard API wrapper for JavaScript/TypeScript (in browser environment)

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
    const ws = LanyardWrapper.connectWebSocket("USER_ID", (data) => {
        console.log(data);
    })
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

const ws = LanyardWrapper.connectWebSocket("USER_ID", (data) => {
    console.log(data);
})
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

const ws = connectWebSocket("USER_ID", (data) => {
    console.log(data);
})
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