# ngx-translate-assistant

Simple devtool to help with different language files, keep them tidy and up to date.

## Add it to your project

- Install the tool: npm install --save-dev ngx-translate-assistant
- Add a script to your package.json to easily using it:
```json
{
    "scripts": {
        "ngxta": "ngxta"
    }
}
```
- create the config file (.ngxtarc.json at beside your package.json):
```json
[
    {
        "baseKey": "form-page",
        "files": [
            "src/app/form/locale/form-page.en.json",
            "src/app/form/locale/form-page.fr.json"
        ]
    },
    {
        "baseKey": "about-page",
        "files": [
            "src/app/about/locale/about-page.en.json",
            "src/app/about/locale/about-page.fr.json"
        ]
    }
]
```
- start it: npm run ngxta
- go to http://localhost:3578