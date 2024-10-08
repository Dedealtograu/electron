console.log('Processo Principal')
console.log(`Electron: ${process.versions.electron}`)

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron')
const path = require('node:path')

const createWindow = () => {
    //nativeTheme.themeSource = 'light'
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: './src/public/img/pc.png',
        //resizable: false,
        //autoHideMenuBar: true,
        //titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

// Janela sobre
const aboutWindow = () => {
    const about = new BrowserWindow({
        width: 360,
        height: 220,
        icon: './src/public/img/pc.png',
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    about.loadFile('./src/views/sobre.html')
}

// Janela secundaria
const childWindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        const child = new BrowserWindow({
            width: 640,
            height: 480,
            icon: './src/public/img/pc.png',
            autoHideMenuBar: true,
            resizable: false,
            parent: father,
            modal: true,
            webPreferences: {
                nodeIntegration: true
            }
        })
        child.loadFile('./src/views/child.html')
    }
}

app.whenReady().then(() => {
    createWindow()
    //aboutWindow()

    // IPC >>>>>>>>>>>>>>>>>>>>>>>>>>>>

    ipcMain.on('open-child', () => {
        childWindow()
    })

    ipcMain.on('renderer-message', (event, message) => {
        console.log(`Mensagem recebida pelo renderer: ${message}`)
        event.reply('main-message', 'Hello from the main process!')
    })

    ipcMain.on('dialog-info', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Informação',
            message: 'Teste de informação',
            buttons: ['OK']
        })
    })

    ipcMain.on('dialog-warning', () => {
        dialog.showMessageBox({
            type: 'warning',
            title: 'Aviso!',
            message: 'Confirma essa ação?',
            buttons: ['Sim', 'Não'],
            defaultId: 0
        }).then(result => {
            console.log(result)
            if (result.response === 0) {
                console.log('Confirmado!')
            }
        })
    })

    ipcMain.on('dialog-select', () => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(result => {
            console.log(result)
        }).catch(err => {
            console.log(err)
        })
    })

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Template do menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Janela Secundaria',
                click: () => childWindow()
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Exibir',
        submenu: [
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            },
            {
                type: 'separator'
            },
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Diminuir zoom',
                role: 'zoomOut'
            },
            {
                label: 'Zoom normal',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'docs',
                click: () => {
                    shell.openExternal('https://github.com/Dedealtograu/electron')
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Sobre',
                click: () => {
                    aboutWindow()
                }
            }
        ]
    }
]