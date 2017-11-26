# Premi-um
> Develop monolithic web application with `express` and `VueJs` in view with Webpack Configuration. 

- First checkout project

```bash
cd ~/your/path/
git clone https://github.com/chungth/premium-pilot.git
```

- Install Project

```bash
cd ~/your/path/
npm install
```

- Bundle assets file(`js`, `css`, image)

```bash
npm run build:js
```

- Or watch mode when developing

```bash
npm run watch:js
```

- Start express project

```bash
npm start
```

- Goto browser, access `localhost:3000`, you will know see Hello Vue Page same as example on VueJs HomePage

- To create database and create fake data into database: go to populatedb.js file, edit dbUrl variable to suitable with your database url
and then run populatedb.js file by command line: node populatedb