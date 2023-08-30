import * as Yup from "yup";
import Category from "../models/Category";
import User from "../models/User"


class CategoryController{
    async store(req,res){
        const schema = Yup.object().shape({
            name:Yup.string().required(),
        })

        try{
            await schema.validateSync(req.body,{abortEarly:false})
        }catch(err){
            return res.status(400).json({erro:err.errors})
        }

        const {admin:isAdmin} = await User.findByPk(req.userId)

        if(!isAdmin){
            return res.status(401).json()
        }

        const {name} = req.body
        const {filename:path} = req.file


        const categoryExists = await Category.findOne({
            where:{name}
        })

        if(categoryExists){
            return res.status(400).json({error:'Category alredy exists'})
        }

        const category = await Category.create({name,path})
       
        return res.json({categoria:{id:category.id,name:category.name}})
       
    }

    async index(req,res){
        const category = await Category.findAll()


        if(category == 0){
            return res.json({error:"Ainda não ha categorias criadas"})
        }
      
        return res.status(200).json(category)
    }

    async update(req,res){
        const schema = Yup.object().shape({
            name:Yup.string(),
        })

        try{
            await schema.validateSync(req.body,{abortEarly:false})
        }catch(err){
            return res.status(400).json({erro:err.errors})
        }

        const {admin:isAdmin} = await User.findByPk(req.userId)

        if(!isAdmin){
            return res.status(401).json()
        }

        const {name} = req.body
        const {id} = req.params

        const category1 = await Category.findByPk(id)

        if(!category1){
            return res.status(401).json({Erro:"Categoria nao existe"})
        }


        let path
        if(req.file){
            path = req.file.filename
        }

      
        await Category.update({name,path},{where:{id}})
       
        return res.json("Categoria atualizada")
       
    }
}

export default new CategoryController()