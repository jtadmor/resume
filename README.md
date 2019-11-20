# Resume Builder

### How To
1. `yarn`
2. Make changes to `resume.json`
3. `yarn run test` to see how it looks in HTML.
4. `yarn run pdf [path/to/output.pdf]` to generate the PDF using chrome.

### Customization
The `templates/` folder contains the scaffolded templates. The `build.js` script inserts the data from `resume.json` using the following rules:

#### HTML
`build.js` will recursively walk though each `{ [key]: [content] }` in `resume.json` and will make changes to the DOM, using the HTML template.

Changes are scoped to a parent container (defaults to `document.body` for top level keys) based on the key and type of content.

**Strings**
The parent `innerHTML` will replace `_key` with `content`. This means you can use `content` to define HTML attributes (e.g. `a.href`, `img.src`).

If no `_key` is found, the parent container has `textContent` set to `content`. This is a useful shorthand for lists of strings.

**Objects**
A container must be defined by `data-container="key"`. The object keys are iterated over, using this container as the parent.

**Arrays**
A template must be defined using `data-template="key"`. This template is then treated as the parent, and the list of data is iterated over, inserting a new copy of the template that is manipulated according to the above rules.

The template is automatically removed after the iteration.

*Note: To include HTML items only when content is non-empty, use `data-if="key"`.*

#### Markdown
`build.js` will recursively walk though each `{ [key]: [content] }` in `resume.json` and will append to the string based on the Markdown template.

**Strings**
`$key` will be be replaced with `content`

**Objects**
The keys will be iterated over.

**Arrays**
Use `{#each key}...{/each key}` syntax, placing a template inside. The list of data is iterated over, inserting a new copy of this template based on the above rules.
If each entry is an object, use use `$subkey1`, `$subkey2` within the `{each}` block.
If each entry is a string, use `$key`.

*Note: To include markdown items only when content is non-empty, use `{#if key}...{/if key}`.*
