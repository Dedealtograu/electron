// processo de renderização
console.log('processo de renderização')
console.log(`Electron: ${api.verElectron()}`)

function openChild() {
    //console.log('Teste do botao')
    api.open()
}

api.send('Hello World!')

api.on((event, message) => {
    console.log(`Processo de renderização recebeu uma mensagem: ${message}`)
})

function info() {
    api.info()
}

function warning() {
    api.warning()
}

function select() {
    api.select()
}