process.on('message', query => {
    const lista = {}

    if (query.query) {
        for (let i = 0; i < query.query; i++) {
            let num = Math.floor(Math.random() * (1001 - 1)) + 1;
            if (lista.hasOwnProperty(num.toString())) {
                lista[num.toString()] += 1;    
            } else {
                lista[num.toString()] = 1;
            }
        }
        process.send({randoms: lista});

    } else {
        for (let i = 0; i < 100000000; i++) {
            let num = Math.floor(Math.random() * (1001 - 1)) + 1;
            if (lista.hasOwnProperty(num.toString())) {
                lista[num.toString()] += 1;    
            } else {
                lista[num.toString()] = 1;
            }
        }
        process.send({randoms: lista});
    }
})

