import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      //TODO
      const checkStock = await api.get(`/stock/${productId}`);
      const stock = checkStock.data as Stock;

      if(stock.amount <= 0) {
        toast.error('Quantidade solicitada fora de estoque');
      }

      const { data } = await api.get(`/products/${productId}`);
      const existProduct = cart.find(product => product.id === productId);

      if(existProduct){
        const newCart = cart.map(product => {
          if(product.id === existProduct.id) {
            product.amount += 1;
          }

          return product;
        })

        setCart(newCart);
      } else {
        const newProduct = { ...data, amount: 1} as Product;

        setCart([...cart, newProduct]);
      }

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
    } catch {
      //TODO
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const existProduct = cart.find(product => product.id === productId);

      if(!existProduct) {
        toast.error('Erro na remoção do produto');
      }
    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      const checkStock = await api.get(`/stock/${productId}`);

      if(amount >= checkStock.data.amount) {
        toast.error('Quantidade solicitada fora de estoque');
      } else if (amount === 0) {
        return;
      } else {
        const newCart = cart.map(product => {
          if(product.id === productId) {
            product.amount = amount;
          }

          return product;
        })

        setCart(newCart);
      }
    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
