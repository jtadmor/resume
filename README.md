<p><a target="_blank" href="https://eraser-qa.web.app/workspace/lFeLo2JGVZcGAFkilxws" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

# Resume Builder
### How To
1. `yarn` 
2. Make changes to `resume.json` 
3. `yarn run test`  to see how it looks in HTML.
4. `yarn run pdf [path/to/output.pdf]`  to generate the PDF using chrome.
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

_Note: To include HTML items only when content is non-empty, use _`_data-if="key"_`_._

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

_Note: To include markdown items only when content is non-empty, use _`_{#if key}...{/if key}_`_._


<!--- Eraser file: https://eraser-qa.web.app/workspace/lFeLo2JGVZcGAFkilxws --->
<!--- This file was last edited by [name] via Eraser on [date] --->