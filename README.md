# handlebars-to-html

Generate static html files from handlebars templates.

**Note:** `cwd` is the base project path.

### Sample folder structure:

> - cwd/src/views
> |_`layouts`
> |_`partials`
> |__`blog`
> |___`post.hbs`
> |_`templates`
> |__`index.hbs`

**Note:** /templates should always contain an index.hbs file.

#### Sample layout:

```
<!-- cwd/views/layouts/base -->
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" prefix="og: http://ogp.me/ns#">
  <head>
    <title>Title</title>
  </head>
  <link type="text/css" href="/styles/main.css" rel="stylesheet">
  <body>
  {{> @partial-block }}
  </body>
</html>
```

#### Sample index template:

```
<!-- cwd/views/templates/index.hbs -->
{{#> base}}
  {{> blog/post}}
{{/base}}
```

### Building:

Run:

`node build/build.js -d cwd -p "src/views/partials/**/*.hbs" -l "src/views/layouts/**/*.hbs" -t "src/views/templates/**/*.hbs" -v`

from the command line, given the default parameters in `index.js`. This outputs `.html` files to the `cwd` in the same folder structure as your compiled `src/views/templates` folder.
