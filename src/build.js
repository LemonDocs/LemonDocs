/*

/======================================================\
|                                                      |
|    DO NOT MODIFY!                                    |
|    ONLY MODIFY IF YOU'RE WORKING ON AN UPDATE.       |
|                                                      |
|    Licensed under Apache 2.0.                        |
|                                                      |
\======================================================/

*/

import { marked } from '../packages/marked.esm.js'
import purify from '../packages/dompurify.esm.js'
import config from '../configs/config.js'
import sidebarConfig from '../configs/sidebar.js'

const content = document.getElementById("content")
const sidebar = document.getElementById("sidebar")

const title = config.title ?? 'Documentation'

async function setup() {
    /**
     * @param {string} path 
     */
    async function readFile(path) {
        try {
            const response = await fetch(path)
            if(!response.ok) {
                throw new Error(`File not found: ${path}`)
            }
            return await response.text()
        } catch(e) {
            console.error(e)
            return '# Something went wrong while loading file!'
        }
    }

    async function fileExists(path) {
        try {
            const response = await fetch(path, {method: 'HEAD'})
            return response.ok
        } catch(e) {
            return false
        }
    }

    if(config.primary_color) {
        document.documentElement.style.setProperty('--primary-color', config.primary_color)
    }
    if(config.text_color) {
        document.documentElement.style.setProperty('--text-color', config.text_color)
    }

    const sidebarStyles = sidebarConfig.styles
    const sidebarNav = sidebarConfig.nav

    if(sidebarStyles) {
        for(const s in sidebarStyles) {
            document.documentElement.style.setProperty(`--${s}`, sidebarStyles[s])
        }
    }
    if(sidebarNav) {
        for(const n of sidebarNav) {

            const url = new URL(window.location.href)

            const searchParam = new URLSearchParams()
            searchParam.set('doc', n.path ?? n.label.toLowerCase())

            url.search = searchParam.toString()

            const item = document.createElement("a")
            item.innerHTML = n.label

            item.href = url

            sidebar.appendChild(item)
        }
    }

    sidebar.innerHTML = `<p class="title"><strong>${title}</strong></p>${sidebar.innerHTML}`

    const searchParams = new URLSearchParams(window.location.search)

    const hasDocParam = searchParams.has('doc')
    const docPath = `${config.docsPath ?? 'docs/'}`

    let foundDoc = false

    for(const n of config.nav) {
        const file = n.file
        const label = n.label

        if(hasDocParam) {
            const param = searchParams.get('doc')
            if(decodeURIComponent(param) == label.toLowerCase()) {
                document.title = `${label} | ${title}`
                content.innerHTML = purify.sanitize(marked.parse(await readFile(`${docPath}${file}`)))
                foundDoc = true
                break
            }
        }
        if(config.defaultPage) {
            if(!hasDocParam && file == config.defaultPage) {
                document.title = `${label} | ${title}`
                content.innerHTML = purify.sanitize(marked.parse(await readFile(`${docPath}${file}`)))
                foundDoc = true
                break
            }
        }
    }

    if(!foundDoc) {
        console.log("The first 404 Error when the page isn't found is unavoidable.")
        if(await fileExists(`${docPath}404.md`)) {
            content.innerHTML = purify.sanitize(marked.parse(await readFile(`${docPath}404.md`)))
        } else {
            content.innerHTML = '<div align="center"><h2>The page you\'re looking for doesn\'t exist.</h2><h1 style="opacity: 10%; user-select: none;">404</h1></div>'
        }
    }

    Prism.highlightAll()
}

setup()