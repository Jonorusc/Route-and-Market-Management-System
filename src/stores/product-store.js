import { defineStore } from 'pinia'
import useApi from 'src/composables/api'

const { getAllProducts, createProduct, updateProduct } = useApi()

export const useProductStore = defineStore('productStore', {
  state: () => {
    return {
      products: []
    }
  },
  actions: {
    async fetchProducts() {
      try {
        const products = await getAllProducts()
        this.products = products.data
        return products.data
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async addProduct(product) {
      try {
        const newProduct = await createProduct(product)
        this.products.push(newProduct)
        return newProduct
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    },
    async updateProduct(id, product) {
      try {
        const updatedProduct = await updateProduct(id, product)
        const index = this.products.findIndex((p) => p.id === id)
        this.products[index] = updatedProduct
        return updatedProduct
      } catch (error) {
        throw error.response ? error.response.data : error
      }
    }
  },
  getters: {
    getProducts() {
      return this.products
    }
  },
  persist: true
})
