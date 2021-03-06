import Config from "../../config"

var ChatroomApi = {

    getList(sub_url, cb){
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null   
        console.log("**********", sub_url)
        $.ajax({
            url: Config.BACKEND_API_URL+sub_url,
            method: 'GET',
            dataType:"json",
            headers: {
                'Authorization': user?'Bearer ' + user['token']:null,
            }
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
    putItem(sub_url, data, cb) {        
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null          
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': user?'Bearer ' + user['token']:null,
            },
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) { 
                if (cb) cb(errMsg, null)
            }
        })
        console.log("sub_url", sub_url, data)
    },
    deleteItem(sub_url, cb) {
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null 
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'DELETE',
            dataType: "json",
            headers: {
                'Authorization': user?'Bearer ' + user['token']:null,
            },
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },

    
    getChatroomList(cb){
        this.getList("/api/v1/chatRoom", cb)
    },
    getChatroom(id, cb){
        this.getList("/api/v1/chatRoom/"+id, cb) 
    },
    postChatroom(data, cb){
        this.postItem("/api/v1/chatRoom", data, cb)
    },
    updateChatroom(id, data, cb) {
        this.putItem(`/api/v1/chatRoom/${id}`, data, cb)
    },
    deleteChatroom(id, cb){
        this.deleteItem('/api/v1/chatRoom/'+id, cb)
    },

    getLatestChatroom(cb){
        this.getList("/orders/filter?sort=book_date&SortDirection=-1", cb)
    },
    searchChatroom( query, cb){
        let stringQuery = "/api/project?"
        let first = true;
        if (query.name) {
            stringQuery += `name=${query.name}`
            first = false;
        }
        if (query.type) {
            if (first == false) stringQuery += '&'
            stringQuery += `type=${query.type}`
            first = false;
        }
        if (query.position) {
            if (first == false) stringQuery += '&'
            stringQuery += `position=${query.position}`
            first = false;
        }
        if (query.featured) {
            if (first == false) stringQuery += '&'
            stringQuery += `featured=${query.featured}`
            first = false;
        }
        if (query.tags) {
            if (first == false) stringQuery += '&'
            stringQuery += `tags=${query.tags}`
            first = false;
        }
        console.log(stringQuery)
        this.getList(stringQuery, cb)
    }

}

module.exports = ChatroomApi;
