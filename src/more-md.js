const contentDiv = document.getElementById('content')

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if(mutation.type == 'childList') {
            for(const node of mutation.addedNodes) {
                if(node instanceof HTMLDivElement) {
                    if(node.classList.contains('div-graph')) {
                        try {
                            const graphContainer = document.createElement('div')
                            graphContainer.classList.add('graph-container')
    
                            const graph = document.createElement('div')
                            const graphLabels = document.createElement('span')
                            graph.classList.add('graph')
                            graphLabels.classList.add('graph-labels')
                            
                            const data = JSON.parse(node.textContent)
    
                            if(Array.isArray(data)) {
                                const values = data.map((v) => v.value)
                                for(const dataItem of data) {
                                    const item = document.createElement('div')
                                    item.classList.add('graph-item')
                                    item.setAttribute('data-value', dataItem.value)
                                    item.style.height = `${((dataItem.value * 2) / Math.max(...values)) + 1.5}rem`
                                    graph.appendChild(item)
                                    const itemLabel = document.createElement('p')
                                    itemLabel.classList.add('graph-label')
                                    itemLabel.textContent = dataItem.item
                                    graphLabels.appendChild(itemLabel)
                                }
                            }
    
                            graphContainer.appendChild(graph)
                            graphContainer.appendChild(graphLabels)
    
                            node.replaceWith(graphContainer)
                        } catch(e) {}
                    }
                } else if(node instanceof HTMLParagraphElement) {
                    if(node.textContent == ':::tabs') {
                        const wrapper = document.createElement('div')
                        wrapper.classList.add('tab-wrapper')

                        const tabHeaders = document.createElement('span')
                        tabHeaders.classList.add('tab-headers')

                        const tabContents = document.createElement('div')
                        tabContents.classList.add('tab-contents')

                        let n = node.nextElementSibling;
                        let currentTab
                        const nodesToRemove = []
                        const tabPairs = []

                        while(n && n.textContent !== ':::') {
                            const next = n.nextElementSibling

                            if(n.textContent.startsWith("@tab ")) {
                                currentTab = document.createElement("div")
                                currentTab.classList.add("tab-content")

                                const tabName = n.textContent.replace("@tab ", "").trim()

                                const button = document.createElement("button")
                                button.textContent = tabName
                                button.classList.add("tab-button")

                                currentTab.classList.add('inactive-content')

                                tabPairs.push({ button, content: currentTab})

                                tabHeaders.appendChild(button)
                                tabContents.appendChild(currentTab)
                                nodesToRemove.push(n)
                            } else if(currentTab) {
                                currentTab.appendChild(n.cloneNode(true))
                                nodesToRemove.push(n)
                            }

                            n = next
                        }

                        wrapper.appendChild(tabHeaders)
                        wrapper.appendChild(tabContents)

                        nodesToRemove.forEach(nod => nod.remove())
                        if(n) n.remove()

                        node.replaceWith(wrapper)

                            tabPairs.forEach(({button, content}) => {
                                button.onclick = () => {
                                    console.log(button.textContent)
                                    wrapper.querySelectorAll('.tab-content').forEach(c => {
                                        c.classList.add('inactive-content')
                                    })
    
                                    wrapper.querySelectorAll('.tab-button').forEach(b => {
                                        b.classList.remove('active-btn')
                                    })
    
                                    content.classList.remove('inactive-content')
                                    button.classList.add('active-btn')
                                }
                            })

                        if(tabPairs.length > 0) {
                            tabPairs[0].button.click()
                        }
                    }
                }
            }
        }
    })
})

observer.observe(contentDiv, {
    childList: true
})