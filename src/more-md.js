const contentDiv = document.getElementById('content')

// Process all tabs when document loads and whenever content changes
function initializeTabs() {
    document.querySelectorAll('.tab-wrapper').forEach(wrapper => {
        const buttons = wrapper.querySelectorAll('.tab-button');
        const contents = wrapper.querySelectorAll('.tab-content');

        // Make all tabs inactive first
        contents.forEach(content => content.classList.add('inactive-content'));
        buttons.forEach(btn => btn.classList.remove('active-btn'));

        // Add click handlers to each tab button
        buttons.forEach((button, index) => {
            // Remove any existing event listeners first to prevent duplicates
            button.removeEventListener('click', handleTabClick);

            // Add new event listener
            button.addEventListener('click', handleTabClick);

            function handleTabClick() {
                // Deactivate all tabs
                contents.forEach(content => content.classList.add('inactive-content'));
                buttons.forEach(btn => btn.classList.remove('active-btn'));

                // Activate current tab
                if (contents[index]) {
                    contents[index].classList.remove('inactive-content');
                    button.classList.add('active-btn');
                }
            }
        });

        // Activate the first tab by default
        if (buttons.length > 0) {
            buttons[0].click();
        }
    });
}

// Process markdown tabs
function processTabs(node) {
    if (!(node instanceof HTMLParagraphElement) || node.textContent !== ':::tabs') {
        return false;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('tab-wrapper');

    const tabHeaders = document.createElement('span');
    tabHeaders.classList.add('tab-headers');

    const tabContents = document.createElement('div');
    tabContents.classList.add('tab-contents');

    let n = node.nextElementSibling;
    let currentTab = null;
    const nodesToRemove = [];

    while (n && n.textContent !== ':::') {
        const next = n.nextElementSibling;

        if (n.textContent.startsWith('@tab ')) {
            const tabName = n.textContent.replace('@tab ', '').trim();

            currentTab = document.createElement('div');
            currentTab.classList.add('tab-content', 'inactive-content');

            const button = document.createElement('button');
            button.textContent = tabName;
            button.classList.add('tab-button');

            tabHeaders.appendChild(button);
            tabContents.appendChild(currentTab);
            nodesToRemove.push(n);
        } else if (currentTab) {
            currentTab.appendChild(n.cloneNode(true));
            nodesToRemove.push(n);
        }

        n = next;
    }

    wrapper.appendChild(tabHeaders);
    wrapper.appendChild(tabContents);

    nodesToRemove.forEach(nod => nod.remove());
    if (n) n.remove();

    node.replaceWith(wrapper);

    // Initialize the tabs after they're added to the DOM
    setTimeout(initializeTabs, 0);
    return true;
}

// Process graphs
function processGraphs(node) {
    if (!(node instanceof HTMLDivElement) || !node.classList.contains('div-graph')) {
        return false;
    }

    try {
        const graphContainer = document.createElement('div');
        graphContainer.classList.add('graph-container');

        const graph = document.createElement('div');
        const graphLabels = document.createElement('span');
        graph.classList.add('graph');
        graphLabels.classList.add('graph-labels');

        const data = JSON.parse(node.textContent);

        if (Array.isArray(data)) {
            const values = data.map((v) => v.value);
            for (const dataItem of data) {
                const item = document.createElement('div');
                item.classList.add('graph-item');
                item.setAttribute('data-value', dataItem.value);
                item.style.height = `${((dataItem.value * 2) / Math.max(...values)) + 1.5}rem`;
                graph.appendChild(item);

                const itemLabel = document.createElement('p');
                itemLabel.classList.add('graph-label');
                itemLabel.textContent = dataItem.item;
                graphLabels.appendChild(itemLabel);
            }
        }

        graphContainer.appendChild(graph);
        graphContainer.appendChild(graphLabels);

        node.replaceWith(graphContainer);
        return true;
    } catch (e) {
        console.error("Error processing graph:", e);
        return false;
    }
}

function initializeSpoilers() {
    document.querySelectorAll('span.spoiler-text').forEach(p => {
        function handleSpoilerClick() {
            p.classList.remove('spoilered')
            p.removeEventListener('click', handleSpoilerClick)
        }
        p.removeEventListener('click', handleSpoilerClick)
        p.addEventListener('click', handleSpoilerClick)
    })
}

/**
 * @param {HTMLElement} node 
 */
function processSpoilers(node) {
    if(!(node instanceof HTMLParagraphElement) || !(/^\|\|.*\|\|$/.test((node.textContent.trim()).replace('\t', '')))) return
    if(node.classList.contains('spoiler-text')) return

    let output = ''
    let loop = true
    
    for(const char of (node.textContent).substring(2)) {
        if(loop) {
            if(char != '|') {
                output = output.concat(char)
            } else {
                loop = false
            }
        }
    }

    if(!loop) {
        const n = document.createElement('span')
        n.classList.add('spoiler-text', 'spoilered')
        n.textContent = output

        node.replaceWith(n)
    }

    setTimeout(initializeSpoilers, 0)

    return !loop
}

// Observe DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                // Process tabs
                if (node instanceof HTMLParagraphElement) {
                    processSpoilers(node)
                    processTabs(node);
                }

                // Process graphs
                if (node instanceof HTMLDivElement) {
                    processGraphs(node);
                }

                // Look for any tabs in child elements
                if (node.querySelectorAll) {
                    node.querySelectorAll('p').forEach(p => {
                        processTabs(p);
                    });
                }
            });

            // Always check for tabs that might have been added
            initializeTabs();
            initializeSpoilers()
        }
    });
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeSpoilers()

    // Process any tabs that might already exist when the page loads
    document.querySelectorAll('p').forEach(p => {
        if (p.textContent === ':::tabs') {
            processTabs(p);
        } else if(/^\|\|.*\|\|$/.test((p.textContent.trim()).replace('\t', ''))) {
            processSpoilers(p)
        }
    });

    document.querySelectorAll('.div-graph').forEach(div => {
        processGraphs(div);
    });
});

// Start observing
observer.observe(contentDiv, {
    childList: true,
    subtree: true
});