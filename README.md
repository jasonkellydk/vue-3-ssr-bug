# CSS custom properties bug using v-bind

> Hello from Denmark 🇩🇰🇩🇰🇩🇰
>
> Thanks for all the amazing work being done by the Vue team 👏

## Reason

The first paint will not contain styles that have used v-bind. Due to ```@vue/server-renderer``` outputting non-valid CSS custom properties 

## How reproduce

***There might be a need to inspect the output in ```view-source:http://localhost:3000/``` due to the initial hydration fixing the issue***

This minimum reproducible example requires a server side rendered app. To run the app run the command
```npm start```

This will produce a server-side app running on ``` http://localhost:3000/:3000 ````

You should then be able to see the inline styled v-bind variables having an invalid syntax

```html
<div id="app">
    <div class="fancy-styling" style="7ba5bd90-fancy-theme_width:250px;7ba5bd90-fancy-theme_height:250px;7ba5bd90-fancy-theme_background-color:green;">
        <h1>Hallo world</h1>
    </div>
</div>
```

The CSS custom properties that are dynamically generated does not contain the required ```--``` prefix

A valid property would look like.
```--7ba5bd90-fancy-theme_width:250px``` instead of the current ```7ba5bd90-fancy-theme_width:250px```
