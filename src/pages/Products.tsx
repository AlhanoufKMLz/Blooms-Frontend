import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppDispatch, RootState } from '../redux/store'
import { fetchProducts } from '../redux/slices/products/productSlice'
import { fetchCategoreis } from '../redux/slices/categories/categorySlice'
import { addToCart } from '../redux/slices/cart/cartSlice'
import { Product } from '../types/types'

export default function Products() {
  const products = useSelector((state: RootState) => state.products)
  const categories = useSelector((state: RootState) => state.categories)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategoreis())
  }, [])

  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>(products.items)
  const [searchKeyWord, setSearchKeyWord] = useState('')

  //Search for product
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchKeyWord(event.target.value)
  }
  useEffect(() => {
    if (searchKeyWord.trim() !== '') {
      const results = products.items.filter((product) =>
        product.name.toLowerCase().includes(searchKeyWord.toLowerCase())
      )
      setProductsToDisplay(results)
    } else setProductsToDisplay(products.items)
  }, [searchKeyWord, products.items])

  //Sort products based on price
  function sort(event: { target: { value: string } }) {
    const sortedProducts = [...productsToDisplay]
    sortedProducts.sort((a, b) => {
      if (event.target.value === 'High-Low') {
        return b.price - a.price
      }
      return a.price - b.price
    })
    setProductsToDisplay(sortedProducts)
  }

  //Filter products based on categories
  function filter(event: { target: { value: string } }) {
    const selectedValue = Number(event.target.value)

    if (selectedValue === 0) {
      setProductsToDisplay(products.items)
    } else {
      setProductsToDisplay(
        products.items.filter((product) => product.categories.includes(selectedValue))
      )
    }
  }

  //Add product to cart
  function handleAddToCart(product: Product) {
    dispatch(addToCart({ product }))
  }

  //Display the products
  return (
    <div>
      <div className="flex flex-col justify-center md:flex-row">
        <div className="pt-2 relative  text-[#727E7E]">
          <input
            onChange={handleChange}
            className="border-2 border-[#D0CDD3] h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search for products..."
          />
          <svg
            className="h-4 w-4 fill-current absolute right-0 top-0 mt-5 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            xmlSpace="preserve"
            width="512px"
            height="512px">
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </div>
        <select
          onChange={sort}
          className="text-[#727E7E] border-2 border-[#D0CDD3] h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none bg-white">
          <option>Sort By</option>
          <option value={'Low-High'}>Low-High</option>
          <option value={'High-Low'}>High-Low</option>
        </select>
        <select
          onChange={filter}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block  p-2.5">
          <option value={0}>All Products</option>
          {categories.items.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <section className="products-container">
        {products.isLoading && <h3> Loading products...</h3>}
        <div className="card grid gap-4">
          <ul className="py-5 m:p-20 flex gap-20 flex-wrap">
            {productsToDisplay.map((product) => (
              <li key={product.id} className="flex flex-col items-center justify-center mx-auto">
                <div className="flex w-80 h-80 bg-white rounded-lg shadow-md items-center justify-center">
                  <Link to={`/${product.id}`}>
                    <img className="w-48" src={product.image} alt={product.name} />
                  </Link>
                </div>
                <div className="w-56 -mt-10 overflow-hidden rounded-lg shadow-lg md:w-64 bg-[#E2DFE4]">
                  <Link to={`/${product.id}`}>
                    <h3 className="py-2 font-bold tracking-wide text-center text-[#727E7E] uppercase">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between px-3 py-2 bg-[#be9995]">
                    <span className="text-[#E2DFE4]">{product.price} SAR</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-2 py-1 text-xs font-semibold text-[#E2DFE4] hover:text-[#727E7E] uppercase transition-colors duration-300 transform rounded focus:bg-grey-700 dark:focus:bg-grey-600">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
