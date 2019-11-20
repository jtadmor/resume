"use strict"
const fs = require('fs')
const { JSDOM } = require('jsdom')
const {
  isEmptyContent,
  findConditionalEls,
  findTemplateEl,
  findContainerEl
} = require('./helpers')

// Grab data and templates, create the DOM
const RESUME = require('./resume')
const BASE_HTML = fs.readFileSync('./templates/resume.html', 'utf-8')
let MARKDOWN = fs.readFileSync('./templates/RESUME.md', 'utf-8')
const { document } = new JSDOM(BASE_HTML).window

// Add everything
Object.keys(RESUME).forEach(content_key => {
  const content = RESUME[content_key]

  addHtml(content_key, content, document.body)
  MARKDOWN = addReadme(content_key, content, MARKDOWN)
})

// Write out
fs.writeFileSync('resume.html', '<!DOCTYPE html>\n' + document.documentElement.outerHTML)
fs.writeFileSync('RESUME.md', MARKDOWN)


function addHtml(key, content, parent) {
  // Remove all DOM elements with data-if="key" when content is empty
  if (isEmptyContent(content)) {
    findConditionalEls(key, parent).forEach(el => {
      el.parentNode.removeChild(el)
    })

    return
  }

  if (typeof content === 'string') {
    if (parent.innerHTML.match(`_${key}`)) {
      parent.innerHTML = parent.innerHTML.replace(`_${key}`, content)
    } else {
      parent.textContent = content
    }
  } else if (Array.isArray(content)) {
    /*
      For lists, there should be a scaffold component as the first child of the container.
      It should have properties that are equivalent to the keys of the object, to let us know where those values go.
      We remove the scaffold, iterate over the content array,
      and insert.
    */
    const template = findTemplateEl(key, parent)

    const clones = content.map(item => {
      const clone = template.cloneNode()
      clone.innerHTML = template.innerHTML

      addHtml(key, item, clone)

      return clone
    })

    template.after(...clones)
    template.parentNode.removeChild(template)
  } else {
    const container = findContainerEl(key, parent)

    Object.keys(content).forEach(k => {
      addHtml(k, content[k], container)
    })
  }
}

function addReadme(key, content, str) {
  if (str.match(`{#if ${key}}`)) {
    if (isEmptyContent(content)) {
      const reg_str = `{#if ${key}}\n((.|\n|\r)+)(?={\/if ${key}){\/if ${key}}\n`
      const reg = new RegExp(reg_str, 'g')
      str = str.replace(reg, '')
    } else {
      const reg_str = `({#if ${key}}\n|{/if ${key}}\n)`
      const reg = new RegExp(reg_str, 'g')
      str = str.replace(reg, '')
    }
  }

  if (typeof content === 'string') {
    return str.replace(`$${key}`, content)
  } else if (Array.isArray(content)) {
    const reg_str = `{#each ${key}}\n((.|\n|\r)+)(?={\/each ${key}){\/each ${key}}`
    const reg = new RegExp(reg_str)
    return str.replace(reg, (m, capture) => (
      content
        .map(item => addReadme(key, item, capture))
        .join('\n')
    ))
  } else {
    Object.keys(content).forEach(k => {
      str = addReadme(k, content[k], str)
    })

    return str
  }
}
