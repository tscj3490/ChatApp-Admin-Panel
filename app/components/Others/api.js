import Config from "../../config"

var OtherApi = {

    getList(sub_url, cb){
        $.ajax({
            url: Config.BACKEND_API_URL+sub_url,
            method: 'GET',
            dataType:"json"
        }).then((res)=>{
            if ( cb ) cb( null, res )
        }, (error)=>{
            if ( cb ) cb(error.responseText, null)
        })
    },
    postItem(sub_url, data, cb){
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null   
        $.ajax({
            url: Config.BACKEND_API_URL+sub_url,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': user?'Bearer ' + user['token']:null,
            },
            success: function(data){
                if (cb) cb(null, data)
            },
            failure: function(errMsg){
                if (cb) cb(errMsg, null)
            }
        })
    },
    deleteItem(sub_url, cb) {
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'DELETE',
            dataType: "json",
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },
  

    changePassword(data, cb) {
        this.postItem('/api/v1/admin/changePassword', data, (err, res) => {
            cb(null, res)
        })
    },
    
    getSetting(cb){
        this.getList("/settings", cb)
    },
    getCoinSetting(cb){
        this.getList("/coinSettings", cb)
    },
    getPaymentSetting(cb){
        this.getList("/paymentSettings", cb)
    },
    postSetting(data, cb){
        this.postItem("/settings", data, cb)
    },
    postCoinSetting(data, cb){
        this.postItem("/coinSettings", data, cb)
    },
    postPaymentSetting(data, cb){
        this.postItem("/paymentSettings", data, cb)
    },

}

module.exports = OtherApi;
