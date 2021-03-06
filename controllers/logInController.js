const fs = require("fs");
const path = require("path");
const {validationResult} = require("express-validator")

const bcrypt = require("bcrypt");

const db = require("../database/models")



module.exports = {

    logIn:(req,res) => {

        res.render("logeo", {
            title: "ingresando"
        });
    },

    processRegister: (req,res) => {

        let errores = validationResult(req);


        if(errores.isEmpty()){

            const {userName, email, pass} = req.body

            
           
            db.Users.create({
                name: userName.toLowerCase().trim(),
                email: email.trim(),
                password : bcrypt.hashSync(pass.trim(), 12), 
            })
            .then(() =>res.redirect('/users'))
            .catch(error => res.send(error))
            
        }else{
                
                return res.render('logeo',{
                    title:"login page",
                    errores : errores.errors,
                    old : req.body
            })
        }
    },


    processLogin: (req,res) => {
        let errores = validationResult(req);
        
        if(errores.isEmpty()){
            const { email, password, recordar} = req.body;

            return db.Users.findOne({
                where : {
                    email
                }
            })
            .then(result => {
                
                /* res.send(result) */
                if(result && bcrypt.compareSync(password, result.password)){
                  
                    req.session.user = {
                        id : result.id,
                        name : result.email,
                        rol: result.rol
                    }
                    if(recordar){
                        res.cookie('userStar', req.session.user, {
                            maxAge : 1000 * 60 * 60 
                        })
                    }
                   
                    return res.redirect('/')
                
                }else {
                    res.render('logeo',{
                        title: "logueo",
                        errores: "contrase??a inv??lida",
                        old : req.body
                    })
                }
            })
        } else {
            res.render('logeo',{
                title: "logueo",
                errores: errores.errors,
                old : req.body
            })
        }

    }, 
    loginGoogle: (req, res) => {
        let user = req.session.passport.user[0]
        req.session.user = {
          id: user.id,
          email: user.email,
          googleId: user.social_id,
        }

        res.redirect('/')
    },

 
    fatality: (req, res) => {
        
        req.session.destroy();
        
        if(req.cookies.userStar){
            
            res.cookie('userStar','',{
                maxAge : -1
            })
        }
        
        res.redirect("/")
    },

} 



