const axios = require('axios');
const _ = require('lodash');
const config = require('../config/config');
const Donor = require('../models/donor')


//axios Set up
const Axios = axios.create({
    headers: {
        authorization: config.test_key,
        'content-type': 'application/json',
        'cache-control': 'no-cache' 
    }
});

exports.get_homepage = (req,res,next) => {
    res.render('index.pug');
}

exports.paystack_page = (req, res) => {
    const form = _.pick(req.body,['amount','email','full_name']);
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;    
  
    Axios.post('https://api.paystack.co/transaction/initialize', form)
      .then((response) => {
       const paystackResponse = response.data;
       const auth_url = paystackResponse.data.authorization_url;
       res.redirect(auth_url)
      }, (error) => {
        console.log("error", error);
        res.send("Error occured , try again")
      });
  
  }

  exports.paystack_callback  =  (req,res) => {
    const ref = req.query.reference;
    const url = 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref);
    
    Axios.get(url)
      .then((response) => {
       const {id,reference,amount,customer} = response.data.data;
       const {email} = customer;
       const full_name = email.split("@")[0];
       newDonor = {reference, amount, email,full_name};
       const donor = new Donor(newDonor);
        donor.save()
        .then((donor)=>{
               if(!donor){
                   return res.redirect('/error');
                   console.log("error occured saving");
               }
              res.redirect('/receipt/'+donor._id);
        }).catch((e)=>{res.redirect('/error');
        });
  
      }, (error) => {
        res.send("Error occured , try again")
    });
  }

  exports.receipt = (req, res)=>{
    const id = req.params.id;
    Donor.findById(id).then((donor)=>{
        if(!donor){
            //handle error when the donor is not found
            res.redirect('/error')
        }
        res.render('success.pug',{donor});
    }).catch((e)=>{
        res.redirect('/error')
    })
  }

  exports.render_error = (req, res)=>{
    res.render('error.pug');
  }