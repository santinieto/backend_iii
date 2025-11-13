import { cartsManager } from "../data/dao.factory.js";
import CartDTO from "../dto/carts.dto.js";
import BaseRepository from "./base.repository.js";

class CartRepository extends BaseRepository {
    constructor() {
        super({
            manager: cartsManager,
            DTO: CartDTO,
            createFn: cartsManager.createCart,
            updateFn: cartsManager.updateCart,
        });
    }

    async addProductToCart(cartId, productId, quantity) {
        return await this.manager.addProductToCart(cartId, productId, quantity);
    }
}

const cartRepository = new CartRepository();
export default cartRepository;
