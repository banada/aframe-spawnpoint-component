## aframe-spawnpoint-component

[![Version](http://img.shields.io/npm/v/aframe-spawnpoint-component.svg?style=flat-square)](https://npmjs.org/package/aframe-spawnpoint-component)
[![License](http://img.shields.io/npm/l/aframe-spawnpoint-component.svg?style=flat-square)](https://npmjs.org/package/aframe-spawnpoint-component)

Spawn A-Frame entities from a point.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-spawnpoint-component/dist/aframe-spawnpoint-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity spawnpoint="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-spawnpoint-component
```

Then require and use.

```js
require('aframe');
require('aframe-spawnpoint-component');
```
