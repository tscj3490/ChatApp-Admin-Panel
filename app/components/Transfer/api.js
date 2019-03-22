import Config from "../../config"
import UtilService from '../../utils/Utils'

var TransferApi = {

    getList(sub_url, cb) {
        let user = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'GET',
            dataType: "json",
            headers: {
                'Authorization': user ? 'Bearer ' + user['access_token'] : null,
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
                'Authorization': user ? 'Bearer ' + user['access_token'] : null,
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
        console.log(data)
        let user = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': user ? 'Bearer ' + user['access_token'] : null,
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
                'Authorization': user ? 'Bearer ' + user['access_token'] : null,
            },
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },


    getCurrencies(cb) {
        this.getList("/api/currencies", cb)
    },
    getCurrencyById(id, cb) {
        this.getList(`/api/currencies/${id}`, cb)
    },
    setCurrency(data, cb) {
        this.postItem("/api/currencies", data, cb)
    },
    updateCurrency(id, data, cb) {
        this.putItem(`/api/currencies/${id}`, data, cb)
    },
    deleteCurrency(id, cb) {
        this.deleteItem(`/api/currencies/`+id, cb)
    },
    calcExchange(data, cb) {
        this.postItem("/api/exchange", data, cb)
    },
    getTransactions(data, cb) {
        this.postItem("/api/transactions", data, cb)
    },
    calcFee(data, cb) {
        this.postItem("/api/calcFee", data, cb)
    },
    setTransfer(data, cb) {
        this.postItem("/api/transfer", data, cb)
    },

    getExchangeRate(base, cb) {
        this.getList(`/api/currencies/rates/${base}`, cb)
    },
    
}

module.exports = TransferApi;
