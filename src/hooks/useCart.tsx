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
      const existProduct = cart.find(item => item.id === productId);
      console.log(existProduct);

      if(!existProduct) {
        const { data } = await api.get(`/products/${productId}`);

        const product = {...data, amount: 1}

        localStorage.setItem('@RocketShoes:cart', JSON.stringify(product));
        setCart([...cart, product]);
      }

      if(existProduct) {
        const attProduct = {
          ...existProduct,
          amount: existProduct.amount + 1
        };
        
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(attProduct));
        setCart([...cart, attProduct]);
        //const amount = existProduct.amount;
        //updateProductAmount({productId, amount});
      }
      // TODO
    } catch {
      //TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      console.log('updateProductAmount:', productId, amount);
    } catch {
      // TODO
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
