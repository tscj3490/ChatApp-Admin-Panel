
import * as async from 'async'
import * as _ from 'underscore'
import moment from 'moment'
import Cache from './utils/Cache'
import UtilService from './utils/Utils'
import Config from './config'

module.exports = {    
    isLogin(){
        return sessionStorage.getItem('currentUser')!=null;       
    },
    
    postItem(sub_url, data, cb) {
        console.log(data)
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            
            success: function (data) {
                if (cb) cb(null, data)
            },
            error: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },

    getList(sub_url, cb) {
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'GET',
            dataType: "json"
        }).then((res) => {
            if (cb) cb(null, res)
        }, (error) => {
            if (cb) cb(error.responseText, null)
        })
    },

    async init(cb) {
        // check if current user exists or not
        var email =  sessionStorage.getItem('email')
        var password =  sessionStorage.getItem('password')

        if (password) {
            this.login(email, password, (err, user) => {
                cb(err, user)
            })
        } else {
            cb(null)
        }
    },

    login(email, password, cb) {
        
        this.postItem('/api/v1/admin/login',  {email, password}, (err, res) => {
            console.log('===>>>', err, res)
            if (err == null) {
                Cache.currentUser = res
                sessionStorage.setItem('currentUser', JSON.stringify(res))
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('password', password);
            }else{
                console.log('error>>>')
            }
            cb(err, res)
        })
    },

    forgotPassword(email, cb) {
        this.getList('/api/v1/admin/forgotPassword?email=' + email, cb)
    },
    
    logout() {
        UtilService.removeLocalObjectData('currentUser');
        UtilService.removeLocalObjectData('email');
        UtilService.removeLocalObjectData('password');
    },

    signup(userData, cb) {
        this.postItem('/api/signup',  userData, (err, res) => {
            cb(null, res)
        })
    },

}
