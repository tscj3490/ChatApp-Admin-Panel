import Config from "../../config"
import UtilService from '../../utils/Utils'

var UserApi = {

    getList(sub_url, cb) {
        let user = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
        console.log('+++', sub_url)
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'GET',
            dataType: "json",
            headers: {
                'Authorization': user ? 'Bearer ' + user['token'] : null,
            }
        }).then((res) => {
            if (cb) cb(null, res)
        }, (error) => {
            if (cb) cb(error.responseText, null)
        })
    },
    postItem(sub_url, data, cb) {
        console.log(data)
        let user = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': user ? 'Bearer ' + user['token'] : null,
            },
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },
    putItem(sub_url, data, cb) {
        console.log(sub_url, data)
        let user = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': user ? 'Bearer ' + user['token'] : null,
            },
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
        
    },
    deleteItem(sub_url, cb) {
        let user = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'DELETE',
            dataType: "json",
            headers: {
                'Authorization': user ? 'Bearer ' + user['token'] : null,
            },
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },

    // Users
    getUserList(cb) { 
        this.getList("/api/v1/users", cb)
    },
    searchUser(query, cb) {
        let stringQuery = "/api/v1/users?"
        let first = true;
        if (query.name) {
            stringQuery += `name=${query.name}`
            first = false;
        }
        if (query.phone) {
            if (first == false) stringQuery += '&'
            stringQuery += `phone=${query.phone}`
            first = false;
        }
        if (query.address) {
            if (first == false) stringQuery += '&'
            stringQuery += `address=${query.address}`
            first = false;
        }
        if (query.city) {
            if (first == false) stringQuery += '&'
            stringQuery += `city=${query.city}`
            first = false;
        }
        if (query.country) {
            if (first == false) stringQuery += '&'
            stringQuery += `country=${query.country}`
            first = false;
        }
        console.log(stringQuery)
        this.getList(stringQuery, cb)
    },
    getUser(id, cb) {
        this.getList("/api/v1/users/" + id, cb)
    },
    postUser(data, cb) {
        this.postItem("/api/v1/signup", data, cb)
    },
    updateUser(id, data, cb) {
        // if ( data.id != undefined && data.id != null ){
        //     this.putItem("/api/users/me", data, cb)
        // }else{
        //     this.postItem("/vendors/insert", data, cb)
        // }
        this.putItem(`/api/v1/users/${id}`, data, cb)
    },
    updateProfile(id, data, cb) {
        this.putItem(`/api/v1/users/${id}`, data, cb)
    },
    deleteUser(id, cb) {
        this.deleteItem("/api/v1/users/" + id, cb)
    },   
}

module.exports = UserApi;
