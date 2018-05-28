# broc - just an experiment

## Build

First, install bower and gulp globally, if you haven't done that yet:

```
npm install -g bower
npm install -g gulp
```

Secondly, install all NodeJS dependencies and Bower dependencies under non-prod Node.js environment:

```
npm install
bower install
```

Then, build the project under Node.js production environment (`NODE_ENV` is `production`):

```
gulp
```

## Run

All files have been compiled into `web/static/` folder. Copy the folder content to any web server and you are good to go:

```
<your-domain>/<your-path>/broc.html
```
