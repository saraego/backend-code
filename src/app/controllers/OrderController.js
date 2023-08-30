

import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";
import Order from "../schemas/Order"
import User from "../models/User";



class OrderController {
    async store(req, res) {

        const schema = Yup.object().shape({
            products:Yup.array().required().of(
                Yup.object().shape({
                    id:Yup.number().required(),
                    quantity:Yup.number().required()
                })
            )
        })

        try {
            await schema.validateSync(req.body, { abortEarly: false })
        } catch (error) {
            return res.status(400).json(error.errors)
        }

        const productsId = req.body.products.map(product => product.id)


        const orderProducts = await Product.findAll({
            where:{
                id:productsId
            },
            include:[
                {
                    model:Category,
                    as: 'category',
                    attributes:['name']
                }
            ]
        })

        const editedProduct = orderProducts.map(product =>{

            const productIndex = req.body.products.findIndex(reqProduct => reqProduct.id === product.id)

            const newProduct = {
                id:product.id,
                name:product.name,
                price:product.price,
                category:product.category.name,
                url:product.url,
                quantity:req.body.products[productIndex].quantity

            }

            return newProduct
        })
        

        const order = {
            user:{
                id:req.userId,
                name:req.userName
            },
            products:editedProduct,
            status:'Pedido realizado',
            
        }

        const orderResponse = await Order.create(order)


        return res.status(201).json(orderResponse)
    }

    async index(req,res){
        const orders = await Order.find()

        return res.json(orders)
    }

    async update(req,res){

        const schma = Yup.object().shape({
            status:Yup.string().required()
        })

        try {
            await schma.validateSync(req.body, {abortEarly:false})
        } catch (error) {
            return res.status(400).json({error:error.errors})
        }

        const {admin:isAdmin} = await User.findByPk(req.userId)

        if(!isAdmin){
            return res.status(401).json()
        }

        const {id} = req.params
        const {status} = req.body

        try {
            await Order.updateOne({_id:id}, {status})
        } catch (error) {
            return res.status(400).json({err:error.message})
        }

       

        return res.json({Message:'Atualizado com sucesso'})
    }
}

export default new OrderController()