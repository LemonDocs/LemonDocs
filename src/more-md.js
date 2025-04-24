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
                }
            }
        }
    })
})

observer.observe(contentDiv, {
    childList: true
})