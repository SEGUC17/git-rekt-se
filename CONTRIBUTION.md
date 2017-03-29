# Project Contribution Guideline

### Code Style
---

- Install ESLint VS Code plugin

- Airbnb Style Guide for ESlint

```
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```

### VS Code
---

- Install Beautify for VS Code.

- Install the following VS Code plugins
  - Auto Complete Tag
  - Auto Rename Tag
  - AutoFileName
  - file-icons
  - npm intellisense
  - html snippets
  - open in browser
  - vue
  - Vue 2 Snippets
  - vue-beautify
  
### API Testing
---

- Postman for testing API

  [https://www.getpostman.com/](https://www.getpostman.com/)

