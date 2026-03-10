
function somaImpares(n) {
    let soma = 0;   

    for (let i = 1; i<=n; i++){
        if (i%2 !== 0) {
            soma += i;
        }
    }
    return soma
}
console.log(somaImpares(50))

function inverterPalavra(palavra) {
    return palavra.split("").reverse().join("");
}

console.log(inverterPalavra("Hello"))