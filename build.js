"use strict"
const fs = require('fs')
const { JSDOM } = require('jsdom')

// Grab data and temapltes, create the DOM
const RESUME = require('./resume')
const BASE_HTML = fs.readFileSync('./templates/resume.html', 'utf-8')
let MARKDOWN = fs.readFileSync('./templates/RESUME.md', 'utf-8')
const { document } = new JSDOM(BASE_HTML).window


// Add everything
Object.keys(RESUME).forEach(content_key => {
  const content = RESUME[content_key]

  addHtml(content_key, content)
  MARKDOWN = addReadme(content_key, content, MARKDOWN)
})

// Write out
fs.writeFileSync('resume.html', document.documentElement.outerHTML)
fs.writeFileSync('RESUME.md', MARKDOWN)


// HELPERS
function addHtml(content_key, content) {
  const container = document.querySelector(`.${content_key}`)

  if (!container) {
    throw new Error(`No DOM container found for ${content_key}`)
  }

  addContentToContainer(container, content_key, content)
}

function addContentToContainer(container, content_key, content) {
  if (typeof content === 'string') {
    container.textContent = content
  } else if (Array.isArray(content)) {
    /*
      For lists, there should be a scaffold component as the first child of the container.
      It should have properties that are equivalent to the keys of the object, to let us know where those values go.
      We remove the scaffold, iterate over the content array,
      and insert.
    */
    let template = container.firstChild

    while (template && !template.tagName) {
      template = template.nextSibling
    }

    if (!template) {
      throw new Error(`No DOM template found for ${content_key} where the content is complex`)
    }

    content.forEach(item => {
      const clone = template.cloneNode()
      clone.innerHTML = template.innerHTML

      addContentToContainer(clone, content_key, item)

      container.appendChild(clone)
    })

    container.removeChild(template)
  } else {
    Object.keys(content).forEach(key => {
      const value = content[key]

      if (typeof value === 'string') {
        container.innerHTML = container.innerHTML.replace(`_${key}`, value)
      } else {
        const sub_container = container.querySelector(`.${key}`)
        addContentToContainer(sub_container, key, value)
      }
    })
  }
}

function addReadme(content_key, content, str) {
  if (typeof content === 'string') {
    return str.replace(`_${content_key}`, content)
  } else if (Array.isArray(content)) {
    const reg_str = `{#each ${content_key}}\n((.|\n|\r)+)(?={\/each ${content_key}){\/each ${content_key}}`
    const reg = new RegExp(reg_str)
    return str.replace(reg, (m, capture) => (
      content
        .map(item => addReadme(content_key, item, capture))
        .join('\n')
    ))
  } else {
    Object.keys(content).forEach(key => {
      str = addReadme(key, content[key], str)
    })

    return str
  }
}
