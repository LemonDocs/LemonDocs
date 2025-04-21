# Getting started

🤔 How do i add a page to the documentation?

1. Go to ***configs/config.js***.
2. Add this to the ***nav*** array: <br>
    ```js
        {
            "label": "The label of the page",
            "file": "The path to the markdown file"
        }
    ```
    <p style="opacity: 25%; user-select: none;">💡 This is just an example! Be sure to replace the values with your own.</p>
3. Go to ***configs/sidebar.js***.
4. Add this to the ***nav*** array: <br>
    ```js
        {
            "label": "The label of the page in the sidebar",
            "path": "The text that will appear in the search parameter when opening this page",
            "file": "The path to the markdown file"
        }
    ```
    <p style="opacity: 25%; user-select: none;">💡 This is yet an another example! Be sure to replace the values with your own.</p>

## 📜 Summary
---
📁 Adding a page to your **documentation** requires you to modify 2 files.<br>
🧠 You would need a little knowledge on JSON.