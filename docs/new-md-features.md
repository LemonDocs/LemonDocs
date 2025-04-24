# More Markdown
✨ **LemonDocs** adds a few more markdown features, such as:

- Bar Graphs<br><br>
    Syntax:
    ```md
        <div class="div-graph">
            [
                {"value": 10, "item": "Item1"},
                {"value": 25, "item": "Item2"}
            ]
        </div>
    ```    
    <p style="opacity: 25%; user-select: none">💡 This is an example! Replace the values with your own!</p><br>
<div class="div-graph">[{"value": 10, "item": "Item1"},{"value": 20, "item": "Item2"}]</div>

- Bar Graphs<br><br>
    Syntax:
    ```md
        :::tabs

        @tab Javascript
        ```js
        console.log(1)
        ```

        @tab Python
        ```py
        print(1)
        ```

        :::
    ```    
    <p style="opacity: 25%; user-select: none">💡 This is yet an another example! Replace the values with your own!</p><br>

:::tabs

@tab Javascript
```js
console.log(1)
```

@tab Python
```py
print(1)
```

:::