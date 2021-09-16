const selDivisas = document.querySelector('#selDivisas');
const selCryptos = document.querySelector('#selCryptos');
const formulario = document.querySelector('#form');
const resultado = document.querySelector('#resultado');

//Promesa que nos ayuda a resolver si las criptodivisas se han descargado correctamente.
const getCryptoCoins = cryptocoins => new Promise( resolve => {
    resolve(cryptocoins);
})

const objParams = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener("DOMContentLoaded", makeCallAPI);

document.addEventListener("change", e => fillParams(e));

formulario.addEventListener("submit", requestInfo)

//Llamada para obtener las principales criptodivisas
function makeCallAPI(){
    fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
        .then(response => response.json())
        .then(result => getCryptoCoins(result.Data))
        .then(cryptoDownloaded => fillSelect(cryptoDownloaded));
}

//Llenamos el select de criptomonedas con base a los resultados de la primera llamada a la API
function fillSelect(cryptoCurrencies){
    cryptoCurrencies.forEach( currency => {

        const {FullName, Name} = currency.CoinInfo

        const option = document.createElement('option');
        option.textContent = FullName;
        option.value = Name;

        selCryptos.appendChild(option);
    });
}

//Leer los datos seleccionados del formulario
function fillParams(e){
    objParams["moneda"] = selDivisas.value;
    objParams["criptomoneda"] = selCryptos.value;

    //console.log(objParams)
}

//Validar formulario
function requestInfo(e){
    e.preventDefault();

    const { moneda, criptomoneda} = objParams;

    //Validamos formulario
    if(moneda === '' || criptomoneda === ''){
        //Mostramos el mensaje
        showMessage("Petición incompleta, intente de nuevo.");
    }
    
    //Hacemos la petición
    fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`)
        .then(response => response.json())
        .then(result => displayInfo(result["DISPLAY"][criptomoneda][moneda]));
}

//Crea un nuevo mensaje en caos de error
function showMessage(message){
    const note = document.createElement("div")
    note.classList.add('message')
    note.textContent = message;

    document.querySelector('input[type="submit"]').disabled = true;
    formulario.insertAdjacentElement("afterend", note);

    setTimeout(() => {
        note.remove();
        document.querySelector('input[type="submit"]').disabled = false;
    }, 3000);
}

//Extreamos y mostramos la información de la petición, pintamos en pantalla
function displayInfo(resultInfo){
    const {PRICE, HIGH24HOUR, HIGHDAY, HIGHHOUR, LASTUPDATE} = resultInfo;

    console.log({PRICE, HIGH24HOUR, HIGHDAY, HIGHHOUR, LASTUPDATE});

    resultado.innerHTML = `
        <p>Precio: <span>${PRICE}</span></p>
        <p>Precio mas alto en las últimas 24h: <span>${HIGH24HOUR}</span></p>
        <p>Precio mas alto de hoy: <span>${HIGHDAY}</span></p>
        <p>Precio mas alto en la última hora: <span>${HIGHHOUR}</span></p>
        <p>Ultima actualización: <span>${LASTUPDATE}</span></p>
    `;
}
