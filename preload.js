const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('electron', {
  updateBadge: (data) => {
    ipcRenderer.send('badge', data);
  },
  configureExternalLinks: () => {
    const aAll = document.querySelectorAll("a.open-externally");
    if (aAll && aAll.length) {
      aAll.forEach(function(a) {
        a.addEventListener("click", function(event) {
          if (event.target) {
            event.preventDefault();
            let link = event.target.href;
            require("electron").shell.openExternal(link);
          }
        });
      });
    }
  }
})
