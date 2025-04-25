# More Markdown 
---
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

- Tabs<br><br>
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

- Spoilers<br><br>
    Syntax:
    ```md
        ||Hello, World!||
    ```    
    <p style="opacity: 25%; user-select: none">💡 This is yet an another example! Replace the values with your own!</p><br>

||Hello, World!||

<br><br>

- Timelines<br><br>
    Syntax:
    ```md
        [TIMELINE]

            [TIME] April 21, 2025

        Naming of LemonDocs

            [TIME] April 24, 2025

        Creation of LemonDocs' Organization Logo

        [END]
    ```    
    <p style="opacity: 25%; user-select: none">💡 This is yet an another example! Replace the values with your own!</p><br>

[TIMELINE]

    [TIME] April 21, 2025

Naming of LemonDocs

    [TIME] April 24, 2025

Creation of LemonDocs' Organization Logo

[END]