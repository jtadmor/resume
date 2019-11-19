# Resume Builder

### How To
1. `yarn`
2. Make changes to `resume.json`
3. `yarn run test` to see how it looks in HTML.
4. `yarn run pdf [path/to/output.pdf]` to generate the PDF using chrome.

### Customization
The `templates/` folder contains the scaffolded templates. The `build.js` script inserts the data from `resume.json` using the following rules:

#### HTML
For each recursive `key -> value` in `resume.json`:
The key must directly match a class on some element, this is then used as the container.
If `value` is a string, it is will be inserted as the `textContent` of that element.
If `value` is an object, the `innerHTML` will replace `_${key}` with `value`. This means you can use values for attribute values (this is helpful for `href`, image sources, etc) or for text content.

For repeated data (represented as arrays), the first child of the container is treated as a template, and is used as the "container" in the above logic. A new container is created and inserted for each element of the array.

#### Markdown
For each recursive `key -> value` in `resume.json`:
If `value` is a string, it will be inserted where the first instance of `_${key}` is found.
This means you should use

For repeated data, `{#each key}...{/each}` syntax is used.
If each entry is an object, you can use `_subkey1`, `_subkey2` within the `{each}` block.
If each entry is a string, simply use `_key`.
Note that these can be nested, see the example of `bullets` in `work-experience`.
