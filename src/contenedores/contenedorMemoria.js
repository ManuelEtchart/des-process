class ContenedorMemoria{
    constructor(){
        this.array = []
        this.contadorObjetos = 1
    }

    save(obj){
        obj.id = this.contadorObjetos
        
        this.array.push(obj)
        
        this.contadorObjetos = this.array[this.array.length - 1].id + 1;

        /*return {'Objeto agregado': obj}*/
    }

    getById(id){
        let objetoBuscado = this.array.find(prod => prod.id == id);

        if(objetoBuscado === undefined){
            return {error: `Objeto ${id} no encontrado`}
        }

        return objetoBuscado
    }

    getAll(){
        if(this.array.length === 0){
            return []
        }else{
            return this.array
        }
    }

    updateById(id, cambios){
        let objetoBuscado = this.array.find(prod => prod.id == id);

        if(objetoBuscado === undefined){
            return {error: `Objeto ${id} no encontrado`}
        }
        console.log(cambios)
        objetoBuscado = cambios;

        objetoBuscado.id = id
        objetoBuscado.fecha = Date.now()

        this.array = this.array.filter(prod => prod.id != id);

        this.array.push(objetoBuscado);

        return {msg: `Objeto ${id} modificado`}
    }

    deleteById(id){
        let objetoBuscado = this.array.find(prod => prod.id == id);

        if(objetoBuscado === undefined){
            return {error: `Objeto ${id} no encontrado`}
        }

        this.array = this.array.filter(prod => prod.id != id);
        
        if(this.array.length === 0){
            return {'msg': 'Todos los objetos han sido eliminados'}
        }

        return {msg: `Objeto ${id} eliminado`}
    }

    deleteAll(){
        this.array = []

        return {'msg': 'Todos los objetos han sido eliminados'}
    }

    agregarProductoEnCarrito(id, id_prod){
        let carritoBuscado = this.array.find(carr => carr.id == id);

        if(carritoBuscado === undefined){
            return {error: `Carrito ${id} no encontrado`}
        }

        let productoBuscado = productoMemoria.getById(id_prod);

        if(productoBuscado.nombre === undefined){
            return {error: `Producto ${id} no encontrado`}
        }

        this.array = this.array.filter(carr => carr.id != id);

        carritoBuscado.productos = [...carritoBuscado.productos, productoBuscado];

        this.array.push(carritoBuscado)

        return carritoBuscado
    }

    borrarProductoEnCarrito(id, id_prod){
        let carritoBuscado = this.array.find(carr => carr.id == id);

        if(carritoBuscado === undefined){
            res.json({error: `Carrito ${id} no encontrado`})
        }

        let productosCarrito = carritoBuscado.productos;

        let productosModificados = productosCarrito.filter(prod => prod.id != id_prod);

        this.array = this.array.filter(carr => carr.id != id);

        carritoBuscado.productos = productosModificados;

        this.array.push(carritoBuscado)

        return carritoBuscado
    }
}

module.exports = ContenedorMemoria;