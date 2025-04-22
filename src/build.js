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

    const localStorage = window.localStorage

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

    sidebar.innerHTML = `<p class="title">${config.favicon ? `<img src="${config.favicon}" class="title-icon">` : ''}<strong>${title}</strong></p>${sidebar.innerHTML}`

    const searchParams = new URLSearchParams(window.location.search)

    const hasDocParam = searchParams.has('doc')
    const docPath = config.docsPath ?? 'docs/'

    let foundDoc = false

    if(config.primary_color) {
        document.documentElement.style.setProperty('--primary-color', config.primary_color)
    }
    if(config.text_color) {
        document.documentElement.style.setProperty('--text-color', config.text_color)
    }

    const sidebarStyles = sidebarConfig.styles
    const sidebarOtherStyles = sidebarConfig.otherThemeStyles
    const sidebarNav = sidebarConfig.nav

    const themeSettings = config?.styleSettings

    const defaultTheme = themeSettings?.defaultTheme
    const otherTheme = themeSettings?.otherTheme

    if(sidebarStyles) {
        for(const s in sidebarStyles) {
            document.documentElement.style.setProperty(`--${s}`, sidebarStyles[s])
        }
    }
    if(sidebarNav) {
        for(const n of sidebarNav) {

            if(n?.type == 'label') {
                const item = document.createElement('p')
                item.textContent = n.label
                item.classList.add('sidebar-label')
                sidebar.appendChild(item)

                continue
            }

            const url = new URL(window.location.href)

            const nPath = n.path ?? n.label.toLowerCase()

            const searchParam = new URLSearchParams()
            searchParam.set('doc', encodeURIComponent(nPath))

            url.search = searchParam.toString()

            const item = document.createElement("a")
            item.innerHTML = n.label

            item.href = url
            item.title = n.label

            if(hasDocParam) {
                if(decodeURIComponent(searchParams.get("doc")) == nPath) {
                    item.classList.add("selected")
                }
            } else {
                if(config.defaultPage) {
                    if(config.defaultPage == n?.file) {
                        item.classList.add("selected")
                    }
                }
            }

            sidebar.appendChild(item)
        }
    }

    function switchTheme() {
        if(localStorage.getItem('theme') == 'other') {
            localStorage.setItem('theme', 'default')

            if(sidebarStyles) {
                for(const s in sidebarStyles) {
                    document.documentElement.style.setProperty(`--${s}`, sidebarStyles[s])
                }
            }
            if(defaultTheme) {
                for(const s in defaultTheme) {
                    document.documentElement.style.setProperty(`--${s}`, defaultTheme[s])
                }
            }
        } else {
            localStorage.setItem('theme', 'other')
            if(sidebarOtherStyles) {
                for(const s in sidebarOtherStyles) {
                    document.documentElement.style.setProperty(`--${s}`, sidebarOtherStyles[s])
                }
            }
            if(otherTheme) {
                for(const s in otherTheme) {
                    document.documentElement.style.setProperty(`--${s}`, otherTheme[s])
                }
            }
        }
    }

    if(localStorage.getItem('theme') == 'other') {
        for(const el of document.querySelectorAll('*')) {
            el.style.transition = 'none'
        }
        if(sidebarOtherStyles) {
            for(const s in sidebarOtherStyles) {
                document.documentElement.style.setProperty(`--${s}`, sidebarOtherStyles[s])
            }
        }
        if(otherTheme) {
            for(const s in otherTheme) {
                document.documentElement.style.setProperty(`--${s}`, otherTheme[s])
            }
        }
        setTimeout(() => {
            for(const el of document.querySelectorAll('*')) {
                el.style.transition = 'all ease 0.5s'
            }
        }, 500);
    }

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

    const iconContainer = document.createElement('span')
    iconContainer.classList.add('icons-container')
    sidebar.appendChild(iconContainer)

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('button-container')
    sidebar.appendChild(buttonContainer)

    if(config['gh-repository']) {
        const ghLink = document.createElement("a")
        ghLink.href = config['gh-repository']
        ghLink.innerHTML = await readFile('assets/github.svg')
        ghLink.classList.add('gh-icon')
        ghLink.title = 'GitHub Repository'
        iconContainer.appendChild(ghLink)
    }

    if(sidebarConfig['otherThemeStyles']) {
        const themeButton = document.createElement('button')
        themeButton.textContent = 'Switch Theme'
        buttonContainer.appendChild(themeButton)

        buttonContainer.addEventListener('click', () => {
            switchTheme()
        })
    }

    if(config.favicon) {
        const f = document.createElement('link')
        f.rel = 'shortcut icon',
        f.href = config.favicon
        f.type = 'image/x-icon'
        document.head.appendChild(f)
    }
}

setup()